require(['watchdog', 'toast', 'configretriever'],function () {

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
            intervalMs: 5000
        });
    };

    createRandomPuppy();

})();