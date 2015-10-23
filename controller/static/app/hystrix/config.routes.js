(function(){
	'use strict';

	angular
		.module('shipyard.hystrix')
		.config(getRoutes);

	getRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

	function getRoutes($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('dashboard.hystrix', {
			    url: '^/real_time',
			    templateUrl: 'app/hystrix/hystrix.html',
                            controller: 'HystrixController',
                            controllerAs: 'vm',
                            authenticate: 'true',
                            resolve: {
                            	hystrix: ['HystrixService', '$state', '$stateParams', function (HystrixService, $state, $stateParams) {
                                    return HystrixService.load().then(null, function(errorData) {	                            
                                        $state.go('error');
                                    }); 
                                }] 
                            }
			})
	}
})();
