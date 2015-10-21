(function(){
    'use strict';

    angular
        .module('shipyard.svcregs')
        .controller('SvcRegAddController', SvcRegAddController);

    SvcRegAddController.$inject = ['$http', '$state'];
    function SvcRegAddController($http, $state) {
        var vm = this;
        vm.request = {};
        vm.addSvcReg = addSvcReg;
        vm.service_name = "";
        vm.service_desc = "";
        vm.request = null;

        function isValid() {
            return $('.ui.form').form('validate form');
        }

        function addSvcReg() {
            if (!isValid()) {
                return;
            }
            vm.request = {
        		service_name: vm.service_name,
        		service_desc: vm.service_desc
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

