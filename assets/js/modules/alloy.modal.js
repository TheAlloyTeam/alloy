(function () {

    var Modal = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('modal');

        this.htmlContent = undefined;
    };

    Modal.prototype = {
        defaults: {
            content: undefined,
            imageAltText: "",

            maskClass: "modal__mask",
            maskActiveClass: "modal__mask--visible",
            maskTransitionLength: 500,

            modalClass: "modal__content",
            modalActiveClass: "modal__content--visible",
            modalTransitionLength: 250,

            closeButtonSelector: ".close-modal-content",

            youtubeUrl: "https://www.youtube.com/embed/",
            vimdeoUrl: "//player.vimeo.com/video/"
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            // If content hasn't been specified, then set content to be the url of the (assumed) a link
            if (this.config.content === undefined) { this.config.content = this.$element.attr("href"); }

            var that = this;
            this.$element.click(function(e) { that._onClick(e, that); });

            ALLOY.Logger.startup('ALLOY.Modal Started');
        },

        _onClick: function(e, that) {
            e.preventDefault();

            var $mask = $('<div class="' + that.config.maskClass + '"></div>');
            $("body").append($mask);
            setTimeout(function() { $mask.addClass(that.config.maskActiveClass); });

            var htmlContent = that._getContent(that);
            
            var $content = $('<div class="' + that.config.modalClass + '">' + htmlContent + '</div>');
            $("body").append($content);
            $content.addClass(that.config.modalActiveClass);

            $(that.config.closeButtonSelector).one("click", function(e) { e.preventDefault(); that._doClose(that); });
            setTimeout(function() { that._checkForClose(that);}, 100);  // Timeout to stop the 'opening' click closing the modal
        },

        _getContent: function(that) {
            
            // Content has already been set
            if (that.htmlContent !== undefined) {
                // Do nothing, let the minifier handle it
            }
            // Check for an element
            else if (that.config.content.indexOf(".") === 0 || that.config.content.indexOf("#") === 0) {
                var $el = $(that.config.content);
                that.htmlContent = $el.prop('outerHTML');
            // Check for video urls
            } else if (that._checkVideos(that)) {
                // Do nothing, let the minifier handle it
            }
            // Check for image url
            else if (that._checkImage(that))
            {
                that.htmlContent = '<img src="' + that.config.content + '" alt="' + that.config.imageAltText + '" />';
            }
            // Just default to the content that was passed through
            else {
                that.htmlContent = that.config.content;
            }
            // Handle situations where it is a url that we can get a partial from

            return that.htmlContent;
        },

        _checkImage: function(that) {
            return(that.config.content.match(/\.(jpeg|jpg|gif|png|bmp)$/) !== null);
        },

        _checkVideos: function(that) {
            // Check for youtube url
            var youtubematches = that.config.content.match(/watch\?v=([a-zA-Z0-9\-_]+)/);
            var vimeomatches = that.config.content.match(/(www\.)?vimeo.com\/(\d+)($|\/)/);

            if (youtubematches) {
                var youtubeId = youtubematches[1];
                that.htmlContent = '<iframe width="420" height="315" src="' + that.config.youtubeUrl + youtubeId + '" frameborder="0"></iframe>';
                return true;
            } else if (vimeomatches) {
                var vimeoId = vimeomatches[2];
                that.htmlContent = '<iframe width="420" height="315" src="' + that.config.vimdeoUrl + vimeoId + '" frameborder="0"></iframe>';
                return true;
            }

            return false;
        },

        _checkForClose: function(that) {
            $("." + that.config.modalClass).one("click", function(e) { e.stopPropagation(); that._checkForClose(that); });
            $('html').one("click", function(e) { e.preventDefault(); that._doClose(that); });
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