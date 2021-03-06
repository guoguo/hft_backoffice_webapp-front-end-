(function() {
  'use strict';
  angular.module('app').factory('MyTaskService', MyTaskService);

  function MyTaskService($http,$rootScope,baseInfo) {
    var service = {};
    let SERVER = baseInfo.baseUrl;

    service.debug = true;

	
    service.queryBankTask = queryBankTask;
    service.queryData = queryData;
    service.queryCoinBankTask = queryCoinBankTask;
    service.queryCoinData = queryCoinData;
    service.goCoinUpstairs = goCoinUpstairs;
    service.goUpstairs = goUpstairs;
    service.rejectFun = rejectFun;
    service.rejectCoinFun = rejectCoinFun;
    service.queryDeposit = queryDeposit;
    service.queryCoinDeposit = queryCoinDeposit;
    service.queryIdCardTask = queryIdCardTask;
    service.deleteCustomerAuthorInfo = deleteCustomerAuthorInfo;
    service.updateCustomerAuthorInfo = updateCustomerAuthorInfo;
    service.queryCustomerAuthorInfo = queryCustomerAuthorInfo;
    service.addPosition = addPosition;

    service.SERVER = SERVER;

    return service;
	
	//同步数据
    function queryCoinData(params) {
      return _get("queryCoinData", params);
    };
	
	//查询数字货币充提任务
    function queryCoinBankTask(params) {
      return _get("queryCoinBankTask", params);
    };
	
	//查询我的人民币充提任务
    function queryData(params) {
      return _get("queryData", params);
    };
	
	//查询我的人民币充提任务
    function queryBankTask(params) {
      return _get("queryBankTask", params);
    };
	
	//提交数字货币上级任务
    function goCoinUpstairs(params) {
      return _post("goCoinUpstairs", params);
    };
	//提交上级任务
    function goUpstairs(params) {
      return _post("goUpstairs", params);
    };
	
	//数字资产拒绝
	function rejectCoinFun(params){
		return _post("rejectCoinFun", params);
	}
	
	//拒绝任务
    function rejectFun(params) {
      return _post("rejectFun", params);
    };
	
	//人民币某个用户充提
    function queryDeposit(params) {
      return _get("queryDeposit", params);
    };
	
	//数字货币某个用户充提
    function queryCoinDeposit(params) {
      return _get("queryCoinDeposit", params);
    };
	
	//查询所有用户认证信息
    function queryIdCardTask(params) {
      return _get("queryCustomerAuthorAll", params);
    };
	
	//用户二级身份验证失败
    function deleteCustomerAuthorInfo(params) {
      return _post("deleteCustomerAuthorInfo", params);
    };
	
	//用户二级身份验证
    function updateCustomerAuthorInfo(params) {
      return _post("updateCustomerAuthorInfo", params);
    };
	
	//查询某个用户认证信息
    function queryCustomerAuthorInfo(params) {
      return _get("queryCustomerAuthorInfo", params);
    };
	
	//手动加持仓
    function addPosition(params) {
      return _post("addPosition", params);
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
		console.log(res);
		return { success: false, message: res.data.status.message };
    } // end handleError

  } // end RegisterService
})();
