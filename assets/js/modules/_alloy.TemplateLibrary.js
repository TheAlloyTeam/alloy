(function() {

    // the ALLOY Namespace is set up in the require config

    ALLOY.Lib = function() {

        // Private Functions
    	var _init = function() {
    		console.log("ALLOY.Lib Started");

    	};

        // Public Interface
        var public = {
            init: _init
        };

        return public;

    }();

    console.log("ALLOY.Lib Initializing");
    // force start of the Library Init function
    E78.Lib.init();
})();