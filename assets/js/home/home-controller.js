angular.module('app.home', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'js/home/home.html',
        controller: 'HomeController as vm'
      });
  }])
  .controller('HomeController', ['$scope', '$window', 'PubSub', 'DataService',
    function($scope, $window, PubSub, DataService) {
      $scope.softDetailShow = function() {
        $window.open('/PinMakerPROv1.pdf');
      }
    }
  ]);
