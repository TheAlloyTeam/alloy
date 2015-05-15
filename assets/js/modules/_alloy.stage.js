(function () {

    var Stage = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Stage.prototype = {

        defaults: {
            stageClass: "stage",
            toggleClass: "stage__toggle",
            pageClass: "stage__page",
            menuClass: "stage__menu"
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            ALLOY.Logger.startup('ALLOY.Stage Started');
        }


    };

    Stage.defaults = Stage.prototype.defaults;

    $.fn.stage = function (options) {
        return this.each(function () {
            new Stage(this, options)._init();
        });
    };
})();