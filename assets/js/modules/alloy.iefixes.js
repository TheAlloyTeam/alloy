(function() {
    'use strict';

    ALLOY.iefixes = function(){

    	var _init =  function() {

            // IE7 Box Sizing
            if($("html").hasClass("ie7")) {
                colSizing();
                $(window).on("resize", this.colSizing);
            }

            // < IE8 Selectivizr
    	    if ($('html.lt-ie9').size()) {
    	        require(['jquery', 'selectivizr']);
    	    } else {
    	        // else
    	    }

            ALLOY.Logger.startup('ALLOY.ieFixes Started');
    	};

    	var colSizing = function() {

            // In case width is already set
            $("[class*='c__']").css("width","");

            $("[class*='c__']").each(function(){

                var fullW = $(this).outerWidth();
                var actualW = $(this).width();
                var wDiff = fullW - actualW;
                var newW = actualW - wDiff;

                $(this).css('width',newW);
            });
        };

        var output = {
            init: _init
        };

        return output;

    }();

    ALLOY.Logger.trace('ALLOY.ieFixes Initializing');
    ALLOY.iefixes.init();

})();
