(function() {
    'use strict';

    ALLOY.Navigation = function () {

    	var _init = function() {
            totopnav();
            dropdown();
            ALLOY.Logger.startup('ALLOY.Navigation Started');
    	};

        var totopnav = function() {
            // TODO: Rewrite this to be more generic and bring in the pattern for the button rather than it being on the page
            // Check if button__totop should be visible on page load
            if ($(window).scrollTop() < 200) {
                $(".button__totop").data("visible", "false").fadeOut(1);
            }

            // Check if button__totop should be visible on scroll
            $(window).scroll(function() {
                var totop = $(".button__totop");

                if ($(window).scrollTop() >= 200 && totop.data("visible") !== 'true') {
                    totop.data("visible", "true").stop(true, true).fadeIn(200);
                } else if ($(window).scrollTop() < 200 && totop.data("visible") !== "false") {
                    totop.data("visible", "false").stop(true, true).fadeOut(200);
                }
            });

            // Perform smooth scroll to top of page
            $(".button__totop").click(function(e) {
                $("html, body").animate({ scrollTop: 0}, 200);
                e.preventDefault();
            });

        };

        var dropdown = function(){

            /***** Dropdown *****/
            $('[data-toggle="menu"]').click(function(e) {
                $(".menu").slideToggle(100);
                $("i",this).toggleClass("icon--up176 icon--downwards");
                e.preventDefault();
            });

        };

        var output = {
            init: _init
        };

        return output;

    }();



        ALLOY.Logger.trace('ALLOY.Navigation Initializing');
        ALLOY.Navigation.init();

})();
