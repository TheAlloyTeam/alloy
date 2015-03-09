(function() {
    'use strict';
    
    ALLOY.Lang = function() {

        var _init = function() {
            ALLOY.Log.Startup("ALLOY.Lang Started");
        };


        var output = {
            init: _init
        };

        return output;

    }();

    ALLOY.Log.Startup("ALLOY.Lang Initializing");
    ALLOY.Lang.init();
})();
