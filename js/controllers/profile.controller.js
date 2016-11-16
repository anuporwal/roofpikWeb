app.controller('profileCtrl', function($scope, $timeout, $state, $mdDialog, $http){
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

	$scope.uploadedImage = 'http://www.e-codices.unifr.ch/documents/media/Collections/img-not-available_en.jpg';
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
			}
			if($scope.user.profileImage){
				$scope.uploadedImage = $scope.user.profileImage;
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

	$scope.submit = function(imgUrl){
		console.log($scope.user);
		if(imgUrl != 'no-image'){
			$scope.user.profileImage = imgUrl;
		}
		if($scope.city != 'Gurgaon'){
			console.log('city changed');
		}
		var updates = {};
		updates['users/hT1YLR90MkUDX3PMgDpbdmyYviF3'] = $scope.user;
		db.ref().update(updates).then(function(){
			swal({
                title: "Saved",
                text: "Your information was successfully saved!",
                type: "success",
                showCancelButton: false,
                confirmButtonColor: "#AEDEF4",
                confirmButtonText: "OK",
                closeOnConfirm: false
            }, function() {
                window.location.reload(true);
            });
		})
	}

	$scope.showUserReviews = function(){
		$state.go('user-all-reviews');
	}

	// $scope.changeProfileImage = function(){
		
	// }

	// $(function(){
	//     $('#image-upload-btn').click(function(){
	//         $('#image-upload-actual-btn').click(function(){
	//         	alert('0');
	//         	$scope.getFileDetails(event);
	//         });
	//     });
	// });

    $scope.createPath = function() {
    	swal({ title: "Saving...", text: "Please wait.", showConfirmButton: false });
        $scope.path = 'users/hT1YLR90MkUDX3PMgDpbdmyYviF3/profileImage';
        if ($scope.selectedFile) {
            $http({
                method: 'POST',
                url: 'http://139.162.3.205/api/createPath',
                params: {
                    path: $scope.path
                }
            }).then(function successCallback(response) {
                if (response.data.SuccessCode == 200) {
                    $scope.path = response.data.path;
                    console.log('Path Created');
                    $scope.upload($scope.path);
                }
            }, function errorCallback(response) {
                sweetAlert("Error", "Profile image cannot be uploaded!", "error");
            });
        } else {
            $scope.submit('no-image');
        }
    }

    $scope.size = '200x200';

    $scope.upload = function(path) {
        $http.post("http://139.162.3.205/api/testupload", { path: JSON.stringify($scope.uploadedImage) })
            .success(function(response) {
                if (response.StatusCode == 200) {
                    $scope.submit(response.Message);
                }
            })
            .error(function(err) {
                sweetAlert("Error", "Profile image cannot be uploaded!", "error");
            })
    }

    function DialogController($scope, $mdDialog, locals) {
        $scope.locals = locals;
        // console.log($scope.locals);
        $('.demo').croppie({
            url: $scope.locals.imageUrl,
        });

        // console.log($('.demo').html());
        $timeout(function() {
            cropImage($scope.locals.imageUrl);
        }, 0);

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

        function cropImage(source) {
            // console.log(source);
            // console.log($('.demo').html());
            basic = $('.demo').croppie({
                viewport: {
                    width: 200,
                    height: 200,
                    type: 'square'
                }
            });
            basic.croppie('bind', {
                url: source
            });
        }

        $scope.cropClick = function() {
            basic.croppie('result', {
                type: 'canvas',
                format: 'jpeg',
                square: true
            }).then(function(resp) {
                $timeout(function() {
                    $scope.answer(resp);
                }, 0);

            });
        }
    }

    $scope.showAdvanced = function(imageUrl) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: 'templates/crop-image.html',
                parent: angular.element(document.body),
                // targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    imageUrl: imageUrl
                }
            })
            .then(function(answer) {
                $timeout(function() {
                    $scope.uploadedImage = answer;
                }, 0);
            }, function() {
            	console.log('Dialog cancelled');
            });
    };

    $scope.getFileDetails = function(event) {
        $scope.selectedFile;
        $scope.uploadedImage = '';
        var files = event.target.files; //FileList object
        $scope.selectedFile = files[0];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
        }
    }

    $scope.imageIsLoaded = function(e) {
        $scope.stepsModel = [];
        $scope.$apply(function() {
            $scope.stepsModel.push(e.target.result);
            $timeout(function() {
                $scope.uploadedImage = $scope.stepsModel[0];
                console.log($scope.uploadedImage);
                $scope.showAdvanced($scope.uploadedImage);
            }, 0);
        });
    }

})