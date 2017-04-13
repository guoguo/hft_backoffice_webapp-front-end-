(function() {
  'use strict';
  angular.module('app').factory('SuperService', SuperService);

  function SuperService($http,$rootScope) {
    var service = {};

    let SERVER = 'http://127.0.0.1:8060/';

    service.debug = true;
    service.queryLoginInfo = queryLoginInfo;
    service.queryUsers = queryUsers;
    service.queryAdminUsers = queryAdminUsers;
    service.frozen = frozen;
    service.unFrozen = unFrozen;
    service.cancellationUser = cancellationUser;

    service.SERVER = SERVER;

    return service;

    // 查询登录信息
    function queryLoginInfo(row,count) {
      return _get("queryLoginInfo", {row:row,count:count});
    }
   
	// 查询用户
    function queryAdminUsers(row,count) {
      return _get("queryAdminUsers", {row:row,count:count});
    }
	
	// 查询用户
    function queryUsers(row,count) {
      return _get("queryUsers", {row:row,count:count});
    }
	
	// 冻结用户
    function frozen(user_id) {
      return _post("frozenUser", {user_id:user_id});
    }
	
	// 解冻用户
    function unFrozen(user_id) {
      return _post("unFrozenUser", {user_id:user_id});
    }
	
	// 注销用户
    function cancellationUser(user_id) {
      return _post("cancellationUser", {user_id:user_id});
    }
	
	
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
