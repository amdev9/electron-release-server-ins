angular.module('app.admin.uploaders.add-uploader-modal', [])
  .controller('AddAdminUploaderModalController', ['$scope', '$http', 'DataUploaderService', 'Notification', '$uibModalInstance',
    function($scope, $http, DataUploaderService, Notification, $uibModalInstance) {
      $scope.DataUploaderService = DataUploaderService;

      // console.log(DataUploaderService);
      $scope.uploader = {
        id: '',
        approved: ''
      };
      $scope.addUploader = function() {
 
        DataUploaderService.createUploader($scope.uploader)
          .then(function success(response) {
            $uibModalInstance.close();
          }, function error(response) {});
      };

      $scope.closeModal = function() {
        $uibModalInstance.dismiss();
      };
    }
  ]);
