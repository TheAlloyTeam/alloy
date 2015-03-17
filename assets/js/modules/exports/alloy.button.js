(function() {
    'use strict';

    // the ALLOY Namespace is set up in the require config

    ALLOY.Button = function() {

        // Private Functions
    	var _init = function() {
    		ALLOY.Logger.startup('ALLOY.Button Started');

    	};

        // Public Interface
        var public = {
            init: _init
        };

        return public;

    }();

    ALLOY.Logger.trace('ALLOY.Button Initializing');
    // force start of the Library Init function
    ALLOY.Button.init();
})();
