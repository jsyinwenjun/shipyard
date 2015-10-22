(function(){
	'use strict';

	angular
		.module('shipyard.eureka_services')
		.config(getRoutes);

	getRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

	function getRoutes($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('dashboard.eureka_services', {
			    url: '^/eureka_services',
			    templateUrl: 'app/eureka_services/services.html',
                            controller: 'EurekaServicesController',
                            controllerAs: 'vm',
                            authenticate: 'true',
                            resolve: {
                                eureka_services: ['EurekaServicesService', '$state', '$stateParams', function (EurekaServicesService, $state, $stateParams) {
                                    return EurekaServicesService.list().then(null, function(errorData) {	                            
                                        $state.go('error');
                                    }); 
                                }] 
                            }
			})
	}
})();
