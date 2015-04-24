(function () {

    var defaults = {
        value: "",
        expires: 30,
        path: undefined,
        domain: undefined,
        secure: undefined
    };

    function setCookie(name, options) {
        var config = $.extend({}, defaults, options, undefined);

        var today = new Date();
        today.setTime(today.getTime());
        var expires = config.expires * 1000 * 60 * 60 * 24;
        var expires_date = new Date(today.getTime() + (expires));
        document.cookie = name + '=' + escape(config.value) +
        ((expires) ? ';expires=' + expires_date.toGMTString() : '') + //expires.toGMTString()
        ((config.path) ? ';path=' + config.path : '') +
        ((config.domain) ? ';domain=' + config.domain : '') +
        ((config.secure) ? ';secure' : '');

        ALLOY.Logger.info('Set cookie ' + name + ' with value ' + config.value + ' for ' + config.expires + ' days.');
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    $.readCookie = readCookie;
    $.setCookie = setCookie;
    $.deleteCookie = function(name) { setCookie(name, { value: "", expires: -1 }); ALLOY.Logger.info('Deleted cookie ' + name +'.'); };

})();