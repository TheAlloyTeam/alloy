require(['jquery', 'easing', 'animate'], function ($) {

	exampleBezier();
	exampleDiy();

	function exampleBezier() {
		var toggled = false;
		var $cssbeziercircle = $(".example--bezier .circle--cssbezier");
		var $jsbeziercircle = $(".example--bezier .circle--jsbezier");

		setInterval(function() {
			var val = 70;
			if (toggled) { val = $cssbeziercircle.parent().width() - 100; }
			toggled = !toggled;

			ALLOY.Animate.animate($cssbeziercircle[0], { left : val + "px" }, 1000, "css");
			ALLOY.Animate.animate($jsbeziercircle[0], { left : val + "px" }, 1000, "js");
		}, 1500);
	}

	function exampleDiy() {
		var $circle = $(".example--diy .circle");

		// Allow the user to submit how the circle should animate
		$(".animform").submit(function(e) {
			e.preventDefault();

			var prop = $(".animform__property").val();
			var value = $(".animform__value").val();
			var time = $(".animform__time").val();

			var props = {};
			props[prop] = value;

			ALLOY.Animate.animate($circle[0], props, time);
		});

		// On click in the example area, exit the circle and enter it where the click occurred
		$(".example--diy").mousedown(function(e) {

			var x;
			var y;
    		if (e.pageX !== undefined) { x = e.pageX; y = e.pageY; }
    		else { x = e.originalEvent.touches[0].pageX; y=e.originalEvent.touches[0].pageY; }

    		var offset = $(".example--diy").offset();
    		x = x - offset.left - 25;
    		y = y - offset.top - 25;

    		// Ensure that the circle is expanding from its center by adding a margintop and left of half its width and height
    		var curLeft = parseInt($circle.css("left"));
    		var curTop = parseInt($circle.css("top"));
    		ALLOY.Animate.exit($circle[0], { width : 0, height: 0, left: (25 + curLeft) + "px", top: (25 + curTop) + "px" }, 200, undefined, function() {
    			$circle.css({ left: (25 + x) + "px", top: (25 + y) + "px" });
    			setTimeout(function() {
	    			ALLOY.Animate.enter($circle[0], { left: x + "px", top: y + "px", width: "50px", height: "50px" }, 200);
	    		}, 100);
    		});

		});
	}

})();