app.controller('writeReviewsCtrl', function($scope, $http, $timeout, $mdToast, $mdDialog) {

    $scope.stepsModel = [];
    var newKey = '';

    $scope.selectedFile;
    var basic;

    $scope.showAdvanced = function(imageUrl) {
        // console.log($scope.uploadedImage);
        console.log('called');
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'templates/crop-image.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
            locals:{
                imageUrl: imageUrl
            }
        })
        .then(function(answer) {
            $timeout(function(){
                $scope.uploadedImage = answer;
                console.log($scope.uploadedImage);
            },0);
            $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
    };

    $scope.getFileDetails = function(event){
        $scope.selectedFile;
        $scope.uploadedImage = '';
         var files = event.target.files; //FileList object
         $scope.selectedFile = files[0];
         console.log($scope.selectedFile);
         for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded; 
            reader.readAsDataURL(file);
         }
    }

    $scope.imageIsLoaded = function(e){
        $scope.stepsModel = [];
        $scope.$apply(function() {
            $scope.stepsModel.push(e.target.result);
            $timeout(function(){
                $scope.uploadedImage = $scope.stepsModel[0];
                console.log($scope.uploadedImage);
                $scope.showAdvanced($scope.uploadedImage);
            },0);
        });
    }
    

    function DialogController($scope, $mdDialog, locals) {
        $scope.locals = locals;
        console.log($scope.locals);
        $('.demo').croppie({
            url: $scope.locals.imageUrl,
        });

        console.log($('.demo').html());
        $timeout(function(){
            cropImage($scope.locals.imageUrl);
        },0);

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        var basic;

        function cropImage(source){
            console.log(source);
            console.log($('.demo').html());
             basic = $('.demo').croppie({
                viewport: {
                width: 250,
                height: 250,
                type: 'square'
                }
            });
            basic.croppie('bind', {
                url: source
            });
        }

        $scope.cropClick = function(){
            console.log(' crop click called');
            basic.croppie('result', {
                type: 'canvas',
                format: 'jpeg',
                square: true
            }).then(function (resp) {
                console.log('called');
                console.log(resp);
                $timeout(function(){
                    $scope.answer(resp);
                    // $scope.uploadedImage = resp;
                },0);
                
            });
        }
    }

    $scope.createPath = function(review){
        $scope.imageKey = db.ref('coverStory/images').push().key;
        if($scope.selectedProjectOrLocality.type == 'Project'){
            newKey = db.ref('reviews/-KPmH9oIem1N1_s4qpCv/residential/'+$scope.selectedProjectOrLocality.id).push().key;
            $scope.path = 'reviews/-KPmH9oIem1N1_s4qpCv/residential/'+$scope.selectedProjectOrLocality.id+'/'+newKey;
        }  else if($scope.selectedProjectOrLocality.type == 'Locality'){
            newKey = db.ref('reviews/-KPmH9oIem1N1_s4qpCv/residential/'+$scope.selectedProjectOrLocality.id).push().key;
            $scope.path = 'reviews/-KPmH9oIem1N1_s4qpCv/residential/'+$scope.selectedProjectOrLocality.id+'/'+newKey;
        }

        console.log($scope.selectedFile);
        if($scope.selectedFile) {
            console.log($scope.path);
            $http({
                method:'POST',
                url:'http://139.162.3.205/api/createPath',
                params: {
                    path: $scope.path
                }
            }).then(function successCallback(response){
                console.log(response);
                if(response.data.SuccessCode == 200){
                    $scope.path = response.data.path;
                    console.log('Path Created');
                    $scope.upload(review, $scope.path);
                }
            }, function errorCallback(response){
                console.log(response);
            });
        } else {
            $scope.submitReview('no-image', review);
        }
    }

    $scope.size= '800x600';

    $scope.imageNames = '';

    $scope.size_url = [];
    $scope.upload = function(review, path){
        $http.post("http://139.162.3.205/api/testupload", {path: JSON.stringify($scope.uploadedImage)})
        .success(function(response){
            console.log(response);
            if(response.StatusCode == 200){
                $scope.submitReview(response.Message, review);
            }
        })
        .error(function(err){
            console.log(err);
        })
    }


    $scope.review = {
        ratings: {}
    }
    $scope.selectedItem = '';

    $scope.projectLocality = [];

    $scope.pushToProjectLocality = function(data){
        console.log(data);
        $scope.projectLocality = [];
        angular.forEach(data, function(value, key){
            if(value.type != 'Developer'){
                $scope.projectLocality.push(value);
            }
        })
    }

    // if(!checkCookie('searchObject')){
    //     db.ref('search').once('value', function(dataSnapshot) {
    //         $timeout(function() {
    //             setCookie('searchObject', JSON.stringify(dataSnapshot.val()), 1);
    //             $scope.pushToProjectLocality(dataSnapshot.val());
    //         }, 0);
    //     })
    // } else {
    //     $scope.pushToProjectLocality(JSON.parse(getCookie('searchObject')) || {});
    // }
    db.ref('search').once('value', function(dataSnapshot) {
        $timeout(function() {
            // setCookie('searchObject', JSON.stringify(dataSnapshot.val()), 1);
            $scope.pushToProjectLocality(dataSnapshot.val());
        }, 0);
    })

    $scope.nameEntered = function(){
        // console.log($scope.selectedItem);
        if($scope.selectedItem){
            if($scope.selectedItem.length > 0){
                $scope.showList = true;
            } else {
                $scope.showList = false;
            }
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

    $scope.submitReview = function(imageUrl, review) {

        var user = firebase.auth().currentUser;
        console.log(user);
        $scope.review.userName = user.displayName;
        // $scope.review.userName = 'Anu';
        $scope.review.userId = user.uid;
        // $scope.review.userId = '1234';
        $scope.review.blocked = false;
        $scope.review.createdDate = new Date().getTime();
        $scope.review.status = 'live';
        if(imageUrl != 'no-image'){
            $scope.review.imageUrl = imageUrl;
        }
        console.log($scope.selectedProjectOrLocality);
        console.log($scope.selectedProjectOrLocality.type);
        if($scope.selectedProjectOrLocality.type == 'Project'){
            var updates = {};
            $scope.useReviewData = {
                projectId: $scope.selectedProjectOrLocality.id,
                projectName: $scope.selectedProjectOrLocality.name,
                cityId: '-KPmH9oIem1N1_s4qpCv',
                cityName: 'Gurgaon',
                reviewTitle: $scope.review.reviewTitle,
                status : 'live',
                createdDate: $scope.review.createdDate
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
        } else if($scope.selectedProjectOrLocality.type == 'Locality'){
            var updates = {};
            $scope.useReviewData = {
                locationId: $scope.selectedProjectOrLocality.id,
                locationName: $scope.selectedProjectOrLocality.name,
                cityId: '-KPmH9oIem1N1_s4qpCv',
                cityName: 'Gurgaon',
                reviewTitle: $scope.review.reviewTitle,
                status : 'live',
                createdDate: $scope.review.createdDate
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
        }
    }

    $scope.openLogin = function() {
        $('#gl-side-menu-btn').click();
    }
});
