    var map;
    var icons = new Map();
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
        icons.set("red", {
            url: "red.png",
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 30)
        });
        icons.set("blue", {
            url: "blue.png",
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 30)
        });
        icons.set("yellow", {
            url: "yellow.png",
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 30)
        });
        icons.set("orange", {
            url: "orange.png",
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 30)
        });
        icons.set("green", {
            url: "green.png",
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 30)
        });

        google.maps.event.addListener(map, "click", function(e) {
            showDistance(e);
        })
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

    function AddMarker(columnNum) {
        this.columnNum = columnNum;
    }
    AddMarker.prototype.add = function(data) {
        var name = "";
        var color = "red";
        if (this.columnNum > 3) {
            name = data[2].trim();
            color = data[3].trim();
        } else if (this.columnNum > 2) {
            name = data[2].trim();
        }
        var marker = new google.maps.Marker({
            map: map,
            position: {
                lat: Number(data[0]),
                lng: Number(data[1])
            },
            title: name,
            icon: icons.get(color)
        });
        google.maps.event.addListener(marker, "click", function(e) {
            showDistance(e);
        });
    }
    $(function() {
        $("#register").click(function() {
            var apiKey = $("#apiKey").val();
            localStorage.setItem("apiKey", apiKey);
            $("body").append($("<script async defer src=\"https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&callback=initMap&libraries=geometry\"><\/script>"));
        });
        $("#addMarkers").click(function() {
            var list = $("#csv").val().split("\n");
            var addMarker = new AddMarker(list[0].split(",").length);
            var latMin = 360;
            var latMax = -360;
            var lonMin = 360;
            var lonMax = -360;
            for (var i in list) {
                var d = list[i].split(",");
                addMarker.add(d);
                latMin = Math.min(latMin, Number(d[0]));
                latMax = Math.max(latMax, Number(d[0]));
                lonMin = Math.min(lonMin, Number(d[1]));
                lonMax = Math.max(lonMax, Number(d[1]));
            }
            var sw = new google.maps.LatLng(latMin, lonMin) ;
            var ne = new google.maps.LatLng(latMax, lonMax) ;
            var latlngBounds = new google.maps.LatLngBounds( sw , ne ) ;
            map.fitBounds(latlngBounds);
        });
        $("#apiKey").val(localStorage.getItem("apiKey"));
    });
