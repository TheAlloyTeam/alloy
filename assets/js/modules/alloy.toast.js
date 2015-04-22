(function() {

    // Acts as a handler for all toasts - bringing them in 
    ALLOY.ToastRack = function() {

        var toasts = [];

        var queue = [];

        var addToast = function(t) {
            if (toasts.length < ALLOY.ToastRack.config.limit && !_isProcessing()) {
                _processToast(t);
            } else {
                queue.push(t);
            }

            ALLOY.Logger.info("Toast added");
        };

        var _processToast = function(t) {

            t.isProcessing = true;

            _createToastrack();

            _showToast(t);

            setTimeout(function() { _activateToast(t); t.isProcessing = false; }, t.config.transitionInterval);

            var hideTimeout;
            if (t.config.despawnInterval > 0) {
                hideTimeout = setTimeout(function() { _hideToast(t); }, t.config.transitionInterval + t.config.despawnInterval);
            }

            var $closebtn = t._getCloseButton();
            $closebtn.one('click', function(e) {
                e.preventDefault();
                if (hideTimeout !== undefined) { clearTimeout(hideTimeout); }
                _hideToast(t);
            });
        };

        var _showToast = function(t) {
            var $toastrack = _getToastRack();
            $toastrack.append(t.$toast);
            setTimeout(function() { t.$toast.addClass(t.config.classes.activating); });
            _pushToast(t);
        };

        var _pushToast = function(t) {
            var height = t.$toast.outerHeight() + parseInt(t.$toast.css("margin-top")) + parseInt(t.$toast.css("margin-bottom"));
            $.each(toasts, function() { 
                if (!this.$toast.hasClass(this.config.classes.deactivating)) { 
                    this.$toast.css({ "bottom": "+=" + height + "px" }); 
                } 
            });
            toasts.push(t);
        };

        var _activateToast = function(t) {
            t.$toast.removeClass(t.config.classes.activating).addClass(t.config.classes.active);
        };

        var _hideToast = function(t) {
            var currentBottom = t.$toast.css("bottom");
            t.$toast.removeClass(t.config.classes.active).removeClass(t.config.classes.activating).addClass(t.config.classes.deactivating).css({ "bottom" : "" });
            var wantedBottom = t.$toast.css("bottom");
            t.$toast.css({ "bottom" : currentBottom + "px" });
            setTimeout(function() { t.$toast.css({ "bottom" : wantedBottom + "px" }); });

            setTimeout(function() { _removeToast(t); }, t.config.transitionInterval);
        };

        var _removeToast = function(t) {
            t.$toast.remove();
            var index = toasts.indexOf(t);
            toasts.splice(index, 1);
            _pushNext();
        };

        var _pushNext = function() {
            if (queue.length > 0 && !_isProcessing()) {
                var t = queue[0];
                queue.splice(0, 1);
                _processToast(t);
            }
        };

        var _createToastrack = function() {
            if (_getToastRack().length === 0) {
                ALLOY.ToastRack.config.$container.append('<div class="' + ALLOY.ToastRack.config.classes.toastrack + '"></div>');
            }
        };

        var _getToastRack = function() {
            return $("." + ALLOY.ToastRack.config.classes.toastrack);
        };

        var _isProcessing = function() {
            var processing = false;
            $.each(toasts, function() { if (this.isProcessing) { processing = true; } });
            return processing;
        };

        var public = {
            config: {
                $container: $('body'),
                limit: 5,
                classes: {
                    'toastrack' : 'toastrack'
                }
            },
            add: addToast
        };

        return public;

    }();

    var Toast = function(options) {
        this.options = options;
    };

    Toast.prototype = {

        defaults: {
            /***** Worth bearing in mind that mustache.js works quite differently to some other interpretations of handlebars so doesn't need if or each calls - worth changing version? *****/
            template: 
                    '<div class="toast popup{{#item.modifier}} toast--{{item.modifier}}{{/item.modifier}}{{#item.status}} {{item.status}}{{/item.status}}">' +
                        '<a href="?err=nojs&module=toast&action=close" class="toast__close">&times;</a>' +
                        '<div class="toast__progress"></div>' +
                        '<div class="toast__icon">{{#content.icon}}' +
                            '<i class="icon {{#item.modifier}}icon--{{item.modifier}}{{/item.modifier}}{{#item.size}} {{item.size}}{{/item.size}}"{{#content.title}} title="{{content.title}}"{{/content.title}} aria-hidden="true" role="img"></i>' +
                        '{{/content.icon}}</div>' +
                        '<div class="toast__content">{{content.text}}</div>' +
                    '</div>',
            classes: {
                'closeButton': 'toast__close',
                'activating' : 'activating',
                'active': 'active',
                'deactivating': 'inactive'
            },
            transitionInterval: 500,
            despawnInterval: 5000
        },

        isProcessing: false,

        $toast: {},
 
        _init: function(json) { 
            this.config = $.extend({}, this.defaults, this.options, undefined);
            var html = window.Mustache.render(this.config.template, json);
            this.$toast = $($.parseHTML(html));
            ALLOY.ToastRack.add(this);
        },

        _getCloseButton: function() {
            return this.$toast.find("." + this.config.classes.closeButton);
        }
    };

    Toast.defaults = Toast.prototype.defaults;

    $.toast = function(json, options) {
        if (json === undefined) { ALLOY.Logger.error("Json object required to turn on toaster"); return; }
        new Toast(options)._init(json);
    };

    ALLOY.Logger.startup('ALLOY.Toast Loaded');
})();