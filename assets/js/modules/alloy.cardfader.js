(function () {

    var CardFader = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');

        this.pauseAuto = false;
        this.doAuto = true;
    };

    CardFader.prototype = {

        defaults: {
            classes: {
                card: "card",
                current: "current",
                control: "cardfader__control"
            },
            dataControlIndex: "cardfadercontrol",
            timer: 2500
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            var that = this;
            that._initElements(that);
            that._initEvents(that);
            that._setTimer(that);

            ALLOY.Logger.startup('ALLOY.CardFader Started');
        },

        _initElements: function(that) {
            that.$element.css({ position: "relative" });
            that.$cards = that.$element.find("." + that.config.classes.card);
            that.$cards.css({ position: "absolute", top: "0", left: "0", margin: "0" });
            that.$controls = that.$element.find("." + that.config.classes.control);
            that.currentIndex = 0;
            that._updateCards(that);
        },

        _initEvents: function(that) {
            that.$element.hover(function() { that.pauseAuto = true; },
                                function() { that.pauseAuto = false; });

            that.$element.find("." + that.config.classes.control).click(function(e) {
                e.preventDefault();
                that.doAuto = false;                    // Cancel autoscrolling
                that._handleControlClick(that,$(this)); // Handle the click
            });
        },

        _handleControlClick: function(that, $btn) {
            var val = $btn.data(that.config.dataControlIndex);
            if (val === "previous") { that._transition(that, -1); }
            else if (val === "next") { that._transition(that, 1); }
            else {
                var index = parseInt(val);
                if (!isNaN(index)) { that._transitionTo(that, index); }
                else { ALLOY.Logger.error("Could not parse an index from cardfader control value: " + val); }
            }
        },

        _setTimer: function(that) {
            setTimeout(function() {
                if (!that.pauseAuto && that.doAuto) { that._transition(that, 1); }
                if (that.doAuto) { that._setTimer(that); }
            }, that.config.timer);
        },

        _transition: function(that, direction) {
            if (direction > 0) { direction = 1; } else if (direction < 0) { direction = -1; }
            that.currentIndex += direction;
            if (that.currentIndex >= that.$cards.length) { that.currentIndex = 0; }
            else if (that.currentIndex < 0) { that.currentIndex = that.$cards.length - 1; }
            that._updateCards(that);
        },

        _transitionTo: function(that, index) {
            if (index >= that.$cards.length) { ALLOY.Logger.error("Not enough cards to transition directly to index: " + index); return; }
            else if (index < 0) { ALLOY.Logger.error("Can't transition directly to an index below zero"); return; }
            that.currentIndex = index;
            that._updateCards(that);
        },

        _updateCards: function(that) {
            that.$cards.css({ position: "absolute" }).removeClass(that.config.classes.current);
            $(that.$cards[that.currentIndex]).css({ position: "relative" }).addClass(that.config.classes.current);
            that.$controls.removeClass(that.config.classes.current);
            that.$controls.each(function(i) {
                var $card = $(that.$controls[i]);
                if ($card.data(that.config.dataControlIndex) === that.currentIndex) {
                    $card.addClass(that.config.classes.current);
                }
            });
        }
    };

    CardFader.defaults = CardFader.prototype.defaults;

    $.fn.cardfader = function (options) {
        return this.each(function () {
            new CardFader(this, options)._init();
        });
    };

    // Autostart
    $(".cardfader").cardfader();
})();