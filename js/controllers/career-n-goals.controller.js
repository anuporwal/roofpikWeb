app.controller('careerAndGoalsCtrl', function($timeout){
    $('.md-header').hide();
    $('.career-n-goals-page').hide();
    $('.new-footer').hide();
    
	$timeout(function() {
        $('.md-header').fadeIn();
        $('.career-n-goals-page').fadeIn();
        $('.new-footer').fadeIn();

    }, 500);
});