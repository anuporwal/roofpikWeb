app.controller('homeCtrl', function($scope, $timeout, $state){
	console.log('working');

    $scope.takeToProjectList = function(param) {
        console.log(param);
        $state.go('project-list', { from: param });
    }

    $scope.topRated = {};

    db.ref('topRated').once('value', function(snapshot) {
        console.log(snapshot.val());

        $timeout(function() {
            $scope.projectNum = Object.keys(snapshot.val()).length;
            var count = 0;
            console.log(snapshot.val()[0]);
            $scope.topRated[0] = snapshot.val()[0];
            $scope.topRated[1] = snapshot.val()[1];
            $scope.topRated[2] = snapshot.val()[2];
        }, 1000);
    })

    $scope.gotoWriteReviews = function() {
        $state.go('write-reviews');
    }

    $scope.takeToProjectDetails = function(project) {
        $state.go('project-details', { id: project.projectId, name: project.projectName });
    }
})