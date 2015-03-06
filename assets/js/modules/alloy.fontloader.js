(function() {

    // the ALLOY Namespace is set up in the require config

    ALLOY.FontLoader = function() {

        // Private Functions
    	var _init = function() {
    		console.log("ALLOY.FontLoader Started");

    	};

        // Public Interface
        var public = {
            init: _init
        };

        return public;

    }();

    console.log("ALLOY.FontLoader Initializing");
    // force start of the Library Init function
    ALLOY.FontLoader.init();
})();