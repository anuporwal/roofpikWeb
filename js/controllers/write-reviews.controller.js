app.controller('writeReviewsCtrl', function($scope, $rootScope, $q, $log, $http, $timeout, $mdToast, $mdDialog) {

    $scope.stepsModel = [];
    var newKey = '';

    $scope.selectedFile;
    $scope.uploadedImage = '';
    var basic;

    // $scope.showAdvanced = function() {
    //     console.log($scope.uploadedImage);
    //     $mdDialog.show({
    //         controller: DialogController,
    //         templateUrl: 'templates/crop-image.html',
    //         parent: angular.element(document.body),
    //         // targetEvent: ev,
    //         clickOutsideToClose:true,
    //         fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    //     })
    //     .then(function(answer) {
    //         $scope.status = 'You said the information was "' + answer + '".';
    //     }, function() {
    //         $scope.status = 'You cancelled the dialog.';
    //     });
    // };

    $scope.getFileDetails = function(event){
         var files = event.target.files; //FileList object
         $scope.selectedFile = files[0];
         for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded; 
            reader.readAsDataURL(file);
         }
    }

    $scope.imageIsLoaded = function(e){
        $scope.$apply(function() {
            $scope.stepsModel.push(e.target.result);
            $scope.uploadedImage = $scope.stepsModel[0];
            // $('.demo').croppie({
            //     url: $scope.uploadedImage,
            // });
            cropImage($scope.uploadedImage);
            // $scope.showAdvanced();
        });
    }



    // function DialogController($scope, $mdDialog) {
    //     console.log($scope.uploadedImage);
    //     $scope.hide = function() {
    //         $mdDialog.hide();
    //     };

    //     $scope.cancel = function() {
    //         $mdDialog.cancel();
    //     };

    //     $scope.answer = function(answer) {
    //         $mdDialog.hide(answer);
    //     };



    // }

        function cropImage(source){
            basic = $('.demo').croppie({
                viewport: {
                width: 200,
                height: 100,
                type: 'square'
                }
            });
            basic.croppie('bind', {
                url: source
            });
        }

        $scope.cropClick = function(){
            console.log('called');
            basic.croppie('result', {
                type: 'canvas',
                format: 'jpeg',
                square: true
            }).then(function (resp) {
                console.log('called');
                console.log(resp);
                $timeout(function(){
                    $scope.uploadedImage = resp;
                },0);
                
            });
        }

    $scope.createPath = function(review){
        console.log($scope.selectedFile);
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
                    console.log('Path Created');
                    $scope.upload(review);
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
    $scope.upload = function(review){
        console.log($scope.size);
        console.log($scope.selectedFile);
        $scope.imageNames = $scope.selectedFile.name;
        fd = new FormData();
        fd.append("uploadedFile", $scope.uploadedImage);
        $http.post('http://139.162.3.205/api/uploadImage', fd,
        {
            transformRequest: angular.identity,
            headers: { 'Content-Type' : undefined},
            params : {
                path : $scope.path,
                size : $scope.size
            }
        })
        .success(function(result){
            console.log(result.URLs);
            // $scope.submitReview(result.URLs[0].imageUrl, review);
        })
        .error(function(err){
            console.log(err.message);
        });
    }


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

    $scope.submitReview = function(imageUrl, review) {

        var user = firebase.auth().currentUser;
        console.log(user);
        $scope.review.userName = user.displayName;
        $scope.review.userId = user.uid;
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
