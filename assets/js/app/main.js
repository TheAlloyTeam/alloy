/* ==========================================================================
// app.js
// =========================================================================*/

// Start the main app logic.
require(['jquery', 'fontloader', 'navigation', 'logging', 'core', 'mobile', 'iefixes', 'highlight', 'dragdrop', 'configretriever', 'watchdog'],
    function ($) {
        ALLOY.Logger.startup('ALLOY.Main Started');
		hljs.initHighlightingOnLoad();

		var setCardBlurWidth = function() {
            $(".blurMask__width").each(function() {
                var width = $(this).closest(".blurMask").width();
                $(this).css({ width: width + "px" });
            });
        };

        setCardBlurWidth();
        $(window).resize(setCardBlurWidth);

    }
);

/* ==========================================================================
// Require js Errors
// =========================================================================*/

if (DEBUG) {
	requirejs.onError = function (err) {
	    console.log(err.requireType);
	    if (err.requireType === 'timeout') {
	        console.log('modules: ' + err.requireModules);
	    }
 	    throw err;
	};
}