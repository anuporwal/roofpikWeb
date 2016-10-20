app.controller('careerAndGoalsCtrl', function($timeout){
    $('.md-header').hide();
    $('.career-n-goals-page').hide();
    $('.footer').hide();
    
	$timeout(function() {
        $('.md-header').fadeIn();
        $('.career-n-goals-page').fadeIn();
        $('.footer').fadeIn();

    }, 500);
});