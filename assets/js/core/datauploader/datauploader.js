angular.module('app.core.datauploader', [
    'app.core.datauploader.service'
  ])
  .run(['DataUploaderService',
    function(DataUploaderService) {
      DataUploaderService.initializeUp();
    }
  ]);
