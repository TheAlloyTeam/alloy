(function() {
    ALLOY.FlashQueue = function() {

        var flashes = [];

        var addFlash = function(flash) {
            flashes.push(flash);

            if (flashes.length == 1) {
                _displayFlash(flash);
            }
        };

        var _displayFlash = function(flash) {
            $('body').prepend(flash.$flash);
            flash.$flash.find("." + flash.config.classes.closeButton).one('click', function(e) {
                e.preventDefault();
                _closeFlash(flash);
            });
        };

        var _closeFlash = function(flash) {
            flash.$flash.remove();
            flashes.splice(0, 1);
            if (flashes.length > 0) { _displayFlash(flashes[0]); }
        };

        var public = {
            add : addFlash
        };

        return public;

    }();

    var Flash = function(options) {
        this.options = options;
        this.$flash = {};
    };

    Flash.prototype = {

        defaults: {
            /***** Worth bearing in mind that mustache.js works quite differently to some other interpretations of handlebars so doesn't need if or each calls - worth changing version? *****/
            html: '<div class="flash">This is the default flash content and should be overwritten by you.</div>',
            classes: {
                'closeButton': 'flash__close'
            }
        },

        $flash: {},

        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, undefined);
            this.$flash = $(this.config.html);
            ALLOY.FlashQueue.add(this);
        }
    };

    Flash.defaults = Flash.prototype.defaults;

    $.flash = function(options) {
        new Flash(options)._init();
    };

    ALLOY.Logger.startup('ALLOY.Flash Loaded');
})();