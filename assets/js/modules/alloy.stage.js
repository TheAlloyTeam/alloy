(function () {

    var Stage = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Stage.prototype = {

        defaults: {
            classes: {
                toggle: "stage__toggle",
                page: "stage__page",
                tray: "stage__tray",

                toggleOpen: "open",

                pageMovingIn: "movingIn",
                pageMovingOut: "movingOut",

                trayOpening: "opening",
                trayClosing: "closing"
            },
            dataPushFrom: "pushfrom"
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            var that = this;
            this._initStageElements(that);
            this._initEvents(that);

            ALLOY.Logger.startup('ALLOY.Stage Started');
        },

        _initStageElements: function(that) {
            that.$page = that.$element.find("." + that.config.classes.page);
            that.$trays = that.$element.find("." + that.config.classes.tray);
            that.$toggles = that.$element.find("." + that.config.classes.toggle);

            // Set required styles for stage element
            that.$element.css({ overflow: "hidden", width: "100%" });

            // Set required styles for tray elements (if left move left, if right move right)
            that.$trays.each(function(i) {
                $(this).css($(this).data(that.config.dataPushFrom), "-" + $(this).width() + "px");
                $(this).data("stagetrayindex", i);
            });

            // Set required styles for page element
            that.$page.css({ top: "0", left: "0", width: that.$element.outerWidth(true) + "px" });
        },

        _initEvents: function(that) {
            that.$toggles.click(function(e) {
                e.preventDefault();
                that._handleToggle($(this), that);
            });
        },

        _handleToggle: function($toggle, that) {
            // Find the id of the tray that we want to toggle (in the href)
            var id = $toggle.attr("href");

            // Find the tray
            var $tray = $(that.$element.find(id));
            var trayid = $tray.data("stagetrayindex");

            for(var i = 0; i < that.$trays.length; i++) {
                var $currTray = $(that.$trays.get(i));
                var open = false;
                var includePage = false;

                if ($currTray.data("stagetrayindex") === trayid) {
                    includePage = true;
                    open = !$currTray.hasClass(that.config.classes.trayOpening);
                }

                that._toggleTray($currTray, open, includePage, that);
            }
        },

        _toggleTray: function($tray, open, includePage, that) {
            // Get its width
            var width = $tray.width();
            var direction = $tray.data(that.config.dataPushFrom);

            if (open) {
                that._openTray($tray, includePage, that, width, direction);
            } else {
                that._closeTray($tray, includePage, that, width, direction);
            }
        },

        _openTray: function($tray, includePage, that, width, direction) {
            $tray.addClass(that.config.classes.trayOpening)
                 .removeClass(that.config.classes.trayClosing)                 
                 .css(direction, "0");

            if (includePage) {
                var moveVal = direction === "left" ? width : width * -1;
                that.$page.addClass(that.config.classes.pageMovingIn)
                          .removeClass(that.config.classes.pageMovingOut)
                          .css({ left: moveVal + "px" });
            }

            ALLOY.Logger.debug("ALLOY.Stage - Opened tray");
        },

        _closeTray: function($tray, includePage, that, width, direction) {
            $tray.addClass(that.config.classes.trayClosing)
                 .removeClass(that.config.classes.trayOpening)
                 .css(direction, "-" + width + "px");

            if (includePage) {
                that.$page.removeClass(that.config.classes.pageMovingIn)
                          .addClass(that.config.classes.pageMovingOut)
                          .css({ left: "0" });
            }

            ALLOY.Logger.debug("ALLOY.Stage - Closed tray");
        },

        _setToggles: function(href, open, that) {
            that.$toggles.each(function() {
                if ($(this).attr("href") === href) {
                    if (open) {
                        $(this).addClass(that.config.classes.toggleOpen);
                        return;
                    }
                }
                $(this).removeClass(that.config.classes.toggleOpen);
            });
        }

    };

    Stage.defaults = Stage.prototype.defaults;

    $.fn.stage = function (options) {
        return this.each(function () {
            new Stage(this, options)._init();
        });
    };
})();