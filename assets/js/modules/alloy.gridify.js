(function () {

    var Gridify = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');

        this.$cards = {};
        this.$noItemsEl = undefined;
    };

    Gridify.prototype = {
        defaults: {
            cardSelector: "li", // The selector for cards within this.$element
            activeClass: "active", // The class to use when an element is active
            transitionClass: "deactivating", // The class to use in between transitions
            inactiveClass: "inactive", // The class to use when an element is inactive
            transitionLength: 400, // The length in ms of the transition from active to inactive or vice versa
            noItemsEl: '<li class="alert alert--info">There were no results for your current search.  Try adjusting your search options.</li>',

            searchFunction: function ($cards, searchArgs) { return { $matches: $cards, $nonmatches: {} }; }, // The function to call for results on search
            searchArgs: {},                                                                                  // Any arguments to pass through to the search function                            
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            this._initContainer();
            this._initCards();

            ALLOY.Logger.startup('ALLOY.Gridify Started');
        },

        _initContainer: function () {
            // Container should be positioned relatively, with a height equal to its current height.
            var height = this.$element.height();
            this.$element.css({ height: height + "px", position: "relative" });
        },

        _initCards: function () {
            this.$cards = this.$element.find(this.config.cardSelector);
            this._updateCards();
        },

        _updateCards: function (searchargs) {
            var that = this;

            if (searchargs === undefined) { searchargs = that.config.searchArgs; }

            var results = that.config.searchFunction(that.$cards, searchargs);
            var $todisplay = results.$matches;
            var $tohide = results.$nonmatches;

            that._updateNoItemsMessage($todisplay.length, that);

            var todisplay = that._getPositions($todisplay, $tohide, that);

            setTimeout(function () {
                $tohide.each(function () { that._hideEl($(this), that); });
                for (var i = 0; i < todisplay.length; i++) {
                    that._displayEl(todisplay[i], that);
                }
            });
        },

        _updateNoItemsMessage: function (resultsCount, that) {
            if (resultsCount === 0) {
                if (that.$noItemsEl === undefined) {
                    that.$noItemsEl = $(that.config.noItemsEl);
                    that.$element.append(that.$noItemsEl);
                }
            } else {
                if (that.$noItemsEl !== undefined) {
                    that.$noItemsEl.remove();
                    that.$noItemsEl = undefined;
                }
            }
        },

        _getPositions: function ($todisplay, $tohide, that) {
            $todisplay.css({ display: "block", position: "initial" });
            $tohide.css({ display: "none", position: "", margin: "0" });

            // Set new height for container
            var newHeight = that.$element.css({ height: "" }).outerHeight();
            that.$element.css({ height: newHeight + "px" });

            // Foreach todisplay find new top and left values
            var todisplay = [];
            $todisplay.each(function () {
                todisplay.push({ $el: $(this), top: $(this).position().top, left: $(this).position().left });
            });

            $todisplay.css({ display: "", position: "absolute", margin: "" });
            $tohide.css({ display: "", position: "absolute", margin: "" });

            return todisplay;
        },

        _hideEl: function ($el, that) {
            $el.addClass(that.config.transitionClass).removeClass(that.config.activeClass);
            setTimeout(function () { $el.removeClass(that.config.transitionClass).addClass(that.config.inactiveClass); }, that.config.transitionLength);
        },

        _displayEl: function (obj, that) {
            var $el = obj.$el;

            // If already displayed then set top and left values.
            $el.css({ top: obj.top + "px", left: obj.left + "px" }).addClass(that.config.activeClass);

            // Else, set top and left values (without transition), and remove hiding/hidden class.
            if ($el.hasClass(that.config.transitionClass) || $el.hasClass(that.config.inactiveClass)) {
                $el.removeClass(that.config.transitionClass).removeClass(that.config.inactiveClass);
            }
        }
    };

    Gridify.defaults = Gridify.prototype.defaults;

    $.fn.gridify = function (options) {
        return this.each(function () {
            // If we already have gridify on this element, then we just refresh it rather than re-instantiate
            var gridify = $(this).data("gridify");
            if (gridify === undefined || gridify === null) { 
                gridify = new Gridify(this, options); 
                gridify._init(); 
            }
            else { gridify._updateCards(options); }
            $(this).data("gridify", gridify);
        });
    };

    // Autostart Plugin
    //ALLOY.Logger.trace('ALLOY.Gridify Initializing');
    //$(".gridify").gridify();
})();