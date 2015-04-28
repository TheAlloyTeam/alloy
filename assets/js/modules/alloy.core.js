(function() {
    'use strict';

    ALLOY.Core = function () {
        var ready = false;
        var version = "0.0.2";
        var readyQue = [];
        
        var config = {
            expressions: {
                "whitespace": "[\\x20\\t\\r\\n\\f]"
            },
            animation: {
                interval : 780
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
            var readyState = document.readyState;
            if(document.addEventListener) {
                // https://developer.mozilla.org/en-US/docs/Web/API/document.readyState

                if(readyState.match(/interactive|complete|loaded/)) {
                    callback();
                } else {
                    document.addEventListener("ALLOYDocumentReady", callback);
                }
            } else {
                // https://gist.github.com/vseventer/1476064
                document.onreadystatechange = function() {
                    // Interactive equals DOMContentLoaded, but doesn't always fire
                    if(readyState.match(/interactive|complete|loaded/)) {
                        this.onreadystatechange = null;//unbind
                        callback();
                    }
                    else {
                        document.addEventListener("ALLOYDocumentReady", callback);
                    }
                };
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
