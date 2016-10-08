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
			url: '/cover-stories/:from/:id',
			templateUrl: 'templates/cover-stories.html',
			controller: 'coverStoryCtrl'
		})
	$stateProvider
		.state('story-details', {
			url: '/story-details/:id',
			templateUrl: 'templates/story-details.html',
			controller: 'storyDetailsCtrl'
		})

	$stateProvider
		.state('project-details', {
			url: '/project-details',
			templateUrl: 'templates/project-details.html',
			controller: 'projectDetailsCtrl'
		})

	$stateProvider
		.state('write-reviews', {
			url: '/write-reviews',
			templateUrl: 'templates/write-reviews.html',
			controller: 'writeReviewsCtrl'
		})

	$urlRouterProvider.otherwise('/project-details');

}]);