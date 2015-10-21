(function(){
    'use strict';

    angular
        .module('shipyard.svcregs')
        .controller('SvcRegEditController', SvcRegEditController);

    SvcRegEditController.$inject = ['svcreg','$http', '$state'];
    function SvcRegEditController(svcreg,  $http, $state) {
        var vm = this;
        vm.svcreg = svcreg;
        vm.editSvcReg = editSvcReg;
        vm.request = {};
        vm.service_name = svcreg.service_name;
        vm.service_desc = svcreg.service_desc;
        vm.request = null;

        function isValid() {
            return $('.ui.form').form('validate form');
        }

        function editSvcReg() {
            if (!isValid()) {
                return;
            }
            vm.request = {
                username: svcreg.service_name,
                service_name: vm.service_name,
                service_desc: vm.service_desc,
            }
            $http
                .post('/api/svcregs', vm.request)
                .success(function(data, status, headers, config) {
                    $state.transitionTo('dashboard.svcregs');
                })
            .error(function(data, status, headers, config) {
                vm.error = data;
            });
        }
    }
})();

