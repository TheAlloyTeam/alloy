require(['jquery', 'easing', 'animate', 'animate.emerger', 'accordion'], function ($) {

	exampleBezier();
	exampleDiy();

	exampleEmerger();
	exampleEmergerSquares();
	exampleEmergerEffects();

	exampleFancyAccordion();

	function exampleFancyAccordion() {
		$(".example--fancy-accordion").accordion({
			classes: {
				'title': "card--button",
				'content': "card--content",
                'opened'    : 'open',                   // The class given to open accordion elements (elements with this class on startup will start expanded)
                'closed'    : 'closed',                 // The class given to closed accordion elements
                'opening'   : 'opening',                // The class given to accordion elements in the process of opening
                'closing'   : 'closing',                // The class given to accordion elements in the process of closing
                'disabled'  : 'disabled'                // The class given to accordion elements that cannot have their state altered
			}
		});
	}

	function exampleBezier() {
		var toggled = false;
		var $cssbeziercircle = $(".example--bezier .circle--cssbezier");
		var $jsbeziercircle = $(".example--bezier .circle--jsbezier");

		setInterval(function() {
			var val = 70;
			if (toggled) { val = $cssbeziercircle.parent().width() - 100; }
			toggled = !toggled;

			ALLOY.Animator.animate($cssbeziercircle[0], { left : val + "px" }, 1000, "css");
			ALLOY.Animator.animate($jsbeziercircle[0], { left : val + "px" }, 1000, "js");
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

			ALLOY.Animator.animate($circle[0], props, time);
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
    		ALLOY.Animator.exit($circle[0], { width : 0, height: 0, left: (25 + curLeft) + "px", top: (25 + curTop) + "px" }, 200, undefined, function() {
    			$circle.css({ left: (25 + x) + "px", top: (25 + y) + "px" });
    			setTimeout(function() {
	    			ALLOY.Animator.enter($circle[0], { left: x + "px", top: y + "px", width: "50px", height: "50px" }, 200);
	    		}, 100);
    		});

		});
	}

	function exampleEmerger() {
		$(".example--emerger .emerging").css({ opacity: 0 });
		$(".example--emerger").emerger();

		$(".example__fade--default").click(function(e) {
			e.preventDefault();
			$(".example--emerger .emerging").css({ opacity: 0 });
			$(".example--emerger").emerger();
		});

		$(".example__fade--random").click(function(e) {
			e.preventDefault();
			$(".example--emerger .emerging").css({ opacity: 0 });
			$(".example--emerger").emerger({ order: "random" });
		});
	}

	function exampleEmergerSquares() {
		$(".example--emerger-squares .emerging").css({ opacity: 0 });
		$(".example--emerger-squares").emerger({ order: "diagonal" });

		$(".example__fade--diagonal").click(function(e) {
			e.preventDefault();
			$(".example--emerger-squares .emerging").css({ opacity: 0 });
			$(".example--emerger-squares").emerger({ order: "diagonal" });
		});

		$(".example__fade--vertical").click(function(e) {
			e.preventDefault();
			$(".example--emerger-squares .emerging").css({ opacity: 0 });
			$(".example--emerger-squares").emerger({ order: "vertical" });
		});

		$(".example__fade--verticalchain").click(function(e) {
			e.preventDefault();
			$(".example--emerger-squares .emerging").css({ opacity: 0 });
			$(".example--emerger-squares").emerger({ order: "verticalchain" });
		});
	}

	function exampleEmergerEffects() {
		$(".example--emerger-effects .emerging").css({ opacity: 0 });
		$(".example--emerger-effects").emerger({
			order: "",
			effect: "expansion",
			properties: { }
	 	});

		$(".example__fade--pop").click(function(e) {
			e.preventDefault();
			$(".example--emerger-effects .emerging").css({ opacity: 0 });
			$(".example--emerger-effects").emerger({
				order: "",
				effect: "expansion",
				properties: { }
		 	});
		});

		$(".example__fade--randpop").click(function(e) {
			e.preventDefault();
			$(".example--emerger-effects .emerging").css({ opacity: 0 });
			$(".example--emerger-effects").emerger({
				order: "random",
				effect: "expansion",
				properties: { }
		 	});
		});

		$(".example__fade--slide").click(function(e) {
			e.preventDefault();
			$(".example--emerger-effects .emerging").css({ left: "120%", position: "relative" });
			$(".example--emerger-effects").emerger({
				order: "",
				properties: { left: "0" },
				afterFinal: function() { $(".example--emerger-effects .emerging").css({ position: "" }); }
		 	});
		});

		// Todo
		// $(".example__fade--randslide").click(function(e) {
		// 	e.preventDefault();
		// 	$(".example--emerger-effects .emerging").css({ "margin-left": "120%" });
		// 	$(".example--emerger-effects").emerger({
		// 		order: "random",
		// 		properties: { "margin-left": "20px" }
		//  	});
		// });

	}

})();