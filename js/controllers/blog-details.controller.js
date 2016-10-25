app.controller('blogDetailsCtrl', function($scope, $timeout, $stateParams, $sce, $state){
	console.log($stateParams);
	$scope.currentStory = {};
	db.ref('blogs/allBlogs/'+$stateParams.id).once('value', function(snapshot){
		// console.log(snapshot.val());
		$timeout(function(){
			$scope.currentBlog = snapshot.val();
		},0);
	})

	db.ref('popularBlogs/-KPmH9oIem1N1_s4qpCv').once('value', function(snapshot){
		$timeout(function(){
		  if(snapshot.val()){
		    $scope.popularBlogs = snapshot.val();
		  }''
		},0);
	})

	db.ref('tagCloud').once('value', function(snapshot){
		$timeout(function(){
		  if(snapshot.val()){
		    $scope.tagCloudData = snapshot.val();
		  }
		},0);
	})

	db.ref('popularLocalities/-KPmH9oIem1N1_s4qpCv').once('value', function(snapshot){
		$timeout(function(){
		  $scope.popularLocalities = snapshot.val();
		},0)
	})

	$scope.toTrustedHTML = function( html ){
		return $sce.trustAsHtml( html );
	}

	$scope.goToStoryDetails = function(id){
		// console.log(id);
		$state.go('story-details', {id: id});
	}

	$scope.getLocalityPosts = function(locality){
		// console.log(locality);
		$state.go('cover-stories', {from:'locality', id: locality.locationId});
	}

	$scope.getRelatedStories = function(tag){
		// console.log(tag);
		$state.go('cover-stories', {from:'tag', id: tag.tagId});
	}
	
})