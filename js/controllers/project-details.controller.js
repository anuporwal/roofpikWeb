app.controller('projectDetailsCtrl', function($scope, $timeout, $stateParams, $rootScope){
   // $rootScope.loading = true;
    $('.project-details-page').hide();
    $('.new-footer').hide();
    $('.md-header').hide();

    var rates = [1, 2, 3, 4, 5];
    $scope.projectName = $stateParams.name;
    $scope.projectId = $stateParams.id;
    $scope.reviews = {};
    $scope.features = [];
    $scope.bhkAvailable = '';
    $scope.dataLoaded = false;
    $scope.buyLinks = {};
    $scope.rentLinks = {};
    console.log('working');

      $timeout(function() {
        $('.md-header').fadeIn();
        $('.project-details-page').fadeIn();
        $('.new-footer').fadeIn();

    }, 2000);


    $scope.viewReviews = 5;

    db.ref('projects/-KPmH9oIem1N1_s4qpCv/residential/' + $scope.projectId).once('value', function(snapshot) {
        console.log(snapshot.val());
        $timeout(function() {
            $scope.project = snapshot.val();
            console.log($scope.project);
            console.log($scope.project.images.main['2100x800']);
            // $('.gl-page-header-wrapper').css('background-image','url('+$scope.project.images.main['2100x800']+')');
            angular.forEach($scope.project.standoutFeatures, function(value, key) {
                $scope.features.push(key);
            })
            if ($scope.project.pricingLinks['99Acres']) {
                $scope.buyLinks.acres = $scope.project.pricingLinks['99Acres'].buy;
                $scope.rentLinks.acres = $scope.project.pricingLinks['99Acres'].rent;
            }
            if ($scope.project.pricingLinks.commonFloor) {
                $scope.buyLinks.cf = $scope.project.pricingLinks.commonFloor.buy;
                $scope.rentLinks.cf = $scope.project.pricingLinks.commonFloor.rent;
            }
            if ($scope.project.pricingLinks.magicBricks) {
                $scope.buyLinks.mb = $scope.project.pricingLinks.magicBricks.buy;
                $scope.rentLinks.mb = $scope.project.pricingLinks.magicBricks.rent;
            }
            console.log($scope.buyLinks);

            console.log($scope.project.bhk);
            angular.forEach($scope.project.bhk, function(value, key) {
                if (value) {
                    $scope.bhkAvailable = $scope.bhkAvailable + key + ', ';
                }
            })
            $scope.bhkAvailable = $scope.bhkAvailable.substring(0, $scope.bhkAvailable.length - 2) + ' BHK available';
            console.log($scope.bhkAvailable);

        }, 100);
    }).then(function() {
        db.ref('reviews/-KPmH9oIem1N1_s4qpCv/residential/' + $scope.projectId).once('value', function(snapshot) {
            // console.log(snapshot.val());
            $timeout(function() {
                $scope.reviews = snapshot.val();
                if(Object.keys(snapshot.val()).length > 5){
                    $scope.showReviewBtn = true;
                }
                // $rootScope.loading = false;
            }, 100);
        }).then(function() {
            db.ref('ratingReview/-KPmH9oIem1N1_s4qpCv/residential/' + $scope.projectId).once('value', function(snapshot) {
                $timeout(function() {
                    // console.log(snapshot.val());
                    $scope.allRatings = snapshot.val();
                    $("#excellentStar").css("width", ($scope.allRatings.fiveStar / $scope.allRatings.overallRatingNum) * 100 + '%');
                    $("#veryGoodStar").css("width", ($scope.allRatings.fourStar / $scope.allRatings.overallRatingNum) * 100 + '%');
                    $("#goodStar").css("width", ($scope.allRatings.threeStar / $scope.allRatings.overallRatingNum) * 100 + '%');
                    $("#averageStar").css("width", ($scope.allRatings.twoStar / $scope.allRatings.overallRatingNum) * 100 + '%');
                    $("#badStar").css("width", ($scope.allRatings.oneStar / $scope.allRatings.overallRatingNum) * 100 + '%');
                    $scope.dataLoaded = true;
                }, 50);
            })
        })
    })


    $scope.showMoreReviews = function(){
        $scope.viewReviews += 5;
        if(Object.keys($scope.reviews).length > $scope.viewReviews){
            $scope.showReviewBtn = true;
        } else {
            $scope.showReviewBtn = false;
        }
    }

    $scope.starrating = function(rating) {
        rating = Math.round(rating);
        return new Array(rating); //ng-repeat will run as many times as size of array
    }

    $scope.buySelected = true;
    $scope.rentSelected = false;

    $scope.selectBuyRent = function(value) {
        console.log(value);
        if (value == 'buy') {
            $scope.buySelected = true;
            $scope.rentSelected = false;
        } else {
            $scope.buySelected = false;
            $scope.rentSelected = true;
        }
    }
})