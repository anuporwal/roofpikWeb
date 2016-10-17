app.controller('homeCtrl', function($scope, $timeout, $state, $mdDialog){
	// console.log('working');

    $scope.takeToProjectList = function(param) {
        $state.go('project-list', { from: param });
    }

    $scope.topRated = {};
    $scope.shortStories = [];

    db.ref('shortStories/-KPmH9oIem1N1_s4qpCv')
        .orderByChild('createdDate')
        .limitToLast(4)
        .once('value', function(snapshot){
            // console.log(snapshot.val());
            $timeout(function(){
                // $scope.shortStories = snapshot.val();
                // console.log($scope.shortStories);
                snapshot.forEach(function(childSnapshot){
                    $scope.shortStories.push(childSnapshot.val());
                    // console.log(childSnapshot.val());

                })
            },0);
        })

    if(!checkCookie('familyListObject')){
        db.ref('familyList').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.familyListObject = dataSnapshot.val();
                setCookie('familyListObject', JSON.stringify($scope.familyListObject), 1);
            }, 0);
        })
    }
    if(!checkCookie('justMarriedListObject')){
        db.ref('justMarriedList').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.justMarriedListObject = dataSnapshot.val();
                setCookie('justMarriedListObject', JSON.stringify($scope.justMarriedListObject), 1);
            }, 0);
        })
    }
    if(!checkCookie('oldAgeFriendlyListObject')){
        db.ref('oldAgeFriendlyList').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.oldAgeFriendlyListObject = dataSnapshot.val();
                setCookie('oldAgeFriendlyListObject', JSON.stringify($scope.oldAgeFriendlyListObject), 1);
            }, 0);
        })
    }
    if(!checkCookie('kidsListObject')){
        db.ref('kidsList').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.kidsListObject = dataSnapshot.val();
                setCookie('kidsListObject', JSON.stringify($scope.kidsListObject), 1);
            }, 0);
        })
    }
    if(!checkCookie('bachelorsListObject')){
        db.ref('bachelorsList').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.bachelorsListObject = dataSnapshot.val();
                setCookie('bachelorsListObject', JSON.stringify($scope.bachelorsListObject), 1);
            }, 0);
        })
    }
    if(!checkCookie('petFriendlyObject')){
        db.ref('petFriendlyList').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.petFriendlyObject = dataSnapshot.val();
                setCookie('petFriendlyObject', JSON.stringify($scope.petFriendlyObject), 1);
            }, 0);
        })
    }

    if(checkCookie('topRatedObject')){
        // console.log(JSON.parse(getCookie('topRatedObject')) || {});
        $scope.topRated = JSON.parse((getCookie('topRatedObject')) || {});
        $scope.numProjects = JSON.parse((getCookie('numProjectsObject')) || {});
    } else {
        db.ref('topRated').once('value', function(snapshot) {
            $timeout(function() {
                $scope.numProjects = Object.keys(snapshot.val()).length;
                setCookie('numProjectsObject', JSON.stringify($scope.numProjects), 1);
                var count = 0;
                // console.log(snapshot.val()[0]);
                $scope.topRated[0] = snapshot.val()[0];
                $scope.topRated[1] = snapshot.val()[1];
                $scope.topRated[2] = snapshot.val()[2];
                setCookie('topRatedObject', JSON.stringify($scope.topRated), 1);
            }, 0);
        })
    }

    $scope.gotoWriteReviews = function() {
        $state.go('write-reviews');
    }

    $scope.takeToProjectDetails = function(project) {
        $state.go('project-details', { id: project.projectId, name: project.projectName });
    }

    $scope.openSearch = function(){
        // console.log('open search called');
    }

    $scope.showAdvanced = function(ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'templates/search-dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogController($scope, $mdDialog) {
        $scope.searchObject = [];
        var count = 0;
        if(checkCookie('searchObject')){
            console.log(JSON.parse(getCookie('searchObject')) || {});
            var data = JSON.parse((getCookie('searchObject')) || {});
            angular.forEach(data, function(value, key){
                $scope.searchObject.push(value);
            })
        } else {
            db.ref('search').once('value', function(snapshot){
                console.log(snapshot.val());
                $timeout(function(){
                    // $scope.searchObject = snapshot.val();
                    setCookie('searchObject', JSON.stringify(snapshot.val()), 1);
                    angular.forEach(snapshot.val(), function(value, key){
                        count++;
                        $scope.searchObject.push(value);
                        if(count == Object.keys(snapshot.val()).length){
                            
                        }
                    })
                },0);
            })
        }
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        $scope.getSearchText = function(){
            // console.log($scope.searchText);
        }

        $scope.selectSearchItem = function(val){
            // console.log(val);
            if(val.type == 'Project'){
                $mdDialog.cancel();
                $state.go('project-details', { id: val.id, name: val.name});
            } else if(val.type =='Locality'){
                $mdDialog.cancel();
                $state.go('project-list', {from:'search', type:'locality', id: val.id});
            } else if(val.type =='Developer'){
                $mdDialog.cancel();
                $state.go('project-list', {from:'search', type:'developer', id: val.id});
            }
        }
    }




    $timeout(function(){


      var map = new google.maps.Map(document.getElementById('micro-market-map'), {
          zoom: 5,
          center: {lat: 24.886, lng: -70.268},
          mapTypeId: 'terrain'
        });

        // Define the LatLng coordinates for the polygon's path.
        var triangleCoords = [
          {lat: 25.774, lng: -80.190},
          {lat: 18.466, lng: -66.118},
          {lat: 32.321, lng: -64.757},
          {lat: 25.774, lng: -80.190}
        ];

        // Construct the polygon.
        var bermudaTriangle = new google.maps.Polygon({
          paths: triangleCoords,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
        bermudaTriangle.setMap(map);

           },2000)

})



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}


function checkCookie(val) {
    var data=getCookie(val);
    if(data != ""){
        // console.log(data);
        return true;
    } else {
        console.log('data not found');
        return false;
    }
}

function deleteCookie(val){
    // console.log('delete cookie called');
    setCookie(val, {}, 0);
}

