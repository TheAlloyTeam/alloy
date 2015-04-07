(function () {

    var Cardflipper = function (element, options) {
    	this.element = element;
    	this.$element = $(element);
    	this.options = options;
    	this.metadata = this.$element.data('options');
    };

    Cardflipper.prototype = {

		defaults: {

		},

		_init: function() { 
			this.config = $.extend({}, this.defaults, this.options, this.metadata);

			// DO STUFF
			this.$element.addClass("flip");
			this.$element.find(".card__front").addClass("flip__front");
			this.$element.find(".card__back").addClass("flip__back");

            var that = this.$element;
            this.$element.find(".button").click(function(e) {
                that.toggleClass("flipped");
                that.find(".card__back").removeClass("init");
                e.preventDefault();
            });
		}
	};

    Cardflipper.defaults = Cardflipper.prototype.defaults;

    $.fn.cardflipper = function (options) {
    	return this.each(function() {
    		new Cardflipper(this, options)._init();
    	});
    };

	console.log('%cALLOY.Cardflipper Started', 'color: green;');

})();