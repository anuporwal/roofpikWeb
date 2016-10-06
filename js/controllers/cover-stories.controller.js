app.controller('coverStoryCtrl', function($scope, $timeout, $state, $mdSidenav, $sce){
	console.log('working');

  $scope.showNoStories = false;

  $scope.close = function () {
    // Component lookup should always be available since we are not using `ng-if`
    $mdSidenav('right').close()
      .then(function () {
        $log.debug("close RIGHT is done");
      });
  };

  $scope.toggleRight = function(){
  	$mdSidenav('right').open()
  }
  $scope.featuredStories = [];

  db.ref('featuredStories').once('value', function(data){
    $timeout(function(){
      if(data.val()){
        angular.forEach(data.val(), function(value, key){
          $scope.featuredStories.push(value);
        })
      }
    },0);
  })

  db.ref('coverStory/stories').once('value', function(snapshot){
    $timeout(function(){
      if(snapshot.val()){
        $scope.allStories = snapshot.val();
        angular.forEach($scope.allStories, function(value, key){
          value.selected = true;
        })
      } else {
        $scope.showNoStories = true;
      }
    })
  })

  db.ref('popularStories').once('value', function(snapshot){
    $timeout(function(){
      if(snapshot.val()){
        $scope.popularStories = snapshot.val();
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

  $scope.getRelatedStories = function(tag){
    console.log(tag);
    db.ref('coverStory/hashtags/'+tag.tagId+'/stories').once('value', function(snapshot){
      $timeout(function(){
        if(snapshot.val()){
          console.log(snapshot.val());
          var storyCount = 0;
          var count = 0;
          angular.forEach($scope.allStories, function(value, key){
            count++;
            if(snapshot.val()[key]){
              value.selected = true;
              storyCount++;
            } else {
              value.selected = false;
            }
            if(count == Object.keys($scope.allStories).length){
              if(storyCount == 0){
                $scope.showNoStories = true;
              } else {
                $scope.showNoStories = false;
              }
            }
          })
        } else {
          angular.forEach($scope.allStories, function(value, key){
            value.selected = false;
          })
          $scope.showNoStories = true;
        }
      },50);
    })
  }

})