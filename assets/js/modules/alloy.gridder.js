(function() {

 var Gridder = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Gridder.prototype = {
        defaults: {
            cardClass: "card--gridder",          // The class given to cards that should be included in the gridder grid
            lockedClass: "locked",              // The class to be given to cards that cannot have their size altered
            ignoreClass: "ignore",              // The class to be given to cards that are ignored from the grid entirely (and should be set to invisible using css)
            columns: 3,                         // The number of columns to try and fit in to the mason'ified element
            minColumnWidth: 120,                // The minimum width that a column can be, before moving down to one less column
            minHeight: 50,                     // The smallest possible height for a card
            heights: [                          // The classes for each possible multiple of the minHeight (starting at the first - default)
                "normal",
                "tall",
                "taller",
                "tallest"
            ],
            verticalSpace: 20,                  // The spacing vertically between cards
            horizontalSpace: 20,                // The spacing horizontally between cards

            increaseAttempts: 100,
            beforeResize: undefined
        },

        // Changes will not take effect until update is called or a resize occurs
        changeSettings: function(newSettings) {
            this.config = $.extend({}, this.config, newSettings, undefined);
        },

        update: function() {
            var that = this;
            that._getCards(that);
            var gridInfo = that._calculateGridInfo(that);
            that.currentColumns = gridInfo.columns;
            that._doWork(that, gridInfo);
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            var that = this;
            that.update();

            $(window).resize(function(e) { that._onResize(e, that); });

            ALLOY.Logger.startup('ALLOY.Gridder Started');
        },

        _getCards: function(that) {
            this.$cards = this.$element.find("." + this.config.cardClass).not("." + that.config.ignoreClass);
        },

        _calculateGridInfo: function(that) {
            var elWidth = that.$element.width();

            var columns = that.config.columns;
            var totalSpace = that.config.horizontalSpace * (columns - 1);
            var colWidth = (elWidth - totalSpace) / columns;

            while (columns > 1 && colWidth < that.config.minColumnWidth) {
                columns--;
                totalSpace = that.config.horizontalSpace * (columns - 1);
                colWidth = (elWidth - totalSpace) / columns;
            }

            return {
                columnWidth: colWidth,
                columns: columns
            };
        },

        _doWork: function(that, gridInfo) {
            that._initColumns(that, gridInfo.columns);
            that._initColumnHeights(that);
            that._setCards(that, gridInfo.columnWidth);
            that._setWrapperHeight(that);
        },

        _initColumns: function(that, columnAmount) {
            that.columns = [];

            for(var i = 0; i < columnAmount; i++) {
                var cards = that._getCardsByColumn(that, i, columnAmount);
                var colCards = that._initCards(that, cards);

                that.columns.push({
                    id: 0,
                    cards: colCards
                });
            }
        },

        _getCardsByColumn: function(that, index, totalColumns) {
            var output = [];

            for(var i = 0; i < that.$cards.length; i++) {
                if (i % totalColumns === index) {
                    output.push(that.$cards[i]);
                }
            }

            return output;
        },

        _initCards: function(that, cards) {
            var colCards = [];
            for(var i = 0; i < cards.length; i++) {
                var card = cards[i];

                colCards.push({
                    element: card,
                    heightClass: that._getHeightClass(that, card),
                    isLocked: $(card).hasClass(that.config.lockedClass)
                });
            }
            return colCards;
        },

        _getHeightClass: function(that, card) {
            var heightClass = that.config.heights[0];
            if ($(card).data("heightClass") !== undefined) {
                heightClass = $(card).data("heightClass");
            }
            else {
                for(var i = 0; i < that.config.heights.length; i++) {
                    if ($(card).hasClass(that.config.heights[i])) {
                        heightClass = that.config.heights[i];
                    }
                }
            }

            $(card).data("heightClass", heightClass);
            return heightClass;
        },

        _initColumnHeights: function(that){
            that._populateColumnPotentialHeights(that);
            var tallest  = that._getTallestHeight(that.columns);
            that._increaseColumnHeights(that, tallest);
        },

        _populateColumnPotentialHeights: function(that) {
            // Find the potential height of each column
            for(var i = 0; i < that.columns.length; i++) {
                var potentialHeight = that._addHeights(that, that.columns[i].cards);
                that.columns[i].potentialHeight = potentialHeight;
            }
        },

        _addHeights: function(that, cards) {
            var height = 0;
            for(var i = 0; i < cards.length; i++) {
                var heightClass = cards[i].heightClass;
                height += that._getHeightByClass(that, heightClass);
            }
            return height + (that.config.verticalSpace * cards.length - 1);
        },

        _getHeightByClass: function(that, classname) {
            for(var i = 0; i < that.config.heights.length; i++) {
                if (classname === that.config.heights[i]) {
                    var multplier = i + 1;
                    var height = (that.config.minHeight * multplier) + (that.config.verticalSpace * (multplier - 1));
                    return height;
                }
            }

            return that.config.minHeight;
        },

        _getTallestHeight: function(cols) {
            var tallest = cols[0].potentialHeight;
            for(var i = 0; i < cols.length; i++) {
                if (cols[i].potentialHeight > tallest) {
                    tallest = cols[i].potentialHeight;
                }
            }

            return tallest;
        },

        _increaseColumnHeights: function(that, increaseTo) {
            for(var i = 0; i < that.columns.length; i++) {
                that._increaseColumnHeight(that, that.columns[i], increaseTo);
            }
        },

        _increaseColumnHeight: function(that, column, increaseTo) {
            var attempts = 0;
            var potentialHeight = column.potentialHeight;
            while (potentialHeight < increaseTo) {
                // Ensure we can't get stuck in an infinite loop attempting to increase column heights
                attempts ++;

                // Select a random card and make it one size bigger if possible
                var rnd = Math.floor(Math.random() * column.cards.length);
                var card = column.cards[rnd];

                // Don't allow scaling up if card is locked
                if (card !== undefined && !card.isLocked) {
                    var newClass = that._getNextHeightClass(that, card.heightClass);

                    // Try again if the card is already at the largest size
                    if (newClass !== undefined) {
                        card.heightClass = newClass;

                        // Check the new height of the column
                        potentialHeight = that._addHeights(that, column.cards);
                    }
                }
            }
        },

        _getNextHeightClass: function(that, heightClass) {
            var useNext = false;
            for(var i = 0; i < that.config.heights.length; i++) {
                if (useNext) { return that.config.heights[i]; }
                if (that.config.heights[i] === heightClass) { useNext = true; }
            }
            return undefined;
        },

        _setCards: function(that, columnWidth) {
            // Loop through all columns adding to the x position
            var xpos = 0;
            for(var col = 0; col < that.columns.length; col++) {
                var column = that.columns[col];

                // Loop through all cards adding to the y position
                var ypos = 0;
                for(var c = 0; c < column.cards.length; c++) {
                    var card = column.cards[c];
                    var cardHeight = that._getHeightByClass(that, card.heightClass);

                    for(var i = 0; i < that.config.heights.length; i++) { $(card.element).removeClass(that.config.heights[i]); }

                    $(card.element).css({
                        height: cardHeight + "px",
                        width: columnWidth + "px",
                        position: "absolute",
                        margin: "0",
                        padding: "0",
                        left: xpos,
                        top: ypos
                    }).addClass(card.heightClass);

                    ypos += cardHeight + that.config.verticalSpace;
                }

                xpos += columnWidth + that.config.horizontalSpace;
                ypos = 0;
            }
        },

        _setWrapperHeight: function(that) {
            // Ensure we are using the correct heights to get the tallest and set the element to this value
            that._populateColumnPotentialHeights(that);
            var tallest = that._getTallestHeight(that.columns);
            that.$element.css({ height: tallest + "px" });
        },

        _onResize: function(e, that) {
            if (that.config.beforeResize !== undefined) { that.config.beforeResize(that); }

            var newGridInfo = that._calculateGridInfo(that);
            console.log("old Columns: " + that.currentColumns + ", new columns: " + newGridInfo.columns);

            // If columns is different then will need to do all this again
            if (newGridInfo.columns !== that.currentColumns) { that.currentColumns = newGridInfo.columns; that._doWork(that, newGridInfo); }
            // If columns is the same then just take the sizes set of each card and jsut have to figure out the widths
            else { that._setCards(that, newGridInfo.columnWidth); that._setWrapperHeight(that);}

            that._setWrapperHeight(that);
        }
    };

    Gridder.defaults = Gridder.prototype.defaults;

    $.fn.gridder = function (options) {
        return this.each(function () {
            // If already started up then ignore
            if ($(this).data("gridder") === undefined) {
                var gridder = new Gridder(this, options);
                gridder._init();
                $(this).data("gridder", gridder);
            }
        });
    };

    // Autostart Plugin
    ALLOY.Logger.trace('ALLOY.Gridder Initializing');
    //$(".gridder").gridder();
})();