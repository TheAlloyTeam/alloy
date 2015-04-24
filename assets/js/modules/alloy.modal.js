(function () {

    var Modal = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('modal');
    };

    // Vimeo/youtube, iframe, id/class of element, html content, ajax content

    Modal.prototype = {
        defaults: {
            content: "<div></div>",

            maskClass: "modal__mask",
            maskActiveClass: "modal__mask--visible",
            maskTransitionLength: 500,

            modalClass: "modal__content",
            modalActiveClass: "modal__content--visible",
            modalTransitionLength: 250,

            closeButtonSelector: ".close-modal-content"
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            var that = this;
            this.$element.click(function(e) { that._onClick(e, that); });

            ALLOY.Logger.startup('ALLOY.Modal Started');
        },

        _onClick: function(e, that) {
            e.preventDefault();

            var $mask = $("." + that.config.maskClass);
            if ($mask.length === 0) {
                $mask = $('<div class="' + that.config.maskClass + '"></div>');
                $("body").append($mask);
            }
            $mask.addClass(that.config.maskActiveClass);
            
            var $content = $('<div class="' + that.config.modalClass + '">' + that.config.content + '</div>');
            $("body").append($content);
            $content.addClass(that.config.modalActiveClass);

            $(that.config.closeButtonSelector).one("click", function(e) { e.preventDefault(); that._doClose(that); });
            setTimeout(function() { that._checkForClose(that);}, 100);  // timeout to stop the 'opening' click closing the modal.
        },

        _checkForClose: function(that) {
            $('html').one("click", function(e) { e.preventDefault(); that._doClose(that); });
            $(that.config.modalClass).one("click", function(e) { e.stopPropagation(); that._checkForClose(that); });
        },

        _doClose: function(that) {
            var $content = $("." + that.config.modalClass);
            $content.removeClass(that.config.modalActiveClass);
            setTimeout(function() { $content.remove(); }, that.config.modalTransitionLength);

            var $mask = $("." + that.config.maskClass);
            $mask.removeClass(that.config.maskActiveClass);
            setTimeout(function() { $mask.remove(); }, that.config.maskTransitionLength);
        }
    };

    Modal.defaults = Modal.prototype.defaults;

    $.fn.modal = function (options) {
        return this.each(function () {
            new Modal(this, options)._init();
        });
    };

    // Autostart Plugin
    ALLOY.Logger.trace('ALLOY.Modal Initializing');
    $(".modal").modal();
})();