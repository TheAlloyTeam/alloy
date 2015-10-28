(function() {
    ALLOY.Mobile = function() {

    	var _init = function() {
            navButton();
            ALLOY.Logger.startup('ALLOY.Mobile Started');
    	};

        var navButton = function() {
            $(".button__mobile--mainnav").click(function() {
                $(".w--nav").slideToggle(200);
                this.classList.toggle( "active" );
            });
        };

        var public = {
            init: _init
        };

        return public;

    }();

    // force start of mobile functions
    ALLOY.Logger.trace('ALLOY.Mobile Initializing');
    ALLOY.Mobile.init();
})();
