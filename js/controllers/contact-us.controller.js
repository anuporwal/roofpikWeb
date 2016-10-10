app.controller('contactUsCtrl', function() {
    console.log("contact Working");

    // function myMap() {
        var mapCanvas = document.getElementById("map");
        var mapOptions = {
            center: new google.maps.LatLng(28.406697, 77.041681),
            zoom: 16
        }
        var map = new google.maps.Map(mapCanvas, mapOptions);
    // }
});
