(function() {
    ALLOY.Core = function () {
        var config = {

        };

    	var _init = function() {
            // add config to the ALLOY Namespace
            var config = ALLOY.config;
            pageSetup();
            console.log("ALLOY.Core Started");
    	};

    	var pageSetup = function() {
    	    window.$ = $;
    		$("html").removeClass("no-js");
    	};

        var public = {
            init: _init
        };

        return public;

    }();

    console.log("ALLOY.Core Initializing");
    ALLOY.Core.init();
})();
