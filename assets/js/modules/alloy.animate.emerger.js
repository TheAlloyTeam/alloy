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
    		properties: { opacity: 1 },               // The properties to animate while emerging.
            between: 125,                             // The number of milliseconds between each card being emerged.
    		animLength: 350,                          // The number of milliseconds that the emerging animation should take.
    		emergingSelector: ".emerging",            // The selector to choose cards that should be emerged beneath the element that this plugin was called upon.
    		order: "horizontal",					  // The method for selecting the order in which to emerge the cards.  Can choose from "horizontal"(default), "random", "diagonal" (only works correctly if all elements are the same width), "vertical" (only works correctly if all elements are the same width), "verticalchain" (only works correctly if all elements are the same width).
            effect: undefined,                        // An additional effect to apply to the cards as they are emerged.  Some of these will ignore the properties set above.  Can choose from "expansion", "slideleft", "slideright", "deal".
    		afterFinal: function() { }                // A function that is called once, after all of the cards have been emerged.
    	},

        _display: function() {
    	    ALLOY.Logger.trace('ALLOY.Animate.Emerger Displaying');
            this.config = $.extend(true, {}, this.defaults, this.options, this.metadata);
            var that = this;

            // Get the cards that need to be emerged
            that.$emerging = $(that.$element.find(that.config.emergingSelector));

            // Set the order that we will be emerging cards
            that._setOrder(that);

            // Ensure all cards are in the same order as they will be displayed
            that.$emerging = that.$emerging.sort(function(a, b) { return $(a).data("emergertimestep") - $(b).data("emergertimestep"); });

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
            } else if (that.config.effect === "slideleft" || that.config.effect === "slideright" || that.config.effect === "slideup" || that.config.effect === "slidedown") {
                that._effectInit = that._slideInit;
                that._effectSetup = that._slideSetup;
                that._effectDeinit = that._slideDeinit;
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
            // It just won't work otherwise
            if (that.config.animLength >= that.config.between + 5) { that.config.animLength = that.config.between - 5; }

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
            that.$emerging.css({ position: "", top: "", left: "" });
        },

        _dealCardAnimation: function(that, el, index, props, lastCardCallback) {
            var left = $(el).data("emergerleft");
            var top = $(el).data("emergertop");
            for(var i = index; i < that.$emerging.length; i++) {
               ALLOY.Animator.animate(that.$emerging[i], { left: left + "px", top: top + "px" }, that.config.animLength, undefined, lastCardCallback);
            }
        },

        // Slide left, right, up and down
        _slideInit: function(that) {
            for(var i = 0; i < that.$emerging.length; i++) {
                var el = that.$emerging[i];
                $(el).data("emergerleft", $(el).position().left);
                $(el).data("emergertop", $(el).position().top);
            }
        },

        _slideSetup: function(that, el, props) {
            $(el).css({ position: "absolute" });

            var left = $(el).data("emergerleft");
            var top = $(el).data("emergertop");

            props.left = left + "px";
            props.top = top + "px";

            var startLeft = left;
            if (that.config.effect === "slideleft") { startLeft = that.$element.outerWidth(true); }
            else if (that.config.effect === "slideright") { startLeft = 0 - $(el).outerWidth(true); }

            var startTop = top;
            if (that.config.effect === "slideup") { startTop = that.$element.outerHeight(true); }
            else if (that.config.effect === "slidedown") { startTop = 0 - $(el).outerHeight(true); }

            $(el).css({ left: startLeft + "px", top: startTop + "px" });

            return props;
        },

        _slideDeinit: function(that) {
            that.$emerging.css({ position: "", top: "", left: "" });
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