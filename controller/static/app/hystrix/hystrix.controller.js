(function(){
	'use strict';

	angular
		.module('shipyard.hystrix')
		.controller('HystrixController', HystrixController);

	HystrixController.$inject = ['HystrixService', '$state', '$timeout'];
	function HystrixController(HystrixService, $state, $timeout) {
            var vm = this;
            vm.refresh = refresh;
            HystrixService.load()
            .then(function(data) {
                vm.cloudAddr = data;
                vm.refresh();
            }, function(data) {
                vm.error = data;
            });
            
            function refresh() {
            	/**
        		 * Queue up the monitor to start once the page has finished loading.
        		 * 
        		 * This is an inline script and expects to execute once on page load.
        		 */ 
        		 
        		 // commands
        		var hystrixMonitor = new HystrixCommandMonitor('dependencies', {includeDetailIcon:false});
        		
        		var stream = encodeURIComponent(vm.cloudAddr);
        		
        		console.log("Stream: " + stream)
        		
        		if(stream != undefined) {
        			
        			var commandStream = "${contextPath}/proxy.stream?origin=" + stream;
        			var poolStream = "${contextPath}/proxy.stream?origin=" + stream;
        			
        			$('#title_name').html("Hystrix Stream: " + decodeURIComponent(stream))
        		}
        		console.log("Command Stream: " + commandStream)
        				
        		setTimeout(function() {
        			if(commandStream == undefined) {
        					console.log("commandStream is undefined")
        					$("#dependencies .loading").html("The 'stream' argument was not provided.");
        					$("#dependencies .loading").addClass("failed");
        			} else {
        				// sort by error+volume by default
        				hystrixMonitor.sortByErrorThenVolume();
        				
        				// start the EventSource which will open a streaming connection to the server
        				var source = new EventSource(commandStream);
        				
        				// add the listener that will process incoming events
        				source.addEventListener('message', hystrixMonitor.eventSourceMessageListener, false);

        				//	source.addEventListener('open', function(e) {
        				//		console.console.log(">>> opened connection, phase: " + e.eventPhase);
        				//	    // Connection was opened.
        				//	}, false);

        				source.addEventListener('error', function(e) {
        					$("#dependencies .loading").html("Unable to connect to Command Metric Stream.");
        					$("#dependencies .loading").addClass("failed");
        				  if (e.eventPhase == EventSource.CLOSED) {
        				    // Connection was closed.
        					  console.log("Connection was closed on error: " + JSON.stringify(e));
        				  } else {
        					  console.log("Error occurred while streaming: " + JSON.stringify(e));
        				  }
        				}, false);
        			}
        		},0);
        		
        		// thread pool
        		var dependencyThreadPoolMonitor = new HystrixThreadPoolMonitor('dependencyThreadPools');

        		setTimeout(function() {
        			if(poolStream == undefined) {
        					console.log("poolStream is undefined")
        					$("#dependencyThreadPools .loading").html("The 'stream' argument was not provided.");
        					$("#dependencyThreadPools .loading").addClass("failed");
        			} else {
        				dependencyThreadPoolMonitor.sortByVolume();
        				
        				// start the EventSource which will open a streaming connection to the server
        				var source = new EventSource(poolStream);
        				
        				// add the listener that will process incoming events
        				source.addEventListener('message', dependencyThreadPoolMonitor.eventSourceMessageListener, false);

        				//	source.addEventListener('open', function(e) {
        				//		console.console.log(">>> opened connection, phase: " + e.eventPhase);
        				//	    // Connection was opened.
        				//	}, false);

        				source.addEventListener('error', function(e) {
                               $("#dependencies .loading").html("Unable to connect to Command Metric Stream.");
                               $("#dependencies .loading").addClass("failed");
        				  if (e.eventPhase == EventSource.CLOSED) {
        				    // Connection was closed.
        					  console.log("Connection was closed on error: " + e);
        				  } else {
        					  console.log("Error occurred while streaming: " + e);
        				  }
        				}, false);
        			}
        		},0);
            }
	}
})();
