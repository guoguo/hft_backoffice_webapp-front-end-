(function() {
  'use strict';
  angular.module('app').factory('ModifyConfigCustomeService', ModifyConfigCustomeService);

  function ModifyConfigCustomeService($http,$rootScope,baseInfo) {
    var service = {};

    let SERVER = baseInfo.baseUrl;

    service.debug = true;
    service.queryDpWdByUid = queryDpWdByUid;
    service.modifyDepositAndWithdrawals = modifyDepositAndWithdrawals;
    service.addDepositAndWithdrawals = addDepositAndWithdrawals;
    service.queryWholeSaleById = queryWholeSaleById;
    service.modifyWholeSale = modifyWholeSale;
    service.addWholeSale = addWholeSale;
    service.SERVER = SERVER;
    return service;
	
    //查询某条充提
    function queryDpWdByUid(params) {
      return _get("queryDpWdByUid", params);
    }
	
    //添加某条充提
    function addDepositAndWithdrawals(params) {
      return _post("addDepositAndWithdrawals", params);
    }
	
    //修改某条充提
    function modifyDepositAndWithdrawals(params) {
      return _post("modifyDepositAndWithdrawals", params);
    }
	
	//查询某条大小额
    function queryWholeSaleById(params) {
      return _get("queryWholeSaleById", params);
    }
	
	//修改某条大小额
    function modifyWholeSale(params) {
      return _post("modifyWholeSale", params);
    }
	
	//添加某条大小额
    function addWholeSale(params) {
      return _post("addWholeSale", params);
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
			return { success: false, message:  res.data.status.message };
			return { success: false, message: res.data.status.message };
    } // end handleError

  } // end RegisterService
})();
