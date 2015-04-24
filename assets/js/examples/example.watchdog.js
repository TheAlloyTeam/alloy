require(['watchdog', 'toast', 'flash', 'configretriever'],function () {

    var createRandomPuppy = function() {
        ALLOY.Watchdog.upsertPuppy({
            name: "example-toaster-alert",
            url: "/assets/data/toast.json",
            bite: function(data) {
                var chance = 0.25;
                if (Math.random() > chance) {
                    $.configretriever("toast", undefined, undefined, undefined, { success: function(config) { $.toast(config.content); } } );
                }
            },
            intervalMs: 25000
        });

        ALLOY.Watchdog.upsertPuppy({
            name: "example-flash-alert",
            url: "/assets/data/flash.json",
            bite: function(data) {
                var chance = 0.95;
                if (Math.random() > chance) {
                    $.configretriever("flash", undefined, undefined, undefined, { success: function(config) { $.flash(config.content); } } );
                }
            },
            intervalMs: 60000
        });

    };

    createRandomPuppy();

})();