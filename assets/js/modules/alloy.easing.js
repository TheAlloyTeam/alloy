(function() {
	ALLOY.Easing = function() {
		
		var defaultAnim = function(t) {
			var easing = window.BezierEasing(0.4, 0, 0.2, 1);
			return easing(t);
		};

		// Extend jquery to include additional easing functions
		$.extend(jQuery.easing, {
			alloy: defaultAnim
		});

    }();
})();
