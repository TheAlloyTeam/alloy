(function() {
    'use strict';

    ALLOY.Navigation = function () {
        var config = {

        };

    	var _init = function() {
            // add config to the ALLOY Namespace
            var config = ALLOY.config;
            ALLOY.Logger.startup('ALLOY.Navigation Started');
    	};

        var totopnav = function() {
            // Check if button__totop should be visible on page load
            if ($(window).scrollTop() < 200) {
                $(".button__totop").data("visible", "false").fadeOut(1);
            }

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

        };

        var output = {
            init: _init
        };

        return output;

    }();



    ALLOY.Navigation.ready(function() {
        ALLOY.Logger.trace('ALLOY.Navigation Initializing');
        ALLOY.Navigation.init();
    });
})();
