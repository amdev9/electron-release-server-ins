angular.module('app.contacts', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/contacts', {
        templateUrl: 'js/contacts/contacts.html',
        controller: 'contactsController as vm'
      });
  }])
  .controller('contactsController', ['$scope', '$window', 'PubSub', 'DataService',
    function($scope, $window, PubSub, DataService) {
      $scope.softDetailShow = function() {
        $window.open('/PinMakerPROv1.pdf');
      }
    }
  ]);
