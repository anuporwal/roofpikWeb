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

	$urlRouterProvider.otherwise('/test');

}]);