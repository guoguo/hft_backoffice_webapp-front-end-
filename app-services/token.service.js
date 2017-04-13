(function () {
  'use strict';

  angular
  .module('app')
  .factory('TokenService', TokenService);

  UserService.$inject = ['$http',];
  function TokenService($http) {
    var service = {};

    service.URL = "http://127.0.0.1:8080";

    service.Get = Get;
    service.Refresh = Refresh;

    function Refresh(){

      return $http.post('/refresh', { token }, { headers: {}}).then(handleSuccess, handleError('Error getting chart data'));
    }

    function Get(username, password){
      return $http.post('/get', { username: username, password: password }, { headers: {}}).then(handleSuccess, handleError('Error getting chart data'));
    }

    // private functions
    function handleSuccess(res) {
      if(res.data!=undefined && res.data.error==undefined)
        return { success: true, data: res.data };
      else
        return handleError(res);
    }

    function handleError(res) {
      if(res.error!=undefined)
        return { success: false, message: res.error };
      return { success: false, message: 'General connection error' };
    }

  }
})();
