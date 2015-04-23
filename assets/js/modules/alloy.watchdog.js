(function() {

    var Puppy = function(options) {
        this.options = options;
        this.interval = undefined;

        this.init = this._init;
        this.start = this._start;
        this.stop = this._stop;
        this.bark = this._bark;
        this.update = this._update;
    };

    Puppy.prototype = {

        defaults: {
            name: undefined,
            url: undefined,
            bite: function(data) { ALLOY.Logger.warn("Puppy '" + this.config.name + "' bite but hasn't been handled."); },
            intervalMs: 60000 // 1 minute by default
        },

        _init: function() {
            this.config = $.extend({}, this.defaults, this.options, undefined);
            this._start();
        },

        _start: function() {
            var that = this;
            if (this.interval === undefined) {
                this.interval = setInterval(function() { that._bark(that); }, that.config.intervalMs);
                ALLOY.Logger.startup("Puppy '" + that.config.name + "' has started.");
            } else {
                ALLOY.Logger.warn("Puppy '" + that.config.name + "' is already running.");
            }
        },

        _stop: function() {
            if (this.interval !== undefined) {
                clearInterval(this.interval);
                this.interval = undefined;
                ALLOY.Logger.startup("Puppy '" + this.config.name + "' has been stopped.");
            } else {
                ALLOY.Logger.warn("Puppy '" + this.config.name + "' is already stopped.");
            }
        },

        _bark: function(that) {
            ALLOY.Logger.log("Puppy '" + that.config.name + "' is biting.");
            $.ajax({
                url: that.config.url,
                dataType: "json",
                contentType: "application/json; charset-utf-8",
                success: that.config.bite,
                error: function(jqXhr, textStatus, errorThrown) {
                    ALLOY.Logger.error("Error barking puppy: '" + that.config.name + "'.");
                }
            });
        },

        _update: function(options) {
            ALLOY.Logger.startup("Puppy '" + this.config.name + "' has been updated and will be restarted.");
            this.config = $.extend({}, this.defaults, this.options, undefined);
            this._stop();
            this._start();
        }
    };

    ALLOY.Watchdog = function () {

        var puppies = {};

        var _startAll = function() {
            for(var i = 0; i < puppies.length; i++) {
                puppies[i].start();
            }
        };

        var _stopAll = function() {
            for(var i = 0; i < puppies.length; i++) {
                puppies[i].stop();
            }
        };

        var _upsertPuppy = function(options) {
            if (puppies[options.name] === undefined) {
                _insertPuppy(options);
            } else {
                _updatePuppy(options);
            }
        };

        var _insertPuppy = function(options) {
            var puppy = new Puppy(options);
            puppies[options.name] = puppy;
            puppy.init();
        };

        var _updatePuppy = function(options) {
            var puppy = puppies[options.name];
            puppy.update(options);
        };

        var public = {
            stopAll: _stopAll,
            startAll: _startAll,
            upsertPuppy: _upsertPuppy
        };

        ALLOY.Logger.trace("ALLOY.Watchdog initialised");
        return public;
    }();

})();
