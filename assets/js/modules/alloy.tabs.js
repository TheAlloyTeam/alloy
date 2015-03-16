(function() {

    var Tabs = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Tabs.prototype = {

        that: {},

        defaults: {
            tabListClass: ".list__tabs",                    // The selector for the list of buttons
            tabItemClass: ".list__link",                    // The selector for a button item
            btnIndexAttr: "href",                           // The attribute on the button to use that matches up to the content id (prefix with 'data-' if applicable)
            tabContentClass: ".tabs__content",              // The selector for the list of tabbed contents
            tabBodyClass: ".tabs__body",                    // The selector for a tabbed content item
            activeClass: "active",                          // The class to use when an element is active
            inactiveClass: "inactive",                      // The class to use when an element is inactive
            defaultTab: undefined,                          // The id of the tab which is to be selected by default
        },
 
        _init: function() { 
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            // Set a default tab value if none is set
            if (this.config.defaultTab === undefined) {
                var $btns = this.$element.find(this.config.tabListClass + " " + this.config.tabItemClass);
                if ($btns.length > 0) { this.config.defaultTab = this._getButtonIndex($btns[0]); }
            }

            that = this;

            // Default all tabs and content to be displayed on load
            that._updateAll(that.config.defaultTab);

            // Initialise the handle click of buttons
            this.$element.find(this.config.tabListClass + " " + this.config.tabItemClass).click(this._handleClick);
            ALLOY.Logger.startup('ALLOY.Tabs Started');
        },

        _getButtonIndex: function(btn) {
            if (this.config.btnIndexAttr.substring(0, 5) == "data-") { 
                var att = this.config.btnIndexAttr.substring(5); 
                return $(btn).data(att); 
            }
            else { return $(btn).attr(this.config.btnIndexAttr); }
        },

        _handleClick: function(e) {
            e.preventDefault();
            var id = that._getButtonIndex($(e.target).closest(that.config.tabListClass + " " + that.config.tabItemClass)[0]);
            that._updateAll(id);
        },

        _setBtnActive: function(btn, id, content) {
            var elId = this._getButtonIndex($(btn)[0]);
            if (elId == id) { $(btn).removeClass(that.config.inactiveClass).addClass(that.config.activeClass); } 
            else { $(btn).removeClass(that.config.activeClass).addClass(that.config.inactiveClass); }
        },

        _updateAll: function(id) {
            that.$element.find(that.config.tabListClass + " " + that.config.tabItemClass).each(function() { that._setBtnActive(this, id, false); });
            that.$element.find(that.config.tabContentClass + " " + that.config.tabBodyClass).removeClass(that.config.activeClass).addClass(that.config.inactiveClass);
            $(id).removeClass(that.config.inactiveClass).addClass(that.config.activeClass);
        },
    };

    Tabs.defaults = Tabs.prototype.defaults;

    $.fn.tabs = function(options) {
        return this.each(function() {
            new Tabs(this, options)._init();
        });
    };

    // Autostart Plugin
    ALLOY.Logger.startup('ALLOY.Tabs Initializing');
    $(".tabs").tabs();
})();