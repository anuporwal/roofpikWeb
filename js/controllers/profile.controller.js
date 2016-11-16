app.controller('profileCtrl', function($scope, $timeout, $state, $mdDialog, $http){
	console.log('working');

	var uid = 'hT1YLR90MkUDX3PMgDpbdmyYviF3';
	$scope.cities = [];
	$scope.dataloaded = false;
	$('.profile-page').hide();

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
	}).then(function(){
		$scope.dataloaded = true;
		$('.profile-page').fadeIn();
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
		swal({
		  title: "Updating",
		  imageUrl: "https://d1ow200m9i3wyh.cloudfront.net/img/assets/common/images/loader.gif",
		  showConfirmButton: false
		});
		var updates = {};
		db.ref('userRegistration/mobile/'+$scope.user.mobile.mobileNum).remove();
		updates['users/hT1YLR90MkUDX3PMgDpbdmyYviF3/mobile/mobileNum'] = mob;
		updates['users/hT1YLR90MkUDX3PMgDpbdmyYviF3/mobile/mobileProvided'] = true;
		updates['userRegistration/mobile/'+mob] = $scope.user.uid;
		console.log(updates);
		db.ref().update(updates).then(function(){
			$timeout(function(){
				$scope.user.mobile.mobileNum = mob;
				$scope.user.mobile.mobileProvided = true;
				updates = {};
				sweetAlert("Successful", "Mobile Number Successfully Added", "success");
			}, 0);
			// window.location.reload(true);
		})
		$scope.addMobileClicked = false;
	}

	$scope.submit = function(){
		swal({
		  title: "Saving",
		  imageUrl: "https://d1ow200m9i3wyh.cloudfront.net/img/assets/common/images/loader.gif",
		  showConfirmButton: false
		});
		// swal({ title: "Saving...", text: "Please wait.", showConfirmButton: false });
		console.log($scope.user);
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

    $scope.createPath = function(imgUrl) {
    	swal({
		  title: "Uploading",
		  imageUrl: "https://d1ow200m9i3wyh.cloudfront.net/img/assets/common/images/loader.gif",
		  showConfirmButton: false
		});
        $scope.path = 'users/hT1YLR90MkUDX3PMgDpbdmyYviF3/profileImage';

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
                $scope.upload($scope.path, imgUrl);
            }
        }, function errorCallback(response) {
            sweetAlert("Error", "Profile image cannot be uploaded!", "error");
        });
    }

    $scope.size = '200x200';

    $scope.upload = function(path, imgUrl) {
        $http.post("http://139.162.3.205/api/testupload", { path: JSON.stringify(imgUrl) })
            .success(function(response) {
                if (response.StatusCode == 200) {
                	db.ref('users/hT1YLR90MkUDX3PMgDpbdmyYviF3/profileImage').set(response.Message).then(function(){
                		sweetAlert("Success", "Profile image successfully uploaded!", "success");
                	})
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
                    $scope.createPath(answer);
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

    $scope.uploadImage = function(){
    	console.log('called');
    	$( "#profile-image-test" ).click();
    }

})