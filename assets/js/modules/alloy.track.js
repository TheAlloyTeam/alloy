(function () {

    ALLOY.Track = function () {
        var filters = ['localhost', '128.0.0.1', 'gotdns.com'];

        var defaults = {
            accountId: undefined,
            trackDataAttr: "track",
        };

        var defaultEvent = {
            category: "",
            action: "",
            label: ""
        };

        var _isDevEnv = function () {
            var url = window.location.href;
            for (var i = 0; i < filters.length; i++) {
                if (url.indexOf(filters[i]) >= 0) { return true; }
            }

            return false;
        };

        var isDevEnv = _isDevEnv();

        var _log = function (text) {
            if (isDevEnv) {
                text = "ALLOY.Track - Dev Mode - Events are not being sent - " + text;
            }
            ALLOY.Logger.info(text);
        };

        var _init = function (args) {
            this.config = $.extend({}, defaults, args);

            if (!isDevEnv) {
                window.ga('create', this.config.accountId);
                window.ga('send', 'pageview');
            }

            _log("ALLOY.Track Initialised with account id: '" + this.config.accountId + "' and page view has been triggered.");
        };

        var _sendEvent = function (event) {
            _log("ALLOY.Track - Sending event: category: '" + event.category + "', action: '" + event.action + "', label: '" + event.label + "'");
            if (!isDevEnv) { window.ga('send', 'event', event.category, event.action, event.label); }
        };

        var _addEvent = function (element) {
            var event = $(element).data(this.config.trackDataAttr);
            event = $.extend({}, this.defaultEvent, event);
            $(element).click(function () { _sendEvent(event); });
        };

        var public = {
            init: _init,
            addEvent: _addEvent,
            sendEvent: _sendEvent
        };

        return public;
    }();

    $.fn.track = function (options) {
        return this.each(function () {
            ALLOY.Track.addEvent(this);
        });
    };
})();
