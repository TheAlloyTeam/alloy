(function() {
    ALLOY.Watchdog =  function (){
    	var config = {

    	};

    	var _init = function() {
    		console.log('%cALLOY.Watchdog Started', 'color: green;');
    	
    	};

        var public = {
            init: _init
        };

        return public;

    }();

    console.log('%cALLOY.Watchdog Initializing', 'color: orange;');
    ALLOY.Watchdog.init();
})();
