(function () {
    'use strict';

    angular
        .module('app')
        .controller('ModifyConfigCustomerController', ModifyConfigCustomerController);

    function ModifyConfigCustomerController($scope,$stateParams,ModifyConfigCustomeService,Util) {
		
        var vm = this;
		$scope.params = {
			title:"修改用户充提限额",
			single_limit:"",
			accumulate_limit:"",
			add_submit:true,
			addFlag:false
		};
		
		var queryparams = {};
		var user_id = $stateParams.user_id;
		var asset_type = $stateParams.asset_type;
		var is_currency = $stateParams.is_currency;
		user_id=="id" ? $scope.params.title="添加用户充提限额" : $scope.params.title="修改用户充提限额";
		
		var levals = ['leval1','leval2','leval3','leval4','leval5'];
		var dwData = ['DEPOSIT','WITHDRAVAL'];
		
		(function(){
			queryparams={
				user_id:user_id,
				asset_type:asset_type,
				is_currency:is_currency
			}
			user_id=="id" ? $scope.params.addFlag=true : queryDpWdByUid(queryparams);
		})()
		//查询某条默认提现限额
		function queryDpWdByUid(queryparams){
			ModifyConfigCustomeService.queryDpWdByUid(queryparams).then((response) =>{
				console.log(response);
				if(response.success){
					$scope.params.id = response.data.customer_user_id;
					$scope.params.description = response.data.description;
					$scope.params.asset_type = response.data.asset_type;
					$scope.params.is_currency = response.data.is_currency;
					$scope.params.single_limit = response.data.single_limit/10000000;
					$scope.params.accumulate_limit = response.data.accumulate_limit/10000000;
				}else{
					Util.dialog("没有查到相关数据!");
				}
			});
		}
		
		//修改默认限额
		$scope.modifyDefaultLimit = function(){
			var data = {
				user_id:user_id,
				single_limit:$scope.params.single_limit,
				accumulate_limit:$scope.params.accumulate_limit
			}
			if(user_id=="id"){
				if($scope.params.single_limit==""){
					Util.dialog("请填写单笔限额");
				}else if(isNaN($scope.params.single_limit)){
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
					data.user_id = $scope.params.user_id;
					data.description = $scope.params.description;
					data.asset_type = $scope.params.asset_type;
					data.is_currency = $scope.params.is_currency;
					ModifyConfigCustomeService.addDepositAndWithdrawals(data).then((response) =>{
						console.log(response)
						if(response.success){
							Util.dialog("恭喜，添加默认限额成功!");
							$scope.params.add_submit = false;
						}else{
							Util.dialog("对不起，添加默认限额失败,原因:用户该类型账户阀值已经存在");
						}
					});
				}
			}else{
				if($scope.params.single_limit==""){
					Util.dialog("请填写单笔限额");
				}else if(isNaN($scope.params.single_limit)){
					Util.dialog("单笔限额必须为数字");
				}else if($scope.params.accumulate_limit==""){
					Util.dialog("请填写累计限额");
				}else if(isNaN($scope.params.accumulate_limit)){
					Util.dialog("累计限额必须为数字");
				}else{
					ModifyConfigCustomeService.modifyDepositAndWithdrawals(data).then((response) =>{
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
