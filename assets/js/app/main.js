/* ==========================================================================
// app.js
// =========================================================================*/

// Start the main app logic.
require(['jquery', 'core', 'mobile', 'iefixes'],
    function ($) {
        console.log("ALLOY.Main Started");
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