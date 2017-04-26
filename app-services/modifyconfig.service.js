(function() {
  'use strict';
  angular.module('app').factory('ModifyConfigService', ModifyConfigService);

  function ModifyConfigService($http,$rootScope,baseInfo) {
    var service = {};

    let SERVER = baseInfo.baseUrl;

    service.debug = true;
    service.queryConfigDefaultLimitById = queryConfigDefaultLimitById;
    service.modifyDefaultLimit = modifyDefaultLimit;
    service.addConfigDefaultLimit = addConfigDefaultLimit;
    service.SERVER = SERVER;
    return service;
	
    //查询某条默认充提
    function queryConfigDefaultLimitById(params) {
      return _get("queryConfigDefaultLimitById", params);
    }
	
    //添加某条默认充提
    function addConfigDefaultLimit(params) {
      return _post("addConfigDefaultLimit", params);
    }
	
    //修改某条默认充提
    function modifyDefaultLimit(params) {
      return _post("modifyDefaultLimit", params);
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
