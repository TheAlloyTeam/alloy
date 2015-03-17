(function() {
    'use strict';
    
    ALLOY.Lang = function() {

        var _init = function() {
            ALLOY.Log.tartup('ALLOY.Lib Started');
        };


        var output = {
            init: _init
        };

        return output;

    }();

    ALLOY.Log.trace('ALLOY.Lang Initializing');
    ALLOY.Lang.init();
})();
