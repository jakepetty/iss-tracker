'use strict'
class Website {
    constructor() {
        let self = this;
        this._map = null;
        this._marker = null;
        $.getScript("https://maps.google.com/maps/api/js?sensor=false&key=AIzaSyByLobYLYqhklGiVYWVuRPbdzhYYkPYO9w", function (a) {
            self.setupMap();
        });
    }
    setupMap() {
        this._map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "all",
                    "stylers": [{ "visibility": "off" }]
                }, {
                    "featureType": "administrative.country",
                    "elementType": "geometry.stroke",
                    "stylers": [{ "visibility": "on" }, { "color": "#363b4a" }, { "lightness": "-30" }]
                }, {
                    "featureType": "administrative.country",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "simplified" }, { "color": "#50b87f" }, { "lightness": "15" }]
                }, {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [{ "visibility": "on" }, { "color": "#363b4a" }, { "lightness": "-30" }]
                }, {
                    "featureType": "administrative.locality",
                    "elementType": "labels",
                    "stylers": [{ "visibility": "simplified" }, { "color": "#363b4a" }, { "lightness": "30" }]
                }, {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{ "color": "#363b4a" }, { "visibility": "simplified" }, { "lightness": "-40" }]
                }, {
                    "featureType": "road.local",
                    "elementType": "geometry.fill",
                    "stylers": [{ "visibility": "on" }, { "color": "#2e323e" }]
                }, {
                    "featureType": "road.local",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "visibility": "on" }, { "color": "#4d5765" }]
                }, {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{ "visibility": "on" }, { "color": "#363b4a" }, { "lightness": "-30" }]
                }
            ]
        });
        this._marker = new google.maps.Marker({
            map: this._map,
            optimized: false,
            icon: new google.maps.MarkerImage('img/iss_marker.png', new google.maps.Size(250, 250), new google.maps.Point(0, 0), new google.maps.Point(250 / 2, 250 / 2))
        });
        this.setupISS(this);
    }
    setupISS(self) {
        $.getJSON('https://api.wheretheiss.at/v1/satellites/25544', function (payload) {
            let latlng = { lat: payload.latitude, lng: payload.longitude };
            self._marker.setPosition(latlng);
            self._map.setCenter(latlng);
            setTimeout(function () {
                self.setupISS(self)
            }, 5000);
        })
    }
}
new Website();