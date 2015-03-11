(function() {

    var Tabber = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Tabber.prototype = {

        that: {},
 
        isAuto: true,

        defaults: {
            buttonsListSelector: ".buttons",        // The selector for the ul list of buttons
            contentsListSelector: ".contents",      // The selector for the ul list of contents
            indexDataAttr: "tabindex",              // The data attribute to use to set the tab index of elements
            inactiveClass: "inactive",              // The class to use when an element is inactive
            activeClass: "active",                  // The class to use when an element is active
            hidingClass: "hiding",                  // The class to use when transitioning from active to inactive
            showingClass: "showing",                // The class to use when transitioning from inactive to active
            transitionTime: 350,                    // The time (in milliseconds) that hiding or showing transitions take to complete            
            defaultIndex: 0,                        // The (zero based) index to default to
            autoTime: 2500                          // The time between automatically moving to the next tab (must be greater than the transition time)
        },

        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            that = this;

            // Don't use _updateAll here as we also want to make sure that the data attribute is set before we alter its active-ness
            this.$element.find(this.config.buttonsListSelector + " li").each(function(i) { 
                $(this).data(that.config.indexDataAttr, i); 
                that._setActive(this, that.config.defaultIndex, false);
            });
            this.$element.find(this.config.contentsListSelector + " li").each(function(i) { 
                $(this).data(that.config.indexDataAttr, i); 
                that._setActive(this, that.config.defaultIndex, true);
            });

            // Initialise the handle click of buttons
            this.$element.find(this.config.buttonsListSelector + " li").click(this._handleClick);

            // Initialise the auto swap timer
            if (this.config.autoTime > this.config.transitionTime) { setTimeout(this._autoSwap, this.config.autoTime); }
        },

        _handleClick: function(e) {
            e.preventDefault();

            that.isAuto = false;
            var index = $(e.target).closest(that.config.buttonsListSelector + " li").data(that.config.indexDataAttr);
            that._updateAll(index);
        },

        _setActive: function(el, id, content) {
            var elId = $(el).data(that.config.indexDataAttr);
            var wasActive = $(el).hasClass(that.config.activeClass) || $(el).hasClass(that.config.showingClass);

            if (wasActive && id == elId) {
                // Do nothing...                
            } else if (wasActive) {
                // Was active, but isn't anymore...
                $(el).removeClass(that.config.activeClass).addClass(that.config.hidingClass);
                setTimeout(function() { $(el).addClass(that.config.inactiveClass).removeClass(that.config.hidingClass); }, that.config.transitionTime);
            } else if (id == elId) {
                // Wasn't active, but is now...
                if (content) { $(el).appendTo($(that.config.contentsListSelector)); }
                $(el).removeClass(that.config.inactiveClass).removeClass(that.config.hidingClass).addClass(that.config.showingClass);
                setTimeout(function() { $(el).addClass(that.config.activeClass).removeClass(that.config.showingClass); }, that.config.transitionTime);
            } else {
                $(el).addClass(that.config.inactiveClass);
            }
        },

        _autoSwap: function() {
            if (that.isAuto) {
                var currentIndex = that._getCurrentIndex();
                var nextIndex = currentIndex + 1;
                var maxIndex = that.$element.find(that.config.buttonsListSelector + " li").length;
                if (nextIndex >= maxIndex) { nextIndex = 0; }
                
                that._updateAll(nextIndex);
                
                setTimeout(that._autoSwap, that.config.autoTime);
            }
        },

        _getCurrentIndex: function() {
            var cur = 0;
            that.$element.find(that.config.buttonsListSelector + " li").each(function() {
                if ($(this).hasClass(that.config.activeClass) || $(this).hasClass(that.config.activeClass)) {
                    cur = $(this).data(that.config.indexDataAttr);
                }
            });

            return cur;
        },

        _updateAll: function(index) {
            that.$element.find(that.config.buttonsListSelector + " li").each(function() { that._setActive(this, index, false); });
            that.$element.find(that.config.contentsListSelector + " li").each(function() { that._setActive(this, index, true); });
        }
    };

    Tabber.defaults = Tabber.prototype.defaults;

    $.fn.tabber = function(options) {
        return this.each(function() {
            new Tabber(this, options)._init(this);
        });
    };

    // Autostart Plugin
    $(".tabber").tabber();
    console.log('%cALLOY.Tabber Started', 'color: green;');
})();