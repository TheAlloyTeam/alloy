(function() {

    var Parallax = function(element, options) {
    	this.element = element;
    	this.$element = $(element);
    	this.options = options;
    	this.metadata = this.$element.data('options');
    };

    Parallax.prototype = {

    	defaults: {
            speed: 0.25,
            start: 0
    	},

        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            var that = this;
            $(window).scroll(function(e) { that._onScroll(that); });
            that._onScroll(that);

            ALLOY.Logger.startup('ALLOY.Parallax Started');
        },

        _onScroll: function(that) {
            var diff = $(window).scrollTop();
            that.$element.css({ "background-position-y" : (that.config.start + (diff * that.config.speed * -1)) + "px" });
        }

    };

    Parallax.defaults = Parallax.prototype.defaults;

    $.fn.parallax = function(options) {
    	return this.each(function() {
    		new Parallax(this, options)._init();
    	});
    };

    // Autostart Plugin
    ALLOY.Logger.trace('ALLOY.Parallax Initializing');
})();
