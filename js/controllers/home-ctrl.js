app.controller('homeCtrl', function($scope, $timeout, $state, $mdDialog) {
    // console.log('working');

    $('.md-header').hide();
    $('.home-container').hide();
    $('.new-footer').hide();

    $timeout(function() {
        $('.md-header').fadeIn();
        $('.home-container').fadeIn();
        $('.new-footer').fadeIn();

    }, 1000);


    $scope.takeToProjectList = function(param) {
        var year = new Date().getFullYear();
        // convertCamelCaseToNormal(param);
        // $state.go('project-list', {year:year, city: 'gurgaon',type:'residential-projects',category:convertCamelCaseToNormal(param), categoryId: '-KQ9cIdfaoKpCj34yAWC', id: '3'});
        $state.go('projects', {year:year, city: 'gurgaon',type:'residential-projects',category:convertCamelCaseToNormal(param), categoryId: '-KQ9cIdfaoKpCj34yAWC', id: '3'});
    }

    $scope.topRated = {};
    $scope.shortStories = [];
    $scope.blogs = [];

    db.ref('shortStories/-KPmH9oIem1N1_s4qpCv')
        .orderByChild('createdDate')
        .limitToLast(4)
        .once('value', function(snapshot) {
            $timeout(function() {
                snapshot.forEach(function(childSnapshot) {
                    $scope.shortStories.push(childSnapshot.val());
                })
            }, 0);
        })

    db.ref('shortBlogs/-KPmH9oIem1N1_s4qpCv')
        .orderByChild('createdDate')
        .limitToLast(8)
        .once('value', function(snapshot) {
            $timeout(function() {
                snapshot.forEach(function(childSnapshot) {
                    var coverimage = childSnapshot.val().coverImage['700x525'];
                    var blogData = childSnapshot.val();
                    blogData.coverImage = coverimage; 
                    $scope.blogs.push(blogData);
                })
                $timeout(function(){
                    console.log('hello');
                    var data = document.getElementById('blog-image-box');
                    console.log(data.clientWidth);
                    console.log(data.scrollWidth);
                    console.log(data.offsetWidth);
                    var newHeight = ((data.clientWidth)*0.75);
                    console.log(newHeight);
                    document.getElementById('blog-image-box').style.height = newHeight+ 'px';
                },1000);
            }, 0);
        })


    if (!checkLocalStorage('family')) {
        db.ref('familyList').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.familyObject = dataSnapshot.val();
                setLocalStorage('family', $scope.familyObject, 1);
            }, 0);
        })
    }


    if (!checkLocalStorage('kids')) {
        db.ref('kidsList').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.kidsObject = dataSnapshot.val();
                setLocalStorage('kids', $scope.kidsObject, 1);
            }, 0);
        })
    }


    if (!checkLocalStorage('justMarried')) {
        db.ref('justMarriedList').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.justMarriedObject = dataSnapshot.val();
                setLocalStorage('justMarried', $scope.justMarriedObject, 1);
            }, 0);
        })
    }


    if (!checkLocalStorage('oldAgeFriendly')) {
        db.ref('oldAgeFriendlyList').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.oldAgeFriendlyObject = dataSnapshot.val();
                setLocalStorage('oldAgeFriendly', $scope.oldAgeFriendlyObject, 1);
            }, 0);
        })
    }

    if (!checkLocalStorage('bachelors')) {
        db.ref('bachelorsList').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.bachelorsObject = dataSnapshot.val();
                setLocalStorage('bachelors', $scope.bachelorsObject, 1);
            }, 0);
        })
    }

    if (!checkLocalStorage('petFriendly')) {
        db.ref('petFriendlyList').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.petFriendlyObject = dataSnapshot.val();
                setLocalStorage('petFriendly', $scope.petFriendlyObject, 1);
            }, 0);
        })
    }

    // console.log(checkLocalStorage('search'));
    if (!checkLocalStorage('search')) {
        db.ref('search').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.searchObject = dataSnapshot.val();
                setLocalStorage('search', $scope.searchObject, 1);
            }, 0);
        })
    }

    $scope.getRequiredTopRated = function(data){
        // console.log(data);
        $scope.topRated[0] = data[0];
        $scope.topRated[1] = data[1];
        $scope.topRated[2] = data[2];
    }
    if (!checkLocalStorage('topRated')) {
        // console.log('top rated not found');
        db.ref('topRated').once('value', function(dataSnapshot) {
            $timeout(function() {
                $scope.numProjects = Object.keys(dataSnapshot.val()).length;
                $scope.topRatedObject = dataSnapshot.val();
                setLocalStorage('topRated', $scope.topRatedObject, 1);
                setLocalStorage('numProjects', $scope.numProjects, 1);
                $scope.getRequiredTopRated($scope.topRatedObject);
            }, 0);
        })
    } else {
        // console.log('top rated found');
        $scope.topRatedObject = getLocalStorage('topRatedObject');
        $scope.numProjects = getLocalStorage('numProjectsObject');
        $scope.getRequiredTopRated($scope.topRatedObject);
    }


    $scope.gotoWriteReviews = function() {
        $('.md-header').hide();
        $('.new-footer').hide();
        $state.go('write-reviews');
    }

    $scope.takeToProjectDetails = function(project) {
        var year = new Date().getFullYear();
        // $state.go('project-details', { id: project.projectId, name: project.projectName, path: JSON.stringify($scope.newPath)});
        $state.go('project-details', {year: year, city: 'gurgaon', type:'residential-projects', category:null, project:convertToHyphenSeparated(project.projectName), id:project.projectId});
    }

    $scope.showCoverStories = function(){
        $state.go('cover-stories',{from:'home', id: '-KPmH9oIem1N1_s4qpCv'});
    }

    $scope.takeToBlogs = function(){
        $state.go('blogs',{from:'home', id: '-KPmH9oIem1N1_s4qpCv'});
    }

    $scope.openSearch = function() {
        // console.log('open search called');
    }

    $scope.showAdvanced = function(ev) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: 'templates/search-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.goToStory = function(val) {
        $state.go('story-details', { id: val.storyId });
    }

    $scope.goToBlog = function(blog){
        console.log(blog);
        $state.go('blog-details', {id: '-KUvRMEmRoWEVsl1e37L'});
        // $state.go('blog-details', {id: blog.blogId});
    }

    function DialogController($scope, $mdDialog, $timeout) {
        $timeout(function(){
            $('#search-input-box').focus();
        },500);
        $scope.searchObject = [];
        var count = 0;
        if(checkLocalStorage('search')){
            var data = getLocalStorage('searchObject');
            angular.forEach(data, function(value, key){
                $scope.searchObject.push(value);
            })
        } else {
            db.ref('search').once('value', function(snapshot){
                $timeout(function(){
                    setLocalStorage('search', snapshot.val());
                    angular.forEach(snapshot.val(), function(value, key) {
                        count++;
                        $scope.searchObject.push(value);
                    })
                }, 0);
            })
        }
        
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };

        $scope.getSearchText = function() {
            // console.log($scope.searchText);
        }

        $scope.selectSearchItem = function(val) {
            // console.log(val);
            var year = new Date().getFullYear();
            if (val.type == 'Project') {
                var path = ["Gurgaon"]
                $mdDialog.cancel();
                // $state.go('project-details', { id: val.id, name: val.name, path: JSON.stringify(path)});
                $state.go('project-details', {year: year, city: 'gurgaon', type:'residential-projects', category:null, project:convertToHyphenSeparated(val.name), id:val.id});
            } else if (val.type == 'Locality') {
                $mdDialog.cancel();
                // $state.go('project-list', {year:year, city: 'gurgaon',type:'residential-projects',category:convertToHyphenSeparated(val.name), categoryId: val.id, id: '1'});
                $state.go('projects', {year:year, city: 'gurgaon',type:'residential-projects',category:convertToHyphenSeparated(val.name), categoryId: val.id, id: '1'});
            } else if (val.type == 'Developer') {
                $mdDialog.cancel();
                // $state.go('project-list', {year:year, city: 'gurgaon',type:'residential-projects',category:convertToHyphenSeparated(val.name), categoryId: val.id, id: '2'});
                $state.go('projects', {year:year, city: 'gurgaon',type:'residential-projects',category:convertToHyphenSeparated(val.name), categoryId: val.id, id: '2'});
            }
        }
    }
})


