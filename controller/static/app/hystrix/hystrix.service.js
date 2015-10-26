(function(){
	'use strict';

	angular
		.module('shipyard.hystrix')
        .factory('HystrixService', HystrixService);

	HystrixService.$inject = ['$http'];
        function HystrixService($http) {
            return {
                load: function() {
                    var promise = $http
                        .get('/api/getcloudaddr')
                        .then(function(response) {
                        	var addr = response.data.addr;
                            return addr;
                        });
                    return promise;
                },
            } 
        } 
})();
