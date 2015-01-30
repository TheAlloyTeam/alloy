(function() {
    ALLOY.Mobile = function() {

    	var _init = function() {
            console.log("ALLOY.Mobile Started");

            navButton();
    	};

        var navButton = function() {
            $(".button__mobile--nav").click(function() {
                $(".list__navigation--main").slideToggle(200);
                this.classList.toggle( "active" );
            });
        };

        var public = {
            init: _init
        };

        return public;

    }();

    // force start of mobile functions
    console.log("ALLOY.Mobile Initializing");
    ALLOY.Mobile.init();
})();