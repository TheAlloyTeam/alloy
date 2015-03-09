(function() {
    'use strict';

    ALLOY.Core = function () {
        var config = {

        };

        var _ready = function(callback) {
            // https://developer.mozilla.org/en-US/docs/Web/API/document.readyState
            var readyState = document.readyState;

            if(readyState === "complete" || readyState === "loaded") {
                callback();
            } else {
                document.addEventListener("ALLOYDocumentReady", callback);
            }
        };

        var _hide = function() {

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

        var output = {
            ready: _ready,
            init: _init
        };

        return output;

    }();



    ALLOY.Core.ready(function() {
        console.log("ALLOY.Core Initializing");
        ALLOY.Core.init();
    });
})();
