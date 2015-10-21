(function(){
	'use strict';

	angular
    	    .module('shipyard.svcregs')
            .factory('SvcRegService', SvcRegService);

	SvcRegService.$inject = ['$http'];
        function SvcRegService($http) {
            return {
                list: function() {
                    var promise = $http
                        .get('/api/svcregs')
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
                getSvcReg: function(service_name) {
                    var promise = $http
                        .get('/api/svcregs/' + service_name)
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
                removeSvcReg: function(svcreg) {
                    var promise = $http
                        .delete('/api/svcregs/'+svcreg.service_name)
                        .then(function(response) {
                            return response.data;
                        });
                    return promise;
                },
            } 
        } 
})();
