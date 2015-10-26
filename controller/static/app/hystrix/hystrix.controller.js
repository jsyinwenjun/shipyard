(function(){
	'use strict';

	angular
		.module('shipyard.hystrix')
		.controller('HystrixController', HystrixController);

	HystrixController.$inject = ['HystrixService', '$state', '$timeout'];
	function HystrixController(HystrixService, $state, $timeout) {
            var vm = this;
            vm.refresh = refresh;

            function refresh() {
            	HystrixService.load()
                    .then(function(data) {
                        vm.cloudAddr = data; 
                    }, function(data) {
                        vm.error = data;
                    });
                vm.error = "";
            }
	}
})();
