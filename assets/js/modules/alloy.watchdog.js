(function() {
    ALLOY.Watchdog =  function (){
    	var config = {

    	};

    	var _init = function() {
    		ALLOY.Logger.startup('ALLOY.Watchdog Started');
    	
    	};

        var public = {
            init: _init
        };

        return public;

    }();

    console.log('%cALLOY.Watchdog Initializing', 'color: orange;');
    ALLOY.Watchdog.init();
})();
