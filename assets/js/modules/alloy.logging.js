(function() {
	ALLOY.Logger = function() {

		var consoleActive = false;

		var config = {
			'version': "0.0.1",

			'level': ["ALL", "TRACE", "DEBUG", "INFO", "WARN", "ERROR", "FATAL", "OFF"],

			'color': {
				'ALL': "grey",
				'TRACE': "blue",
				'DEBUG': "cyan",
				'INFO': "green",
				'WARN': "yellow",
				'ERROR': "red",
				'FATAL': "magenta",
				'START': "green",
				'OFF': "grey"
			},

			'number': {
				'ALL': 0,
				'START': 10,
				'TRACE': 5000,
				'DEBUG': 10000,
				'INFO': 20000,
				'WARN': 30000,
				'ERROR': 40000,
				'FATAL': 50000,
				'OFF': 0
			}
		};

		var _init = function() {
			_fixconsole();
		};

		var _fixconsole = function() {
			var method;
		    var noop = function () {};
		    var methods = [
		        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
		    ];
		    var length = methods.length;
		    var console = (window.console = window.console || {});

		    while (length--) {
		        method = methods[length];

		        // Only stub undefined methods.
		        if (!console[method]) {
		            console[method] = noop;
		        } else {
	                if (!consoleActive) {
	                    // use internal logging
	                    startup("Console is on");
	                    startup("you have a working console implementation - well done");
	                    consoleActive = true;
	                }
	            }
		    }
		};

		var logEvent = function(level, message) {
			var event = {};
			event.time = new Date();
			event.message = message;
			event.level = level;

		};

		var logToConsole =  function(event) {

		};

		var logThis = function(level, message) {
			//var logEvent = new logEvent(level, message);
			//logToConsole(logEvent);
		};

		// Log Items

		var info = function(message) {
			logThis("INFO", message);
		};

		var debug = function(message) {
			logThis("DEBUG", message);
		};

		var trace = function(message) {
			logThis("TRACE", message);
		};

		var warn = function(message) {
			logThis("WARN", message);
		};

		var error = function(message) {
			logThis("ERROR", message);
		};

		var fatal = function(message) {
			logThis("FATAL", message);
		};

		var startup = function(message) {
			logThis("START", message);
		};

        var public = {
            init: _init,
            log : logThis,
            info : info,
            debug : debug,
            trace : trace,
            warn : warn,
            error: error,
            fatal : fatal,
            startup : startup
        };

        return public;

    }();

	// Functions

	console.log("ALLOY.Logging Loaded");
	ALLOY.Logger.init();
})();