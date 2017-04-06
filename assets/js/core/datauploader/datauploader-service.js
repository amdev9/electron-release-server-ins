angular.module('app.core.datauploader.service', [
    'ngSails'
  ])
  .service('DataUploaderService', [
    '$sails', '$q', '$log', '$http', 'Notification', 'Upload', 'PubSub',
    'AuthService',
    function(
      $sails, $q, $log, $http, Notification, Upload, PubSub,
      AuthService
    ) {
      var self = this;

      /**
       * Main Data object, containing all of the version objects and their
       * nested assets
       * @type {array}
       */
       
      self.data = [];

      /**
      * An array of all approve statuses 
      * @type {Array}
      */
      self.availableStatuses = [
        true,
        false
      ];


      var UNKNOWN_ERROR_MESSAGE = 'An Unkown Error Occurred.';

      /**
       * Compare uploader objects using creation dates
       * Pass to Array.sort for a descending array
       * @param  {Object} v1 Uploader object one
       * @param  {Object} v2 Uploader object two
       * @return {-1|0|1}    Whether one is is less than or greater
       */
      self.compareUploader = function(v1, v2) {
        return -compareVersions(v1.name, v2.name); // FIX to dates
      };

      /**
       * Sort version data in descending order
       */
      self.sortUploaders = function() { // compare by creation date
        self.data.sort(self.compareUploader);
      };

      /**
       * Shows an appropriate error notification method for every invalid
       * attribute.
       * @param  {Object} response A response object returned by sails after a
       *                           erroneous blueprint request.
       */
      var showAttributeWarnings = function(response) {
        if (!_.has(response, 'data.invalidAttributes')) {
          return;
        }

        _.forEach(response.data.invalidAttributes,
          function(attribute, attributeName) {
            warningMessage = '';

            _.forEach(attribute, function(attributeError) {
              warningMessage += (attributeError.message || '') + '<br />';
            });

            Notification.warning({
              title: 'Invalid attribute: ' + attributeName,
              message: warningMessage
            });
          });
      };

      /**
       * Shows notifications detailing the various errors described by the
       * response object
       * @param  {Object} response   A response object returned by sails after a
       *                             erroneous request.
       * @param  {String} errorTitle The string to be used as a title for the
       *                             main error notification.
       */
      var showErrors = function(response, errorTitle) {
        if (!response) {
          return Notification.error({
            title: errorTitle,
            message: UNKNOWN_ERROR_MESSAGE
          });
        }

        Notification.error({
          title: errorTitle,
          message: response.summary || UNKNOWN_ERROR_MESSAGE
        });

        showAttributeWarnings(response);
      };

      /**
       * Creates a version using the api.
       * Requires authentication (token is auto-injected).
       * @param  {Object}  version     A object containing all of the parameters
       *                               we would like to create the version with.
       * @return {Promise}             A promise which is resolve/rejected as
       *                               soon as we know the result of the operation
       *                               Contains the response object.
       */
      self.createUploader = function(uploader) {
        if (!uploader) {
          throw new Error('An uploader object is required for creation');
        }

        return $http.post('/api/uploader', uploader)
          .then(function(response) {
            Notification.success('Uploader Created Successfully.');
            return response;
          }, function(response) {

            var errorTitle = 'Unable to Create Uploader';

            showErrors(response, errorTitle);

            return $q.reject(response);
          });
      };

      /**
       * Updates a version using the api.
       * Requires authentication (token is auto-injected).
       * @param  {Object}  version     A object containing all of the parameters
       *                               we would like to update the version with.
       * @param  {String}  versionName The version's original name (in case we
       *                               are trying to change it)
       * @return {Promise}             A promise which is resolve/rejected as
       *                               soon as we know the result of the operation
       *                               Contains the response object.
       */
      self.updateUploader = function(uploader, uploaderId) {
        if (!uploader) {
          throw new Error('An uploader object is required for updating');
        }
        if (!uploaderId) {
          throw new Error('An uploader Id is required for updating');
        }

        return $http.post('/api/uploader/' + uploaderId, uploader)
          .then(function(response) {
            Notification.success('Uploader Updated Successfully.');

            return response;
          }, function(response) {
            var errorTitle = 'Unable to Update Uploader';

            showErrors(response, errorTitle);

            return $q.reject(response);
          });
      };

      /**
       * Deletes a version using the api.
       * Requires authentication (token is auto-injected).
       * @param  {Object}  versionName The name of the version that we would
       *                               like to delete.
       * @return {Promise}             A promise which is resolve/rejected as
       *                               soon as we know the result of the operation
       *                               Contains the response object.
       */
      self.deleteUploader = function(uploaderId) {
        if (!uploaderId) {
          throw new Error('A uploader Id is required for deletion');
        }

        return $http.delete('/api/uploader/' + uploaderId)
          .then(function success(response) {
            Notification.success('Uploader Deleted Successfully.');

            return response;
          }, function error(response) {
            var errorTitle = 'Unable to Delete Version';

            showErrors(response, errorTitle);

            return $q.reject(response);
          });
      };

      $sails.on('uploader', function(msg) { // FIX
        if (!msg) {
          return;
        }
        $log.log(msg.verb);
        PubSub.publish('data-change');

      });
      /**
       * Retrieve & subscribe to all version & asset data.
       * @return {Promise} Resolved once data has been retrieved
       */
      self.initializeUp = function() {
        var deferred = $q.defer();

        // Get the initial set of releases from the server.
        // XXX This will also subscribe us to future changes regarding releases
        // sails
        $http.get('/api/uploader')
          .success(function(data) {
            self.data = data; // check for Date in this array
            // self.sortUploaders();
            deferred.resolve(true);

            PubSub.publish('data-change');
          })
          .error(function(data, status) {
            deferred.reject(data);
          });

        return deferred.promise;
      };

    
    }
  ]);
