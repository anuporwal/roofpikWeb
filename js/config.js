app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'templates/home.html',
			controller: 'homeCtrl'
		})

	$stateProvider
		.state('test', {
			url: '/test',
			templateUrl: 'templates/test.html'
		})

	$stateProvider
		.state('cover-stories', {
			url: '/cover-stories',
			templateUrl: 'templates/cover-stories.html',
			controller: 'coverStoryCtrl'
		})

	$urlRouterProvider.otherwise('/cover-stories');

}]);