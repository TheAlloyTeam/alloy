(function() {
    'use strict';
    
    ALLOY.Lang = function() {

        var _init = function() {
            ALLOY.Log.Startup('%cALLOY.Lib Started', 'color: green;');
        };


        var output = {
            init: _init
        };

        return output;

    }();

    ALLOY.Log.Startup('%cALLOY.Lang Initializing', 'color: orange;');
    ALLOY.Lang.init();
})();
