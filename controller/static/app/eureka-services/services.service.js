(function(){
	'use strict';

	angular
		.module('shipyard.eureka-services')
        .factory('EurekaServicesService', EurekaServicesService);

	EurekaServicesService.$inject = ['$http'];
        function EurekaServicesService($http) {
            return {
                list: function() {
                    var promise = $http
                        .get('/eureka/apps')
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
            } 
        } 
})();
