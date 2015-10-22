(function(){
	'use strict';

	angular
		.module('shipyard.eureka_services')
		.controller('EurekaServicesController', EurekaServicesController);

	EurekaServicesController.$inject = ['eureka_services', 'EurekaServicesService', '$state', '$timeout'];
	function EurekaServicesController(eureka_services, EurekaServicesService, $state, $timeout) {
            var vm = this;
            vm.eureka_services = eureka_services;
            vm.refresh = refresh;
            vm.removeEurekaService = removeEurekaService;
            vm.showRemoveEurekaServiceDialog = showRemoveEurekaServiceDialog;
            vm.selectedEurekaService = null;

            function showRemoveEurekaServiceDialog(eurekaService) {
                vm.selectedEurekaService = eurekaService;
                $('.ui.small.remove.modal').modal('show');
            }

            function refresh() {
                EurekaServicesService.list()
                    .then(function(data) {
                        vm.eureka_services = data; 
                    }, function(data) {
                        vm.error = data;
                    });
                vm.error = "";
            }
            
            function removeEurekaService() {
                EurekaServicesService.removeEurekaService(vm.selectedEurekaService)
                    .then(function(data) {
                        vm.refresh();
                    }, function(data) {
                        vm.error = data;
                    });
            }

	}
})();
