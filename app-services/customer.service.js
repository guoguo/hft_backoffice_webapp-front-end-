(function() {
  'use strict';
  angular.module('app').factory('CustomerService', CustomerService);

  function CustomerService($http,$rootScope,baseInfo) {
    var service = {};

    let SERVER = baseInfo.baseUrl;

    service.debug = true;

    service.queryCustomerAllUsers = queryCustomerAllUsers;
    service.frozenCustomerUser = frozenCustomerUser;
    service.unFrozenCustomerUser = unFrozenCustomerUser;
    service.deleteCustomerUser = deleteCustomerUser;

    service.SERVER = SERVER;

    return service;

	//查询所有用户
    function queryCustomerAllUsers(params) {
      return _get("queryCustomerAllUsers", params);
    };
	
	//加入黑名单用户
    function frozenCustomerUser(params) {
      return _post("frozenCustomerUser", params);
    };
	
	//移除黑名单用户
    function unFrozenCustomerUser(params) {
      return _post("unFrozenCustomerUser", params);
    };
	
	//删除用户
    function deleteCustomerUser(params) {
      return _post("deleteCustomerUser", params);
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
