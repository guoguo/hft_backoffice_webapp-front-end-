(function() {
  'use strict';
  angular.module('app').factory('AuditService', AuditService);

  function AuditService($http,$rootScope) {
    var service = {};

    let SERVER = 'http://127.0.0.1:8060/';

    service.debug = true;

	
    service.getUserInfoById = getUserInfoById;
    service.queryTodayAudit = queryTodayAudit;
    service.getMarkets = getMarkets;
    service.exportExcel = exportExcel;

    service.SERVER = SERVER;

    return service;
	
	//默认查询所有日志
    function exportExcel(params) {
      return _get("exportExcel", params);
    };
	
	//查询操作员用户信息
    function getUserInfoById(params) {
      return _get("getUserInfoById", params);
    };
	
	//默认查询所有日志
    function queryTodayAudit(params) {
      return _post("queryAuditByUserId", params);
    };
	
	//查询所有市场
    function getMarkets(params) {
      return _get("getMarkets", params);
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
