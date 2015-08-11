(function () {

    var Modeless = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('modeless');

        this.$html = undefined;
        this.isOpen = false;
    };

    Modeless.prototype = {
        defaults: {
            content: undefined,

            wrapClass: "modelesswrap",
            draggableClass: "modelesswrap",
            closeButtonClass: "close-modeless-content",

            stateful: true,

            closingClass: "closing",
            closedClass: "closed",
            closingTransitionLength: 400,
            startX: undefined,
            startY: undefined
        },

        _init: function () {
            var that = this;

            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            this.$element.click(function(e) { that._onClick(e, that); });

            ALLOY.Logger.startup('ALLOY.Modal Started');
        },

        _onClick: function(e, that) {
            e.preventDefault();

            if (!that.isOpen) {
                that._loadContent(that);
                that._setupEvents(that);
                that.isOpen = true;
            }
        },

        _loadContent: function(that) {
            if (!that.config.stateful || that.$html === undefined) {
                that._createDialog(that);
            } else {
                that.$html.removeClass(that.config.closingClass).removeClass(that.config.closedClass);
            }
        },

        _createDialog: function(that) {
            that._removeEvents(that);
            that.$html = $(that.config.content);
            that.$html.wrap('<div class="' + that.config.wrapClass + '"></div>');
            that.$html = $(that.$html.parent("." + that.config.wrapClass));
            $('body').append(that.$html);
            var pos = that._getStartPosition(that);
            that.$html.css({ left: pos.x + "px", top: pos.y + "px" });
        },

        _getStartPosition: function(that) {
            var startX = 0;
            var startY = 0;

            if (that.config.startX !== undefined) { startX = that.config.startX; }
            else { startX = that.$element.offset().left - $(window).scrollLeft(); }
            if (that.config.startY !== undefined) { startY = that.config.startY; }
            else { startY = that.$element.offset().top - $(window).scrollTop(); }

            return {
                x: startX,
                y: startY
            };
        },

        _setupEvents: function(that) {
            // Get draggable class and make sure we can drag around
            that.$draggable = that.$html.find("." + that.config.draggableClass).andSelf().filter("." + that.config.draggableClass);
            that.$draggable.mousedown(function(e) { that._onDragStart(e, that); });

            // Make sure that the movement and end of dragging happens on whole body so the event still triggers outside of the modeless window
            $('body').mousemove(function(e) { that._onDragMove(e, that); })
                     .mouseup(function(e) { that._onDragEnd(e, that); });

            // Close the modeless window
            that.$html.find("." + that.config.closeButtonClass).one("click", function(e) { e.preventDefault(); that._close(that); });
        },

        _close: function(that) {
            that.$html.addClass(that.config.closingClass);

            setTimeout(function() {
                that.isOpen = false;
                if (that.config.stateful) {
                    that.$html.addClass(that.config.closedClass).removeClass(that.config.closingClass);
                } else {
                    that.$html.remove();
                }
            }, that.closingTransitionLength);
        },

        _removeEvents: function(that) {
            if (that.$draggable !== undefined) {
                that.$draggable.off("mousedown");
            }
        },

        _onDragStart: function(e, that) {
            that.startX = e.pageX;
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
            $("html").css({ cursor: that.config.cursor });

            ALLOY.Logger.debug('ALLOY.Modeless Dragging started');
        },

        _onDragMove: function(e, that) {
            if (that.startY !== undefined && that.startX !== undefined) {
                var movedX = (that.startX - e.pageX) * -1;
                var movedY = (that.startY - e.pageY) * -1;

                that.$html.css({ left: "+=" + movedX + "px", top: "+=" + movedY + "px" });

                that.startX = e.pageX;
                that.startY = e.pageY;
            }
        },

        _onDragEnd: function(e, that) {
            if (that.startY !== undefined && that.startX !== undefined) {
                that.startY = undefined;
                that.startX = undefined;

                $('body').css({
                    "-moz-user-select": "",
                    "-o-user-select": "",
                    "-khtml-user-select": "",
                    "-webkit-user-select": "",
                    "-ms-user-select": "",
                    "user-select": ""
                });

                $("*").attr("unselectable", "");
                $("html").css({ cursor: "" });

                ALLOY.Logger.debug('ALLOY.Modeless Dragging ended');
            }
        }
    };

    Modeless.defaults = Modeless.prototype.defaults;

    $.fn.modeless = function (options) {
        return this.each(function () {
            new Modeless(this, options)._init();
        });
    };

    // Autostart Plugin
    ALLOY.Logger.trace('ALLOY.Modeless Initializing');
    $(".modeless").modeless();
})();
