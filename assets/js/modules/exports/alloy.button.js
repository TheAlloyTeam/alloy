(function() {
    var myButton;

    // how to bring in the options
    var Button = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Button.prototype = {

        that: {},

        defaults: {
            classes: {},

        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            that = this;

            ALLOY.Logger.startup('ALLOY.Button Started');
        },

        _setState: function (state) {

        },

        _handleEvent: function(e) {

        },

        _update: function(id, toOpen) {
            that.$element.find("." + that.config.classes.title).each(function() { that._handleTitle(this, id, toOpen); });
        },

    };

    Button.defaults = Button.prototype.defaults;

    $.fn.button = function(options) {
        return this.each(function() {
            new Button(this, options)._init();
        });
    };

    // Autostart Plugin
    ALLOY.Logger.trace('ALLOY.Button Initializing');
    //$(".button").button();
})();
