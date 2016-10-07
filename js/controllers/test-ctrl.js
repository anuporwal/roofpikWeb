app.controller('testCtrl', function($scope, $mdSidenav, $timeout) {
    $scope.close = function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav('right').close()
            .then(function() {
                $log.debug("close RIGHT is done");
            });
    };

    $scope.toggleRight = function() {
        $mdSidenav('right').open()
    }

    $timeout(function(){
    	console.log('called');
    	 map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 28.4247649, lng: 76.8496963 },
        zoom: 12
    });
    }, 3000)
   
})
