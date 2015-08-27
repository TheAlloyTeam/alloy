(function() {

	ALLOY.Animator = function() {
		/***** Variables *****/
		var styles = [];

		var cssTransitions = {
			curve: "cubic-bezier(0.4, 0, 0.2, 1)",
			enter: "cubic-bezier(0.4, 0, 1, 1)",
			exit: "cubic-bezier(0, 0, 0.6, 1)"
		};

		var jsEasings = {
			curve: "alloy",
			enter: "alloy",
			exit: "alloy"
		};

		var transitionsSupported = ('transition' in document.documentElement.style) || ('WebkitTransition' in document.documentElement.style);

		// Ensure that init is called on startup
		_init();

		/***** Return public functions *****/
		var public = {
			animate: curve,
			enter: enter,
			exit: exit
		};

		return public;

		/***** Public functions *****/
		function curve(el, properties, time, method, callback) {
			_animate(el, properties, time, method, callback, "curve");
		}

		function enter(el, properties, time, method, callback) {
			_animate(el, properties, time, method, callback, "enter");
		}

		function exit(el, properties, time, method, callback) {
			_animate(el, properties, time, method, callback, "exit");
		}

		/***** Private functions *****/
		function _animate(el, properties, time, method, callback, type) {
			if (method !== "css" && method !== "js") { method = _chooseBestAnimationMethod(); }

			var props = _setProperties(el, properties);

			if (method === "css" && transitionsSupported) { _animateCss($(el), props, time, callback, type); }
			else if (method === "js") { _animateJs($(el), props, time, callback, type); }
		}

		function _chooseBestAnimationMethod() {
			return transitionsSupported ? "css" : "js";
		}

		function _setProperties(el, properties) {
			var props = $.extend({}, properties);	// Clone the object so that it doesn't override anything in a calling function

			if ("width" in props && props.width === "full") {
				var oldwidth = $(el).width();
				$(el).css({ width: "" });
				var setwidth = $(el).width();
				$(el).css({ width: oldwidth });
				props.width = setwidth + "px";
			}

			if ("height" in props && props.height === "full") {
				var oldheight = $(el).height();
				$(el).css({ height : "" });
				var setheight = $(el).height();
				$(el).css({ height : oldheight });
				props.height = setheight + "px";
			}

			return props;
		}

		function _animateCss($el, properties, time, callback, type) {
			// Get a classname that is descriptive and unique to this animation
			var propertiesname = "";
			for (var key in properties) { propertiesname += key + "_"; }
			propertiesname = propertiesname.slice(0, propertiesname.length - 1);

			var cssClass = "anim__" + propertiesname + "--" + type + "-t" + time + "ms";

			// Add the new style rule to the custom style tag
			if (styles.indexOf(cssClass) < 0) { _createStyle(cssClass, properties, time, cssTransitions[type]); }

			// Apply the animation class to the element, alter the properties, then remove the class after the timeout expires
			$el.addClass(cssClass).css(properties);
			setTimeout(function() {
				$el.removeClass(cssClass);
				if (callback !== undefined) { callback(); }
			}, time);
		}

		function _createStyle(cssClass, properties, time, transition) {
			styles.push(cssClass);

			var props = "";
			for (var key in properties) { props = props + key + " " + time + "ms " + transition + ","; }
			props = props.slice(0, props.length - 1);

			var style = "." + cssClass + "{ -webkit-transition: " + props + ";  " +
    										"-moz-transition: " + props + ";  "  +
    										"transition: " + props + "; }";
    		$(".alloy-animations").append(style);
		}

		function _animateJs($el, properties, time, callback, type) {
			$el.animate(properties, time, jsEasings[type], callback);
		}

		function _init() {
			// Create a style tag in the head to store our custom animation classes
			var style = $('<style class="alloy-animations"></style>');
			$("html > head").append(style);
		}
	}();

})();