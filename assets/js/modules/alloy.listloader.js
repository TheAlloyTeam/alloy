(function () {

    $.listloader = function (options) {

        var defaults = {
            url: undefined,                     // Required - the url to retrieve the json list of items
            mustacheTemplate: undefined,        // Required - the template to apply to each item in the json list
            data: {},                           // Any parameters to pass through in the request
            classes: {
                list: "newslist",               // The class selector for the list to load items into
                listexpanding: "expanding",     // The class to give the list when it is expanding
                listclosing: "closing",         // The class to give the list when it is closing
                inserting: "inserting",         // The class to give items that are in the process of being inserted to the list
                inserted: "inserted",           // The class to give items that have been inserted into the list
                removing: "removing",           // The class to give items that are in the process of being removed from the list
                removed: "removed"              // The class to give items that have been removed from the list
            },
            timeoutBetween: 200,                // The timeout between insertion into the list of each item returned from the json request
            cardInsertingTime: 400,             // The length of time it takes for an item to transition on insertion to the list
            cardRemovingTime: 400,              // The length of time it takes for an item to transition on removal from the list
            listHeightPause: 200,               // The length of the pause (in milliseconds) before setting the new height of the list element
            clearList: false,                   // Whether to remove all items from the list before adding new items, default is false
            beforeInsert: undefined             // The optional function to call when the data has been retrieved
        };

        function bringInMore(template, json, config, $list, newHeight) {

            $list.addClass(config.classes.listclosing).removeClass(config.classes.listexpanding);

            $.each(json, function (index, obj) {
                var html = window.Mustache.render(template, obj);
                var $item = $(html);
                $list.append($item);

                setTimeout(function () {
                    var addHeight = $item.height();
                    newHeight += addHeight;

                    $item.addClass(config.classes.inserting);

                    setTimeout(function () {
                        $list.css({ height: newHeight + "px" });
                        $item.addClass(config.classes.inserted).removeClass(config.classes.inserting);
                        setTimeout(function () { $item.removeClass(config.classes.inserted); }, config.cardInsertingTime);
                    }, (index * config.timeoutBetween));

                }, config.listHeightPause);
            });
        };

        function onTemplateRetrieved(template, json, config) {
            var $list = $("." + config.classes.list);

            // Ensure that height of the list stays the same
            $list.css({ height: $list.height() + "px" });
            var newHeight = $list.height();

            // Make sure that the function to call once data has been retrieved is called
            if (config.beforeInsert !== undefined) { config.beforeInsert(json, template); }

            // Clear the list before bringing in more items
            if (config.clearList) {

                $list.addClass(config.classes.listclosing).removeClass(config.classes.listexpanding);

                var $children = $list.children();

                // Loop through the list backwards so that they are removed from bottom to top
                $($children.get().reverse()).each(function (index) {
                    var $item = $(this);

                    var removeHeight = $item.height();
                    newHeight -= removeHeight;
                    if (newHeight < 0) { newHeight = 0; }
                    $list.css({ height: newHeight + "px" });

                    $(this).addClass(config.classes.removing).removeClass(config.classes.inserted).removeClass(config.classes.inserting);

                    setTimeout(function () {

                        $item.addClass(config.classes.removed).removeClass(config.classes.removing);
                        setTimeout(function () {
                            $item.remove();
                            if (index == $children.length - 1) { bringInMore(template, json, config, $list, newHeight); }
                        }, config.cardRemovingTime);

                    }, index * config.timeoutBetween);
                });
            } else {
                bringInMore(template, json, config, $list, newHeight);
            }
        };

        function onJsonRetrieved(json, config) {
            // Get the template to put the list of json objects into
            $.ajax({
                url: config.mustacheTemplate,
                dataType: "text",
                contentType: "text/x-handlebars-template",
                success: function (template) { onTemplateRetrieved(template, json, config); },
                error: function (jqXhr, textStatus, errorThrown) {
                    ALLOY.Logger.error("ALLOY.ListLoader - Error retrieving mustache template: " + errorThrown);
                }
            });
        };

        function doGet(args) {
            var config = $.extend({}, defaults, args, undefined);
            if (config.url === undefined) { ALLOY.Logger.error("ALLOY.ListLoader: url is a required config value."); return; }
            if (config.mustacheTemplate === undefined) { ALLOY.Logger.error("ALLOY.ListLoader - mustacheTemplate is a required config value."); return; }

            // Go and get json and template from server
            $.ajax({
                url: config.url,
                data: config.data,
                dataType: "json",
                contentType: "application/json; charset-utf-8",
                success: function (json) { onJsonRetrieved(json, config); },
                error: function (jqXhr, textStatus, errorThrown) {
                    ALLOY.Logger.error("ALLOY.ListLoader - Error retrieving more news posts: " + errorThrown);
                }
            });
        };

        doGet(options);
    };

})();