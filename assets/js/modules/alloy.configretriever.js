(function () {

    var mydefaults = {
        jsonDirectory: '/assets/data/',
        success: function(data) { }
    };

    function handleResponse(data, myconfig) {
        ALLOY.Logger.info("ConfigRetriever: Found " + data.length + " results");
        var random = Math.floor(Math.random() * (data.length));
        myconfig.success(data[random]);
    }

    $.configretriever = function (filename, theirdefaults, theiroptions, theirmetadata, myoptions) {
        // If we are in dev mode and no options have been set, then get a default from json store
        if (window.DEV && theiroptions === undefined && theirmetadata === undefined) {

            var myconfig = $.extend({}, mydefaults, myoptions, undefined);
            var file = myconfig.jsonDirectory + filename + ".json";

            ALLOY.Logger.info("ConfigRetriever: Retrieving dev data from: " + file);

            $.ajax({
                url: file,
                dataType: "json",
                contentType: "application/json; charset-utf-8",
                success: function(data) { handleResponse(data, myconfig); },
                error: function(jqXhr, textStatus, errorThrown) {
                    ALLOY.Logger.error("Error retrieving json: " + errorThrown);
                }
            });

        // Otherwise something has been set so just merge them together and return
        } else {
            ALLOY.Logger.info("ConfigRetriever: Config for " + filename + " was defined and used.");
            var theirconfig = $.extend({}, theirdefaults, theiroptions, theirmetadata);
            myoptions.success(theirconfig);
            return;
        }
    };

})();