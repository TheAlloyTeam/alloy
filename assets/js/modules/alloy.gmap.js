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
            var that = this;
            $.configretriever("gmap", that.defaults, that.options, that.metadata, { success: function(config) { that._start(config, that); } });
        },

        _start: function(config, that) {
            that.config = config;
            that.config.mapOptions.center = new google.maps.LatLng(that.config.defaultView.lat, that.config.defaultView.lng);
            that.config.mapOptions.zoom = that.config.defaultView.zoom;

            // Create map
            var mapCanvas = that.element;
            that.map = new google.maps.Map(mapCanvas);
            that.map.setOptions(that.config.mapOptions);

            that.infoWindow = new google.maps.InfoWindow();

            // Add markers
            for (var i = 0; i < that.config.markers.length; i++) {
                var m = that.config.markers[i];
                that._addMarker(m.lat, m.lng, m.info, m.args, that);
            }

            ALLOY.Logger.startup('ALLOY.Gmap Started');
        },

        // See https://developers.google.com/maps/documentation/javascript/reference#MarkerOptions
        // for more information on 'args' parameter
        _addMarker: function (lat, lng, info, args, that) {
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