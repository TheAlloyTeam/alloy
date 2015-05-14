(function() {
    'use strict';

    ALLOY.Keyboard = function() {

        var _init = function() {
            ALLOY.Log.startup('ALLOY.Keyboard Started');
        };


        var output = {
            init: _init
        };

        return output;

    }();

    ALLOY.Log.trace('ALLOY.Keyboard Initializing');
    ALLOY.Lang.init();
})();
