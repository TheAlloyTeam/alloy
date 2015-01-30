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

    	classes: {
            'panel': 'accordion__panel',
            'header': 'panel__head',
            'title': 'panel__title',
            'content': 'panel__content',
            'opened': 'open',
            'closed': 'closed',
            'opening': 'opening',
            'closing': 'closing',
            'disabled': 'disabled'
    	},

    	defaults: {

    	},

    	_init: function(element) {
    		this.config = $.extend({}, this.defaults, this.options, this.metadata);
            myAccordion = $(element);

            var that = this;

            // Add initial classes
            var accordionsToClose = $(element).find("." + this.classes.panel).not("." + this.classes.opened);
            accordionsToClose.addClass(this.classes.closed);
            var accordionsToOpen = $("." + this.classes.opened);

            // Set initial states
            that.closeContent(accordionsToClose);
            that.openContent(accordionsToOpen);

            // Attach events
            $("." + this.classes.title).on("click", function (e) {
                that.toggleContent($(this).parent().parent());
                e.preventDefault();
            });

            // Init has event for grouped accordions
            that.hashEvent();

    	},

        closeContent: function (element) {
            element.find("." + this.classes.content).slideUp();
        },

        openContent: function (element) {
            element.find("." + this.classes.content).slideDown();
        },

        toggleContent: function (element) {
            // If it contains an icon toggle it

            var panel = element.closest("." + this.classes.panel).first();
            if (panel.length > 0) {
                
                if (element.hasClass(this.classes.closed)) {
                    this.openContent(element);
                    panel.removeClass(this.classes.closed);
                } else {
                    this.closeContent(element);
                    panel.addClass(this.classes.closed);
                }
            }

        },

        toggleOtherContent: function (element) {
            element.next().slideToggle();
        },

        hashEvent: function () {
            // Open accordion on hash change - used by our branches
            var that = this;

            if ($("." + this.classes.panel)) {
                $(window).on('hashchange', function () {
                    var accordionToOpen = $(window.location.hash);
                    that.openContent(accordionToOpen);
                    accordionToOpen.removeClass(this.classes.closed);
                });
            }
        }
    };

    Accordion.defaults = Accordion.prototype.defaults;

    $.fn.accordion = function(options) {
    	return this.each(function() {
    		new Accordion(this, options)._init(this);
    	});
    };

    // Autostart Plugin
    $(".accordion").accordion();
    console.log("E78.Accordion Loaded");
})();