require(['watchdog', 'toastrack', 'flash', 'configretriever'],function () {

    var createRandomPuppy = function() {
        ALLOY.Watchdog.upsertPuppy({
            name: "example-toaster-alert",
            url: "/assets/data/toast.json",
            bite: function(data) {
                var chance = 0.25;
                if (Math.random() > chance) {
                    $.configretriever("toast", undefined, undefined, undefined,
                        { success: function(config) {
                            $.mustacheretriever("toast", config.content, function(html) {
                                ALLOY.Toastrack.add({html: html});
                            });
                        }
                    });
                }
            },
            intervalMs: 5000
        });

        ALLOY.Watchdog.upsertPuppy({
            name: "cool-cats",
            url: "/assets/data/toast.json",
            bite: function(data) {
                var chance = 0.95;
                if (Math.random() > chance) {
                    var config = {"item": {"modifier": "","status": "warn" },"content": {"text": "The ALLOY Team are some pretty cool cats!","icon": [{"item": {"modifier": "round52","size": "xlarge"},"content": {"title": ""}}]}};
                    $.flash(config);
                }
            },
            intervalMs: 5000
        });

    };

    createRandomPuppy();

})();