(function() {

    var Scrollbar = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');

        this.hasFocus = false;
    };

    Scrollbar.prototype = {

        defaults: {
            classes: {
                wrapper: "scroll-wrap",
                scrollContainer: "scrollcontainer",
                buttonUp: "button-up",
                buttonDown: "button-down",
                scrollbar: "scrollbar",
                scroller: "button-scroller",
                focus: "hasfocus"
            },
            steps: {
                scrollWheel: 20,
                button: 10,
                keyboard: 20,
            }
        },

        _moveBy: function(pixels, that) {
            var currentScroll = that.$element.scrollTop();
            currentScroll += pixels;
            var maxScroll = that.$element.prop("scrollHeight") - that.$element.height();

            if (currentScroll >= maxScroll) { currentScroll = maxScroll; }
            if (currentScroll < 0) { currentScroll = 0; }
            this.$element.scrollTop(currentScroll);

            var scrollPercent = currentScroll / maxScroll;
            var scrollerHeight = that.$scrollbar.height() - that.$scroller.height();
            var elScroll = scrollerHeight * scrollPercent;
            this.$scroller.css({ top: elScroll + "px" });
        },

        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            var that = this;

            this._createScrollbar();
            this._setStyles();
            this._setSizes(that);
            this._initEvents(that);

            ALLOY.Logger.startup('ALLOY.Scrollbar Started');
        },

        /* Init */
        _createScrollbar: function() {
            this.$element.wrap('<div class="' + this.config.classes.wrapper + ' c"></div>');
            this.$scrollwrap = this.$element.parent();

            this.$scrollwrap.append('<div class="' + this.config.classes.scrollContainer + '"></div>');
            this.$scrollContainer = this.$scrollwrap.find("." + this.config.classes.scrollContainer);

            this.$scrollContainer.html('<div class="' + this.config.classes.scrollbar + '"><div class="' + this.config.classes.scroller + '"></div></div>');
            this.$scrollbar = this.$scrollContainer.find("." + this.config.classes.scrollbar);
            this.$scroller = this.$scrollContainer.find("." + this.config.classes.scroller);
        },

        _setStyles: function() {
            // Set required styles for the scrollable element
            this.$element.css({
                overflow: "hidden"
            });

            // Set required styles for the scroller button
            this.$scroller.css({
                position: "relative",
                top: "0"
            });
        },

        _setSizes: function(that) {
            var elWidth = that.$element.width();
            var scWidth = that.$scrollContainer.width();

            var elHeight = that.$element.height();
            that.$scrollContainer.css({ height: elHeight + "px" });
        },

        _initEvents: function(that) {
            /* Scroll by the scroller */
            that.$scroller.mousedown(function(e) { that._beginScroll(e, that); });
            $('body').mousemove(function(e) { that._doScroll(e, that); })
                     .mouseup(function(e) { that._endScroll(e, that); });

            /* Track focus for keyboard and mouse scrolling */
            $('body').on("mousedown", function() {
                that._removeFocus(that);
            });

            that.$scrollwrap.on("mousedown", function(e) {
                that._addFocus(that);
                e.stopPropagation();
            });

            /* Scroll by keyboard events */
            $('body').keydown(function(e) { that._onKeydown(e, that); });

            /* Scroll by mouse events */
            $('body').on('DOMMouseScroll mousewheel', function(e) { that._onMouseScroll(e, that); });
        },

        _addFocus: function(that) {
            that.hasFocus = true;
            that.$scrollwrap.addClass(that.config.classes.focus);
        },

        _removeFocus: function(that) {
            that.hasFocus = false;
            that.$scrollwrap.removeClass(that.config.classes.focus);
        },

        /* Scroller */
        _beginScroll: function(e, that) {
            that.startY = e.pageY;
            
            $('body').css({
                "-moz-user-select": "-moz-none",
                "-o-user-select": "none",
                "-khtml-user-select": "none",
                "-webkit-user-select": "none",
                "-ms-user-select": "none",
                "user-select": "none"
            });

            $("*").attr("unselectable", "on");

            ALLOY.Logger.debug('ALLOY.Scrollbar Scrolling started');
        },

        _doScroll: function(e, that) {
            if (that.startY !== undefined) {
                var moved = (that.startY - e.pageY) * -1;
                that._moveByScrollerPixels(moved, that);
                that.startY = e.pageY;
            }
        },

        _endScroll: function(e, that) {
            if (that.startY !== undefined) {
                that.startY = undefined;

                $('body').css({
                    "-moz-user-select": "",
                    "-o-user-select": "",
                    "-khtml-user-select": "",
                    "-webkit-user-select": "",
                    "-ms-user-select": "",
                    "user-select": ""
                });

                $("*").attr("unselectable", "");

                that._removeFocus(that);

                ALLOY.Logger.debug('ALLOY.Scrollbar Scrolling ended');
            }
        },

        _moveByScrollerPixels: function(pixels, that) {
            var currentScroll = parseInt(that.$scroller.css("top"));
            currentScroll += pixels;
            var maxScroll = that.$scrollbar.height() - that.$scroller.height();

            if (currentScroll >= maxScroll) { currentScroll = maxScroll; }
            if (currentScroll < 0) { currentScroll = 0; }
            that.$scroller.css({ top: currentScroll + "px" });

            var scrollPercent = currentScroll / maxScroll;
            var scrollheight = that.$element.prop("scrollHeight") - that.$element.height();
            var elScroll = scrollheight * scrollPercent;
            this.$element.scrollTop(elScroll);
        },

        /* Keyboard */
        _onKeydown: function(e, that) {
            if (that.hasFocus) {
                var pixels;
                switch(e.keyCode) {

                    case 33: // Page up
                        pixels = that.config.steps.keyboard * -1;
                        break;
                    case 32: // Spacebar
                    case 34: // Page down
                        pixels = that.config.steps.keyboard;
                        break;
                    case 36: // Home
                        pixels = that.$element.prop("scrollHeight") * -1;
                        break;
                    case 35: // End
                        pixels = that.$element.prop("scrollHeight");
                        break;
                    case 38: // Button up
                        pixels = that.config.steps.button * -1;
                        break;
                    case 40: // Button down
                        pixels = that.config.steps.button;
                        break;
                }

                if (pixels !== undefined) {
                    e.preventDefault();
                    that._moveBy(pixels, that);
                }
            }
        },

        /* Mouse */
        _onMouseScroll: function(e, that) {
            if (that.hasFocus) {
                var pixels;
                if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
                    // Scroll up
                    pixels = that.config.steps.scrollWheel * -1;
                } else {
                    // Scroll down
                    pixels = that.config.steps.scrollWheel;
                }

                if (pixels !== undefined) {
                    e.preventDefault();
                    that._moveBy(pixels, that);
                }
            }
        }
    };

    Scrollbar.defaults = Scrollbar.prototype.defaults;

    $.fn.scrollbar = function(options) {
        return this.each(function() {
            new Scrollbar(this, options)._init();
        });
    };

    ALLOY.Logger.trace('ALLOY.Scrollbar Initializing');
})();
