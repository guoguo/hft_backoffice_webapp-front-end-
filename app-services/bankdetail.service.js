(function() {
  'use strict';
  angular.module('app').factory('BankDetailService', BankDetailService);

  function BankDetailService($http,$rootScope,baseInfo) {
    var service = {};

    let SERVER = baseInfo.baseUrl;

    service.debug = true;

    service.queryByTransferId = queryByTransferId;

    service.SERVER = SERVER;

    return service;

	//根据交易id查询该条交易信息
    function queryByTransferId(params) {
      return _get("queryByTransferId", params);
    };
	
	
	function _post(method, params) {
		return $http.post(SERVER + method , params ,{ headers : { "x-access-token" :$rootScope.globals.token }}).then(
			function(res){
			  return handleSuccess(res);
			},
			function(res){
				
			  return handleError(res);
		});
	}

	function _get(method, params){
		return $http.get(SERVER + method ,{ params:params , headers : { "x-access-token" :$rootScope.globals.token }}).then(
		    function(res){
				return handleSuccess(res);
			},
			function(res){
				return handleError(res);
			}
		);
	}

    // private functions
    function handleSuccess(res) {
		if(res.data!=undefined && res.data.status.success!=undefined && res.data.status.success)
			return { success: true, data: res.data.status.message};
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
