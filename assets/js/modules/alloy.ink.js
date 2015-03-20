// Taken and modified from: http://webdesign.tutsplus.com/tutorials/recreating-the-touch-ripple-effect-as-seen-on-google-design--cms-21655
(function() {

    // how to bring in the options
    var Ink = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Ink.prototype =  {
        that: {},

        defaults: {
            classes: {
                'box': 'button',
                'ink': 'ink',
                'svg': 'svg',
                'ripple': 'ripple'
            },
            rippleInterval: 300
        },

        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            that = this;

            this.$element.click(that._svgOnClick);
            ALLOY.Logger.startup('ALLOY.Ink Started');
        },

        _svgOnClick: function(e) {
            // In case button isn't position relative
            $(this).css({ position: "relative" });

            var x = e.pageX;
            var y = e.pageY;
            var clickY = y - $(this).offset().top;
            var clickX = x - $(this).offset().left;
            var box = this;
            var setX = parseInt(clickX);
            var setY = parseInt(clickY);
            $(this).find("." + that.config.classes.svg).remove();
            $(this).append('<svg class="' + that.config.classes.svg + '"><circle class="' + that.config.classes.ripple + '" cx="'+setX+'" cy="'+setY+'" r="'+0+'"></circle></svg>');
               
            var c = $(box).find("." + that.config.classes.ripple);
            c.animate(
            {
                "r" : Math.sqrt(Math.pow($(box).outerWidth(), 2) + Math.pow($(box).outerHeight(), 2)).toFixed(2)
            },
            {
                easing: "alloy",
                duration: that.config.rippleInterval,
                step : function(val) {
                    c.attr("r", val);
                },
                complete: function() {
                    c.fadeOut('fast', function() { c.remove(); });
                }
            });
        }
    };

    Ink.defaults = Ink.prototype.defaults;

    $.fn.ink = function(options) {
        return this.each(function() {
            new Ink(this, options)._init(this);
        });
    };

    // Autostart Plugin
    ALLOY.Logger.trace('ALLOY.Ink Initialized');
    $('.button').ink();
})();
