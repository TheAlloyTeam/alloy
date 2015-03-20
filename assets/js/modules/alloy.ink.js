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
            rippleInterval: 333
        },

        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            that = this;

            // Todo - If SVG's are supported do svgonclick else do cssonclick?
            this.$element.click(that._svgOnClick);
            
            ALLOY.Logger.startup('ALLOY.Ink Started');
        },

        // Taken and modified from: http://webdesign.tutsplus.com/tutorials/recreating-the-touch-ripple-effect-as-seen-on-google-design--cms-21655
        _svgOnClick: function(e) {
            var href = $(this).attr("href");
            if (href !== undefined) { e.preventDefault(); }

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
                duration: that.config.rippleInterval,
                step : function(val) {
                    c.attr("r", val);
                },
                complete: function() {
                    c.fadeOut('fast', function() { c.remove(); });
                    if (href !== undefined) { location.href = href; }
                }
            });
        }
    // http://thecodeplayer.com/walkthrough/ripple-click-effect-google-material-design
   //  	defaults : {
   //  		"inkClass" : "ink"
   //  	},

   //  	_init: function() {
   //          this.config = $.extend({}, this.defaults, this.options, this.metadata);
   //          this.$element.prepend("<span class=\"" + this.config.inkClass + "\"></span>");
   //          this.$element.on("click, tap", function() {
   //          	this.onEvent();
   //          });
   //          ALLOY.Logger.startup('ALLOY.Ink Started');
   //  	},

   //      onEvent: function() {
   //      	ink = this.$element;

			// ink.removeClass("animate");

			// if(!ink.height() && !ink.width())
			// {
			// 	d = Math.max(parent.outerWidth(), parent.outerHeight());
			// 	ink.css({height: d, width: d});
			// }

			// x = e.pageX - parent.offset().left - ink.width()/2;
			// y = e.pageY - parent.offset().top - ink.height()/2;

			// ink.css({top: y+'px', left: x+'px'}).addClass("animate");
   //      }

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
