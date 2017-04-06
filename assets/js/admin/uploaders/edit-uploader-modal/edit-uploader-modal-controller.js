angular.module('app.admin.uploaders.edit-uploader-modal', [])
  .controller('EditAdminUploaderModalController', ['$scope', 'DataUploaderService', 'Notification', '$uibModalInstance', '$uibModal', 'uploader',
    function($scope, DataUploaderService, Notification, $uibModalInstance, $uibModal, uploader) {
      $scope.DataUploaderService = DataUploaderService;

      // Clone so not to polute the original
      $scope.uploader = _.cloneDeep(uploader);
   

      $scope.acceptEdit = function() {
          // console.log(uploader);
        DataUploaderService.updateUploader($scope.uploader, uploader.id)
          .then(function success(response) {
            $uibModalInstance.close();
          }, function error(response) {});
      };

      $scope.deleteUploader = function() {
        DataUploaderService.deleteUploader(uploader.id)
          .then(function success(response) {
            $uibModalInstance.close();
          }, function error(response) {});
      };

      $scope.closeModal = function() {
        $uibModalInstance.dismiss();
      };
    }
  ]);
