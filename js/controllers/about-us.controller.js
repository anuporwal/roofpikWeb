app.controller('aboutUsCtrl', function($timeout){
    $('.md-header').hide();
    $('.about-us-page').hide();
    $('.new-footer').hide();

	$timeout(function() {
        $('.md-header').fadeIn();
        $('.about-us-page').fadeIn();
        $('.new-footer').fadeIn();

    }, 500);
});