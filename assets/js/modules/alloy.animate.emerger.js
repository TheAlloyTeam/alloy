(function() {

	var Emerger = function(element, options) {
    	this.element = element;
    	this.$element = $(element);
    	this.options = options;
    	this.metadata = this.$element.data('options');

    	this.useEffect = false;
    };

    Emerger.prototype = {

    	defaults: {
    		properties: {
    			opacity: 1
    		},
    		effect: undefined,						// Can choose from "expansion", "slideleft", "slideright"... Cannot be used if method chosen is deal.
    		animLength: 350,
    		emerging: ".emerging",
    		order: "horizontal",					// Can choose from "horizontal"(default), "random", "deal", "diagonal" (can only be used if all elements are the same width), "vertical" (can only be used if all elements are the same width), "verticalchain" (can only be used if all elements are the same width)
    		between: 125,
    		afterFinal: function() { }
    	},

        _display: function() {
    	    ALLOY.Logger.trace('ALLOY.Animate.Emerger Displaying');
            this.config = $.extend(true, {}, this.defaults, this.options, this.metadata);
            var that = this;

            that.$emerging = $(that.$element.find(that.config.emerging));

			if (that.config.effect !== undefined) { that._initEffect(that); }

            if (that.config.order === "random") {
            	that._random(that);
            } else if (that.config.order === "deal") {
            	that._deal(that);
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

        /***** Ordering Methods *****/
        _deal: function(that) {
        	that.config.includeExpansion = false;

        	that.$emerging.each(function(i, el) {
        		// Todo!
        	});
        },

        _verticalChain: function(that) {
        	var totalWidth = that.$element.width();
        	var cardWidth = that.$emerging.first().outerWidth(true);
        	var perRow = Math.floor(totalWidth / cardWidth);

        	var col = 0;
        	var row = 0;

        	that.$emerging.each(function(i) {
        		var multiplier = (col * perRow) + row;
        		that._doTransition(that, this, multiplier * that.config.between, i);

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
        		that._doTransition(that, this, col * that.config.between, i);

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
        		that._doTransition(that, this, multiplier * that.config.between, i);

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
        		that._doTransition(that, selected, i * that.config.between, i);
			});
        },

        _horizontal: function(that) {
			that.$emerging.each(function(i, el) {
				that._doTransition(that, el, i * that.config.between, i);
           	});
        },

        _initEffect: function(that) {
        	if (that.config.effect === "expansion") {
        		that.useEffect = true;
        		that._expansionInit(that);
			}
        },

        _effectSetup: function(that, el, props) {
        	if (that.config.effect === "expansion") {
        		return that._expansionSetup(that, el, props);
			}

			return props;
        },

        _deinitEffect: function(that) {
			that.$emerging.css({ position: "" });
        },

        _doTransition: function(that, el, timeout, index) {
			var props = $.extend({}, that.config.properties);	// Clone the object so that it doesn't override anything in a calling function

			if (that.useEffect) {
				props = that._effectSetup(that, el, props);
			}

			setTimeout(function() {
       			ALLOY.Animator.enter(el, props, that.config.animLength, undefined, function() {

       				if (index === that.$emerging.length - 1) {
	       				if (that.useEffect) { that._deinitEffect(that); }
       					that.config.afterFinal();
	       			}
       			});
			}, timeout);
        },

        /***** Effect functionality *****/
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
        }

    };

    Emerger.defaults = Emerger.prototype.defaults;

    $.fn.emerger = function(options) {
    	return this.each(function() {
    		new Emerger(this, options)._display();
    	});
    };

}());