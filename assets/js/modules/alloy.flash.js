(function() {
    ALLOY.FlashQueue = function() {

        var queue = [];

        var addFlash = function(flash) {
            queue.push(flash);
        };

        var public = {
                        
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
                '<div class="flash{{#item.modifier}} flash--{{item.modifier}}{{/item.modifier}}{{#item.status}} {{item.status}}{{/item.status}}">' +
                    '<a href="#" class="flash__close">&times;</a>' +
                    '{{#content.icon}}' +
                    '<div class="flash__icon">' +
                        '{{#item.modifier}}<i class="icon icon--{{item.modifier}}{{#item.size}} {{item.size}}{{/item.size}}"{{#content.title}} title="{{content.title}}"{{/content.title}} aria-hidden="true" role="img"></i>{{/item.modifier}}' +
                    '</div>' +
                    '{{/content.icon}}' +
                    '<div class="flash__content">{{content.text}}</div>' +
                '</div>',
            classes: {
                'closeButton': 'flash__close',
            }
        },
        _init: function(json) { 
            this.config = $.extend({}, this.defaults, this.options, undefined);

        },
    };

    Flash.defaults = Flash.prototype.defaults;

    $.flash = function(json, options) {
        if (json === undefined) { ALLOY.Logger.error("Json object required to turn on flash"); return; }
        new Flash(options)._init(json);
    };

    ALLOY.Logger.startup('ALLOY.Flash Loaded');
})();