function setLocalStorage(name, value){
    var newField = name+'Version';

    var dataStored = {
        value: value,
        createdDate: new Date().getTime(),
         version: versions[newField]
    }

    localStorage.setItem(name+'Object' , JSON.stringify(dataStored));
}

function checkLocalStorage(val){
    var currentDate = new Date().getTime();
    var factor = 604800000;
    var checkingValue = val+'Version';
    if (localStorage.getItem(val+'Object') === null) {
        return false;
    } else if(JSON.parse(localStorage.getItem(val+'Object')).createdDate+ factor < currentDate || JSON.parse(localStorage.getItem(val+'Object')).version != versions[checkingValue]){
        deleteLocalStorage(val+'Object');
        return false;
    } else {
        return true;
    }
}

function deleteLocalStorage(val){
    localStorage.removeItem(val);
}

function getLocalStorage(val){
    // console.log(val);
    // console.log(JSON.parse(localStorage.getItem(val)));
    return JSON.parse(localStorage.getItem(val)).value;
}

function convertCamelCaseToNormal(data){
    console.log(data);
    if (data == null || data == "") {
      return data;
    }

    data = data.trim();
    var newText = "";
    for (var i = 0; i < data.length; i++) {
      if (/[A-Z]/.test(data[i])
          && i != 0
          && /[a-z]/.test(data[i-1])) {
        newText += "-";
      }
      newText += data[i];
    }
    console.log(newText.toLowerCase());
    return newText.toLowerCase();
}

function toCamelCase(str){
    str = str.trim();
   var newText = str.split('-').map(function(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');

   return newText.charAt(0).toLowerCase() + newText.slice(1);
}

function convertToHyphenSeparated(data){
    console.log(data);
    if (data == null || data == "") {
      return data;
    }

    data = data.trim();
    return data.split(" ").join("-").toLowerCase();
}

function convertHyphenSeparatedToNormal(str){
    str = str.trim();
   return str.split('-').map(function(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}
