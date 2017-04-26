(function() {
  'use strict';
  angular.module('app').factory('AdminService', AdminService);

  function AdminService($http,$rootScope,baseInfo) {
    var service = {};
	
    let SERVER = baseInfo.baseUrl;

    service.debug = true;
    service.getRoleInfo = getRoleInfo;
    service.queryDepartment = queryDepartment;
    service.createUser = createUser;

    service.SERVER = SERVER;

    return service;

    // 查询权限和菜单信息
    function getRoleInfo() {
      return _get("queryRole", {});
    }
   
    // 查询所有的部门
    function queryDepartment() {
      return _get("queryDepartment", {});
    }
	
    // 创建用户
    function createUser(params) {
      return _post("createUser", params);
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
			
			return { success: false, message: res.data.status.message };
			//return { success: false, message: 'General connection error' };
    } // end handleError

  } // end RegisterService
})();
