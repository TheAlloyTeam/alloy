(function() {
    ALLOY.Utils = function() {

    	var _init = function() {
    		console.log('%cALLOY.Utils Started', 'color: green;');
    	
    	};

        var public = {
            init: _init
        };

        return public;

    }();

    console.log('%cALLOY.Utils Initializing', 'color: orange;');
    ALLOY.Utils.init();
})();