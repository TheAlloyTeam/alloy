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
    };

    Flash.prototype = {

        defaults: {
            /***** Worth bearing in mind that mustache.js works quite differently to some other interpretations of handlebars so doesn't need if or each calls - worth changing version? *****/
            template: 
                '<div class="flash example{{#item.modifier}} flash--{{item.modifier}}{{/item.modifier}}{{#item.status}} {{item.status}}{{/item.status}}">' +
                    '<a href="#" class="flash__close">&times;</a>' +
                    '<div class="flash__icon">{{#content.icon}}' +
                        '{{#item.modifier}}<i class="icon icon--{{item.modifier}}{{#item.size}} {{item.size}}{{/item.size}}"{{#content.title}} title="{{content.title}}"{{/content.title}} aria-hidden="true" role="img"></i>{{/item.modifier}}' +
                    '{{/content.icon}}</div>' +
                    '<div class="flash__content">{{content.text}}</div>' +
                '</div>',
            classes: {
                'closeButton': 'flash__close',
            }
        },

        $flash: {},

        _init: function(json) { 
            this.config = $.extend({}, this.defaults, this.options, undefined);
            var html = window.Mustache.render(this.config.template, json);
            this.$flash = $($.parseHTML(html));
            ALLOY.FlashQueue.add(this);
        },
    };

    Flash.defaults = Flash.prototype.defaults;

    $.flash = function(json, options) {
        if (json === undefined) { ALLOY.Logger.error("Json object required to turn on flash"); return; }
        new Flash(options)._init(json);
    };

    ALLOY.Logger.startup('ALLOY.Flash Loaded');
})();