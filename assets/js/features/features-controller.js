angular.module('app.features', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/features', {
        templateUrl: 'js/features/features.html',
        controller: 'featuresController as vm'
      });
  }])
  .controller('featuresController', ['$scope', '$window', 'PubSub', 'DataService',
    function($scope, $window, PubSub, DataService) {
      $scope.softDetailShow = function() {
        $window.open('/PinMakerPROv1.pdf');
      }
    }
  ]);


