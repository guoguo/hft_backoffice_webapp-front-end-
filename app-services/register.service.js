(function() {
  'use strict';
  angular.module('app').factory('RegisterService', RegisterService);

  function RegisterService($http) {
    var service = {};

    let SERVER = 'http://127.0.0.1:8090/';

    service.debug = true;
    service.Register = Register;
    service.GetCaptcha = GetCaptcha;

    service.SERVER = SERVER;

    return service;

    // Register posts the following
    function Register(mobileNumber, checkCodeId, checkCode) {
      return _post("register", {mobileNumber: mobileNumber,
                                                  checkCodeId: checkCodeId,
                                                  checkCode:  checkCode});
    }

    // Obtain the picture
    function GetCaptcha() {
      return _get("captcha.png", {});
    } // end GetCaptcha


		function _post(method, params) {
      return $http.post(SERVER + method , params ,{ headers : {}}).then(
        function(res){
          return handleSuccess(res);
        },
        function(res){
          return handleError(res);
        });
		} // end _post

		function _get(method, params){
			return $http.get(SERVER + method , params ,{ headers : {}}).then(
				 function(res){
					 return handleSuccess(res);
				 },
				 function(res){
					 return handleError(res);
				 });
		} // end _get

    // private functions
    function handleSuccess(res) {
      if(res.data!=undefined && res.data.status.success!=undefined && res.data.status.success)
        return { success: true, data: res.data.result};
      else
        return handleError(res);
    } // end handleSuccess

    function handleError(res) {
      if(res.error!=undefined)
        return { success: false, message: res.error };
      return { success: false, message: 'General connection error' };
    } // end handleError

  } // end RegisterService
})();
