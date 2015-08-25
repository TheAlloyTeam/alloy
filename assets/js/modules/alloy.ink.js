// Taken and modified from: http://webdesign.tutsplus.com/tutorials/recreating-the-touch-ripple-effect-as-seen-on-google-design--cms-21655
// For event re-ordering see: http://www.robeesworld.com/blog/67/changing-the-order-of-the-jquery-event-queue
(function() {

    // how to bring in the options
    var Ink = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Ink.prototype =  {
        defaults: {
            classes: {
                'box': 'button',
                'ink': 'ink',
                'svg': 'svg',
                'ripple': 'ripple'
            },
            rippleInterval: 300,
            easing: 'alloy'
        },

        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            var that = this;
            this.$element.on("click.ink", function(e) {
                if (that.$element.hasClass("event-paused")) {
                    that.$element.removeClass("event-paused");
                    return true;
                } else {
                    setTimeout(function() { that.$element[0].click(); }, that.config.rippleInterval);
                    that.$element.addClass("event-paused");
                    that._onClick(this, e.pageX, e.pageY, e);

                    e.stopImmediatePropagation();
                    return false;
                }
            });

            // Ensure this event is the first in the queue
            var eventList = $._data(this.$element[0], "events");
            for(var i = 0; i < eventList.click.length; i++) {
                if (eventList.click[i].namespace === "ink") {
                    var inkEvent = eventList.click.splice(i, 1);
                    eventList.click.unshift(inkEvent[0]);
                }
            }

            ALLOY.Logger.startup('ALLOY.Ink Started');
        },

        _onClick: function(el, x, y) {
            // In case button isn't position relative
            $(el).css({ position: "relative" });

            var clickY = y - $(el).offset().top;
            var clickX = x - $(el).offset().left;
            var box = el;
            var setX = parseInt(clickX);
            var setY = parseInt(clickY);
            $(el).find("." + this.config.classes.svg).remove();
            $(el).append('<svg class="' + this.config.classes.svg + '"><circle class="' + this.config.classes.ripple + '" cx="'+setX+'" cy="'+setY+'" r="'+0+'"></circle></svg>');

            var c = $(box).find("." + this.config.classes.ripple);
            c.animate(
            {
                "r" : Math.sqrt(Math.pow($(box).outerWidth(), 2) + Math.pow($(box).outerHeight(), 2)).toFixed(2)
            },
            {
                easing: this.config.easing,
                duration: this.config.rippleInterval,
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
    $('.ink').ink();
})();
