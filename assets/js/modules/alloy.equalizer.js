(function() {

    var Equalizer = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Equalizer.prototype = {

        that: {},

        defaults: {

        },
 
        _init: function(json) { 
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            that = this;
        },

    };

    Equalizer.defaults = Equalizer.prototype.defaults;

    $.fn.equalizer = function(options) {
        if (json === undefined) { ALLOY.Logger.error("Json object required to turn on toaster"); }
        return function() {
            new Equalizer(this, options)._init();
        };
    };

    ALLOY.Logger.startup('ALLOY.Equalizer Loaded');
    $(".equalizer").equalizer();
})();