(function() {

    var Toast = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Toast.prototype = {

        that: {},

        defaults: {
            classes: {
                'active': 'active',
                'inactive': 'inactive'
            },

            toggleInterval: 5000
        },
 
        _init: function() { 
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            that = this;

            // Make sure that this can be accessed from inside the element being 'toasted'
            this.$element.toast = this;

            if (this.config.toggleInterval > 0) { setTimeout(this._toggleToast, this.config.toggleInterval); }

            ALLOY.Logger.startup('ALLOY.Toast Started');
        },

        _toggleToast: function() {
            if (that.$element.hasClass(that.config.classes.active)) {
                that.$element.removeClass(that.config.classes.active).addClass(that.config.classes.inactive);
            } else {
                that.$element.removeClass(that.config.classes.inactive).addClass(that.config.classes.active);
                if (this.config.toggleInterval > 0) { setTimeout(this._toggleToast, this.config.toggleInterval); }
            }
        },

        return {
            toggle : _toggleToast
        }
    };

    Toast.defaults = Toast.prototype.defaults;

    $.fn.toast = function(options) {
        return this.each(function() {
            new Toast(this, options)._init();
        });
    };

    // Autostart Plugin
    ALLOY.Logger.startup('ALLOY.Toast Initializing');
    $(".toast").toast();
})();