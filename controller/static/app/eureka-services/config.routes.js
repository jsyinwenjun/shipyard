(function(){
	'use strict';

	angular
		.module('shipyard.eureka-services')
		.config(getRoutes);

	getRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

	function getRoutes($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('dashboard.eureka-services', {
			    url: '^/eureka-services',
			    templateUrl: 'app/eureka-services/services.html',
                            controller: 'EurekaServicesController',
                            controllerAs: 'vm',
                            authenticate: 'true',
                            resolve: {
                                eureka-services: ['EurekaServicesService', '$state', '$stateParams', function (EurekaServicesService, $state, $stateParams) {
                                    return EurekaServicesService.list().then(null, function(errorData) {	                            
                                        $state.go('error');
                                    }); 
                                }] 
                            }
			})
	}
})();
