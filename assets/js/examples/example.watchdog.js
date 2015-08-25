require(['watchdog', 'toastrack', 'flash', 'configretriever', 'mustacheretriever'],function () {

    var createRandomPuppy = function() {
        ALLOY.Watchdog.upsertPuppy({
            name: "example-toaster-alert",
            url: "/assets/data/toast.json",
            bite: function(data) {
                var chance = 0.25;
                if (Math.random() > chance) {
                    $.configretriever("toast", undefined, undefined, undefined,
                        { success: function(config) { $.mustacheretriever("toast", config.content, function(html) { ALLOY.Toastrack.add({html: html}); }); }
                    });
                }
            },
            intervalMs: 25000
        });

        ALLOY.Watchdog.upsertPuppy({
            name: "example-flash-alert",
            url: "/assets/data/flash.json",
            bite: function(data) {
                var chance = 0.25;
                if (Math.random() > chance) {
                    $.configretriever("flash", undefined, undefined, undefined,
                        { success: function(config) { $.mustacheretriever("flash", config, function(html) { $.flash({html: html}); }); }
                    });
                }
            },
            intervalMs: 25000
        });

    };

    createRandomPuppy();

})();