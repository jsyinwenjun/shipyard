# Copyright 2013 Evan Hazlett and contributors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import celery
from django.core.cache import cache
from django.conf import settings
from django.utils.translation import ugettext as _
from containers.models import Container
from hosts.models import Host
from exceptions import RecoveryThresholdError
import utils
import hashlib

@celery.task
def check_protected_containers():
    # TODO: needs refactored for new agent setup
    print('Checking protected containers')
    protected_containers = Container.objects.filter(protected=True)
    for c in protected_containers:
        host = c.host
        # get host containers
        cnt_ids = [utils.get_short_id(x.get('Id'))
            for x in c.host.get_containers()]
        # check if container is still running
        if c.container_id not in cnt_ids:
            # reload the latest info
            host._load_container_data(c.container_id)
            host = c.host
            meta = c.get_meta()
            cfg = meta.get('Config')
            if not cfg:
                print('Invalid container config for {} ; skipping'.format(
                    c.description))
                c.delete()
                return
            image = cfg.get('Image')
            command = ' '.join(cfg.get('Cmd'))
            # update port spec to specify the original NAT'd port
            port_mapping = meta.get('NetworkSettings').get('PortMapping')
            port_specs = []
            if port_mapping:
                for x,y in port_mapping.items():
                    for k,v in y.items():
                        port_specs.append('{}:{}/{}'.format(v,k,x.lower()))
            env = cfg.get('Env')
            mem = cfg.get('Memory')
            description = c.description
            volumes = cfg.get('Volumes')
            volumes_from = cfg.get('VolumesFrom')
            privileged = cfg.get('Privileged')
            owner = c.owner
            hostname = cfg.get("Hostname")
            # volume mapping
            binds = {}
            for k in meta.get("Volumes"):
                binds[meta.get("Volumes")[k]] = k
            # check/update cache for recovery
            c_hash = hashlib.sha256(
                str(host.id)+str(image)+''.join(port_specs)).hexdigest()
            key = 'recover:{}'.format(c_hash)
            if cache.get(key):
                val = cache.incr(key)
                if val > settings.RECOVERY_THRESHOLD:
                    # mark as not protected to prevent recovery loop
                    c.protected = False
                    c.save()
                    raise RecoveryThresholdError(_('Container') + ' {} '.format(
                        c.description) + _('has recovered too many times.'))
            else:
                cache.set(key, 1, settings.RECOVERY_TIME)
            print('Recovering: {}'.format(c.description))
            c_id, status = host.create_container(image, command, port_specs,
                env, mem, description, volumes, volumes_from, privileged, binds, owner, hostname)
            # load new container data
            host._load_container_data(c.container_id)
            new_c = Container.objects.get(container_id=c_id)
            # mark new container as protected
            new_c.protected = True
            new_c.save()
            # add new container to any applications that
            # previous container belonged
            for app in c.get_applications():
                app.containers.add(new_c)
                app.save()
            # remove old container meta
            c.delete()
    return True

@celery.task
def import_image(repo_name=None):
    if not repo_name:
        raise StandardError('You must specify a repo name')
    hosts = Host.objects.filter(enabled=True)
    for h in hosts:
        import_image_to_host.subtask((h, repo_name)).apply_async()
    return True

@celery.task
def import_image_to_host(host, repo_name):
    if not host or not repo_name:
        raise StandardError('You must specify a host and repo name')
    print('Importing {} on {}'.format(repo_name, host.name))
    host.import_image(repo_name)
    return 'Imported {} on {}'.format(repo_name, host.name)

@celery.task
def build_image(path=None, tag=None):
    if not path:
        raise StandardError('You must specify a path')
    hosts = Host.objects.filter(enabled=True)
    for h in hosts:
        build_image_on_host.subtask((h, path, tag)).apply_async()
    return True

@celery.task
def build_image_on_host(host, path, tag):
    if not host or not path:
        raise StandardError('You must specify a host and path')
    print('Building {} on {}'.format(tag, host.name))
    host.build_image(path, tag)
    return 'Built {} on {}'.format(tag, host.name)

@celery.task
def docker_host_info():
    hosts = Host.objects.filter(enabled=True)
    for h in hosts:
        get_docker_host_info.subtask((h.id,)).apply_async()
    return True

@celery.task
def get_docker_host_info(host_id):
    if not host_id:
        raise StandardError('You must specify a host_id')
    host = Host.objects.get(id=host_id)
    print('Getting docker host info: {}'.format(host.name))
    host.get_containers()
    host.get_images()
    return True
