(function() {

    // Returns the current value of an element within a CSS media query (MQ)
    // even if the MQ is set in ems (variable per users zoom setting)
    // so we don't have an overlap/gap if we specify pixels.

    ALLOY.queryMedia = function() {

        // Private Functions
        var _init = function() {
            ALLOY.Logger.startup('ALLOY.QueryMedia Started');

            var mq = document.getElementById("mediaquery");
            if (mq) {
                // Check for all browsers
                mq.addEventListener('webkitTransitionEnd', eventCheck, true);
                mq.addEventListener('oTransitionEnd', eventCheck, true);
                mq.addEventListener('transitionend', eventCheck, true);
            }
        };

        var eventCheck = function() {
            // Queries the ::after:content value of <div id="mediaquery"></div>
            // Set the content value in the CSS for each media query needed
            var mediaSize = "large";
            var mq = document.getElementById("mediaquery");
            if (mq) {
                mediaSize = window.getComputedStyle(mq,":after").getPropertyValue("content");
            }

            // Remove the quotes around the result for FF and Safari
            mediaSize = mediaSize.replace( /"/g, '' );

            ALLOY.Logger.info('ALLOY.QueryMedia Size: ' + mediaSize);
            return mediaSize;
        };

        // Public Interface
        var public = {
            init: _init,
            getSize : eventCheck
        };

        return public;

    }();

    ALLOY.Logger.trace('ALLOY.QueryMedia Initializing');
    // force start of the Library Init function
    ALLOY.queryMedia.init();
})();
