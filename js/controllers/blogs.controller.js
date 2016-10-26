app.controller('blogsCtrl', function($scope, $timeout, $state, $mdSidenav, $sce, $stateParams){

  $scope.showNoBlogs = false;

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
  $scope.featuredBlogs = [];

  db.ref('featuredBlogs/-KPmH9oIem1N1_s4qpCv').once('value', function(data){
    $timeout(function(){
      if(data.val()){
        angular.forEach(data.val(), function(value, key){
          $scope.featuredBlogs.push(value);
        })
      }
    },0);
  })

  db.ref('shortBlogs/-KPmH9oIem1N1_s4qpCv').once('value', function(snapshot){
    $timeout(function(){
      if(snapshot.val()){
        $scope.allBlogs = snapshot.val();
        console.log($scope.allBlogs);
        angular.forEach($scope.allBlogs, function(value, key){
          value.selected = true;
        })
      } else {
        $scope.showNoBlogs = true;
      }
      if($stateParams.from == 'locality'){
        $scope.getLocalityBlogs($stateParams.id);
      } else if($stateParams.from == 'tag'){
        $scope.getRelatedBlogs($stateParams.id);
      } else if($stateParams.from == 'home'){
        $scope.showAllBlogs();
      }
    })
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

  $scope.showAllBlogs = function(){
    console.log($scope.allBlogs);
    angular.forEach($scope.allBlogs, function(value, key){
      value.selected = true;
    })
  }

  $scope.getRelatedBlogs = function(tag){
    console.log(tag);
    db.ref('blogs/hashtags/'+tag+'/blogs').once('value', function(snapshot){
      $timeout(function(){
        if(snapshot.val()){
          var blogCount = 0;
          var count = 0;
          angular.forEach($scope.allBlogs, function(value, key){
            count++;
            if(snapshot.val()[key]){
              value.selected = true;
              blogCount++;
            } else {
              value.selected = false;
            }
            if(count == Object.keys($scope.allBlogs).length){
              console.log('blogCount ', blogCount);
              if(blogCount == 0){
                $scope.showNoBlogs = true;
              } else {
                $scope.showNoBlogs = false;
              }
            }
          })
        } else {
          angular.forEach($scope.allBlogs, function(value, key){
            value.selected = false;
          })
          $scope.showNoBlogs = true;
        }
      },50);
    })
  }

  $scope.getLocalityBlogs = function(locality){
    var count = 0;
    var localityBlogCount = 0;
    console.log(locality);
    angular.forEach($scope.allBlogs, function(value, key){
      count++;
      if(value.placeId == locality){
        value.selected = true;
        localityBlogCount++;
      } else {
        value.selected = false;
      }
      if(count == Object.keys($scope.allBlogs).length){
        console.log('localityBlogCount ', localityBlogCount);
        if(localityBlogCount == 0){
          $scope.showNoBlogs = true;
        } else {
          $scope.showNoBlogs = false;
        }
      }
    })
  }

  $scope.goToBlogDetails = function(id){
    // console.log(id);
    $state.go('blog-details', {id: id});
  }

})