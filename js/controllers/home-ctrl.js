app.controller('homeCtrl', function($scope, $timeout, $state, $mdDialog){
	// console.log('working');

    $scope.takeToProjectList = function(param) {
        // console.log(param);
        $state.go('project-list', { from: param });
    }

    $scope.topRated = {};

    db.ref('topRated').once('value', function(snapshot) {
        // console.log(snapshot.val());

        $timeout(function() {
            $scope.projectNum = Object.keys(snapshot.val()).length;
            var count = 0;
            // console.log(snapshot.val()[0]);
            $scope.topRated[0] = snapshot.val()[0];
            $scope.topRated[1] = snapshot.val()[1];
            $scope.topRated[2] = snapshot.val()[2];
        }, 0);
    })

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
        db.ref('search').once('value', function(snapshot){
            $timeout(function(){
                // $scope.searchObject = snapshot.val();
                angular.forEach(snapshot.val(), function(value, key){
                    $scope.searchObject.push(value);
                })
            },0);
        })
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