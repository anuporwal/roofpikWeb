app.controller('homeCtrl', function($scope, $timeout, $state, $mdDialog){
	// console.log('working');

    $scope.takeToProjectList = function(param) {
        // console.log(param);
        $state.go('project-list', { from: param });
    }

    $scope.topRated = {};

    if(checkCookie('topRatedObject')){
        console.log(JSON.parse(getCookie('topRatedObject')) || {});
        $scope.topRated = JSON.parse((getCookie('topRatedObject')) || {});
        $scope.projectNum = JSON.parse((getCookie('projectNumObject')) || {});
    } else {
        db.ref('topRated').once('value', function(snapshot) {
            // console.log(snapshot.val());

            $timeout(function() {
                $scope.projectNum = Object.keys(snapshot.val()).length;
                setCookie('projectNumObject', JSON.stringify($scope.projectNum), 1);
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
        console.log('open search called');
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
            $scope.searchObject = JSON.parse((getCookie('searchObject')) || {});
        } else {
            db.ref('search').once('value', function(snapshot){
                console.log(snapshot.val());
                $timeout(function(){
                    // $scope.searchObject = snapshot.val();
                    angular.forEach(snapshot.val(), function(value, key){
                        count++;
                        $scope.searchObject.push(value);
                        if(count == Object.keys(snapshot.val()).length){
                            setCookie('searchObject', JSON.stringify($scope.searchObject), 1);
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
            console.log($scope.searchText);
        }

        $scope.selectSearchItem = function(val){
            console.log(val);
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
