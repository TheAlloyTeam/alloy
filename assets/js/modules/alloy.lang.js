(function() {
    ALLOY.Lang = function() {

        var _init = function() {
            ALLOY.Log.Startup("ALLOY.Lang Started");
        };


        var public = {
            init: _init
        };

        return public;

    }();

    ALLOY.Log.Startup("ALLOY.Lang Initializing");
    ALLOY.Lang.init();
})();
