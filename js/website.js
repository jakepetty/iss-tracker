'use strict'
class Website {
    constructor() {
        let self = this;
        this._map = null;
        this._issMarker = null;
        this._homeMarker = null;
        this._geocoder = null;
        $.getScript("https://maps.google.com/maps/api/js?sensor=false&key=AIzaSyByLobYLYqhklGiVYWVuRPbdzhYYkPYO9w&libraries=geometry", function (a) {
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
                    "stylers": [{ "visibility": "on" }, { "color": "#8c99bf" }, { "lightness": "-30" }]
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

        this._geocoder = new google.maps.Geocoder()
        this._issMarker = new google.maps.Marker({
            map: this._map,
            optimized: false,
            icon: new google.maps.MarkerImage('img/iss_marker.png', new google.maps.Size(250, 250), new google.maps.Point(0, 0), new google.maps.Point(250 / 2, 250 / 2))
        });

        this._homeMarker = new google.maps.Marker({
            map: this._map,
            optimized: false,
            icon: new google.maps.MarkerImage('img/home_marker.png', new google.maps.Size(52, 52), new google.maps.Point(0, 0), new google.maps.Point(52 / 2, 52 / 2)),
            position: {
                lat: 41.978119,
                lng: -91.667814
            }
        });
        this.setupISS(this);
    }
    setupISS(self) {
        $.getJSON('https://api.wheretheiss.at/v1/satellites/25544?units=miles', function (payload) {
            let latlng = { lat: payload.latitude, lng: payload.longitude };
            self._issMarker.setPosition(latlng);

            let bounds = new google.maps.LatLngBounds();
            bounds.extend(self._issMarker.getPosition());
            bounds.extend(self._homeMarker.getPosition());
            self._map.fitBounds(bounds);

            self._geocoder.geocode({ location: latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    let addrComponents = results[0].address_components;
                    let location;
                    for (let i = 0; i < addrComponents.length; i++) {
                        if (addrComponents[i].types[1] == "political") {
                            location = addrComponents[i].long_name + ', ';
                        }
                        if (addrComponents[i].types[0] == "country") {
                            location += addrComponents[i].long_name;
                        }
                    }
                    $('#iss-location').text(location);
                } else {
                    $('#iss-location').text("Over an Ocean");
                }
            });
            var distance = google.maps.geometry.spherical.computeDistanceBetween(self._homeMarker.getPosition(), self._issMarker.getPosition()) * 0.000621371;
            $("#iss-distance").text(Number(distance.toFixed()).toLocaleString("en-US")).append("<span class='units'>miles</span>")
            $('#iss-velocity').text(Number(payload.velocity.toFixed()).toLocaleString("en-US")).append("<span class='units'>mph</span>")
            $('#iss-altitude').text(Number(payload.altitude.toFixed()).toLocaleString("en-US")).append("<span class='units'>miles</span>")
            setTimeout(function () {
                self.setupISS(self)
            }, 5000);
        })
    }
}
new Website();