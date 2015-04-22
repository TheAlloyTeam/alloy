(function () {

    var Sticky = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');

        this.defaultTop = this.$element.position().top;
        this.$ghost = undefined;
    };

    Sticky.prototype = {
        defaults: {
            stuckClass: "stuck",
            minimumWidth: 618,
            ghostClass: "stuckghost"
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            var that = this;
            $(window).scroll(function() { that._onScroll(that); });
            $(window).resize(function() { that._onScroll(that); });

            ALLOY.Logger.startup('ALLOY.Sticky Started');
        },

        _onScroll: function(that) {
            if ($(window).width() >= that.config.minimumWidth && $(window).scrollTop() >= that.defaultTop) {
                that._stick(that);
            } else {
                that._unstick(that);
            }

            that._updateGhost(that);
        },

        _stick: function(that) {
            that.$element.addClass(that.config.stuckClass).css({ position: "fixed", top: "0" });
        },

        _unstick: function(that) {
            that.$element.removeClass(that.config.stuckClass).css({ position: "", top: "" });
        },

        _updateGhost: function(that) {
            if (that.$element.hasClass(that.config.stuckClass)) {
                if (that.$ghost === undefined) {
                    that.$ghost = $('<div class="' + that.config.ghostClass + '"></div>');
                    that.$ghost.insertAfter(that.$element);
                }
                that.$ghost.css({height: that.$element.height() + "px"});
            } else if (that.$ghost !== undefined) {
                that.$ghost.remove();
                that.$ghost = undefined;
            }
        }
    };

    Sticky.defaults = Sticky.prototype.defaults;

    $.fn.sticky = function (options) {
        return this.each(function () {
            new Sticky(this, options)._init();
        });
    };

    // Autostart Plugin
    ALLOY.Logger.trace('ALLOY.Sticky Initializing');
    $(".sticky").sticky();
})();