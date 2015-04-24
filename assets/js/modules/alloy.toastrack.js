(function() {

    var Toast = function(options) {
        this.options = options;
        this.$toast = {};
        this.isProcessing = false;
        this.timer = undefined;
        this.progress = undefined;
        this.progressPercent = 0;

        this.activate = this._activate;
        this.getHeight = this._getHeight;
        this.addFromBottom = this._addFromBottom;

        this._init();
    };

    Toast.prototype = {
        defaults: {
            html: '<div class="toast">This is the default toast content and should be overwritten by you.</div>',
            classes: {
                'close': 'toast__close',
                'activating': 'activating',
                'active': 'active',
                'deactivating': 'deactivating',
                'progressbar': 'toast__progress'
            },
            transitionLength: 500,
            despawnInterval: 10000
        },

        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, undefined);
            this.$toast = $(this.config.html);
        },

        _activate: function(onCooked) {
            this.isProcessing = true;
            this.$toast.addClass(this.config.classes.activating);

            var that = this;
            setTimeout(function() {
                that.isProcessing = false;
                that.$toast.removeClass(that.config.classes.activating).addClass(that.config.classes.active);

                // Triggers for closing toast
                that.timer = setTimeout(function() { that._deactivate(onCooked); }, that.config.despawnInterval );
                that.$toast.find("." + that.config.classes.close).click(function(e) { e.preventDefault(); that._handleCloseButton(onCooked); });

            }, this.config.transitionLength);

            // Set progress bar
            this.progress = setInterval(function() { that._progressTick(that); }, Math.floor(that.config.despawnInterval / 100));
        },

        _handleCloseButton: function(onCooked) {
            if (!this.isProcessing) {
                this._deactivate(onCooked);
            }
        },

        _deactivate: function(onCooked) {
            this.isProcessing = true;
            this.$toast
                    .removeClass(this.config.classes.activating)
                    .removeClass(this.config.classes.active)
                    .addClass(this.config.classes.deactivating)
                    .css({ bottom: "" });

            onCooked(this, this.config.transitionLength);

            clearTimeout(this.timer);
            clearInterval(this.progress);
        },

        _addFromBottom: function(fromBottom) {
            if (!this.$toast.hasClass(this.config.classes.deactivating)) {
                this.isProcessing = true;
                this.$toast.css({ bottom: "+=" + fromBottom + "px"});
                var that = this;
                setTimeout(function() { that.isProcessing = false; }, that.config.transitionLength);
            }
        },

        _progressTick: function(that) {
            that.progressPercent ++;
            that.$toast.find("." + that.config.classes.progressbar).css({ width: 100 - that.progressPercent + "%" });
        },

        _getHeight: function() {
            return this.$toast.outerHeight(true);
        },
    };

    ALLOY.Toastrack = function() {

        var config = {
            limit: 5,
            $container: $('body'),
            class: 'toastrack'
        };

        var toasts = [];
        var rack = [];

        var _enqueue = function(options) {
            var toast = new Toast(options);
            rack.push(toast);
            _tryPop();
        };

        var _tryPop = function() {
            if (rack.length > 0 && !_isProcessing() && !_isFull()) {
                var toast = rack[0];
                rack.splice(0, 1);
                toasts.push(toast);
                _cook(toast);
            }
        };

        var _cook = function(toast) {
            var $toastrack = _getToastrack();
            
            $toastrack.append(toast.$toast);
            setTimeout(function() { toast.activate(_onCooked); });

            // Make room for new toast
            var height = toast.getHeight();
            $.each(toasts, function() { if (this !== toast) { this.addFromBottom(height); } });
        };

        var _getToastrack = function() {
            if ($("." + config.class).length === 0) { config.$container.append('<div class="' + config.class + '"></div>'); }
            return $("." + config.class);
        };

        var _isProcessing = function() {
            var processing = false;
            $.each(toasts, function() { if (this.isProcessing) { processing = true; }});
            return processing;
        };

        var _isFull = function() {
            return toasts.length >= config.limit;
        };

        var _onCooked = function(toast, duration) {
            var height = toast.getHeight();
            var index = toasts.indexOf(toast);

            for(var i = index - 1; i >= 0; i--) { toasts[i].addFromBottom(height * -1); }

            setTimeout(function() {
                index = toasts.indexOf(toast);
                toasts.splice(index, 1);
                _tryPop();
            }, duration);
        };

        var public  = {
            add: _enqueue
        };

        ALLOY.Logger.trace("ALLOY.Toastrack initialized");
        return public;
    }();

})();