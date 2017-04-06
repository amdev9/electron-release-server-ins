angular.module('app.admin.uploaders.uploader-table', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/admin/uploaders', {
        templateUrl: 'js/admin/uploaders/uploader-table/uploader-table.html',
        controller: 'AdminUploaderTableController',
        data: {
          private: true
        }
      });
  }])
  .controller('AdminUploaderTableController', ['$scope', 'Notification', 'DataUploaderService','$uibModal',
    function($scope, Notification, DataUploaderService, $uibModal) {
      $scope.DataUploaderService = DataUploaderService;

      // console.log(DataUploaderService);

      $scope.openEditUploaderModal = function(uploader, uploaderHex) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'js/admin/uploaders/edit-uploader-modal/edit-uploader-modal.html',
          controller: 'EditAdminUploaderModalController',
          resolve: {
            uploader: function() {
              return uploader;
            }
          }
        });
        

        modalInstance.result.then(function() {}, function() {});
      };
      $scope.openAddUploaderModal = function() {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'js/admin/uploaders/add-uploader-modal/add-uploader-modal.html',
          controller: 'AddAdminUploaderModalController'
        });
        modalInstance.result.then(function() {}, function() {});
      };
    }
  ]);
