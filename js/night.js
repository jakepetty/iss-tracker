var nite = {
    map: null,
    date: null,
    sun_position: null,
    earth_radius_meters: 6371008,
    marker_twilight_civil: null,
    marker_twilight_nautical: null,
    marker_twilight_astronomical: null,
    marker_night: null,
    init: function(e) {
        if ("undefined" == typeof google || void 0 === google.maps) throw "Nite Overlay: no google.maps detected";
        this.map = e, this.sun_position = this.calculatePositionOfSun(), nite.marker_twilight_civil = new google.maps.Circle({
            map: nite.map,
            center: nite.getShadowPosition(),
            radius: nite.getShadowRadiusFromAngle(.566666),
            fillColor: "#000",
            fillOpacity: .1,
            strokeOpacity: 0,
            clickable: !1,
            editable: !1
        }), nite.marker_twilight_nautical = new google.maps.Circle({
            map: nite.map,
            center: nite.getShadowPosition(),
            radius: nite.getShadowRadiusFromAngle(6),
            fillColor: "#000",
            fillOpacity: .1,
            strokeOpacity: 0,
            clickable: !1,
            editable: !1
        }), nite.marker_twilight_astronomical = new google.maps.Circle({
            map: nite.map,
            center: nite.getShadowPosition(),
            radius: nite.getShadowRadiusFromAngle(12),
            fillColor: "#000",
            fillOpacity: .1,
            strokeOpacity: 0,
            clickable: !1,
            editable: !1
        }), nite.marker_night = new google.maps.Circle({
            map: nite.map,
            center: nite.getShadowPosition(),
            radius: nite.getShadowRadiusFromAngle(18),
            fillColor: "#000",
            fillOpacity: .1,
            strokeOpacity: 0,
            clickable: !1,
            editable: !1
        })
    },
    getShadowRadiusFromAngle: function(e) {
        return nite.earth_radius_meters * Math.PI * .5 - 2 * nite.earth_radius_meters * Math.PI / 360 * e
    },
    getSunPosition: function() {
        return nite.sun_position
    },
    getShadowPosition: function() {
        return nite.sun_position ? new google.maps.LatLng(-nite.sun_position.lat(), nite.sun_position.lng() + 180) : null
    },
    refresh: function() {
        if (nite.isVisible()) {
            nite.sun_position = nite.calculatePositionOfSun(nite.date);
            var e = nite.getShadowPosition();
            nite.marker_twilight_civil.setCenter(e), nite.marker_twilight_nautical.setCenter(e), nite.marker_twilight_astronomical.setCenter(e), nite.marker_night.setCenter(e)
        }
    },
    jday: function(e) {
        return e.getTime() / 864e5 + 2440587.5
    },
    calculatePositionOfSun: function(e) {
        var t = .017453292519943295,
            a = 1e3 * (60 * (60 * (e = e instanceof Date ? e : new Date).getUTCHours() + e.getUTCMinutes()) + e.getUTCSeconds()) + e.getUTCMilliseconds(),
            i = (nite.jday(e) - 2451545) / 36525,
            n = (280.46646 + i * (36000.76983 + 3032e-7 * i)) % 360,
            o = 357.52911 + i * (35999.05029 - 1537e-7 * i),
            s = n + (Math.sin(t * o) * (1.914602 - i * (.004817 + 14e-6 * i)) + Math.sin(2 * t * o) * (.019993 - 101e-6 * i) + 289e-6 * Math.sin(3 * t * o)) - .00569 - .00478 * Math.sin(125.04 * t - 1934.136 * i),
            l = 23 + (26 + (21.448 - i * (46.815 + i * (59e-5 - .001813 * i))) / 60) / 60 + .00256 * Math.cos(125.04 * t - 1934.136 * i),
            r = Math.asin(Math.sin(t * l) * Math.sin(t * s)) / t,
            p = .016708634 - i * (42037e-9 + 1.267e-7 * i),
            c = Math.tan(t * (l / 2)) * Math.tan(t * (l / 2)),
            d = (a + 6e4 * ((c * Math.sin(2 * t * n) - 2 * p * Math.sin(t * o) + 4 * p * c * Math.sin(t * o) * Math.cos(2 * t * n) - .5 * c * c * Math.sin(4 * t * n) - 1.25 * p * p * Math.sin(2 * t * o)) / t * 4)) % 864e5 / 24e4,
            m = -(d < 0 ? d + 180 : d - 180);
        return new google.maps.LatLng(r, m)
    },
    setDate: function(e) {
        nite.date = e, nite.refresh()
    },
    setMap: function(e) {
        nite.map = e, nite.marker_twilight_civil.setMap(nite.map), nite.marker_twilight_nautical.setMap(nite.map), nite.marker_twilight_astronomical.setMap(nite.map), nite.marker_night.setMap(nite.map)
    },
    show: function() {
        nite.marker_twilight_civil.setVisible(!0), nite.marker_twilight_nautical.setVisible(!0), nite.marker_twilight_astronomical.setVisible(!0), nite.marker_night.setVisible(!0), nite.refresh()
    },
    hide: function() {
        nite.marker_twilight_civil.setVisible(!1), nite.marker_twilight_nautical.setVisible(!1), nite.marker_twilight_astronomical.setVisible(!1), nite.marker_night.setVisible(!1)
    },
    isVisible: function() {
        return nite.marker_night.getVisible()
    }
}