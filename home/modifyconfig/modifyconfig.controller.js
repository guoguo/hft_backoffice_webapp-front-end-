(function () {
    'use strict';

    angular
        .module('app')
        .controller('ModifyConfigController', ModifyConfigController);

    function ModifyConfigController($scope,$stateParams,ModifyConfigService,ConfigDataService,Util) {
		
        var vm = this;
		$scope.params = {
			title:"修改默认充提限额",
			simgle_limit:"",
			accumulate_limit:"",
			add_submit:true,
			addFlag:false
		};
		
		var queryparams = {};
		var configId = $stateParams.configId;
		configId=="id" ? $scope.params.title="添加默认充提限额" : $scope.params.title="修改默认充提限额";
		
		var levals = ['leval1','leval2','leval3','leval4','leval5'];
		var dwData = ['DEPOSIT','WITHDRAVAL'];
		
		(function(){
			queryparams={
				id:configId
			}
			configId=="id" ? $scope.params.addFlag=true : queryConfigDefaultLimitById(queryparams);
		})()
		//查询某条默认提现限额
		function queryConfigDefaultLimitById(queryparams){
			ModifyConfigService.queryConfigDefaultLimitById(queryparams).then((response) =>{
				if(response.success){
					$scope.params.id = response.data[0].id;
					$scope.params.description = response.data[0].description;
					$scope.params.asset_type = response.data[0].asset_type;
					$scope.params.is_currency = response.data[0].is_currency;
					$scope.params.leval = response.data[0].leval;
					$scope.params.simgle_limit = response.data[0].simgle_limit;
					$scope.params.accumulate_limit = response.data[0].accumulate_limit;
				}else{
					Util.dialog("没有查到相关数据!");
				}
			});
		}
		
		//修改默认限额
		$scope.modifyDefaultLimit = function(){
			var data = {
				id:configId,
				simgle_limit:$scope.params.simgle_limit,
				accumulate_limit:$scope.params.accumulate_limit
			}
			if(configId=="id"){
				if($scope.params.simgle_limit==""){
					Util.dialog("请填写单笔限额");
				}else if(isNaN($scope.params.simgle_limit)){
					Util.dialog("单笔限额必须为数字");
				}else if($scope.params.accumulate_limit==""){
					Util.dialog("请填写累计限额");
				}else if(isNaN($scope.params.accumulate_limit)){
					Util.dialog("累计限额必须为数字");
				/*}else if($scope.params.description==""){
					Util.dialog("请填写描述");
				}else if($scope.params.asset_type==""){
					Util.dialog("请填写账户类型");
				}else if($scope.params.is_currency==""){
					Util.dialog("请填写充提类型");
				}else if($scope.params.leval==""){
					Util.dialog("请填写用户等级类型");
				}else if(levals.indexOf($scope.params.leval)==-1){
					Util.dialog("请填写正确的用户等级类型");*/
				}else{
					data.description = $scope.params.description;
					data.asset_type = $scope.params.asset_type;
					data.is_currency = $scope.params.is_currency;
					data.leval = $scope.params.leval;
					ModifyConfigService.addConfigDefaultLimit(data).then((response) =>{
						if(response.success){
							Util.dialog("恭喜，添加默认限额成功!");
							$scope.params.add_submit = false;
						}else{
							Util.dialog("对不起，添加默认限额失败,原因：重复的默认限额!");
						}
					});
				}
			}else{
				if($scope.params.simgle_limit==""){
					Util.dialog("请填写单笔限额");
				}else if(isNaN($scope.params.simgle_limit)){
					Util.dialog("单笔限额必须为数字");
				}else if($scope.params.accumulate_limit==""){
					Util.dialog("请填写累计限额");
				}else if(isNaN($scope.params.accumulate_limit)){
					Util.dialog("累计限额必须为数字");
				}else{
					ModifyConfigService.modifyDefaultLimit(data).then((response) =>{
						if(response.success){
							Util.dialog("恭喜，修改默认限额成功!");
							$scope.params.add_submit = false;
						}else{
							Util.dialog("对不起，修改默认限额失败!");
						}
					});
				}
			}
		};
		//返回
		$scope.back = function(){
			window.history.go(-1);
		}
		
    }
})();
