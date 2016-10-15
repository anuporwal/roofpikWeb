app.controller('reviewDetailsCtrl', function($scope, $http, $timeout, $mdToast, $stateParams){
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
    };

	$scope.ratingsCallback4 = function(rating, index) {
        console.log('Selected rating is : ', rating, ' and index is ', index);
        $scope.review.ratings.amenities = rating;
    };

	$scope.ratingsCallback5 = function(rating, index) {
        console.log('Selected rating is : ', rating, ' and index is ', index);
        $scope.review.ratings.openAndGreenAreas= rating;
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
        });
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
    }

    $scope.size= '800x600';

    $scope.imageNames = '';

    $scope.size_url = [];
    $scope.upload = function(review){
        console.log($scope.size);
        console.log($scope.selectedFile);
        $scope.imageNames = $scope.selectedFile.name;
        fd = new FormData();
        fd.append("uploadedFile", $scope.selectedFile);
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
            $scope.submitReview(result.URLs[0].imageUrl, review);
        })
        .error(function(err){
            console.log(err.message);
        });
    }

    $scope.submit = function(review){
    	console.log(review);
    }

})