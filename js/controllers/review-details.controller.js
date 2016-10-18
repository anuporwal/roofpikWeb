app.controller('reviewDetailsCtrl', function($scope, $http, $timeout, $mdToast, $stateParams, $mdDialog){
	console.log($stateParams);
	$scope.reviewName = $stateParams.typeName;
	$scope.ratingsObject1 = {};
	$scope.ratingsObject2 = {};
	$scope.ratingsObject3 = {};
	$scope.ratingsObject4 = {};
	$scope.ratingsObject5 = {};
	$scope.ratingsObject6 = {};
	$scope.ratingsObject7 = {};
	console.log('reviews/'+$stateParams.city+'/'+$stateParams.type+'/'+$stateParams.typeId+'/'+$stateParams.id);
	db.ref('reviews/'+$stateParams.city+'/'+$stateParams.type+'/'+$stateParams.typeId+'/'+$stateParams.id).once('value', function(snapshot){
		$timeout(function(){
			console.log(snapshot.val());
			$scope.review = snapshot.val();
			if($scope.review.imageUrl){
				$scope.uploadedImage = $scope.review.imageUrl;
			}
			$scope.ratingsObject1 = {
		        iconOnColor: 'rgb(255,87,34)', //Optional
		        iconOffColor: 'rgb(140, 140, 140)', //Optional
		        rating: $scope.review.overallRating || 0, //Optional
		        minRating: 0, //Optional
		        readOnly: false, //Optional
		        callback: function(rating, index) { //Mandatory    
		            $scope.ratingsCallback1(rating, 1);
		        }
		    };
			$scope.ratingsObject2 = {
		        iconOnColor: 'rgb(255,87,34)', //Optional
		        iconOffColor: 'rgb(140, 140, 140)', //Optional
		        rating: $scope.review.ratings.security || 0, //Optional
		        minRating: 0, //Optional
		        readOnly: false, //Optional
		        callback: function(rating, index) { //Mandatory    
		            $scope.ratingsCallback2(rating, 2);
		        }
		    };
			$scope.ratingsObject3 = {
		        iconOnColor: 'rgb(255,87,34)', //Optional
		        iconOffColor: 'rgb(140, 140, 140)', //Optional
		        rating: $scope.review.ratings.amenities || 0, //Optional
		        minRating: 0, //Optional
		        readOnly: false, //Optional
		        callback: function(rating, index) { //Mandatory    
		            $scope.ratingsCallback3(rating, 3);
		        }
		    };
		    $scope.ratingsObject4 = {
		        iconOnColor: 'rgb(255,87,34)', //Optional
		        iconOffColor: 'rgb(140, 140, 140)', //Optional
		        rating: $scope.review.ratings.openAndGreenAreas || 0, //Optional
		        minRating: 0, //Optional
		        readOnly: false, //Optional
		        callback: function(rating, index) { //Mandatory    
		            $scope.ratingsCallback4(rating, 4);
		        }
		    };
		    $scope.ratingsObject5 = {
		        iconOnColor: 'rgb(255,87,34)', //Optional
		        iconOffColor: 'rgb(140, 140, 140)', //Optional
		        rating: $scope.review.ratings.electricityAndWaterSupply || 0, //Optional
		        minRating: 0, //Optional
		        readOnly: false, //Optional
		        callback: function(rating, index) { //Mandatory    
		            $scope.ratingsCallback5(rating, 5);
		        }
		    };
		    $scope.ratingsObject6 = {
		        iconOnColor: 'rgb(255,87,34)', //Optional
		        iconOffColor: 'rgb(140, 140, 140)', //Optional
		        rating: $scope.review.ratings.convenienceOfHouseMaids || 0, //Optional
		        minRating: 0, //Optional
		        readOnly: false, //Optional
		        callback: function(rating, index) { //Mandatory    
		            $scope.ratingsCallback6(rating, 6);
		        }
		    };
		    $scope.ratingsObject7 = {
		        iconOnColor: 'rgb(255,87,34)', //Optional
		        iconOffColor: 'rgb(140, 140, 140)', //Optional
		        rating: $scope.review.ratings.convenienceOfParking || 0, //Optional
		        minRating: 0, //Optional
		        readOnly: false, //Optional
		        callback: function(rating, index) { //Mandatory    
		            $scope.ratingsCallback7(rating, 7);
		        }
		    };
		},0);
		
	})

    $scope.ratingsCallback1 = function(rating, index) {
        console.log('Selected rating is : ', rating, ' and index is ', index);
        $scope.review.overallRating = rating;

        // console.log($scope.review);
    };
    $scope.ratingsCallback2 = function(rating, index) {
        console.log('Selected rating is : ', rating, ' and index is ', index);
        $scope.review.ratings.security = rating;
    };
    $scope.ratingsCallback3 = function(rating, index) {
        console.log('Selected rating is : ', rating, ' and index is ', index);
        $scope.review.ratings.amenities = rating;
    };

	$scope.ratingsCallback4 = function(rating, index) {
        console.log('Selected rating is : ', rating, ' and index is ', index);
        $scope.review.ratings.openAndGreenAreas = rating;
    };

	$scope.ratingsCallback5 = function(rating, index) {
        console.log('Selected rating is : ', rating, ' and index is ', index);
        $scope.review.ratings.electricityAndWaterSupply= rating;
    };

	$scope.ratingsCallback6 = function(rating, index) {
        console.log('Selected rating is : ', rating, ' and index is ', index);
        $scope.review.ratings.convenienceOfHouseMaids= rating;
    };

	$scope.ratingsCallback7 = function(rating, index) {
        console.log('Selected rating is : ', rating, ' and index is ', index);
        $scope.review.ratings.convenienceOfParking= rating;
    };



    $scope.stepsModel = [];
    var newKey = '';

    $scope.selectedFile;

    var basic;
    $scope.uploadedImage = '';

    $scope.showAdvanced = function(imageUrl) {
        // console.log($scope.uploadedImage);
        console.log('called');
        $mdDialog.show({
            controller: cropImageCtrl,
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
                alert(JSON.stringify($scope.uploadedImage));
                console.log($scope.uploadedImage);
            },0);
            $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
    };


    $scope.getFileDetails = function(event){
        console.log('getFileDetails called');
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
        console.log('imageIsLoaded called');
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

    function cropImageCtrl($scope, $mdDialog, locals) {
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
        console.log(review);
        console.log($scope.selectedFile);
        $scope.path = 'reviews/-KPmH9oIem1N1_s4qpCv/'+$stateParams.type+'/'+$stateParams.typeId+'/'+$stateParams.id;
        // $scope.path = ''
        if($scope.selectedFile){
            console.log('called');
            $http({
                method:'POST',
                url:'http://139.162.3.205/api/createPath',
                params: {
                    path: $scope.path
                }
            }).then(function successCallback(response){
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

    $scope.submitReview = function(imageUrl, review){
    	console.log(imageUrl, review);
        if(imageUrl != 'no-image'){
            review.imageUrl = imageUrl;
        }
        review.createdDate = new Date().getTime();
        var updates = {};
        updates['reviews/-KPmH9oIem1N1_s4qpCv/'+$stateParams.type+'/'+$stateParams.typeId+'/'+$stateParams.id] = review;
        updates['userReviews/'+review.userId+'/'+$stateParams.type+'/'+$stateParams.id+'/createdDate'] = review.createdDate;
        updates['userReviews/'+review.userId+'/'+$stateParams.type+'/'+$stateParams.id+'/reviewTitle'] = review.reviewTitle;
        console.log(updates);
        db.ref().update(updates).then(function(){
            console.log('updated review');
        });
    }

})