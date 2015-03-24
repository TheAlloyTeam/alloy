(function() {
    'use strict';

    ALLOY.Core = function () {
        var readyque = [];
        
        var config = {
            animation: {
                interval : 780;
            },
            arc : {
                center: [285,185],
                radius: 100,
                start: 30,
                end: 200,
                dir: -1
            }
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
            ALLOY.Logger.startup('ALLOY.Core Started');
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
        ALLOY.Logger.trace('ALLOY.Core Initializing');
        ALLOY.Core.init();
    });
})();
