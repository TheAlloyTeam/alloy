/* ==========================================================================
// ALLOY.initial.js
// =========================================================================*/

// Namespace Setup
var ALLOY = ALLOY || {};

// Env Setup
var DEBUG = true;
window.DEBUG = DEBUG;

if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement("style");
  msViewportStyle.appendChild(
    document.createTextNode(
      "@-ms-viewport{width:auto!important}"
    )
  );
  document.getElementsByTagName("head")[0].
    appendChild(msViewportStyle);
}