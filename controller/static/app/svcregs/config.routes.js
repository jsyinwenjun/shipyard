(function(){
	'use strict';

	angular
		.module('shipyard.svcregs')
		.config(getRoutes);

	getRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

	function getRoutes($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('dashboard.svcregs', {
			    url: '^/svcregs',
			    templateUrl: 'app/svcregs/svcreg.html',
                            controller: 'SvcRegController',
                            controllerAs: 'vm',
                            authenticate: true,
                            resolve: {
                            	svcregs: ['SvcRegService', '$state', '$stateParams', function (SvcRegService, $state, $stateParams) {
                                    return SvcRegService.list().then(null, function(errorData) {	                            
                                        $state.go('error');
                                    }); 
                                }]
                            }
			})
                        .state('dashboard.addSvcReg', {
                            url: '^/svcregs/add',
                            templateUrl: 'app/svcregs/add.html',
                            controller: 'SvcRegAddController',
                            controllerAs: 'vm',
                            authenticate: true,
                            resolve: {
                            }
                        })
                        .state('dashboard.editSvcReg', {
                            url: '^/svcregs/edit/{service_name}',
                            templateUrl: 'app/svcregs/edit.html',
                            controller: 'SvcRegEditController',
                            controllerAs: 'vm',
                            authenticate: true,
                            resolve: {
                                svcreg: ['SvcRegService', '$state', '$stateParams', function (SvcRegService, $state, $stateParams) {
                                    return SvcRegService.getSvcReg($stateParams.username).then(null, function(errorData) {
                                        $state.go('error');
                                    });
                                }]
                            }
                        });
	}
})();
