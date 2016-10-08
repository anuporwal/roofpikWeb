app.controller('writeReviewsCtrl', function($scope, $rootScope, $q, $log, $http, $timeout, $mdToast) {

    $scope.review = {
        ratings: {}
    }
    $scope.selectedItem = '';

    $scope.projectLocality = [];

    db.ref('search').once('value', function(snapshot){
        console.log(snapshot.val());
        var count = 0;
        $timeout(function(){
            angular.forEach(snapshot.val(), function(value, key){
                count++;
                if(value.type != 'Developer'){
                    $scope.projectLocality.push(value);
                }
                if(count ==Object.keys(snapshot.val()).length){
                    // console.log($scope.projectLocality);
                }
            })
        },100);
    })

    $scope.nameEntered = function(){
        // console.log($scope.selectedItem);
        if($scope.selectedItem.length > 0){
            $scope.showList = true;
        } else {
            $scope.showList = false;
        }
    }

    $scope.selectProjectLocality = function(val){
        // console.log(val);
        $scope.selectedItem = val.name;
        $scope.selectedProjectOrLocality = val;
        $scope.showList = false;
    }

    $scope.ratingsObject = {
        iconOnColor: 'rgb(255,87,34)', //Optional
        iconOffColor: 'rgb(140, 140, 140)', //Optional
        rating: 0, //Optional
        minRating: 0, //Optional
        readOnly: false, //Optional
        callback: function(rating, index) { //Mandatory    
            $scope.ratingsCallback(rating, index);
        }
    };


    $scope.ratingsCallback = function(rating, index) {
        // console.log('Selected rating is : ', rating, ' and index is ', index);

        if (index == 1) {
            $scope.review.overallRating = rating;
        } else if (index == 2) {
            $scope.review.ratings.security = rating;
        } else if (index == 3) {
            $scope.review.ratings.amenities = rating;
        } else if (index == 4) {
            $scope.review.ratings.openAndGreenAreas= rating;
        } else if (index == 5) {
            $scope.review.ratings.electricityAndWaterSupply= rating;
        } else if (index == 6) {
            $scope.review.ratings.convenienceOfHouseMaids= rating;
        } else if (index == 7) {
            $scope.review.ratings.convenienceOfParking= rating;
        }

        // console.log($scope.review);
    };

    $scope.submitReview = function(review) {

        var user = firebase.auth().currentUser;
        console.log(user);
        $scope.review.userName = user.displayName;
        $scope.review.userId = user.uid;
        $scope.review.blocked = false;
        $scope.review.createdDate = new Date().getTime();
        $scope.review.status = 'live';
        console.log($scope.selectedProjectOrLocality);
        console.log($scope.selectedProjectOrLocality.type);
        if($scope.selectedProjectOrLocality.type == 'Project'){
            var newKey = db.ref('reviews/-KPmH9oIem1N1_s4qpCv/residential/'+$scope.selectedProjectOrLocality.id).push().key;
            var updates = {};
            $scope.useReviewData = {
                projectId: $scope.selectedProjectOrLocality.id,
                projectName: $scope.selectedProjectOrLocality.name,
                cityId: '-KPmH9oIem1N1_s4qpCv',
                cityName: 'Gurgaon',
                reviewTitle: $scope.review.reviewTitle,
                status : 'live'
            }
            updates['reviews/-KPmH9oIem1N1_s4qpCv/residential/'+$scope.selectedProjectOrLocality.id+'/'+newKey] = $scope.review;
            updates['userReviews/'+user.uid+'/residential/'+newKey] = $scope.useReviewData
            console.log(updates);
            db.ref().update(updates).then(function(){
                console.log('review successfully submitted');
                $timeout(function(){
                    $scope.review = {};
                    $scope.selectedItem = '';
                    $scope.selectedProjectOrLocality = {};
                    $mdToast.show($mdToast.simple().textContent('Your review has been successfully submitted'));
                },50);
            })
            // db.ref('reviews/-KPmH9oIem1N1_s4qpCv/residential/'+$scope.selectedProjectOrLocality.id).push($scope.review).then(function(){
            //     console.log('project review submitted');
            // });
        } else if($scope.selectedProjectOrLocality.type == 'Locality'){
            var newKey = db.ref('reviews/-KPmH9oIem1N1_s4qpCv/residential/'+$scope.selectedProjectOrLocality.id).push().key;
            var updates = {};
            $scope.useReviewData = {
                locationId: $scope.selectedProjectOrLocality.id,
                locationName: $scope.selectedProjectOrLocality.name,
                cityId: '-KPmH9oIem1N1_s4qpCv',
                cityName: 'Gurgaon',
                reviewTitle: $scope.review.reviewTitle,
                status : 'live'
            }
            updates['reviews/-KPmH9oIem1N1_s4qpCv/locality/'+$scope.selectedProjectOrLocality.id+'/'+newKey] = $scope.review;
            updates['userReviews/'+user.uid+'/locality/'+newKey] = $scope.useReviewData;
            console.log(updates);
            db.ref().update(updates).then(function(){
                console.log('review successfully submitted');
                $timeout(function(){
                    $scope.review = {};
                    $scope.selectedItem = '';
                    $scope.selectedProjectOrLocality = {};
                    $mdToast.show($mdToast.simple().textContent('Your review has been successfully submitted'));
                },50);
            })
            // db.ref('reviews/-KPmH9oIem1N1_s4qpCv/locality/'+$scope.selectedProjectOrLocality.id).push($scope.review).then(function(){
            //     console.log('locality review submitted');
            // });
        }
    }

    $scope.openLogin = function() {
        $('#gl-side-menu-btn').click();
    }
});
