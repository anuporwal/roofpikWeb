app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'templates/home.html',
			controller: 'homeCtrl'
		});

	$stateProvider
		.state('test', {
			url: '/test',
			templateUrl: 'templates/test.html'
		});

	$stateProvider
		.state('cover-stories', {
			url: '/cover-stories/:from/:id',
			templateUrl: 'templates/cover-stories.html',
			controller: 'coverStoryCtrl'
		});

	$stateProvider
		.state('story-details', {
			url: '/story-details/:id',
			templateUrl: 'templates/story-details.html',
			controller: 'storyDetailsCtrl'
		});

	$stateProvider
		.state('blogs', {
			url: '/blogs/:from/:id',
			templateUrl: 'templates/blogs.html',
			controller: 'blogsCtrl'
		});

	$stateProvider
		.state('blog-details', {
			url: '/blog-details/:id',
			templateUrl: 'templates/blog-details.html',
			controller: 'blogDetailsCtrl'
		});

	// $stateProvider
	// 	.state('project-details', {
	// 		url: '/project-details/:id/:name/:path',
	// 		templateUrl: 'templates/project-details.html',
	// 		controller: 'projectDetailsCtrl'
	// 	});
	$stateProvider
		.state('project-details', {
			url: '/project-details/:year/:city/:type/:category/:project/:id',
			templateUrl: 'templates/project-details.html',
			controller: 'projectDetailsCtrl'
		});

	$stateProvider
		.state('write-reviews', {
			url: '/write-reviews',
			templateUrl: 'templates/write-reviews.html',
			controller: 'writeReviewsCtrl'
		});

	$stateProvider
		.state('review-details', {
			url: '/review-details/:city/:type/:typeId/:typeName/:id',
			templateUrl: 'templates/review-details.html',
			controller: 'reviewDetailsCtrl'
		});

	$stateProvider
		.state('user-all-reviews', {
			url: '/user-all-reviews',
			templateUrl: 'templates/user-all-reviews.html',
			controller: 'userAllReviewsCtrl'
		});

	$stateProvider
		.state('project-list', {
			url: '/project-list/:year/:city/:type/:category/:categoryId/:id',
			templateUrl: 'templates/project-list.html',
			controller: 'projectListCtrl'
		});

	$stateProvider
		.state('projects', {
			url: '/projects/:year/:city/:type/:category/:categoryId/:id',
			templateUrl: 'templates/projects.html',
			controller: 'projectsCtrl'
		});

	$stateProvider
		.state('about-us', {
			url: '/about-us',
			templateUrl: 'templates/about-us.html',
			controller: 'aboutUsCtrl'
		});

	$stateProvider
		.state('contact-us', {
			url: '/contact-us',
			templateUrl: 'templates/contact-us.html',
			controller: 'contactUsCtrl'
		});

	$stateProvider
		.state('career-n-goals', {
			url: '/career-n-goals',
			templateUrl: 'templates/career-n-goals.html',
			controller: 'careerAndGoalsCtrl'
		});

	$stateProvider
		.state('faq', {
			url: '/faq',
			templateUrl: 'templates/faq.html',
			controller: 'faqCtrl'
		});


	$urlRouterProvider.otherwise('/home');

}]);