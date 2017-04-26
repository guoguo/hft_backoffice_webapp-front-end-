(function() {
	'use strict';
  angular
    .module('app')
    .factory('PrivateService', PrivateService);

  PrivateService.$inject = ['$http', '$cookies', '$rootScope'];
  function PrivateService($http, $cookies, $rootScope,baseInfo) {
    let service = {};

    let SERVER = baseInfo.baseUrl;

    service.debug = true;
    service.Balances = Balances;
    service.SetPassword = SetPassword;
    service.SetEmail = SetEmail;
    service.SetPhone = SetPhone;

    return service;


    function Balances() {
      console.log($cookies.getObject('globals').token);
      return _get("getBalances");
    }

    function SetEmail(old_email, new_email) {
      return _post('modifyEmail', {oldEmail: old_email, newEmail: new_email});
    }

    function SetPassword(old_password, new_password) {
      return _post('modifyPassword', {oldPsw: old_password, newPsw: new_password});
    }

    function SetPhone(old_phone, new_phone) {
      return _post('modifyPhone', {oldPhone: old_phone, newPhone: new_phone});
    }


		function _post(method, params) {
      return $http.post(SERVER + method ,params, { headers : { "x-access-token" :$cookies.getObject('globals').token }}).then(
        function(res){
					return handleSuccess(res);
				},
				function(res){
					return handleError(res);
				});
		} // end _post


		function _get(method, params) {
      return $http.get(SERVER + method ,{ headers : { "x-access-token" :$cookies.getObject('globals').token }}).then(
        function(res){
          console.log(res)
					return handleSuccess(res);
				},
				function(res){
					return handleError(res);
				});
		} // end _get
    // private functions
    function handleSuccess(res) {
      console.log(res.data);
      if(res.data!=undefined && res.data.status.success!=undefined && res.data.status.success)
        return { success: true, data: res.data.result};
      else
        return handleError(res);
    } // end handleSuccess

    function handleError(res) {
      console.log(res)
      if(res.error!=undefined)
        return { success: false, message: res.error };
      return { success: false, message: 'General connection error' };
    } // end handleError


  } // end BalanceService

})();
