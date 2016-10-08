app.directive('reviewRatings', reviewRatings);

function reviewRatings() {
    return {
        restrict: 'AE',
        replace: true,
        template: '<div class="text-center review_ratings">' +
            '<span ng-style="iconOffColor" ng-click="ratingsClicked(1)" ng-if="rating < 1" ng-class="{\'read_only\':(readOnly)}"><i class="material-icons">star_border</i></span>' +
            '<span ng-style="iconOnColor" ng-if="rating > 0" ng-class="{\'read_only\':(readOnly)}"><i class="material-icons">star</i></span>' +
            '<span ng-style="iconOffColor" ng-click="ratingsClicked(2)" ng-if="rating < 2" ng-class="{\'read_only\':(readOnly)}"><i class="material-icons">star_border</i></span>' +
            '<span ng-style="iconOnColor" ng-if="rating > 1" ng-class="{\'read_only\':(readOnly)}"><i class="material-icons">star</i></span>' +
            '<span ng-style="iconOffColor" ng-click="ratingsClicked(3)" ng-if="rating < 3" ng-class="{\'read_only\':(readOnly)}"><i class="material-icons">star_border</i></span>' +
            '<span ng-style="iconOnColor" ng-if="rating > 2" ng-class="{\'read_only\':(readOnly)}"><i class="material-icons">star</i></span>' +
            '<span ng-style="iconOffColor" ng-click="ratingsClicked(4)" ng-if="rating < 4" ng-class="{\'read_only\':(readOnly)}"><i class="material-icons">star_border</i></span>' +
            '<span ng-style="iconOnColor" ng-if="rating > 3" ng-class="{\'read_only\':(readOnly)}"><i class="material-icons">star</i></span>' +
            '<span ng-style="iconOffColor" ng-click="ratingsClicked(5)" ng-if="rating < 5" ng-class="{\'read_only\':(readOnly)}"><i class="material-icons">star_border</i></span>' +
            '<span ng-style="iconOnColor" ng-if="rating > 4" ng-class="{\'read_only\':(readOnly)}"><i class="material-icons">star</i></span>' +
            '</div>',
        scope: {
            ratingsObj: '=ratingsobj',
            index: '=index'
        },
        link: function(scope, element, attrs) {

            //Setting the default values, if they are not passed
            scope.iconOnColor = scope.ratingsObj.iconOnColor || 'rgb(255,87,34)';
            scope.iconOffColor = scope.ratingsObj.iconOffColor || 'rgb(140, 140, 140)';
            scope.rating = scope.ratingsObj.rating || 0;
            scope.minRating = scope.ratingsObj.minRating || 0;
            scope.readOnly = scope.ratingsObj.readOnly || false;
            scope.index = scope.index || 0;

            //Setting the color for the icon, when it is active
            scope.iconOnColor = {
                color: scope.iconOnColor
            };

            //Setting the color for the icon, when it is not active
            scope.iconOffColor = {
                color: scope.iconOffColor
            };

            //Setting the rating
            scope.rating = (scope.rating > scope.minRating) ? scope.rating : scope.minRating;

            scope.$watch('ratingsObj.rating', function(newValue) {
                setRating(newValue);
            });

            function setRating(val, uiEvent) {
                if (scope.minRating !== 0 && val < scope.minRating) {
                    scope.rating = scope.minRating;
                } else {
                    scope.rating = val;
                }
                if (uiEvent) scope.ratingsObj.callback(scope.rating, scope.index);
            }

            //Called when he user clicks on the rating
            scope.ratingsClicked = function(val) {
                setRating(val, true);
            };
        }
    };
}
