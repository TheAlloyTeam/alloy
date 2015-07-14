/* ==========================================================================
// ALLOY.initial.js
// =========================================================================*/

// Namespace Setup
var ALLOY = ALLOY || {};
window.ALLOY = ALLOY;

// Env Setup
var DEBUG = false;
window.DEBUG = DEBUG;

var DEV = false;
window.DEV = DEV;

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

/***** Filthy hack because of weird IE/gmaps bug where getBoundingClientRect returns undefined and falls over *****/
/***** See: http://stackoverflow.com/questions/19275088/in-google-maps-getboundingclientrect-gives-unspecified-error-in-ie *****/
var elementPrototype = typeof HTMLElement !== "undefined" ? HTMLElement.prototype : Element.prototype;
elementPrototype.getBoundingClientRect = (function () {
    var oldGetBoundingClientRect = elementPrototype.getBoundingClientRect;
    return function () {
        try {
            return oldGetBoundingClientRect.apply(this, arguments);
        } catch (e) {
            return {
                left: '',
                right: '',
                top: '',
                bottom: ''
            };
        }
    };
})();