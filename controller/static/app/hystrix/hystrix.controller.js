(function(){
	'use strict';

	angular
		.module('shipyard.hystrix')
		.controller('HystrixController', HystrixController);

	HystrixController.$inject = ['hystrix', 'HystrixService', '$state', '$timeout'];
	function HystrixController(hystrix, HystrixService, $state, $timeout) {
            var vm = this;
            vm.hystrix = hystrix;
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
