(function() {
    ALLOY.Utils = function() {

    	var _init = function() {
    		console.log("ALLOY.Utils Started");
    	
    	};

        var public = {
            init: _init
        };

        return public;

    }();

    console.log("ALLOY.Utils Initializing");
    ALLOY.Utils.init();
})();