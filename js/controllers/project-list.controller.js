app.controller('projectListCtrl', function($scope, $mdSidenav, $timeout, $stateParams, $state) {
    $scope.close = function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('right').close()
            .then(function() {
                $log.debug("close RIGHT is done");
            });
    };
    $('.md-header').hide();
    $('.project-list-page').hide();
    $('.new-footer').hide();

    $timeout(function() {
        $('.md-header').fadeIn();
        $('.project-list-page').fadeIn();
        $('.new-footer').fadeIn();

    }, 2000);

    $scope.toggleRight = function() {
        $mdSidenav('right').open()
    }

    var h = $(window).height() - 300;
    console.log(h);
    $('.map-wrapper').css('height', h);
    // $timeout(function() {

    $scope.initializeProjects = function(projects){

        var map;
        var bounds = new google.maps.LatLngBounds();

        // Display a map on the page
        //  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        var infoWindowContent = [];
        var markers = [];
        var latLngCount = 0;
        var latSum = 0;
        var lngSum = 0;
        angular.forEach(projects, function(value, key){
            latLngCount++;
            var data = [];
            data = ['<div class="info_content"><a href="#/project-details/'+value.projectId+'/'+value.projectName+'">' +
             '<img style="width:80%" src="'+value.imgUrl+'"' +
                '<h3>'+value.projectName+'</h3>' +
                '<p>'+value.displayLocation+'</p>' + '</a></div>'
            ];
            var markerData = [value.projectName, value.lat, value.lng];
            latSum += value.lat;
            lngSum += value.lng;
            if(latLngCount == Object.keys(projects).length){
                latSum = latSum/latLngCount;
                lngSum = lngSum/latLngCount;
            }
            markers.push(markerData);
            infoWindowContent.push(data);
        })


        var uluru = { lat: latSum, lng: lngSum};
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

        var image = 'https://wiki.smu.edu.sg/is480/img_auth.php/thumb/0/00/Change-Makers_home-icon.png/40px-Change-Makers_home-icon.png';

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

    }

      

    // }, 3000);

    // $timeout(function(){
    // 	console.log('called');
    // 	 map = new google.maps.Map(document.getElementById('map'), {
    //     center: { lat: 28.4247649, lng: 76.8496963 },
    //     zoom: 12
    // });
    // }, 3000)

    var type = $stateParams.type || null;
    var id = $stateParams.id || null;
    var name = $stateParams.name || null;
    $scope.filterPath = [];
    // console.log(type);
    $scope.projects = {};
    var types = ['family', 'justMarried', 'oldAgeFriendly', 'kids', 'bachelors', 'petFriendly'];

    function capitalizeFirstLetter(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    $scope.storeProjects = function(data){
        var projectCount = 0;
         if($stateParams.type == 'locality'){
            $scope.filterPath = ["Gurgaon",">", $stateParams.name];
            // $scope.filterPath[0] = 'Gurgaon > '
            // $scope.filterPath[1] = $stateParams.name;
            angular.forEach(data, function(value, key){
                projectCount++;
                if(value.localityId == $stateParams.id){
                    $scope.projects[key] = value;
                }
                if(projectCount == Object.keys(data).length){
                    // console.log($scope.projects);
                    $scope.numProjects = Object.keys($scope.projects).length;
                    $scope.initializeProjects($scope.projects);
                }
            })
        } else if($stateParams.type == 'developer'){
            $scope.filterPath = ["Gurgaon",">", $stateParams.name];
            angular.forEach(data, function(value, key){
                projectCount++;
                if(value.developerId == $stateParams.id){
                    $scope.projects[key] = value;
                }
                if(projectCount == Object.keys(data).length){
                    // console.log($scope.projects);
                    $scope.numProjects = Object.keys($scope.projects).length;
                    $scope.initializeProjects($scope.projects);
                }
            })
        }
    }

    if($stateParams.from == 'search'){
        if (!checkLocalStorage('topRated')) {
            // console.log('from database');
            db.ref('topRated').once('value', function(dataSnapshot) {
                $timeout(function() {
                    $scope.numProjects = Object.keys(dataSnapshot.val()).length;
                    $scope.topRatedObject = dataSnapshot.val();
                    setLocalStorage('topRated', $scope.topRatedObject);
                    setLocalStorage('numProjects', $scope.numProjects);
                    $scope.storeProjects(dataSnapshot.val());
                }, 0);
            })
        } else {
            // console.log('from localstorage');
            $scope.topRatedObject = getLocalStorage('topRatedObject');
            $scope.numProjects = getLocalStorage('numProjectsObject');
            $scope.storeProjects($scope.topRatedObject);
        }
    }else if ($stateParams.from == 'topRated') {
        $scope.filterPath = ["Gurgaon",">","Top Rated"];
        if(!checkLocalStorage('topRated')){
            db.ref('topRated').once('value', function(dataSnapshot) {
                $timeout(function(){
                    $scope.projects = dataSnapshot.val();
                    $scope.numProjects = Object.keys(dataSnapshot.val()).length;
                    setLocalStorage('topRated', dataSnapshot.val());
                    setLocalStorage('numProjects', $scope.numProjects);
                    $scope.initializeProjects($scope.projects);
                },0);
            })
        } else {
            $scope.projects = getLocalStorage('topRatedObject');
            $scope.numProjects = getLocalStorage('numProjectsObject');
            $scope.initializeProjects($scope.projects);
        }
    } else {
        for (var i = 0; i < 6; i++) {
            if ($stateParams.from == types[i]) {
                var cat;
                if(types[i] == 'family'){
                    cat = 'Family';
                }else if(types[i] == 'justMarried'){
                    cat = 'Just Married';
                } else if(types[i] == 'oldAgeFriendly'){
                    cat = 'Old Age Friendly';
                } else if(types[i] == 'kids'){
                    cat = 'Kids';
                } else if(types[i] == 'bachelors'){
                    cat = 'Bachelors';
                } else if(types[i] == 'petFriendly'){
                    cat = 'Pet Friendly';
                }
                $scope.filterPath = ["Gurgaon",">", cat];
                if(!checkLocalStorage($stateParams.from)){
                    // console.log('from firebase');
                    db.ref($stateParams.from + 'List').once('value', function(dataSnapshot) {
                        $timeout(function(){
                           $scope.numProjects = Object.keys(dataSnapshot.val()).length;
                           $scope.projects = dataSnapshot.val();
                           setLocalStorage($stateParams.from, $scope.projects);
                           setLocalStorage('numProjects', $scope.numProjects);
                           $scope.initializeProjects($scope.projects);
                        }, 0);
                    })
                } else {
                    // console.log('from localstorage');
                    $scope.projects = getLocalStorage($stateParams.from+'Object');
                    $scope.numProjects = getLocalStorage('numProjectsObject'); 
                    $scope.initializeProjects($scope.projects);
                }
            }
        }
    }

    $scope.selectProject = function(id, name) {
        // console.log(id, name);
        $state.go('project-details', { id: id, name: name, path: JSON.stringify($scope.filterPath) });
    }
})
