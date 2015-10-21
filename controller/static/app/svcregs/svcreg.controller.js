(function(){
	'use strict';

	angular
		.module('shipyard.svcregs')
		.controller('SvcRegController', SvcRegController);

	SvcRegController.$inject = ['svcregs', 'SvcRegService', '$state', '$timeout'];
	function SvcRegController(svcregs, SvcRegService, $state, $timeout) {
            var vm = this;
            vm.svcregs = svcregs;
            vm.refresh = refresh;
            vm.selectedSvcReg = null;
            vm.removeSvcReg = removeSvcReg;
            vm.showRemoveSvcRegDialog = showRemoveSvcRegDialog;

            function showRemoveSvcRegDialog(svcreg) {
                vm.selectedSvcReg = svcreg;
                $('#remove-modal').modal('show');
            }

            function refresh() {
            	SvcRegService.list()
                    .then(function(data) {
                        vm.svcregs = data; 
                    }, function(data) {
                        vm.error = data;
                    });
                vm.error = "";
            }

            function removeSvcReg() {
            	SvcRegService.removeSvcReg(vm.selectedSvcReg)
                    .then(function(data) {
                        vm.refresh();
                    }, function(data) {
                        vm.error = data;
                    });
            }
            
	}
})();
