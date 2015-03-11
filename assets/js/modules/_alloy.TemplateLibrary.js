(function() {

    // the ALLOY Namespace is set up in the require config

    ALLOY.Lib = function() {

        // Private Functions
    	var _init = function() {
    		console.log('%cALLOY.Lib Started', 'color: green;');

    	};

        // Public Interface
        var public = {
            init: _init
        };

        return public;

    }();

    console.log('%cALLOY.Lib Initializing', 'color: orange;');
    // force start of the Library Init function
    ALLOY.Lib.init();
})();
