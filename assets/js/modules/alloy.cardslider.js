(function () {

    var CardSlider = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');

        this.index = 0;
        this.$tray = {};
        this.$cards = {};
        this.doAuto = false;
        this.pauseAuto = false;
    };

    CardSlider.prototype = {

        defaults: {
            trayClass: "cardslider__tray",                              // The element containing the cards
            cardSelector: ".card",                                      // The selector for the card elements, that will be scrolled through
            animationClass: "anim--cardslider",                         // The class to use when animating the slider
            animationLength: 400,                                       // The length of the animation
            previousButtonSelector: ".cardslider__control.previous",    // The selector for the 'previous' button
            nextButtonSelector: ".cardslider__control.next",            // The selector for the 'next' button
            automaticTimer: 2500,                                       // 0 to turn off automatic timer
            startIndex: 0,                                              // The index to start the cardslider at
            onScreenResize: function() { },                             // Function to call during the standard screen resize function
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            // Do init
            this._initContainer();
            this._initCards();
            this._initTray();
            this._initAuto();

            // Handle button clicks
            var that = this;
            $(this.config.previousButtonSelector).click(function (e) { e.preventDefault(); that._previousCardClick(that); });
            $(this.config.nextButtonSelector).click(function (e) { e.preventDefault(); that._nextCardClick(that); });

            // Make sure everything is still working correctly on resize
            $(window).resize(function () { that._onResize(that); });

            this._goto(this.config.startIndex);
            ALLOY.Logger.startup('ALLOY.CardSlider Started');
        },

        _initContainer: function () {
            // Make sure that the container is overflow: hidden
            this.$element.css({
                overflow: "hidden"
            });
        },

        _initCards: function () {
            this.$cards = this.$element.find(this.config.cardSelector);

            // Find the total width up until this card and save it to card along with Id, give cards styles of float: left, width of this.$element.width
            var width = this._getCardsliderWidth();
            this.$cards.css({
                float: "left",
                width: width + "px"
            });
        },

        _initTray: function () {
            this.$tray = this.$element.find("." + this.config.trayClass);

            if (this.$tray.length === 0) {
                this.$element.wrapInner('<div class="' + this.config.trayClass + '"></div>');
                this.$tray = this.$element.find("." + this.config.trayClass);
            }

            // Give it styles: position: relative, width: 99999px, display: inline-block, left: 0
            this.$tray.css({
                position: "relative",
                width: "999999px",
                display: "inline-block",
                left: "0"
            });
        },

        _initAuto: function() {
            var that = this;
            if (this.config.automaticTimer > 0) {
                this.doAuto = true;
                setTimeout(function() { that._doAuto(that); }, that.config.automaticTimer);
                this.$element.hover(function() { that.pauseAuto = true; }, function() { that.pauseAuto = false; });
            }
        },

        _doAuto: function(that) {
            if (that.doAuto) {
                if (!that.pauseAuto) {
                    var index = that.index + 1;
                    if (index >= that.$cards.length) { index = 0; }
                    that._goto(index);
                }
                setTimeout(function() { that._doAuto(that); }, that.config.automaticTimer);
            }
        },

        _onResize: function (that) {
            that._initCards();
            if (that.config.onScreenResize !== undefined) { that.config.onScreenResize(); }
            that._goto(that.index);
        },

        _goto: function (index) {
            this.index = index;
            var goto = (this._getCardsliderWidth() * this.index) * -1;
            this.$tray.addClass(this.config.animationClass).css({ left: goto + "px" });

            var that = this;
            setTimeout(function () {
                that.$tray.removeClass(that.config.animationClass);
            }, this.config.animationLength);
        },

        _previousCardClick: function (that) {
            if (that.doAuto) { that.doAuto = false; }
            var index = that.index - 1;
            if (index < 0) { index = that.$cards.length - 1; }
            that._goto(index);
        },

        _nextCardClick: function (that) {
            if (that.doAuto) { that.doAuto = false; }
            var index = that.index + 1;
            if (index >= that.$cards.length) { index = 0; }
            that._goto(index);
        },

        _getCardsliderWidth: function () {
            return this.$element.width();
        },

    };

    CardSlider.defaults = CardSlider.prototype.defaults;

    $.fn.cardslider = function (options) {
        return this.each(function () {
            new CardSlider(this, options)._init();
        });
    };
})();