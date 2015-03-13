(function() {
    var myAccordion;

    // how to bring in the options
    var Accordion = function(element, options) {
    	this.element = element;
    	this.$element = $(element);
    	this.options = options;
    	this.metadata = this.$element.data('options');
    };

    Accordion.prototype = {

        that: {},

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
            transitionTime  : 350,                     // The amount of time it takes to transition from open to closed, and vice versa
            titleIndexAttr  : 'data-accordionindex'     // The attribute on the title to use that matches up to the content id (prefix with 'data-' if applicable)
    	},

        // Set aria-multiselectable to true on the accordion element in order to turn on multi select
        _isMultiSelectable: function() {
            return that.$element[0].getAttribute("aria-multiselectable");
        },
 
        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            that = this;

            // Init all elements to closed (or open to start off open).
            this.$element.find("." + this.config.classes.title).each(function() { 
                if ($(this).hasClass(that.config.classes.opened)) { that._handleElement(this, true); } else { that._handleElement(this, false); }
            });

            // Handle the click of the title
            this.$element.find("." + this.config.classes.title).click(this._handleClick);

            console.log('%cALLOY.Accordion Started', 'color: green;');
        },

        _handleClick: function(e) {
            e.preventDefault();
            var $el = $(e.target).closest("." + that.config.classes.title);

            if (!$el.hasClass(that.config.classes.disabled)) {
                var toOpen = ($el.hasClass(that.config.classes.closed) || $el.hasClass(that.config.classes.closing));
                var id = that._getTitleIndex($el[0]);
                that._update(id, toOpen);
            }
        }, 

        _update: function(id, toOpen) {
            that.$element.find("." + that.config.classes.title).each(function() { that._handleTitle(this, id, toOpen); });
        },

        _handleTitle: function(el, id, toOpen) {
            var index = that._getTitleIndex(el);
            if (index == id) {
                that._handleElement(el, toOpen);
            } else if (!that._isMultiSelectable() && toOpen) {
                that._handleElement(el, false);
            }
        },

        _handleElement: function(el, toOpen) {
            var fromTran = "";
            var fromEnd = "";
            var toTran = "";
            var toEnd = "";

            var $title = $(el);
            var $content = that.$element.find(that._getTitleIndex(el));


            // Set our variables depending on if we are opening or closing this element.
            if (toOpen) {
                $content.attr("aria-hidden", "false");

                fromTran = that.config.classes.closing;
                fromEnd = that.config.classes.closed;
                toTran = that.config.classes.opening;
                toEnd = that.config.classes.opened;
            } else {
                $content.attr("aria-hidden", "true");

                fromTran = that.config.classes.opening;
                fromEnd = that.config.classes.opened;
                toTran = that.config.classes.closing;
                toEnd = that.config.classes.closed;                
            }

            // If transitions turned on, then transition to end go to end, or transitions off so just go to end.             
            if (that.config.transitionTime > 0) {                
                that._handleTransition($title, $content, fromTran, fromEnd, toTran, toEnd);
            } else {
                $title.addClass(toEnd).removeClass(fromEnd).removeClass(fromTran);
                $content.addClass(toEnd).removeClass(fromEnd).removeClass(fromTran);
            }
        },

        _handleTransition: function($title, $content, fromTran, fromEnd, toTran, toEnd) {
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
            }, that.config.transitionTime);
        },

        _getTitleIndex: function(el) {
            if (this.config.titleIndexAttr.substring(0, 5) == "data-") { 
                var att = this.config.titleIndexAttr.substring(5);  
                return $(el).data(att); 
            }
            else { return $(el).attr(this.config.titleIndexAttr); }
        },

        // hashEvent: function () {
        //     // Open accordion on hash change - used by our branches
        //     var that = this;

        //     if ($("." + this.classes.panel)) {
        //         $(window).on('hashchange', function () {
        //             var accordionToOpen = $(window.location.hash);
        //             that.openContent(accordionToOpen);
        //             accordionToOpen.removeClass(this.classes.closed);
        //         });
        //     }
        // }
    };

    Accordion.defaults = Accordion.prototype.defaults;

    $.fn.accordion = function(options) {
    	return this.each(function() {
    		new Accordion(this, options)._init();
    	});
    };

    // Autostart Plugin
    console.log('%cALLOY.Accordion Initializing', 'color: orange;');
    $(".accordion").accordion();
})();
