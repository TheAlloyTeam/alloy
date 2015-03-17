(function() {
    ALLOY.Utils = function() {

    	var _init = function() {
    		ALLOY.Logger.startup('ALLOY.Utils Started');
    	
    	};

        var public = {
            init: _init
        };

        return public;

    }();

    ALLOY.Logger.trace('ALLOY.Utils Initializing');
    ALLOY.Utils.init();
})();