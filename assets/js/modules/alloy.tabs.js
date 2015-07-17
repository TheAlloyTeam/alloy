(function() {

    var Tabs = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Tabs.prototype = {

        defaults: {
            tabListClass: ".list__tabs",                    // The selector for the list of buttons
            tabItemClass: ".list__link",                    // The selector for a button item
            btnIndexAttr: "href",                           // The attribute on the button to use that matches up to the content id (prefix with 'data-' if applicable)
            tabContentClass: ".tabs__content",              // The selector for the list of tabbed contents
            tabBodyClass: ".tabs__body",                    // The selector for a tabbed content item
            activeClass: "active",                          // The class to use when an element is active
            inactiveClass: "inactive",                      // The class to use when an element is inactive
            defaultTab: undefined                           // The id of the tab which is to be selected by default
        },
 
        _init: function() { 

            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            // Set a default tab value if none is set
            if (this.config.defaultTab === undefined) {
                var $btns = this.$element.find(this.config.tabListClass + " " + this.config.tabItemClass);
                if ($btns.length > 0) { this.config.defaultTab = this._getButtonIndex($btns[0]); }
            }

            // Default all tabs and content to be displayed on load
            this._updateAll(this.config.defaultTab);

            var that = this;
            // Initialise the handle click of buttons
            this.$element.find(this.config.tabListClass + " " + this.config.tabItemClass).click(function(e) { e.preventDefault(); that._handleClick(this); });
            ALLOY.Logger.startup('ALLOY.Tabs Started');
        },

        _getButtonIndex: function(btn) {
            if (this.config.btnIndexAttr.substring(0, 5) === "data-") {
                var att = this.config.btnIndexAttr.substring(5); 
                return $(btn).data(att); 
            }
            else { return $(btn).attr(this.config.btnIndexAttr); }
        },

        _handleClick: function(el) {
            var id = this._getButtonIndex($(el).closest(this.config.tabListClass + " " + this.config.tabItemClass)[0]);
            this._updateAll(id);
        },

        _setBtnActive: function(btn, id, content) {
            var elId = this._getButtonIndex($(btn)[0]);
            if (elId === id) { $(btn).removeClass(this.config.inactiveClass).addClass(this.config.activeClass); }
            else { $(btn).removeClass(this.config.activeClass).addClass(this.config.inactiveClass); }
        },

        _updateAll: function(id) {
            var that = this;
            this.$element.find(this.config.tabListClass + " " + this.config.tabItemClass).each(function() { that._setBtnActive(this, id, false); });
            this.$element.find(this.config.tabContentClass + " " + this.config.tabBodyClass).removeClass(this.config.activeClass).addClass(this.config.inactiveClass);
            $(id).removeClass(this.config.inactiveClass).addClass(this.config.activeClass);
        }

    };

    Tabs.defaults = Tabs.prototype.defaults;

    $.fn.tabs = function(options) {
        return this.each(function() {
            new Tabs(this, options)._init();
        });
    };

    // Autostart Plugin
    ALLOY.Logger.trace('ALLOY.Tabs Initializing');
    $(".tabs").tabs();
})();