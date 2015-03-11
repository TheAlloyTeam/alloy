(function() {
    ALLOY.Mobile = function() {

    	var _init = function() {
            navButton();
            console.log('%cALLOY.Mobile Started', 'color: green;');
    	};

        var navButton = function() {
            $(".button__mobile--navigation").click(function() {
                $(".w--navigation").slideToggle(200);
                this.classList.toggle( "active" );
            });
        };

        var public = {
            init: _init
        };

        return public;

    }();

    // force start of mobile functions
    console.log('%cALLOY.Mobile Initializing', 'color: orange;');
    ALLOY.Mobile.init();
})();
