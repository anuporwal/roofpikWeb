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

		.state('about-us', {
			url: '/about-us',
			templateUrl: 'templates/about-us.html',
			controller: 'aboutUsCtrl'
		})
		.state('contact-us', {
			url: '/contact-us',
			templateUrl: 'templates/contact-us.html',
			controller: 'contactUsCtrl'
		})
		.state('career-n-goals', {
			url: '/career-n-goals',
			templateUrl: 'templates/career-n-goals.html',
			controller: 'careerAndGoalsCtrl'
		})
		.state('faq', {
			url: '/faq',
			templateUrl: 'templates/faq.html',
			controller: 'faqCtrl'
		})


	$urlRouterProvider.otherwise('/story-details');

}]);