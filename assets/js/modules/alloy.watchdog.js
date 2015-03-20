(function() {
    ALLOY.Watchdog =  function (){
    	var defaults = {
            interval: 60000 //Check every minute
    	};

    	var _init = function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            _start();
    		ALLOY.Logger.startup('ALLOY.Watchdog Started');

    	};

        var tick = function() {
            ALLOY.watchdogInterval = setInterval(function () {
                bark("TimedCheck"); }, config.interval);

        };

        var bark = function() {

        };

        var action = function() {

        };

        var getdata = function() {

        };

        var _stop = function() {

        };

        var _start = function() {

            ALLOY.Logger.trace('ALLOY.Watchdog now running');

            ALLOY.Logger.trace('ALLOY.Watchdog is already running');

        };

        var _setinterval = function() {

        };

        var public = {
            init: _init,
            stop: _stop,
            start: _start,
            setinterval: _setinterval
        };

        return public;

    }();

    ALLOY.Logger.trace('ALLOY.Watchdog Initializing');
    ALLOY.Watchdog.init();
})();
