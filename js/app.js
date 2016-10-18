var app = angular.module('NewApp', ['ngMaterial', 'ui.router', 'jkAngularCarousel']);
var db = firebase.database();

var versions = {
   searchVersion: 1,
   topRatedVersion: 1,
   kidsVersion: 1,
   petFriendlyVersion: 1,
   oldAgeFriendlyVersion: 1,
   bachelorsVersion: 1,
   justMarriedVersion: 1,
   familyVersion: 1,
   numProjectsVersion: 1
};

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