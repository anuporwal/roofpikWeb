app.controller('faqCtrl', function($timeout){
    $('.md-header').hide();
    $('.faq-page').hide();
    $('.footer').hide();
    
	$timeout(function() {
        $('.md-header').fadeIn();
        $('.faq-page').fadeIn();
        $('.footer').fadeIn();

    }, 500);
});