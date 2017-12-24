angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $state, $ionicModal, $timeout, $q) {

      $scope.jsBuffer = {
        Image: undefined
      };

      $scope.formControls =
      {
        captureEnabled : true,
        liveRefreshEnabled : false
      };

      $scope.cameraPlus = null;

      window.ionic.Platform.ready(function() {
        console.log('Ionic ready... Loading plugins.');

        $scope.cameraPlus = ( cordova && cordova.plugins && cordova.plugins.CameraPlus ) ? cordova.plugins.CameraPlus : null;

        $scope.switchCapture(true);
      });


      $scope.switchCapture = function (enabled)
      {
        if (enabled)
        {
          $scope.startCapture("");
        }
        else
        {
          $scope.stopCapture();
        }
      };

      $scope.startCapture = function() {

        if ( $scope.cameraPlus ) {
          $scope.cameraPlus.startCamera(function(){
            console.log('Capture Started');
            $scope.refreshPreview();
          },function( error ){
            console.log('CameraServer StartCapture failed: ' + error);
          });
        } else {
           console.log('CameraServer StartCapture: CameraPlus plugin not available/ready.');
        }
      };

      $scope.stopCapture = function() {

        if ( $scope.cameraPlus ) {
          $scope.cameraPlus.stopCamera(function(){
            console.log('Capture Stopped');
          },function( error ){
            console.log('CameraServer StopCapture failed: ' + error);
          });
        } else {
          console.log('CameraServer StopCapture: CameraPlus plugin not available/ready.');
        }
      };

      $scope.switchLiveRefresh = function (enabled)
      {
        if (enabled)
        {
          $scope.asyncGetImage().then();
        }
        else
        {
        }
      };

      $scope.getImage = function() {
        $scope.asyncGetImage().then(function()
        {
          if (!$scope.$$phase) {
            $scope.$apply();
          }
        });
      };

      $scope.refreshPreview = function () {
        if ($scope.formControls.liveRefreshEnabled) {
          setTimeout(function () {
            $scope.$apply(function () {
              $scope.asyncGetImage().then();
            });
          }, 40);
        }
      };

      $scope.asyncGetImage = function() {
        return $q(function(resolve, reject) {

          $scope.cameraPlus.getJpegImage(function(jpgData)
          {
            if ($scope.jsBuffer.Image != jpgData)
            {
              $scope.jsBuffer.Image = jpgData;
            }
            else
            {
              $scope.refreshPreview();
            }

            resolve(true);

          }, function()
          {
              console.log('getImage failed');
              reject('getImage failed');
          });
        });
      };

    })

;
