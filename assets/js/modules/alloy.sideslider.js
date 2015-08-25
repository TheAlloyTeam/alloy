(function () {

    var SideSlider = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');

        this.isSwiping = false;

        var that = this;
        this.public = {
        	triggerIntro: function() { that._introAnim(that); },
        	triggerOutro: function() { that._outroAnim(that); },
            resetCards: function() { that._initCards(that); }
        };
    };

    SideSlider.prototype = {

        defaults: {
        	classes: {
      			wrapper: "slider__wrapper",
        		card: "slider__card",
        	},
        	scrollSteps: 80,							// The number of steps to move on scroll
        	spacing: 20,								// The number of pixels spacing between the cards
        	minimumSwipeDistance: 20,					// The minimum number of pixels before a swipe can be classed as valid

        	buttonLeft: ".sideslider__left",			// Selector for the button to go left
        	buttonRight: ".sideslider__right",			// Selector for the button to go right
        	buttonSteps: 10,							// The number of steps to move on click of the button

        	introAnim: "fromRight",						// The intro animation to use - can choose: "", "fromRight",
        	introLength: 1500,							// The number of milliseconds that the intro animation should last

        	outroAnim: "toLeft",						// The outro animation to use - can choose: "", "toLeft",
        	outroLength: 1000,   						// The number of milliseconds that the outro animation should last

        	onOutroComplete: function() { } 			// The function to call once the outro has finished
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            var that = this;
            that._initSlider(that);
            that._initEvents(that);
            $(window).resize(function() { that._onResize(that); });

            setTimeout(function() {
        		that._introAnim(that);
            }, 250);

            ALLOY.Logger.startup('ALLOY.SideSlider Started');
        },

        _initSlider: function(that) {
        	// The $element becomes the tray that will move left and right, and create a wrapper around tray that will be overflow hidden
        	that.$element.wrap('<div class="' + that.config.classes.wrapper + '"></div>');
        	that.$wrapper = that.$element.parent();

        	that._updateWrapper(that);
        	that.$element.css({ "white-space": "nowrap", position: "relative" });

        	that._initCards(that);
        },

        _initCards: function(that) {
        	that.$cards = that._getCards(that);
        	that.$cards.css({ display: "inline-block", "margin-right": that.config.spacing + "px" });
        	$(that.$cards.last()).css("margin-right", "0");
        },

        _updateWrapper: function(that) {
        	that.$wrapper.css({ width: "" });
        	var width = that.$element.outerWidth(true);

        	that.$wrapper.css({
        		width: width + "px",
        		overflow: "hidden"
        	});
        },

        _getCards: function(that) {
        	return that.$element.find("." + that.config.classes.card);
        },

        _initEvents: function(that) {
        	$(document).on('touchstart mousedown', function(e) { that._swipeStart(e, that); })
        			   .on('touchmove mousemove', function(e) { that._swipeMove(e, that); })
        			   .on('touchend mouseup', function(e) { that._swipeEnd(e, that); });

           	that.$wrapper.on('DOMMouseScroll mousewheel', function(e) { that._onMouseScroll(e, that); });

           	that._initButtonEvent(that, that.config.buttonLeft, that.config.buttonSteps);
           	that._initButtonEvent(that, that.config.buttonRight, that.config.buttonSteps * -1);
		},

		_initButtonEvent: function(that, buttonSelector, steps) {
           	if (buttonSelector !== undefined) {
                $(buttonSelector).click(function(e) { e.preventDefault(); });

           		$(buttonSelector).mousedown(function(e) {
           			e.preventDefault();
           			that.buttontimeout = setInterval(function() {
           				that._moveBy(that, steps);
           			}, 1);
           		});

           		$(document).mouseup(function(e) {
           			e.preventDefault();
           			if (that.buttontimeout !== undefined) {
	           			clearInterval(that.buttontimeout);
	           		}
           		});
           	}
		},

        _swipeStart: function(e, that) {
			// Check whether to start swiping on this particular slider
        	that.isSwiping = false;
        	var $parentWrap = $(e.target).closest("." + that.config.classes.wrapper);
        	if ($parentWrap.get(0) === that.$wrapper.get(0)) { that.isSwiping = true; }

        	if (that.isSwiping) {
        		if (e.pageX !== undefined) { that.lastX = e.pageX; }
        		else { that.lastX = e.originalEvent.touches[0].pageX; }
        	}
        },

        _swipeMove: function(e, that) {
        	if (!that.isSwiping) { return; }

            if (e.pageX !== undefined) { newX = e.pageX; }
            else { newX = e.originalEvent.touches[0].pageX; }

            if (!that.swipeValid && Math.abs(that.lastX - newX) > that.config.minimumSwipeDistance) {
                that.swipeValid = true;

	            $('body').css({
	                "-moz-user-select": "-moz-none",
	                "-o-user-select": "none",
	                "-khtml-user-select": "none",
	                "-webkit-user-select": "none",
	                "-ms-user-select": "none",
	                "user-select": "none"
	            });

	            $("*").attr("unselectable", "on");
	            $("html").css({ cursor: that.config.cursor });
            }
            if (that.swipeValid) {
                that._moveBy(that, that.lastX - newX);
                that.lastX = newX;
            }
        },

        _swipeEnd: function(e, that) {
        	that.isSwiping = false;
        	that.swipeValid = false;

            $('body').css({
                "-moz-user-select": "",
                "-o-user-select": "",
                "-khtml-user-select": "",
                "-webkit-user-select": "",
                "-ms-user-select": "",
                "user-select": ""
            });

            $("*").attr("unselectable", "");
            $("html").css({ cursor: "" });

        	if (!that.isSwiping || !that.swipeValid) { return; }

            if (e.pageX !== undefined) { newX = e.pageX; }
            else { newX = e.originalEvent.touches[0].pageX; }

	        that._moveBy(that, that.lastX - newX);
        },

        _onMouseScroll: function(e, that) {
            e.preventDefault();

            var pixels = 0;
            if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) { pixels = that.config.scrollSteps * -1; }
            else { pixels = that.config.scrollSteps; }
            that._moveBy(that, pixels);
        },

        _addCardWidths: function(that) {
        	var width = 0;
        	for(var i = 0; i < that.$cards.length; i++) {
        		width += that._getCardWidthByIndex(that, i);
        	}
        	return width;
        },

        _getCardWidthByIndex: function(that, index) {
        	return $(that.$cards[index]).outerWidth(true);
        },

        _moveBy: function(that, distance) {
            var totalWidth = that._addCardWidths(that);
            if (totalWidth < that.$wrapper.width()) { return; }
        	var leftVal = parseInt(that.$element.css("left"));
        	if (isNaN(leftVal)) { leftVal = 0; }

        	var moveTo = leftVal - distance;
        	var maxLeft = (totalWidth - that.$wrapper.width()) * -1;

        	if (moveTo > 0) { moveTo = 0; }
        	else if (moveTo < maxLeft) { moveTo = maxLeft; }

        	that.$element.css({ left: moveTo + "px" });
        },

        _onResize: function(that) {
        	that._updateWrapper(that);
        	that._moveBy(that, 0);
        },

        _introAnim: function(that) {
            if (that.config.introAnim === "fromRight") { that._introFromRight(that); }
        },

        _introFromRight: function(that) {
            that.$element.css({ left: "0" });
            that.$cards.css({ left: (that._addCardWidths(that) + 200) + "px" });

            var transitionLength = that.config.introLength / that.$cards.length;
            that.$cards.each(function (i, el) {
                $(el).animate({ left: "0" }, transitionLength, 'alloy');
                transitionLength = transitionLength + (transitionLength / 2);
            });
        },

        _outroAnim: function(that) {
            if (that.config.outroAnim === "toLeft") { that._outroToLeft(that); }
        },

        _outroToLeft: function(that) {
            var transitionLength = that.config.outroLength / that.$cards.length;
            var startTime = 0;

            function doAnimate($el, start, trans) {
                setTimeout(function() {
                    $el.animate({ left: (-1 * that._addCardWidths(that) - 200) + "px" }, trans, 'alloy');
                }, start);
            }

            that.$cards.each(function (i, el) {
                doAnimate($(el), startTime, transitionLength);
                startTime += transitionLength / 2;
            });

            if (that.config.onOutroComplete !== undefined) { setTimeout(that.config.onOutroComplete, that.config.outroLength); }
        }

    };

    SideSlider.defaults = SideSlider.prototype.defaults;

    $.fn.sideslider = function (options) {
        return this.each(function () {
        	var slider;
        	if ($(this).data("sideslider") === undefined) {
				slider = new SideSlider(this, options);
				slider._init();
	        	$(this).data("sideslider", slider);
	        }
        });
    };
})();