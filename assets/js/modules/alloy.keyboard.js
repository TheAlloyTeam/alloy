(function() {
    'use strict';

    ALLOY.Keyboard = function() {

        var _initialised = false;
        var _accessKeys = [];

        var _init = function() {
            if (_initialised) { ALLOY.Log.debug("ALLOY.Keyboard is already initialised."); return; }

            _initialised = true;
            _initAccessKeys();

            ALLOY.Logger.trace('ALLOY.Keyboard Started');
        };

        var _initAccessKeys = function() {
            $('[accesskey][accesskey!=""]').each(function() {
                var key = $(this).attr("accesskey");
                _accessKeys[key.toUpperCase()] = this;
            });

            $(window).keydown(_onKeyPress);
        };

        var _onKeyPress = function(e) {
            var key = String.fromCharCode(e.keyCode);

            if (_accessKeys[key] !== undefined && _canAccessKey()) {
                ALLOY.Logger.trace("ALLOY.Keyboard: Triggered access key press: " + key + ", on element: " + _accessKeys[key]);
                var el = _accessKeys[key];
                el.click();
            }
        };

        var _canAccessKey = function() {
            /* Put functionality to NOT trigger access keys in here */
            if ($("input:focus").length > 0) {
                return false;
            }

            return true;
        };

        /* Get codes from bottom of page here: https://api.jquery.com/keydown/ */
        var _keycodes = {
            SPACEBAR:       32,
            PAGE_UP:        33,
            PAGE_DOWN:      34,
            END:            35,
            HOME:           36,
            ARROW_UP:       38,
            ARROW_DOWN:     40
        };

        var output = {
            init: _init,
            keycodes: _keycodes
        };

        return output;

    }();

    ALLOY.Logger.trace('ALLOY.Keyboard Initializing');
    // ALLOY.Lang.init();

    ALLOY.Keyboard.init();
})();
