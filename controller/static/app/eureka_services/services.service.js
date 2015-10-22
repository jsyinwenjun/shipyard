(function(){
	'use strict';

	angular
		.module('shipyard.eureka_services')
        .factory('EurekaServicesService', EurekaServicesService);

	EurekaServicesService.$inject = ['$http'];
        function EurekaServicesService($http) {
            return {
                list: function() {
                    var promise = $http
                        .get('/eureka/apps')
                        .then(function(response) {
                        	var res = response.data.applications.application;
                            return res ? res : [];
                        });
                    return promise;
                },
            } 
        } 
})();
