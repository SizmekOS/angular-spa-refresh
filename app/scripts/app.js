'use strict';

/**
 * @ngdoc overview
 * @name angularSpaRefreshApp
 * @description
 * # angularSpaRefreshApp
 *
 * Main module of the application.
 */
angular()
  .module('angularSpaRefreshApp', [
    'webStorageModule'
  ]).config(['angularSpaRefreshProvider', function(angularSpaRefreshProvider){
    angularSpaRefreshProvider.init('version.js', 5000);
  }]).run(['angularSpaRefresh', '$timeout', function(angularSpaRefresh, $timeout){
    angularSpaRefresh.startMonitoringAppVersion();

    checkIfShouldRefresh();

    function checkIfShouldRefresh() {
      if (angularSpaRefresh.shouldRefresh()) {
        location.reload();
      } else {
        $timeout(function(){
          checkIfShouldRefresh();
        },1000);
      }
    }
  }]);
