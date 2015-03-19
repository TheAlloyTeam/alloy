(function() {

    var Toast = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');
    };

    Toast.prototype = {

        that: {},

        defaults: {
            /***** Worth bearing in mind that mustache.js works quite differently to some other interpretations of handlebars so doesn't need if or each calls - worth changing version? *****/
            template: 
                    '<div class="toast popup{{#item.modifier}} toast--{{item.modifier}}{{/item.modifier}}{{#item.status}} {{item.status}}{{/item.status}}">' +
                        '<a href="#" class="toast__close">&times;</a>' +
                        '<div class="toast__progress"></div>' +
                        '<div class="toast__icon">{{#content.icon}}' +
                            '<i class="icon {{#item.modifier}}icon--{{item.modifier}}{{/item.modifier}}{{#item.size}} {{item.size}}{{/item.size}}"{{#content.title}} title="{{content.title}}"{{/content.title}} aria-hidden="true" role="img"></i>' +
                        '{{/content.icon}}</div>' +
                        '<div class="toast__content">{{content.text}}</div>' +
                    '</div>',
            classes: {
                'toModify': 'toast',
                'toClose': 'toast__close',
                'active': 'active',
                'inactive': 'inactive'
            },

            toggleInterval: 5000
        },
 
        _init: function(json) { 
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            that = this;

            var html = window.Mustache.render(this.config.template, json);
            var $html = $($.parseHTML(html));
            var $closeButton = $html.find("." + this.config.classes.toClose);
            var $toastModifier = $html.find("." + this.config.classes.toModify).andSelf().filter("." + this.config.classes.toModify);
            that.$element.append($html);

            setTimeout(function() { $toastModifier.addClass(that.config.classes.active); });
            var hideTimeout;
            if (this.config.toggleInterval > 0) { hideTimeout = setTimeout(function() { that._hideToast($toastModifier); }, that.config.toggleInterval); }
            $closeButton.one('click', function(e) {
                e.preventDefault();
                if (hideTimeout !== undefined) { clearTimeout(hideTimeout); }
                that._hideToast($toastModifier);
            });
        },

        _hideToast: function($modifier) {
            $modifier.addClass(that.config.classes.inactive).removeClass(that.config.classes.active);
        }
    };

    Toast.defaults = Toast.prototype.defaults;

    $.fn.toast = function(json, options) {
        if (json === undefined) { ALLOY.Logger.error("Json object required to turn on toaster"); }
        return this.each(function() {
            new Toast(this, options)._init(json);
        });
    };

    ALLOY.Logger.startup('ALLOY.Toast Loaded');
    // Probably don't want to autostart *this* plugin (toasts popping everywhere)
    // $(".toast").toast();
})();