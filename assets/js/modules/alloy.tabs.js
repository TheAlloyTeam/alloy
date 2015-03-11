(function() {

    var Tabs = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Tabs.prototype = {

        that: {},

        isAuto: true,

        defaults: {
            tabListClass: ".list__tabs",        // The selector for the ul list of buttons
            tabItemClass: ".list__item",        // The selector for the ul Item
            tabContentClass: ".tabs__content",      // The selector for the Tabs list of contents
            tabBodyClass: ".tabs__body",      // The selector for a Tabs Body
            indexDataAttr: "tabindex",              // The data attribute to use to set the tab index of elements
            hiddenClass: "hidden",              // The class to use when an element is inactive
            activeClass: "active",                  // The class to use when an element is active
            //hidingClass: "hidden",                  // The class to use when transitioning from active to inactive
            //showingClass: "showing",                // The class to use when transitioning from inactive to active
            transitionTime: 350,                    // The time (in milliseconds) that hiding or showing transitions take to complete
            defaultIndex: 0,                        // The (zero based) index to default to
            autoTime: 2500                          // The time between automatically moving to the next tab (must be greater than the transition time)
        },

        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            that = this;

            // Don't use _updateAll here as we also want to make sure that the data attribute is set before we alter its active-ness
            this.$element.find(this.config.tabListClass + " " + this.config.tabItemClass).each(function(i) {
                $(this).data(that.config.indexDataAttr, i);
                that._setActive(this, that.config.defaultIndex, false);
            });
            this.$element.find(this.config.tabContentClass + " " + this.config.tabBodyClass).each(function(i) {
                $(this).data(that.config.indexDataAttr, i);
                that._setActive(this, that.config.defaultIndex, true);
            });

            // Initialise the handle click of buttons
            this.$element.find(this.config.tabListClass + " " + this.config.tabItemClass).click(this._handleClick);

            // Initialise the auto swap timer
            if (this.config.autoTime > this.config.transitionTime) { setTimeout(this._autoSwap, this.config.autoTime); }
        },

        _handleClick: function(e) {
            e.preventDefault();

            that.isAuto = false;
            var index = $(e.target).closest(that.config.tabListClass + " " + that.config.tabItemClass).data(that.config.indexDataAttr);
            that._updateAll(index);
        },

        _setActive: function(el, id, content) {
            var elId = $(el).data(that.config.indexDataAttr);
            var wasActive = $(el).hasClass(that.config.activeClass);

            if (wasActive && id == elId) {
                // Do nothing...
            } else if (wasActive) {
                // Was active, but isn't anymore...
                $(el).removeClass(that.config.activeClass);
                setTimeout(function() { $(el).addClass(that.config.hiddenClass); }, that.config.transitionTime);
            } else if (id == elId) {
                // Wasn't active, but is now...
                if (content) { $(el).appendTo($(that.config.tabContentClass)); }
                $(el).removeClass(that.config.hiddenClass);
                setTimeout(function() { $(el).addClass(that.config.activeClass); }, that.config.transitionTime);
            } else {
                $(el).addClass(that.config.hiddenClass);
            }
        },

        _autoSwap: function() {
            if (that.isAuto) {
                var currentIndex = that._getCurrentIndex();
                var nextIndex = currentIndex + 1;
                var maxIndex = that.$element.find(that.config.tabListClass + " " + that.config.tabItemClass).length;
                if (nextIndex >= maxIndex) { nextIndex = 0; }
                that._updateAll(nextIndex);
                setTimeout(that._autoSwap, that.config.autoTime);
            }
        },

        _getCurrentIndex: function() {
            var cur = 0;
            that.$element.find(that.config.tabListClass + " " + that.config.tabItemClass).each(function() {
                if ($(this).hasClass(that.config.activeClass) || $(this).hasClass(that.config.activeClass)) {
                    cur = $(this).data(that.config.indexDataAttr);
                }
            });

            return cur;
        },

        _updateAll: function(index) {
            that.$element.find(that.config.tabListClass + " " + that.config.tabItemClass).each(function() { that._setActive(this, index, false); });
            that.$element.find(that.config.tabContentClass + " " + that.config.tabBodyClass).each(function() { that._setActive(this, index, true); });
        }
    };

    Tabs.defaults = Tabs.prototype.defaults;

    $.fn.tabs = function(options) {
        return this.each(function() {
            new Tabs(this, options)._init(this);
        });
    };

    // Autostart Plugin
    $(".tabs").tabs();
    console.log('%cALLOY.Tabs Started', 'color: green;');
})();