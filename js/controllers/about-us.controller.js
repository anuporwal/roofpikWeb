app.controller('aboutUsCtrl', function($timeout){
    $('.md-header').hide();
    $('.about-us-page').hide();
    $('.footer').hide();

	$timeout(function() {
        $('.md-header').fadeIn();
        $('.about-us-page').fadeIn();
        $('.footer').fadeIn();

    }, 500);
});