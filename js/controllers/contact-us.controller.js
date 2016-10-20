app.controller('contactUsCtrl', function($timeout) {
    console.log("contact Working");

    $('.md-header').hide();
    $('.contact-us-page').hide();
    $('.footer').hide();
    
	$timeout(function() {
        $('.md-header').fadeIn();
        myMap();
        $('.contact-us-page').fadeIn();
        $('.footer').fadeIn();

    }, 500);

    function myMap() {
    	var bounds = new google.maps.LatLngBounds();
        var mapCanvas = document.getElementById("map");
        var mapOptions = {
            center: new google.maps.LatLng(28.406697, 77.041681),
            zoom: 16
        }
        var map = new google.maps.Map(mapCanvas, mapOptions);
        var position = new google.maps.LatLng(28.406827,77.042364);
        bounds.extend(position);

		var contentString = '<div id="content">'+
            '<div id="bodyContent">'+
            '<div class="roofpik-logo" style="text-align:center;">'+
            '<img src="images/logo.png" style="height:auto;width:100px;"/>'+
            '</div>'+
            '<p style="font-weight:400">250, Vipul Trade Center</p>'+
            '<p style="font-weight:400">Sector 48, Gurgaon, Haryana</p>'+
            '</div>'+
            '</div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: 'Roofpik'
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
    }
});
