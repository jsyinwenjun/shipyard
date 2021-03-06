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
                        	if (!res) res = [];
                        	var apps = [];
                        	if (res.length) {
                        		angular.forEach(res, addApp);
                        	}else {
                        		addApp(res);
                        	}
                        	function addApp(app) {
                        		var num = 0;
                        		var addr = "";
                        		if (app.instance) {
                        			num = 1;
                        			if (app.instance.length) {
                        				num = app.instance.length;
                        				angular.forEach(app.instance, function(ins) {
                        					addr += ins.ipAddr + ",";
                        				});
                        				addr = addr.substring(0, addr.length - 1);
                        			}else {
                        				addr = app.instance.ipAddr;
                        			}
                        			
                        		}
                        		apps.push({
                        			name: app.name,
                        			number: num,
                        			idAddr: addr
                        		});
                        	};
                            return apps;
                        });
                    return promise;
                },
            } 
        } 
})();
