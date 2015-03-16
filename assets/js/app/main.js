/* ==========================================================================
// app.js
// =========================================================================*/

// Start the main app logic.
require(['jquery', 'fontloader', 'logging', 'core', 'mobile', 'iefixes', 'prettyprint'],
    function ($) {
        ALLOY.Logger.startup('ALLOY.Main Started');
    }
);

/* ==========================================================================
// Require js Errors
// =========================================================================*/

if (DEBUG) {
	requirejs.onError = function (err) {
	    console.log(log(err.requireType));
	    if (err.requireType === 'timeout') {
	        console.log('modules: ' + err.requireModules);
	    }
	    throw err;
	};
};