(function() {

    var defaults = {
        templateDirectory: '/assets/templates/',
        success: function(html) { }
    };

    function handleResponse(template, json, onResponse) {
        ALLOY.Logger.info("MustacheRetriever: Retrieved mustache template");
        var html = window.Mustache.render(template, json);
        onResponse(html);
    }

    $.mustacheretriever = function(filename, json, onResponse, options) {
        var config = $.extend({}, defaults, options, undefined);
        var file = config.templateDirectory + filename + ".hbs";
        ALLOY.Logger.info("MustacheRetriever: Retrieving template from: " + file);

        $.ajax({
            url: file,
            dataType: "text",
            contentType: "text/x-handlebars-template",
            success: function(data) { handleResponse(data, json, onResponse); },
            error: function(jqXhr, textStatus, errorThrown) {
                ALLOY.Logger.error("Error retrieving mustache template: " + errorThrown);
            }
        });
    };

})();
