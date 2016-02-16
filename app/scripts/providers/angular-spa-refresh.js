/**
 * Created by rotem.perets on 02/07/16.
 */
(function(angular){
  angular
    .module('angularSpaRefreshApp')
    .provider('angularSpaRefresh', AngularSpaRefresh);

  function AngularSpaRefresh() {
    var versionFileUrl = 'version.json';
    var versionCheckInterval = 60000;
    var localStorageKey = 'angularSpaRefresh_version';

    this.init = function(url, interval){
      versionFileUrl = url;
      versionCheckInterval = interval;
    };

    /* jshint validthis:true */
    this.$get = AngularSpaRefreshHelper;

    AngularSpaRefreshHelper.$inject = ['$http', 'webStorage'];

    function AngularSpaRefreshHelper($http, webStorage) {
      var shouldRefreshOnNextStateTransition = false;

      return {
        shouldRefresh: shouldRefresh,
        startMonitoringAppVersion: startMonitoringAppVersion
      };

      function shouldRefresh() {
        return !!shouldRefreshOnNextStateTransition;
      }

      function startMonitoringAppVersion() {
        shouldRefreshOnNextStateTransition = false;
        var clientVersion = getClientVersion(localStorageKey);
        if(!clientVersion){
          clientVersion = 0;
          shouldRefreshOnNextStateTransition = true;
          setClientVersion(localStorageKey, clientVersion);
        }

        getServerVersionRecursive(parseInt(clientVersion));
      }

      function getServerVersionRecursive(clientVersion){
        $http({method: "GET",url: versionFileUrl})
          .then(function(result){
            var serverVersion = parseInt(result.data.version);
            if (serverVersion > clientVersion) {
              clientVersion = serverVersion;
              setClientVersion(localStorageKey, serverVersion);
              shouldRefreshOnNextStateTransition = true;
            }

            setTimeout(function () {
              getServerVersionRecursive(clientVersion);
            }, versionCheckInterval);
          }, function(error){
            setTimeout(function () {
              getServerVersionRecursive(clientVersion);
            }, versionCheckInterval);
          });
      }

      function getClientVersion(name){
        return webStorage.get(name);
      }

      function setClientVersion(name, value){
        webStorage.local.add(name, value);
      }
    }
  }

})(angular);
