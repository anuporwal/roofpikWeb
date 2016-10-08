app.controller('projectListCtrl', function($scope, $mdSidenav, $timeout) {
    $scope.close = function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('right').close()
            .then(function() {
                $log.debug("close RIGHT is done");
            });
    };

    $scope.toggleRight = function() {
        $mdSidenav('right').open()
    }

    var h = $(window).height() - 300;
    console.log(h);
    $('.map-wrapper').css('height', h);
    $timeout(function() {

        var map;
        var bounds = new google.maps.LatLngBounds();

        // Display a map on the page
        //  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);


        var uluru = { lat: 28.4479248, lng: 77.0582817 };
        map = new google.maps.Map(document.getElementById('map'), {
            center: uluru,
            zoom: 12
        });

        map.setTilt(45);

        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });


        // Info Window Content
        var infoWindowContent = [
            ['<div class="info_content">' +
            	'<img style="width:80%" src="http://roofpik.com/test/newweb/images/newlymarried.jpg"' +
                '<h3>London Eye</h3>' +
                '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' + '</div>'
            ],
            ['<div class="info_content">' +
                '<h3>Palace of Westminster</h3>' +
                '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
                '</div>'
            ]
        ];


        var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        var markers = [
            ['Gurgaon, India', 28.465168, 77.0296213],
            ['Delhi, India', 28.4111889, 77.040829]
        ];


        var infoWindow = new google.maps.InfoWindow(),
            marker, i;
        // Loop through our array of markers & place each one on the map  
        for (i = 0; i < markers.length; i++) {
            var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
            bounds.extend(position);
            var marker = new google.maps.Marker({
                position: position,
                map: map,
                title: markers[i][0],
                icon: image
            });

            // Allow each marker to have an info window    
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent[i][0]);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
        }

        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(14);
            google.maps.event.removeListener(boundsListener);
        });

      

    }, 3000)


    // $timeout(function(){
    // 	console.log('called');
    // 	 map = new google.maps.Map(document.getElementById('map'), {
    //     center: { lat: 28.4247649, lng: 76.8496963 },
    //     zoom: 12
    // });
    // }, 3000)
   

})