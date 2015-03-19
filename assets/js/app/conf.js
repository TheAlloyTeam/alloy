/* ==========================================================================
// conf.js
// =========================================================================*/

// Namespace Setup
var ALLOY = ALLOY || {};

// Env Setup
var DEBUG = true;
window.DEBUG = DEBUG;
 
// Main Require configuration

var require = {
    baseUrl: '/assets/js/',
    waitSeconds : 40,
    urlArgs: "bust=" + (new Date()).getTime(), // For development to bypass the cache
    //urlArgs: "bust=v2", // For production
    paths: {
        app: "app",
        libs: "libs",
        modules: "modules",
        jquery: "libs/jquery/jquery.min",
        fontfaceobserver: "libs/fontfaceobserver/fontfaceobserver",
        'prettyprint': "libs/google-code-prettify/run_prettify",
        'selectivizr': "libs/selectivizr",
        'logging': "modules/alloy.logging",
        'core': "modules/alloy.core",
        'utils': "modules/alloy.utils",
        'iefixes': "modules/alloy.iefixes",
        'mobile': "modules/alloy.mobile",
        'fontloader': "modules/alloy.fontloader",
        'accordion': "modules/alloy.accordion",
        'tabs' : "modules/alloy.tabs",
        'amd': "modules/exports/amd"
    },
    shim: {
        'logging': {deps: ['jquery']},
        'utils': {deps: ['jquery', 'logging']},
        'core': {deps: ['jquery', 'logging', 'utils', 'amd']},
        'iefixes': {deps: ['jquery', 'core', 'logging']},
        'mobile': {deps: ['jquery', 'core', 'logging']},
        'fontloader': {deps: ['fontfaceobserver', 'core', 'logging']},
        'accordion': {deps: ['jquery', 'core', 'logging']},
        'tabs' : {deps: ['jquery', 'core', 'logging']}
        //jqueryvalidate: { deps: ['jquery'] },
        //jqueryvalidateunobtrusive: { deps: ['jquery', 'jqueryvalidate'] },
        //jqueryunobtrusive: { deps: ['jquery'] }
    }
}; 
