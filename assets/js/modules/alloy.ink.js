// http://thecodeplayer.com/walkthrough/ripple-click-effect-google-material-design

(function(){

    // how to bring in the options
    var Ink = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Ink.prototype =  {
    	defaults : {
    		"inkClass" : "ink"
    	},

    	_init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            this.$element.prepend("<span class=\"" + this.config.inkClass + "\"></span>");
            this.$element.on("click, tap", function() {
            	this.onEvent();
            });
    	},

        onEvent: function() {
        	ink = this.$element;

			ink.removeClass("animate");

			if(!ink.height() && !ink.width())
			{
				d = Math.max(parent.outerWidth(), parent.outerHeight());
				ink.css({height: d, width: d});
			}

			x = e.pageX - parent.offset().left - ink.width()/2;
			y = e.pageY - parent.offset().top - ink.height()/2;

			ink.css({top: y+'px', left: x+'px'}).addClass("animate");
        }

    };

    Ink.defaults = Ink.prototype.defaults;

    $.fn.ink = function(options) {
        return this.each(function() {
            new Ink(this, options)._init(this);
        });
    };

    // Autostart Plugin
    $(".button").ink();
    console.log("ALLOY.Ink Loaded");
})();

