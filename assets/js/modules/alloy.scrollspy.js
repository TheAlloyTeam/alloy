(function() {

 var ScrollSpy = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    ScrollSpy.prototype = {
        defaults: {
            currentClass: "current",
            navItemClass: "nav__spy",
            extraTop: 40
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            var that = this;
            that._initNavItems(that);
            that._doCheck(that);
            $(window).scroll(function(e) { that._onScroll(e, that); });

            ALLOY.Logger.startup('ALLOY.ScrollSpy Started');
        },

        _initNavItems: function(that) {
            that.$navItems = that._getNavItems(that);
        },

        _getNavItems: function(that) {
            return that.$element.find("." + that.config.navItemClass);
        },

        _doCheck: function(that) {
            var currentNav = that._getCurrentNav(that);
            that.$navItems.removeClass(that.config.currentClass);
            $(currentNav).addClass(that.config.currentClass);
        },

        _getCurrentNav: function(that) {
            var scrollTop =$(window).scrollTop();

            var current;
            var next = true;    // Make sure we default to the first

            for(var i = 0; i < that.$navItems.length; i++) {
                var navItem = that.$navItems[i];

                if (next) { current = navItem; next = false; }

                var id = $(navItem).data("scrollspy");
                var $content = $(id);

                var offset = $content.offset().top;
                var fromTop = offset - scrollTop;

                if (fromTop <= that.config.extraTop) { next = true; }
            }

            return current;
        },

        _onScroll: function(e, that) {
            that._doCheck(that);
        }
    };

    ScrollSpy.defaults = ScrollSpy.prototype.defaults;

    $.fn.scrollspy = function (options) {
        return this.each(function () {
            new ScrollSpy(this, options)._init();
        });
    };

    // Autostart Plugin
    ALLOY.Logger.trace('ALLOY.ScrollSpy Initializing');
    $(".scrollspy").scrollspy();
})();