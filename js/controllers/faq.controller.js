app.controller('faqCtrl', function($timeout){
    $('.md-header').hide();
    $('.faq-page').hide();
    $('.new-footer').hide();
    
	$timeout(function() {
        $('.md-header').fadeIn();
        $('.faq-page').fadeIn();
        $('.new-footer').fadeIn();

    }, 500);
});