(function() {

    // the ALLOY Namespace is set up in the require config

    ALLOY.FontLoader = function() {

        // Private Functions
    	var _init = function() {
    		console.log('%cALLOY.FontLoader Started', 'color: green;');

    	};

        // Public Interface
        var public = {
            init: _init
        };

        return public;

    }();

    console.log('%cALLOY.FontLoader Initializing', 'color: orange;');
    // force start of the Library Init function
    ALLOY.FontLoader.init();
})();
