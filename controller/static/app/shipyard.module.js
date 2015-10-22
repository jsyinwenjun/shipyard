(function(){
    'use strict';

    angular
        .module('shipyard', [
                'shipyard.accounts',
                'shipyard.core',
                'shipyard.services',
                'shipyard.layout',
                'shipyard.help',
                'shipyard.login',
                'shipyard.containers',
                'shipyard.events',
                'shipyard.registry',
                'shipyard.nodes',
                'shipyard.images',
                'shipyard.filters',
                'shipyard.eureka_services',
                'angular-jwt',
                'base64',
                'selectize',
                'ui.router'
        ]);

})();
