(function () {

    $.fn.equalizer = function (options) {

        var defaults = {
            minimumWidth: 601,                  // The minimum width at which resizing will still occur
            applyWhat: "padding-bottom",        // The style to apply the difference in height to
            applyTo: ".element-selector",       // The element on which to apply the style to
        };

        function _doEqualize(els, options) {
            var config = $.extend({}, defaults, options, undefined);
            ALLOY.Logger.startup('ALLOY.Equalizer Working');

            // Reset the value to start with
            $(els).find(config.applyTo).css(config.applyWhat, "");
            if ($(window).width() <= config.minimumWidth) { return; }
            var that = this;

            var tallest = 0;
            $(els).each(function () {
                var height = $(this).height();
                if (height > tallest) { tallest = height; }
            });

            $(els).each(function () {
                var height = $(this).height();
                var diff = tallest - height;
                $(this).find(config.applyTo).css(config.applyWhat, diff + "px");
            });
        }

        _doEqualize(this, options);
    };
})();