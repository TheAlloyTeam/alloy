/* ==========================================================================
// conf.js
// =========================================================================*/
 
// Main Require configuration

var require = {
    baseUrl: '/assets/js/',
    waitSeconds : 40,
    //urlArgs: "bust=" + (new Date()).getTime(), // For development to bypass the cache
    //urlArgs: "bust=v2", // For production
    paths: {
        app: "app",
        libs: "libs",
        modules: "modules",
        jquery: "libs/jquery/jquery.min",
        fontfaceobserver: "libs/fontfaceobserver/fontfaceobserver",
        async: "libs/async",
        'bezier' : "libs/easing/index",
        'mustache' : "libs/mustache/mustache",
        'prettyprint': "libs/google-code-prettify/run_prettify",
        'selectivizr': "libs/selectivizr",
        'logging': "modules/alloy.logging",
        'core': "modules/alloy.core",
        'utils': "modules/alloy.utils",
        'iefixes': "modules/alloy.iefixes",
        'mobile': "modules/alloy.mobile",
        'cookies': "modules/alloy.cookies",
        'fontloader': "modules/alloy.fontloader",
        'navigation': "modules/alloy.navigation",
        'accordion': "modules/alloy.accordion",
        'tabs' : "modules/alloy.tabs",
        'toast' : "modules/alloy.toast",
        'flash' : "modules/alloy.flash",
        'ink' : "modules/alloy.ink",
        'easing' : "modules/alloy.easing",
        'amd': "modules/exports/amd",
        'cardflipper': "modules/alloy.cardflipper",
        'cardslider': "modules/alloy.cardslider",
        'gmap': "modules/alloy.gmap",
        'equalizer': "modules/alloy.equalizer",
        'gridify': "modules/alloy.gridify",
        'sticky': "modules/alloy.sticky",
        'dragdrop': "modules/alloy.dragdrop",
        'modal': "modules/alloy.modal",
        'configretriever': "modules/alloy.configretriever"
    },
    shim: {
        'logging': {deps: ['jquery']},
        'utils': {deps: ['jquery', 'logging']},
        'core': {deps: ['jquery', 'logging', 'utils', 'amd']},
        'iefixes': {deps: ['jquery', 'core', 'logging']},
        'navigation': {deps: ['jquery', 'core', 'logging']},
        'mobile': {deps: ['jquery', 'core', 'logging']},
        'cookies': {deps: ['jquery', 'core', 'logging']},
        'fontloader': {deps: ['fontfaceobserver', 'core', 'logging', 'cookies']},
        'accordion': {deps: ['jquery', 'core', 'logging']},
        'tabs' : {deps: ['jquery', 'core', 'logging']},
        'toast' : {deps: ['jquery', 'core', 'logging', 'mustache']},
        'flash' : {deps: ['jquery', 'core', 'logging', 'mustache']},
        'easing' : {deps: ['jquery', 'bezier']},
        'ink' : {deps: ['jquery', 'core', 'logging', 'easing']},
        'cardflipper': {deps: ['jquery', 'core', 'logging']},
        'cardslider': {deps: ['jquery', 'core', 'logging']},
        'gmap': {deps: ['jquery', 'core', 'logging', 'async!http://maps.google.com/maps/api/js?sensor=false']},
        'equalizer': {deps: ['jquery', 'core', 'logging']},
        'gridify': {deps: ['jquery', 'core', 'logging']},
        'sticky': { deps: ['jquery', 'core', 'logging'] },
        'dragdrop': {deps: ['jquery']},
        'modal': {deps: ['jquery', 'core', 'logging']},
        'configretriever': {deps: ['jquery', 'core', 'logging']}
        //jqueryvalidate: { deps: ['jquery'] },
        //jqueryvalidateunobtrusive: { deps: ['jquery', 'jqueryvalidate'] },
        //jqueryunobtrusive: { deps: ['jquery'] }
    }
};