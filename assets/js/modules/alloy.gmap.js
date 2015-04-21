(function () {

    var Gmap = function (element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
        this.metadata = this.$element.data('gmap');

        this.map = {};
        this.infoWindow = {};
        this.markers = [];
    };

    Gmap.prototype = {

        defaults: {
            defaultView: {
                lat: 51.4531659,
                lng: -2.5984168,
                zoom: 14
            },
            markers: [],    // Format of {lat: 51.443221, lng: -2.567437, info: '<p>This is Element78 HQ</p>', args: {}}
            mapOptions: {}  // See https://developers.google.com/maps/documentation/javascript/reference#MapOptions for more information on 'mapOptions' parameter
        },

        _init: function () {
            this.config = $.extend({}, this.defaults, this.options, this.metadata);
            this.config.mapOptions.center = new google.maps.LatLng(this.config.defaultView.lat, this.config.defaultView.lng);
            this.config.mapOptions.zoom = this.config.defaultView.zoom;

            // Create map
            var mapCanvas = this.element;
            this.map = new google.maps.Map(mapCanvas);
            this.map.setOptions(this.config.mapOptions);

            this.infoWindow = new google.maps.InfoWindow();

            // Add markers
            for (var i = 0; i < this.config.markers.length; i++) {
                var m = this.config.markers[i];
                this._addMarker(m.lat, m.lng, m.info, m.args);
            }

            ALLOY.Logger.startup('ALLOY.Gmap Started');
        },

        // See https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions
        // for more information on 'args' parameter
        _addMarker: function (lat, lng, info, args) {
            var that = this;

            args.position = new google.maps.LatLng(lat, lng);

            var marker = {
                info: info,
                isVisible: true,
                gmarker: new google.maps.Marker(args)
            };

            marker.gmarker.setMap(that.map);
            that.markers.push(marker);

            if (info !== undefined && info !== '') {
                // If the marker is clicked inside the info window
                google.maps.event.addListener(marker.gmarker, 'click', function() {
                    that.infoWindow.setContent(marker.info);
                    that.infoWindow.open(that.map, marker.gmarker);

                    // If anything is clicked in the map, then hide the info window...
                    google.maps.event.addListener(that.map, 'click', function () {
                        that.infoWindow.close();

                        // ...and remove the event to hide the info window on map click
                        google.maps.event.clearListeners(that.map, 'click');
                    });
                });
            }
        }
    };

    Gmap.defaults = Gmap.prototype.defaults;

    $.fn.gmap = function (options) {
        return this.each(function () {
            new Gmap(this, options)._init();
        });
    };
})();