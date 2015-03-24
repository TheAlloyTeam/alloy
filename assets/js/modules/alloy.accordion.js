(function() {
    var myAccordion;

    // how to bring in the options
    var Accordion = function(element, options) {
    	this.element = element;
    	this.$element = $(element);
    	this.options = options;
    	this.metadata = this.$element.data('options');

        // Set aria-multiselectable to true on the accordion element in order to turn on multi select
        this._isMultiSelectable = function() {
            return this.$element[0].getAttribute("aria-multiselectable");
        };

        this._handleClick = function(el) {
            var $el = $(el).closest("." + this.config.classes.title);

            if (!$el.hasClass(this.config.classes.disabled)) {
                var toOpen = ($el.hasClass(this.config.classes.closed) || $el.hasClass(this.config.classes.closing));
                var id = this._getTitleIndex($el[0]);
                this._update(id, toOpen);
            }
        };

        this._update = function(id, toOpen) {
            var that = this;
            this.$element.find("." + this.config.classes.title).each(function() { that._handleTitle(this, id, toOpen); });
        };

        this._handleTitle = function(el, id, toOpen) {
            var index = this._getTitleIndex(el);
            if (index == id) {
                this._handleElement(el, toOpen);
            } else if (!this._isMultiSelectable() && toOpen) {
                this._handleElement(el, false);
            }
        };

        this._handleElement = function(el, toOpen) {
            var fromTran = "";
            var fromEnd = "";
            var toTran = "";
            var toEnd = "";

            var $title = $(el);
            var $content = this.$element.find(this._getTitleIndex(el));

            // Set our variables depending on if we are opening or closing this element
            if (toOpen) {
                $content.attr("aria-hidden", "false");

                fromTran = this.config.classes.closing;
                fromEnd = this.config.classes.closed;
                toTran = this.config.classes.opening;
                toEnd = this.config.classes.opened;
            } else {
                $content.attr("aria-hidden", "true");

                fromTran = this.config.classes.opening;
                fromEnd = this.config.classes.opened;
                toTran = this.config.classes.closing;
                toEnd = this.config.classes.closed;
            }

            // Trigger change event
            if (this.config.onChangeFunc !== undefined) { this.config.onChangeFunc($title, $content, toOpen); }

            // If transitions turned on, then transition to end go to end, or transitions off so just go to end          
            if (this.config.transitionTime > 0) {
                this._handleTransition($title, $content, fromTran, fromEnd, toTran, toEnd);
            } else {
                $title.addClass(toEnd).removeClass(fromEnd).removeClass(fromTran);
                $content.addClass(toEnd).removeClass(fromEnd).removeClass(fromTran);
            }
        };

        this._handleTransition = function($title, $content, fromTran, fromEnd, toTran, toEnd) {
            // Get contents original height
            var origHeight = $content.innerHeight();

            // Remove all classes from the content and just at the toEnd so we know its final height
            $content.removeClass(fromEnd).removeClass(fromTran).addClass(toEnd);
            var newHeight = $content.innerHeight();

            // Set content to original height so we can transition to it using our new height
            $content.css({height: origHeight + "px"});
            setTimeout(function() { $content.addClass(toTran).css({height: newHeight + "px"}); });

            // Ensure that our button is also transitioning through states correctly aswell
            $title.removeClass(fromEnd).removeClass(fromTran).addClass(toTran);
            setTimeout(function() {
                $title.removeClass(toTran).addClass(toEnd);
                $content.removeClass(toTran).addClass(toEnd).css({height: ""});
            }, this.config.transitionTime);
        };

        this._getTitleIndex = function(el) {
            if (this.config.titleIndexAttr.substring(0, 5) == "data-") {
                var att = this.config.titleIndexAttr.substring(5);
                return $(el).data(att);
            }
            else { return $(el).attr(this.config.titleIndexAttr); }
        };
    };

    Accordion.prototype = {

    	defaults: {
            classes: {
                'title'     : 'accordion__tab',         // The class to select the title (button) of an accordion'd element
                'content'   : 'accordion__panel',       // The class to select the content of an accordion'd element
                'opened'    : 'open',                   // The class given to open accordion elements (elements with this class on startup will start expanded)
                'closed'    : 'closed',                 // The class given to closed accordion elements
                'opening'   : 'opening',                // The class given to accordion elements in the process of opening
                'closing'   : 'closing',                // The class given to accordion elements in the process of closing
                'disabled'  : 'disabled'                // The class given to accordion elements that cannot have their state altered
            },
            transitionTime  : 350,                      // The amount of time it takes to transition from open to closed, and vice versa
            titleIndexAttr  : 'data-accordionindex',    // The attribute on the title to use that matches up to the content id (prefix with 'data-' if applicable)
            onChangeFunc    : undefined                 // Custom callback function to handle functionality on accordion change
    	},

        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            var that = this;

            // Init all elements to closed (or open to start off open)
            this.$element.find("." + this.config.classes.title).each(function() {
                if ($(this).hasClass(that.config.classes.opened)) { that._handleElement(this, true); } else { that._handleElement(this, false); }
            });

            // Handle the click of the title
            this.$element.find("." + this.config.classes.title).click(function(e) {e.preventDefault(); that._handleClick(this);});

            ALLOY.Logger.startup('ALLOY.Accordion Started');
        }
    };

    Accordion.defaults = Accordion.prototype.defaults;

    $.fn.accordion = function(options) {
    	return this.each(function() {
    		new Accordion(this, options)._init();
    	});
    };

    // Autostart Plugin
    ALLOY.Logger.trace('ALLOY.Accordion Initializing');
    //$(".accordion").accordion();
})();
