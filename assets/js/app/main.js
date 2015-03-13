/* ==========================================================================
// app.js
// =========================================================================*/

// Start the main app logic.
require(['jquery', 'core', 'mobile', 'fontloader', 'iefixes'],
    function ($) {
        console.log('%cALLOY.Main Started', 'color: green;');
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
};