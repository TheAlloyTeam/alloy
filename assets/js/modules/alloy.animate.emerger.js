(function() {

	var Emerger = function(element, options) {
    	this.element = element;
    	this.$element = $(element);
    	this.options = options;
    	this.metadata = this.$element.data('options');

        this._effectInit = function() { };
        this._effectSetup = function() { };
        this._effectDeinit = function() { };

        this._cardAnimation = this._defaultCardAnimation;  // By default do this, but override it for some effects (ie, deal)
    };

    Emerger.prototype = {

    	defaults: {
    		properties: {
    			opacity: 1
    		},
    		effect: undefined,						// Can choose from "expansion", "slideleft", "slideright", "deal"...
    		animLength: 350,
    		emerging: ".emerging",
    		order: "horizontal",					// Can choose from "horizontal"(default), "random", "diagonal" (only works correctly if all elements are the same width), "vertical" (only works correctly if all elements are the same width), "verticalchain" (only works correctly if all elements are the same width)
    		between: 125,
    		afterFinal: function() { }
    	},

        _display: function() {
    	    ALLOY.Logger.trace('ALLOY.Animate.Emerger Displaying');
            this.config = $.extend(true, {}, this.defaults, this.options, this.metadata);
            var that = this;

            // Get the cards that need to be emerged
            that.$emerging = $(that.$element.find(that.config.emerging));

            // Set the order that we will be emerging cards
            that._setOrder(that);

            // Set the effect that we will be using to transition the emergence
            that._setEffect(that);

            // Initialise the effect
            that._effectInit(that);

            // Emerge the cards
            that.$emerging.each(function(index) { that._doTransition(that, this, $(this).data("emergertimestep"), index); });
        },

        /***** Ordering Methods *****/
        _setOrder: function(that) {
            if (that.config.order === "random") {
                that._random(that);
            } else if (that.config.order === "diagonal") {
                that._diagonal(that);
            } else if (that.config.order === "pop") {
                that._pop(that);
            } else if (that.config.order === "vertical") {
                that._vertical(that);
            } else if (that.config.order === "verticalchain") {
                that._verticalChain(that);
            } else {
                that._horizontal(that);
            }
        },

        _verticalChain: function(that) {
        	var totalWidth = that.$element.width();
        	var cardWidth = that.$emerging.first().outerWidth(true);
        	var perRow = Math.floor(totalWidth / cardWidth);

        	var col = 0;
        	var row = 0;

        	that.$emerging.each(function(i) {
        		var multiplier = (col * perRow) + row;

                $(this).data("emergertimestep", multiplier * that.config.between);

        		col = col + 1;
        		if (col >= perRow) {
        			row = row + 1;
        			col = 0;
        		}
        	});
        },

        _vertical: function(that) {
        	var totalWidth = that.$element.width();
        	var cardWidth = that.$emerging.first().outerWidth(true);
        	var perRow = Math.floor(totalWidth / cardWidth);

        	var col = 0;

        	that.$emerging.each(function(i) {
                $(this).data("emergertimestep", col * that.config.between);

        		col = col + 1;
        		if (col >= perRow) {
        			col = 0;
        		}
        	});
        },

        _diagonal: function(that) {
        	var totalWidth = that.$element.width();
        	var cardWidth = that.$emerging.first().outerWidth(true);
        	var perRow = Math.floor(totalWidth / cardWidth);

        	var row = 0;
        	var col = 0;

        	that.$emerging.each(function(i) {
        		var multiplier = row + col;
                $(this).data("emergertimestep", multiplier * that.config.between);

        		col = col + 1;
        		if (col >= perRow) {
        			row = row + 1;
        			col = 0;
        		}
        	});
        },

        _random: function(that) {
        	var toUnfade = [];
        	for(var i = 0; i < that.$emerging.length; i++) { toUnfade.push(that.$emerging[i]); }

			that.$emerging.each(function(i) {
				var rnd = Math.floor(Math.random() * toUnfade.length);
        		var selected = toUnfade.splice(rnd, 1);
                $(selected).data("emergertimestep", i * that.config.between);
			});
        },

        _horizontal: function(that) {
			that.$emerging.each(function(i, el) {
                $(this).data("emergertimestep", i * that.config.between);
           	});
        },

        /***** Effect Methods *****/
        _setEffect: function(that) {
            if (that.config.effect === "expansion") {
                that._effectInit = that._expansionInit;
                that._effectSetup = that._expansionSetup;
            } else if (that.config.effect === "deal") {
                that._effectInit = that._dealInit;
                that._effectSetup = that._dealSetup;
                that._effectDeinit = that._dealDeinit;
                that._cardAnimation = that._dealCardAnimation;
            }
        },

        _deinitEffect: function(that) {
            that.$emerging.css({ position: "" });
        },

        // Expansion
        _expansionInit: function(that) {
	    	for(var i = 0; i < that.$emerging.length; i++) {
				var el = that.$emerging[i];

				var oldWidth = $(el).width();
				var defaultWidth = ("width" in that.config.properties && that.config.properties.width !== "full") ? parseFloat(that.config.properties.width) : $(el).css("width", "").width();
				$(el).css("width", oldWidth);

				var oldHeight = $(el).height();
				var defaultHeight = ("height" in that.config.properties && that.config.properties.height !== "full") ? parseFloat(that.config.properties.height) : $(el).css("height", "").height();
				$(el).css("height", oldHeight);

				$(el).data("emergerleft", $(el).position().left);
				$(el).data("emergertop", $(el).position().top);

				$(el).data("emergerwidth", defaultWidth);
				$(el).data("emergerheight", defaultHeight);
			}
        },

        _expansionSetup: function(that, el, props) {
    		// Set position to absolute so that we can manually control its left and top positions
			$(el).css({ position: "absolute" });

			var left = $(el).data("emergerleft");
			var top = $(el).data("emergertop");
			var width = $(el).data("emergerwidth");
			var height = $(el).data("emergerheight");

			props.left = left + "px";
			props.top = top + "px";
			props.width = width + "px";
			props.height = height + "px";

			$(el).css({ width: "0", height: "0", left: (left + width / 2) + "px", top: (top + height / 2) + "px"});

			return props;
        },

        // Deal
        _dealInit: function(that) {
            // Ensure all emerging are position absolute'd and the $emerger list is ordered by emergertimestep
            var emerging = that.$emerging.sort(function(a, b) { return $(a).data("emergertimestep") - $(b).data("emergertimestep"); });
            that.$emerging = $(emerging);
            for(var i = 0; i < that.$emerging.length; i++) {
                var el = that.$emerging[i];

                $(el).data("emergerleft", $(el).position().left);
                $(el).data("emergertop", $(el).position().top);
            }
        },

        _dealSetup: function(that, el, props) {
            $(el).css({ position: "absolute" });
        },

        _dealDeinit: function(that) {
            that.$emerging.css({ position: "" });
        },

        _dealCardAnimation: function(that, el, index, props, lastCardCallback) {
            var left = $(el).data("emergerleft");
            var top = $(el).data("emergertop");
            for(var i = index; i < that.$emerging.length; i++) {
               ALLOY.Animator.animate(that.$emerging[i], { left: left + "px", top: top + "px" }, that.config.animLength, undefined, lastCardCallback);
            }
        },

        /***** Actual transition functionality *****/
        _doTransition: function(that, el, timeout, index) {
            var props = $.extend({}, that.config.properties);   // Clone the object so that it doesn't override anything in a calling function

            that._effectSetup(that, el, props);

            setTimeout(function() {
                that._cardAnimation(that, el, index, props, function() {

                    if (index === that.$emerging.length - 1) {
                        that._effectDeinit(that);
                        that.config.afterFinal();
                    }

                });
            }, timeout);
        },

        _defaultCardAnimation: function(that, el, index, props, lastCardCallback) {
            ALLOY.Animator.enter(el, props, that.config.animLength, undefined, lastCardCallback);
        }
    };

    Emerger.defaults = Emerger.prototype.defaults;

    $.fn.emerger = function(options) {
    	return this.each(function() {
    		new Emerger(this, options)._display();
    	});
    };

}());