(function( core ) {
    'use strict';
    
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "alloy.core", [], function() {
		return core;
	});
}

})();