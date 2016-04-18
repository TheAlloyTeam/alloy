(function () {

    var STATES = {
        AUTO: "AUTO",
        HOVER: "HOVER",
        LEFT: "LEFT",
        RIGHT: "RIGHT",
        STOP: "STOP"
    };

    var EndlessSlider = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('options');

        this.state = STATES.AUTO;
        this.currentSpeed = 0;
        this.listenForMouseUp = false;
        this.totalWidth = 0;
        this.wrapperWidth = 0;
    };

    EndlessSlider.prototype = {
        defaults: {
            autoSpeed: -2.5,
            hoverSpeed: 0,
            buttonSpeed: -5,
            acceleration: 0.05
        },

        _init: function () {
            this.config = $.extend(true, {}, this.defaults, this.options, this.metadata);

            this._initWrapper();
            this._initEvents();

            setInterval(this._onTick, 1000 / 60, this);
        },

        _initWrapper: function () {
            // Find the ul and get its width
            var $ul = this.$element.find("ul");
            $ul.css({ width: "" });
            this.wrapperWidth = $ul.width();

            // Create or retrieve wrapper and set to correct width
            var $wrapper = this.$element.find(".wrapper");
            if ($wrapper.length === 0) {
                $ul.wrap("<div class='wrapper'></div>");
                $wrapper = this.$element.find(".wrapper");
            }
            $wrapper.css({ width: "100%", overflow: "hidden" });

            // Find the width of all the images and set ul to correct width
            var $images = $ul.find("li");
            this.totalWidth = 0;
            var that = this;
            $images.each(function () {
                that.totalWidth += $(this).outerWidth(true);
            });

            $ul.css({ width: this.totalWidth + "px", position: "relative", left: "0" });
        },

        _initEvents: function () {
            var that = this;

            // On hover
            this.$element.hover(
                function () { that.state = STATES.HOVER; },
                function () { that.state = STATES.AUTO; });

            // On clicks
            this.$element.find(".scroll-left")
                .mousedown(function (e) {
                    e.preventDefault();
                    that.state = STATES.LEFT;
                    that.listenForMouseUp = true;
                }).on('mousedown click', function (e) {
                    e.preventDefault();
                });

            this.$element.find(".scroll-right")
                .mousedown(function (e) {
                    e.preventDefault();
                    that.state = STATES.RIGHT;
                    that.listenForMouseUp = true;
                }).on('mousedown click', function (e) {
                    e.preventDefault();
                });

            // On click end
            $('html').mouseup(function () {
                if (that.listenForMouseUp) {
                    that.state = STATES.STOP;
                    that.listenForMouseUp = false;
                }
            });

            $(window).resize(function () {
                that._initWrapper();
            });
        },

        _onTick: function (that) {
            if (that.totalWidth > that.wrapperWidth) {
                that._setSpeed();
                that._moveBy(that.currentSpeed);
            }
        },

        _setSpeed: function () {
            var goTowards = this._getGoTowards();
            var acc = Math.abs(this.config.acceleration);

            // If the current speed is less than we want, add on acceleration and if we are now too big then set to wanted value
            // Else if the current speed is more than we want, remove acceleration and if we are now too small then set to wanted value
            if (this.currentSpeed < goTowards) {
                this.currentSpeed += acc;
                if (this.currentSpeed > goTowards) { this.currentSpeed = goTowards; }
            } else if (this.currentSpeed > goTowards) {
                this.currentSpeed -= acc;
                if (this.currentSpeed < goTowards) { this.currentSpeed = goTowards; }
            }
        },

        _getGoTowards: function () {
            switch (this.state) {
                case STATES.AUTO:
                    return this.config.autoSpeed;
                case STATES.HOVER:
                    return this.config.hoverSpeed;
                case STATES.LEFT:
                    return this.config.buttonSpeed;
                case STATES.RIGHT:
                    return this.config.buttonSpeed * -1;
                case STATES.STOP:
                    return 0;
            }
        },

        _moveBy: function (amount) {
            if (amount === 0) { return; }

            var $ul = this.$element.find("ul");
            var oldLeft = parseFloat($ul.css("left"));
            var newLeft = oldLeft + amount;
            var absLeft = Math.abs(newLeft);

            var goingRight = amount > 0;

            var $notClones = $ul.find("li").not(".clone");
            var $first = $notClones.first();
            var $second = $($notClones[1]);
            var $last = $notClones.last();
            var $clones = $ul.find("li.clone");

            var $newclone;

            if (goingRight) {
                // Moving right

                // If we are off the right of the screen, then:
                var posLeft = $last.position().left + newLeft;
                if (posLeft + $last.outerWidth(true) * 1.5 > this.totalWidth) {
                    //      move (real) last element to the beginning of the ul
                    $last.prependTo($ul);
                    newLeft -= $last.outerWidth(true);

                    //      create a clone of the (real) last element to append to the end of the ul
                    $newclone = $last.clone();
                    $newclone.addClass("clone");
                    if ($clones.length === 0) {
                        $newclone.appendTo($ul);
                    } else {
                        $newclone.insertBefore($clones.first());
                    }
                    $ul.css({ width: "+=" + $newclone.outerWidth(true) + "px" });

                    //      remove last clone (if it is off the screen)
                    if ($clones.length > 0) {
                        var clonePosLeft = $clones.last().position().left + newLeft;
                        if (clonePosLeft > this.wrapperWidth) {
                            $ul.css({ width: "-=" + $clones.last().outerWidth(true) + "px" });
                            $clones.last().remove();
                        }
                    }
                }
            } else {
                // Moving left

                if ($clones.length === 0) {
                    //      create a clone of the first element to append to the end of the ul
                    $newclone = $first.clone();
                    $newclone.addClass("clone");
                    $newclone.appendTo($ul);
                    $ul.css({ width: "+=" + $newclone.outerWidth(true) + "px" });
                }

                // If we are off the left of the screen, then:
                var firstWidth = $first.outerWidth(true);
                if (Math.abs(newLeft) > firstWidth * 1.5) {
                    //      move (real) first element to the end of the ul
                    $first.appendTo($ul);
                    newLeft += $first.outerWidth(true);

                    //      remove all clones
                    var clonesWidth = 0;
                    $clones.each(function () { clonesWidth += $(this).outerWidth(true); });
                    $clones.remove();
                    $ul.css({ width: "-=" + clonesWidth + "px" });

                    //      create a clone of the new first element to append to the end of the ul
                    $newclone = $second.clone();
                    $newclone.addClass("clone");
                    $newclone.appendTo($ul);
                    $ul.css({ width: "+=" + $newclone.outerWidth(true) + "px" });
                }
            }

            $ul.css({ left: newLeft + "px" });
        }
    };

    EndlessSlider.defaults = EndlessSlider.prototype.defaults;

    $.fn.endlessslider = function (options) {
        return this.each(function () {
            new EndlessSlider(this, options)._init();
        });
    };
})();