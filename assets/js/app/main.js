/* ==========================================================================
// app.js
// =========================================================================*/

// Start the main app logic.
require(['jquery', 'fontloader', 'navigation', 'logging', 'core', 'mobile', 'iefixes', 'highlight', 'dragdrop', 'configretriever', 'watchdog'],
    function ($) {
        ALLOY.Logger.startup('ALLOY.Main Started');
		hljs.initHighlightingOnLoad();
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