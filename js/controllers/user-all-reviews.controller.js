app.controller('userAllReviewsCtrl', function($scope, $timeout, $state){
	// var user = firebase.auth().currentUser;

	$scope.allReviews = {};
	var count = 0;
	$scope.dataloaded = false;
	// db.ref('userReviews/'+user.uid).once('value', function(snapshot){
	db.ref('userReviews/2cQ2XQ7w7pdT9WGq2nyGJhrPSOo2').once('value', function(snapshot){
		$timeout(function(){
			angular.forEach(snapshot.val(), function(value, key){
				count++;
				// console.log(value, key);
				angular.forEach(value, function(value1, key1){
					if(key == 'residential'){
						value1.type = 'residential',
						value1.id = key1;
						$scope.allReviews[key1] = value1;
					} else if(key == 'locality'){
						value1.type = 'locality',
						value1.id = key1;
						$scope.allReviews[key1] = value1;
					}
				})
				if(count == Object.keys(snapshot.val()).length){
					// console.log($scope.allReviews);
					$scope.dataloaded = true;
				}
			})
		},0);
	})


	$scope.editReview = function(review){
		// console.log(review.id);
		var reviewTypeId = '';
		if(review.type == 'residential'){
			reviewTypeId = review.projectId;
			reviewTypeName = review.projectName;
		} else {
			reviewTypeId = review.locationId;
			reviewTypeName = review.locationName;
		}
		$state.go('review-details', {city:review.cityId, type:review.type, typeId:reviewTypeId, typeName:reviewTypeName, id:review.id});
	}
})