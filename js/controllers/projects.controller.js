app.controller('projectsCtrl', function($scope, $timeout, $stateParams, $state){
	console.log($stateParams);

    var type = $stateParams.type || null;
    var id = $stateParams.id || null;
    var name = $stateParams.name || null;

    $scope.category = $stateParams.category || null;
    $scope.filterPath = [];

    db.ref('locality/-KPmH9oIem1N1_s4qpCv').once('value', function(snapshot){
    	console.log(snapshot.val());
    	$timeout(function(){
    		$scope.localities = snapshot.val();
    	}, 0);
    })
    // console.log(type);
    $scope.projects = {};
    var types = ['family', 'just-married', 'old-age-friendly', 'kids', 'bachelors', 'pet-friendly'];

    function preprocessData(data){
    	var count = 0;
    	for(key in data){
	        data[key].overallRating = Math.round(data[key].overallRating);
	        data[key].buyMin = convertCurrency(data[key].price.buy.min);
	        data[key].buyMax = convertCurrency(data[key].price.buy.max);
	        data[key].rentMin = convertCurrency(data[key].price.rent.min);
	        data[key].rentMax = convertCurrency(data[key].price.rent.max);
	        data[key].bhkAvailable = '';
	        angular.forEach(data[key].bhk, function(value1, key1) {
	            if (value1) {
	                data[key].bhkAvailable = data[key].bhkAvailable + key1 + ', ';
	            }
	        })
	        data[key].bhkAvailable = data[key].bhkAvailable.substring(0, data[key].bhkAvailable.length - 2) + ' BHK available';
	        data[key].show = true;
    	}
    	return data;
    }

    $scope.storeProjects = function(data){
    	console.log(data);
        var projectCount = 0;
        $scope.filterPath = ["Gurgaon",">","Residential",">", convertHyphenSeparatedToNormal($stateParams.category)];
        var responseProjects = preprocessData(data);
        console.log()
         if($stateParams.id == '1'){
            angular.forEach(responseProjects, function(value, key){
                projectCount++;
                if(value.localityId == $stateParams.categoryId){
                    $scope.projects[key] = value;
                }
                if(projectCount == Object.keys(data).length){
                    // console.log($scope.projects); 
                    $scope.numProjects = Object.keys($scope.projects).length;
                    $scope.showCount  = Object.keys($scope.projects).length;
                }
            })
        } else if($stateParams.id == '2'){

            angular.forEach(responseProjects, function(value, key){
                projectCount++;
                if(value.developerId == $stateParams.categoryId){
                    $scope.projects[key] = value;
                }
                if(projectCount == Object.keys(data).length){
                    // console.log($scope.projects);
                    $scope.numProjects = Object.keys($scope.projects).length;
                    $scope.showCount  = Object.keys($scope.projects).length; 
                }
            })
        }
    }

    if($stateParams.id == '1' || $stateParams.id == '2'){
        if (!checkLocalStorage('topRated')) {
            // console.log('from database');
            db.ref('topRated').once('value', function(dataSnapshot) {
                $timeout(function() {
                    $scope.numProjects = Object.keys(dataSnapshot.val()).length;
                    $scope.showCount  = Object.keys(dataSnapshot.val()).length;
                    $scope.topRatedObject = dataSnapshot.val();
                    setLocalStorage('topRated', $scope.topRatedObject);
                    setLocalStorage('numProjects', $scope.numProjects);
                    $scope.storeProjects(dataSnapshot.val());
                }, 0);
            })
        } else {
            // console.log('from localstorage');
            $scope.topRatedObject = getLocalStorage('topRatedObject');
            $scope.numProjects = getLocalStorage('numProjectsObject');
            $scope.showCount  = getLocalStorage('numProjectsObject');
            $scope.storeProjects($scope.topRatedObject);
        }
    }else if ($stateParams.category == 'top-rated') {
        $scope.filterPath = ["Gurgaon",">","Residential",">","Top Rated"];
        if(!checkLocalStorage('topRated')){
            db.ref('topRated').once('value', function(dataSnapshot) {
                $timeout(function(){
                    $scope.projects = preprocessData(dataSnapshot.val());
                    $scope.numProjects = Object.keys(dataSnapshot.val()).length;
                    $scope.showCount  = Object.keys(dataSnapshot.val()).length;
                    setLocalStorage('topRated', dataSnapshot.val());
                    setLocalStorage('numProjects', $scope.numProjects);
                    
                },0);
            })
        } else {
            $scope.projects = preprocessData(getLocalStorage('topRatedObject'));
	        console.log($scope.projects);
            $scope.numProjects = getLocalStorage('numProjectsObject');
            $scope.showCount  = getLocalStorage('numProjectsObject');
            
        }
    } else {
        console.log($stateParams.category);
        for (var i = 0; i < 6; i++) {
            if ($stateParams.category == types[i]) {
                var cat;
                if(types[i] == 'family'){
                    cat = 'Family';
                }else if(types[i] == 'just-married'){
                    cat = 'Just Married';
                } else if(types[i] == 'old-age-friendly'){
                    cat = 'Old Age Friendly';
                } else if(types[i] == 'kids'){
                    cat = 'Kids';
                } else if(types[i] == 'bachelors'){
                    cat = 'Bachelors';
                } else if(types[i] == 'pet-friendly'){
                    cat = 'Pet Friendly';
                }
                $scope.filterPath = ["Gurgaon",">","Residential",">", cat];
                var localStorageFrom = toCamelCase($stateParams.category);
                console.log(localStorageFrom);
                if(!checkLocalStorage(localStorageFrom)){
                    db.ref(localStorageFrom + 'List').once('value', function(dataSnapshot) {
                        $timeout(function(){
                           $scope.numProjects = Object.keys(dataSnapshot.val()).length;
                           $scope.showCount = Object.keys(dataSnapshot.val()).length;
                           $scope.projects = preprocessData(dataSnapshot.val());
                           setLocalStorage(localStorageFrom, $scope.projects);
                           setLocalStorage('numProjects', $scope.numProjects);
                           
                        }, 0);
                    })
                } else {
                    // console.log('from localstorage');
                    $scope.projects = preprocessData(getLocalStorage(localStorageFrom+'Object'));
                    $scope.numProjects = getLocalStorage('numProjectsObject'); 
                    $scope.showCount = getLocalStorage('numProjectsObject');
                }
            }
        }
    }

    $scope.selectProject = function(id, name) {
        // console.log(id, name);
        var year = new Date().getFullYear();
        // $state.go('project-details', { id: id, name: name, path: JSON.stringify($scope.filterPath) });
        $state.go('project-details', {year: year, city: 'gurgaon', type:'residential-projects', category:$stateParams.category, project:convertToHyphenSeparated(name), id:id});
    }

    $scope.takeToHome = function(){
        $state.go('home');
    }

    function convertCurrency(value){
        valueLen = getlength(value);
        var denomination = '';

        if(valueLen <= 5){
            return value;
        } else if(valueLen> 5 && valueLen <= 7){
            denomination = ' L';
            value = value/100000;
            value = parseFloat(Math.round(value * 100) / 100).toFixed(2);
            return value+denomination;
        } else if(valueLen> 7 && valueLen <= 9){
            denomination = ' Cr';
            value = value/10000000;
            value = parseFloat(Math.round(value * 100) / 100).toFixed(2);
            return value+denomination;
        }
   }

	function getlength(number) {
	   return number.toString().length;
	}

   	$scope.bhk = ['1', '2', '3', '4', '5', '6', '6+'];
   	$scope.ratings = [1, 2, 3, 4, 5];
   	$scope.filters = {
   		status: [],
   		bhk: [],
   		ratings: [],
   		locality: [],
   		price: {
   			buy: {},
   			rent: {}
   		}
   	}

  	function filterStatus(filters){
  		for(key in $scope.projects){
			if(filters.indexOf($scope.projects[key].projectStatus) > -1){
				console.log('yes');
				$scope.projects[key].show = true
			} else {
				$scope.projects[key].show = false;
			}
  		}
  	}

  	function filterBhk(filters){
   		for(key in $scope.projects){
   			if($scope.projects[key].show){
   				var exists = false;
   				for(key1 in $scope.projects[key].bhk){
   					if($scope.projects[key].bhk[key1]){
						if(filters.indexOf(key1) > -1){
   							exists = true;
   						}
   					}
   				}
   				console.log(exists);
   				if(exists){
   					console.log('exists');
 
   				} else {
   					console.log('does not exist');
   					$scope.projects[key].show = false;
   				}
   			}
  		}
  	}

  	function filterLocality(filters){
  		for(key in $scope.projects){
  			if($scope.projects[key].show){
				if(filters.indexOf($scope.projects[key].localityId) > -1){
					console.log('yes');
					$scope.projects[key].show = true;
				} else {
					$scope.projects[key].show = false;
				}
			}
  		}
  	}

  	function filterRatings(filters){
  		var minKey = (($scope.filters.ratings).sort())[0];
  		console.log(minKey);
  		for(key in $scope.projects){
  			if($scope.projects[key].show){
  				console.log($scope.projects[key].overallRating);
				if($scope.projects[key].overallRating >= minKey){
					console.log('yes');
					$scope.projects[key].show = true;
				} else {
					$scope.projects[key].show = false;
				}
			}
  		}
  	}

  	function filterPriceBuy(filters){
  		console.log(filters);
  		for(key in $scope.projects){
  			if($scope.projects[key].show){
				if($scope.projects[key].price.buy.min>= filters.min && $scope.projects[key].price.buy.max <= filters.max){
					$scope.projects[key].show = true;
				} else {
					$scope.projects[key].show = false;
				}
			}
  		}
  	}

  	function filterPriceRent(filters){
  		console.log(filters);
  		for(key in $scope.projects){
  			if($scope.projects[key].show){
				if($scope.projects[key].price.rent.min>= filters.min && $scope.projects[key].price.rent.max <= filters.max){
					$scope.projects[key].show = true;
				} else {
					$scope.projects[key].show = false;
				}
			}
  		}
  	}

    function findShowCount(){
      $scope.showCount = 0;
      for(key in $scope.projects){
        if($scope.projects[key].show){
          $scope.showCount++;
        }
      }
    }

  	function filterList(){
  		if($scope.filters.status.length){
  			console.log('if called');
  			filterStatus($scope.filters.status);
  		}else {
  			console.log('else called');
	  		for(key in $scope.projects){
	  			$scope.projects[key].show = true;
	  			console.log($scope.projects[key].show);
	  		}
	  		console.log($scope.projects);
  		}

  		if($scope.filters.bhk.length){
  			filterBhk($scope.filters.bhk);
  		}

  		if($scope.filters.locality.length){
  			filterLocality($scope.filters.locality);
  		}

  		if($scope.filters.ratings.length){
  			filterRatings($scope.filters.ratings.length);
  		}

  		if($scope.filters.price.buy.min < $scope.filters.price.buy.max){
  			filterPriceBuy($scope.filters.price.buy);
  		}

  		if($scope.filters.price.rent.min < $scope.filters.price.rent.max){
  			filterPriceRent($scope.filters.price.rent);
  		}
      findShowCount();
  	}

	$scope.exists = function (item) {
    	return $scope.filters.status.indexOf(item) > -1;
  	};

	$scope.toggle = function (item) {
		var idx = $scope.filters.status.indexOf(item);
		if (idx > -1) {
			$scope.filters.status.splice(idx, 1);
		}
		else {
			$scope.filters.status.push(item);
		}
		console.log($scope.filters.status);
		filterList();
	};

	$scope.existsBhk = function (item) {
    	return $scope.filters.bhk.indexOf(item) > -1;
  	};

	$scope.toggleBhk = function (item) {
		var idx = $scope.filters.bhk.indexOf(item);
		if (idx > -1) {
			$scope.filters.bhk.splice(idx, 1);
		}
		else {
			$scope.filters.bhk.push(item);
		}
		console.log($scope.filters.bhk);
		filterList();
	};

	$scope.existsLocality = function (item) {
    	return $scope.filters.locality.indexOf(item.locationId) > -1;
  	};

	$scope.toggleLocality = function (item) {
		console.log(item);
		var idx = $scope.filters.locality.indexOf(item.locationId);
		if (idx > -1) {
			$scope.filters.locality.splice(idx, 1);
		}
		else {
			$scope.filters.locality.push(item.locationId);
		}
		console.log($scope.filters.locality);
		filterList();
	};

	$scope.existsRatings = function (item) {
    	return $scope.filters.ratings.indexOf(item) > -1;
  	};

	$scope.toggleRatings = function (item) {
		console.log(item);
		var idx = $scope.filters.ratings.indexOf(item);
		if (idx > -1) {
			for(var i = 1; i <= item; i++){
				var index = $scope.filters.ratings.indexOf(i);
				if(index > -1){
					$scope.filters.ratings.splice(index, 1);
				}
			}
		}
		else {
			console.log('else called 322');
			// $scope.filters.ratings.push(item);
			for(var i = item; i <=5; i++){
				console.log(i);
				if($scope.filters.ratings.indexOf(i) > -1){

				} else {
					$scope.filters.ratings.push(i);
				}
			}

		}
		console.log($scope.filters.ratings);
		filterList();
	};

	$scope.applyPriceFilter = function(){
		console.log($scope.filters.price);
		if($scope.filters.price.buy.min && $scope.filters.price.buy.max){
			filterList();
		}
		if($scope.filters.price.rent.min && $scope.filters.price.rent.max){
			filterList();
		}
	}

  $scope.clearPriceFilter = function(){
    $scope.filters.price.buy = {};
    $scope.filters.price.rent = {};
    filterList();
  }

})
