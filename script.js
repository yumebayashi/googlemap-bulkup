    var map;
    var points = [];
    var polyLineOptions = {
        path: null,
        strokeWeight: 4,
        strokeColor: "black",
        strokeOpacity: "0.8"
    };
    var initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: {
                lat: 35.6841,
                lng: 139.7524
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false
        });
        // google.maps.event.addListener(map, "click", function(e) {
        //     showDistance(e);
        // })
    }

    var showDistance = function(e) {
        points.push(e.latLng);

        if (points.length > 1) {
            polyLineOptions.path = points;

            var poly = new google.maps.Polyline(polyLineOptions);
            google.maps.event.addListener(poly, "click", function(e) {
                poly.setMap(null);
            });
            poly.setMap(map);

            var distance = google.maps.geometry.spherical.computeDistanceBetween(points[0], points[1]);
            var mLat = (points[0].lat() + points[1].lat()) / 2;
            var mLng = (points[0].lng() + points[1].lng()) / 2;
            var infoWindow = new google.maps.InfoWindow({
                content: points[0].lat().toFixed(5) + "," + points[0].lng().toFixed(5) + "<br>" + points[1].lat().toFixed(5) + "," + points[1].lng().toFixed(5) + "<br>" + distance.toFixed(1) + " m",
                position: new google.maps.LatLng(mLat, mLng)
            });
            infoWindow.setMap(map);
            google.maps.event.addListener(infoWindow, "closeclick", function() {
                poly.setMap(null);
            });
            points.length = 0;
        }
    }
    var markers = [];

    function AddMarker(columnNum) {
        this.columnNum = columnNum;
    }
    AddMarker.prototype.add = function(data) {
        if (data == "") return;
        var name = "";
        var color = "";
        
        if (this.columnNum > 2) {
            name = data[2].trim();
            color = "hsl(" + parseInt(string_to_utf8_hex_string(name.slice(0, 3)), 16) % 360 + ", 100%, 60%)";
        }
        
        var marker = new google.maps.Marker({
            map: map,
            position: {
                lat: Number(data[0]),
                lng: Number(data[1])
            },
            title: name,
            icon: {
                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                scale: 5,
                fillColor: color,
                fillOpacity: 0.8,
                strokeWeight: 2
            }
        });
        markers.push(marker);
        google.maps.event.addListener(marker, "click", function(e) {
            showDistance(e);
        });
    }

    function register() {
        var apiKey = $("#apiKey").val();
        localStorage.setItem("apiKey", apiKey);
        $("body").append($("<script async defer src=\"https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=initMap&libraries=geometry\"><\/script>"));
    }
    $(function() {
        $("#register").click(function() {
            register();
        });
        $("#addMarkers").click(function() {
            var list = $("#csv").val().split("\n");
            var addMarker = new AddMarker(list[0].split(",").length);
            for (var i in list) {
                var d = list[i].split(",");
                addMarker.add(d);
            }
        });
        $("#delMarkers").click(function() {
            for (var i in markers) {
                markers[i].setMap(null);
            }
            markers = [];
        });
        $("#apiKey").val(localStorage.getItem("apiKey"));
        register();
    });

    function string_to_utf8_hex_string(text) {
        var bytes1 = string_to_utf8_bytes(text);
        var hex_str1 = bytes_to_hex_string(bytes1);
        return hex_str1;
    }

    function string_to_utf8_bytes(text) {
        var result = [];
        if (text == null)
            return result;
        for (var i = 0; i < text.length; i++) {
            var c = text.charCodeAt(i);
            if (c <= 0x7f) {
                result.push(c);
            } else if (c <= 0x07ff) {
                result.push(((c >> 6) & 0x1F) | 0xC0);
                result.push((c & 0x3F) | 0x80);
            } else {
                result.push(((c >> 12) & 0x0F) | 0xE0);
                result.push(((c >> 6) & 0x3F) | 0x80);
                result.push((c & 0x3F) | 0x80);
            }
        }
        return result;
    }

    function bytes_to_hex_string(bytes) {
        var result = "";

        for (var i = 0; i < bytes.length; i++) {
            result += byte_to_hex(bytes[i]);
        }
        return result;
    }

    function byte_to_hex(byte_num) {
        var digits = (byte_num).toString(16);
        if (byte_num < 16) return '0' + digits;
        return digits;
    }
