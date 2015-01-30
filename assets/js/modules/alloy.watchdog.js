(function() {
    ALLOY.Watchdog =  function (){
    	var config = {

    	};

    	var _init = function() {
    		console.log("ALLOY.Watchdog Started");
    	
    	};

        var public = {
            init: _init
        };

        return public;

    }();

    console.log("ALLOY.Watchdog Initializing");
    ALLOY.Watchdog.init();
})();