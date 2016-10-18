var app = angular.module('NewApp', ['ngMaterial', 'ui.router', 'ngMessages']);
var db = firebase.database();


app.run(function($rootScope, $timeout) {
    // localStorage.clear();
    $rootScope.loginStatus = false;
    $rootScope.loading = true;
    firebase.auth().onAuthStateChanged(function(user) {
        // Sign-out successful.
        console.log(user);
        if (user != null) {
            // User is signed in.
            $rootScope.loginStatus = true;
        } else {
            console.log('called2');
            $rootScope.loginStatus = false;
            // No user is signed in.
        }
        // An error happened.
    });


});

app.config(['$mdThemingProvider', function($mdThemingProvider) {

    var customBlueMap = $mdThemingProvider.extendPalette('grey', {
        'contrastDefaultColor': 'light',
        'contrastDarkColors': ['50'],
        '50': 'ffffff'
    });
    $mdThemingProvider.definePalette('customBlue', customBlueMap);
    $mdThemingProvider.theme('default')
        .primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50'
        })
        .accentPalette('pink');
    $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
}]);
