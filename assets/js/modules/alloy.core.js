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
            ALLOY.Logger.startup('ALLOY.Core Started');
    	};

    	var pageSetup = function() {
    	    window.$ = $;
    		$("html").removeClass("no-js");
    	};

        // Check if button__totop should be visible on page load
        $(function() {
            if ($(window).scrollTop() < 200) {
                $(".button__totop").data("visible", "false").fadeOut(1);
            }
        });

        // Check if button__totop should be visible on scroll
        $(window).scroll(function() {
            if ($(window).scrollTop() >= 200 && $(".button__totop").data("visible") != 'true') {
                $(".button__totop").data("visible", "true").stop(true, true).fadeIn(200);
            } else if ($(window).scrollTop() < 200 && $(".button__totop").data("visible") != "false") {
                $(".button__totop").data("visible", "false").stop(true, true).fadeOut(200);
            }
        });

        // Perform smooth scroll to top of page
        $(".button__totop").click(function(e) {
            $("html, body").animate({ scrollTop: 0}, 200);
            e.preventDefault();
        });


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
