app.controller('profileCtrl', function($scope, $timeout, $state){
	console.log('working');

	var uid = 'hT1YLR90MkUDX3PMgDpbdmyYviF3';
	$scope.cities = [];

	db.ref('city').once('value', function(snapshot){
		$timeout(function(){
			angular.forEach(snapshot.val(), function(value, key){
				$scope.cities.push(value.cityName);
			})
		},0);
	})
	db.ref('users/hT1YLR90MkUDX3PMgDpbdmyYviF3').once('value', function(snapshot){
		console.log(snapshot.val());
		$timeout(function(){
			$scope.user = snapshot.val();
			if(!$scope.user.gender){
				$scope.user.gender = 'Gender';
			}
			if(!$scope.user.birthDay){
				$scope.user.birthDay = {};
				$scope.user.birthDay.date = '1';
				$scope.user.birthDay.month = 'December';
				$scope.user.birthDay.year = '1999';
			}
			if($scope.user.mobile.mobileProvided == false){
				$scope.showAddMobile = true;
				$scope.user.mobile.mobileNum = '';
			}
			console.log($scope.user.address.cityName);
			$scope.city = $scope.user.address.cityName;
		}, 0);
	})

	$scope.allGenders = ['Gender', 'Male', 'Female', 'Other'];
	$scope.allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	$scope.allDates = [];
	for(var i = 1; i <=31; i++){
		$scope.allDates.push(i);
	}

	$scope.allYears = [];

	var currentYear = new Date().getFullYear();

	for(var i = 0; i < 100; i++){
		$scope.allYears.push(currentYear-100);
		currentYear++;
	}

	$scope.addMobile = function(){
		console.log('add mobile called');
		$scope.addMobileClicked = true;
	}

	$scope.addMobileNumber = function(mob){
		$scope.user.mobile.mobileNum = mob;
		$scope.addMobileClicked = false;
	}

	$scope.submit = function(){
		console.log($scope.user);
		if($scope.city != 'Gurgaon'){
			console.log('city changed');
		}
	}

	$scope.showUserReviews = function(){
		$state.go('user-all-reviews');
	}

	$scope.changeProfileImage = function(){
		
	}
})