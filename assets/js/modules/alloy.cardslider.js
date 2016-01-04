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
            controlDataAttr: "cardslidercontrol",                       // The data attribute which specifies how a button controls the cardslider
            controlSelector: ".cardslider__control",                    // The selector for a cardslider control
            currentClass: "current",                                    // The class to use when on the current card or control
            automaticTimer: 2500,                                       // 0 to turn off automatic timer
            automaticDirection: "left",                                 // The direction to automatically scroll - "left" or "right", defaults to "right" if unrecognised
            startIndex: 0,                                              // The index to start the cardslider at
            endless: true,                                              // True to endlessly scroll the carousel, or false to 'go' back to the beginning
            onScreenResize: function() { },                             // Function to call during the standard screen resize function
            beforeScroll: function() { },                               // Function to call before the the slider scrolls to a different card
            afterScroll: function() { }                                 // Function to call after the the slider scrolls to a different card
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            // Do init
            this._initContainer();
            this._initCards();
            this._initTray();
            this._initAuto();

            var that = this;

            // Handle button clicks
            $(this.config.controlSelector).click(function(e) { e.preventDefault(); that._handleControlClick($(this).data(that.config.controlDataAttr), that); });

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
                    var index;
                    if (that.config.automaticDirection === "left") {
                        index = that.index - 1;
                        if (index < 0) { index =  that.$cards.length - 1; }
                    } else {
                        index = that.index + 1;
                        if (index >= that.$cards.length) { index = 0; }
                    }
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
            // Handle endless scrolls to last from first or vice versa differently
            if (this.index === 0 && index === (this.$cards.length - 1) && this.config.endless) { this._gotoLastEndless(); return; }
            else if (this.index === (this.$cards.length - 1) && index === 0 && this.config.endless) { this._gotoFirstEndless(); return; }

            // Scroll normally
            this.index = index;

            var sendIndex = index;
            if (sendIndex === this.$cards.length) { sendIndex = 0; }

            if (this.config.beforeScroll !== undefined) {
                this.config.beforeScroll(sendIndex);
            }

            var goto = (this._getCardsliderWidth() * this.index) * -1;
            this.$tray.addClass(this.config.animationClass).css({ left: goto + "px" });

            // Update the currently active controls and cards
            var that = this;
            this._updateControls(index);
            this.$cards.removeClass(this.config.currentClass);
            $(this.$cards.get(this.index)).addClass(this.config.currentClass);
            if (index >= this.$cards.length) {
                var tempindex = index - this.$cards.length;
                $(this.$cards.get(tempindex)).addClass(this.config.currentClass);
            }

            // Remove the animation class from the tray at the end of the animation
            setTimeout(function () {
                that.$tray.removeClass(that.config.animationClass);
                if (that.config.afterScroll !== undefined) { that.config.afterScroll(sendIndex); }
            }, this.config.animationLength);
        },

        _updateControls: function(index) {
            if (index >= this.$cards.length) { index -= this.$cards.length; }

            var that = this;
            $(this.config.controlSelector).each(function() {
                var id = $(this).data(that.config.controlDataAttr);
                if (typeof id === "number") { id -= 1; }
                if (id == index) { $(this).addClass(that.config.currentClass); }
                else { $(this).removeClass(that.config.currentClass); }
            });
        },

        _gotoLastEndless: function() {
            // Create a clone of the first one on the end, travel directly to it, then scroll left to the last one and once done, then remove the clone
            var $clone = this._cloneAndInsertFirst();
            var that = this;
            this.$tray.css({ left: ((that._getCardsliderWidth() * this.$cards.length) * -1) + "px" });

            this.index = this.$cards.length;
            that._goto(this.$cards.length - 1);
            setTimeout(function() {
                $clone.remove();
            }, this.config.animationLength);
        },

        _gotoFirstEndless: function() {
            // Create a clone of the first one on the end, travel to the clone and then after finished travelling, go to the real first one and remove the clone
            var $clone = this._cloneAndInsertFirst();
            this._goto(this.$cards.length);

            var that = this;
            setTimeout(function() {
                that.$tray.css({ left: "0" });
                $clone.remove();
            }, this.config.animationLength);
        },

        _cloneAndInsertFirst: function() {
            var $clone = this.$cards.first().clone();
            $clone.insertAfter(this.$cards.last());
            return $clone;
        },

        _handleControlClick: function(data, that) {
            if (that.doAuto) { that.doAuto = false; }
            if (data === "previous") { that._previousCardClick(that); return; }                     // Previous
            else if (data === "next") { that._nextCardClick(that); return; }                        // Next
            else if (typeof data === "number") { that._goto(data - 1); }                            // Direct Index
            else { ALLOY.Logger.error("Didn't recognise cardslider control action: " + data); }     // Broken
        },

        _previousCardClick: function (that) {
            var index = that.index - 1;
            if (index < 0) { index = that.$cards.length - 1; }
            that._goto(index);
        },

        _nextCardClick: function (that) {
            var index = that.index + 1;
            if (index >= that.$cards.length) { index = index - that.$cards.length; }
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