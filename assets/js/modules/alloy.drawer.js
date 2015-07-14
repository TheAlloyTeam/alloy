(function () {
    // how to bring in the options
    var Drawer = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Drawer.prototype = {

        defaults: {
            closedClass: "closed",              // The class to give to the drawer when it is on the screen but closed
            knobClass: "drawer__knob",          // The class given to the buttons that open or close the drawer
            hiddenClass: "drawer--hidden",      // The class to give to the drawer when it is no longer on the screen
            slideOutFromTop: 200,               // The minimum amount of scroll from the top where the drawer will be displayed on the screen
            slideInFromBottom: 200,             // The minimum amount of scroll from the bottom where the drawer will be displayed on the screen
            extraPopout: 60                     // The additional amount of height given to the drawer by any buttons that might go outside of its standard css height
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            this._initDrawer(this);
            this._initEvents(this);

            var that = this;
            $(window).scroll(function () { that._onPageScroll(that); });
            that._onPageScroll(that);

            ALLOY.Logger.startup('ALLOY.Drawer Started');
        },

        _initDrawer: function (that) {
            that.$element.css({
                position: "fixed",
                bottom: that._getHeight(that) + "px"
            });
        },

        _initEvents: function (that) {
            var $knobs = that.$element.find("." + that.config.knobClass);
            $knobs.click(function (e) {
                e.preventDefault();

                that.$element.toggleClass(that.config.closedClass)
                    .css({ bottom: that._getHeight(that) + "px" });
            });
        },

        _onPageScroll: function (that) {
            if (that._shouldSlideOut(that)) {
                that.$element.removeClass(that.config.hiddenClass);
            } else {
                that.$element.addClass(that.config.hiddenClass);
            }

            that.$element.css({ bottom: that._getHeight(that) + "px" });
        },

        _getHeight: function (that) {
            // If hidden then get height including the popout
            if (that.$element.hasClass(that.config.hiddenClass)) {
                return (that.$element.outerHeight(true) + that.config.extraPopout) * -1;
            } else {
                // Otherwise visible, so figure out if open or closed and return height or nothing
                if (that.$element.hasClass(that.config.closedClass)) {
                    return that.$element.outerHeight(true) * -1;
                } else {
                    return 0;
                }
            }
        },

        _shouldSlideOut: function (that) {
            var val = $(window).scrollTop();
            var fromBottom = $(document).height() - (val + $(window).height());
            var result = val >= that.config.slideOutFromTop && fromBottom >= that.config.slideInFromBottom;
            return result;
        }
    };

    Drawer.defaults = Drawer.prototype.defaults;

    $.fn.drawer = function (options) {
        return this.each(function () {
            new Drawer(this, options)._init();
        });
    };

})();
