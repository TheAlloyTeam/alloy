require(['jquery', 'easing'], function ($) {

	exampleBezier();



	function exampleBezier() {
		var toggled = false;
		var $cssbeziercircle = $(".example--bezier .circle--cssbezier");
		var $jsbeziercircle = $(".example--bezier .circle--jsbezier");

		setInterval(function() {
			var val = 70;
			if (toggled) { val = $cssbeziercircle.parent().width() - 100; }
			toggled = !toggled;
			$cssbeziercircle.css({ left: val + "px" });
			$jsbeziercircle.animate({ left: val + "px"}, 1000, 'alloy');
		}, 1500);
	}
})();