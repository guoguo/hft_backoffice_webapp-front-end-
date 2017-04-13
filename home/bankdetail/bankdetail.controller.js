(function () {
    'use strict';

    angular
        .module('app')
        .controller('BankDetailController', BankDetailController);

    function BankDetailController($scope,$stateParams,MyTaskService,BankDepositService,BankDetailService) {

		console.log($stateParams.tranfer_id);
		$scope.params = {
			dialogMes:"",
			symbol:0,
			index:-1,
			user_id:'',
			allFlag:true,
			rejectFlag:true,
			errMsg:"",
			errSymbol:false,
			userinfoFlag:true,
			userInfo:{},
			tranferInfo:{}
		};
		//提交上级数据
		$scope.goUpdtariParam={
			bank_transfer_id:0,
			system_status:1,
			customer_user_id:0,
			amount:0,
			is_currency:'',
			show_user_status:0
		};
		//拒绝数据
		$scope.rejectData={
			bank_transfer_id:0,
			system_status:1
		};
		
		//各种查询请求数句
		var params = {
			is_currency:'DEPOSIT',
			row:0,
			count:10
		};
		
		//初始化查询
		(function init(){
			$scope.symbol = window.localStorage['symbols'];
			if($scope.symbol==0){
				$scope.params.rejectFlag = false;
			}
			var userparams ={
				'customer_user_id':$stateParams.user_id
			};
			queryCustomerInfo(userparams);
			var transferparams ={
				'bank_transfer_id':$stateParams.tranfer_id
			};
			queryByTransferId(transferparams);
		})();
		
		
		
		
		//查询用户信息
		function queryCustomerInfo(user_id){
			BankDepositService.queryCustomerInfo(user_id).then((response) => {
				if(response.success){
					if(response.data.length!=0){
						$scope.params.userinfoFlag = true;
						$scope.params.userInfo = response.data[0];
					}else{
						$scope.params.userinfoFlag = false;
						$scope.params.errMsg="没查到用户信息!";
						$scope.params.errSymbol=true;
						setTimeHide();
					}
				}
			});
		};
		
		function queryByTransferId(tranferparam){
			BankDetailService.queryByTransferId(tranferparam).then((response) => {
				console.log(response);
				if(response.success){
					$scope.params.tranferInfo = response.data;
				}
			});
		};
		
		
		//判断是否是当前自己可以操作的数据
		$scope.isSelf = function(show_status,role_symbol){
			var is = false;
			if(show_status==1 && role_symbol==$scope.symbol){
				is = true;
			}
			return is;
		}
		
		//拒绝
		$scope.reject = function(index){
			showAndHide("show");
			$scope.params.symbol = 9;
			$scope.params.index = index;
			$scope.params.dialogMes = "您确定拒绝该操作吗？"
			$scope.rejectData.bank_transfer_id=$scope.params.tranferInfo.bank_transfer_id;
			$scope.rejectData.system_status=-1;
		};
		//异常
		$scope.abnormal = function(){
			showAndHide("show");
			$scope.params.symbol = 10;
			$scope.params.dialogMes = "您确定将该操作加入异常吗？"
		};
		
		//提交上级
		$scope.goUpstairs = function(index){
			showAndHide("show");
			$scope.params.index = index;
			$scope.params.symbol = 11;
			$scope.params.dialogMes = "您确定提交该操作吗？"
			$scope.goUpdtariParam.leval=$scope.params.userInfo.vip_level;
			$scope.goUpdtariParam.bank_transfer_id=$scope.params.tranferInfo.bank_transfer_id;
			$scope.goUpdtariParam.system_status=$scope.params.tranferInfo.system_status+1;
			$scope.goUpdtariParam.show_user_status=$scope.params.tranferInfo.show_user_status;
			if($scope.symbol==3){
				$scope.goUpdtariParam.system_status=0;
				$scope.goUpdtariParam.show_user_status=0;
			}
			$scope.goUpdtariParam.customer_user_id=$scope.params.tranferInfo.customer_user_id;
			$scope.goUpdtariParam.amount=$scope.params.tranferInfo.amount;
			$scope.goUpdtariParam.is_currency=$scope.params.tranferInfo.is_currency;
		};
		
		//显示隐藏
		function showAndHide(type){
			var hide = document.querySelector(".hide");
			var dialog = document.querySelector(".dialog");
			if(type=="show"){
				hide.style.display = "block";
				dialog.style.display = "block";
			}else{
				hide.style.display = "none";
				dialog.style.display = "none";
			}
		};
		
		//取消按钮
		$scope.cancel = function(){
			showAndHide("hide");
		};
		
		//返回按钮
		$scope.cancleBack = function(){
			window.history.go(-1);
		};
		
		//定时隐藏提示框
		function setTimeHide(){
			setTimeout(function(){
				$scope.params.errSymbol = false;
				$scope.$apply();
			},3000);
		};
		
		//确定按钮
		$scope.sure = function(){
			//拒绝
			if($scope.params.symbol==9){
				MyTaskService.rejectFun($scope.rejectData).then((response) => {
					if(response.success){
						var index = $scope.params.index;
						$scope.params.errMsg="拒绝成功";
						if($scope.symbol==3){
							$scope.params.tranferInfo.system_status=3;
							$scope.params.tranferInfo.show_user_status=-1;
						}else{
							$scope.params.tranferInfo.system_status=$scope.params.tranferInfo.system_status+1;
							$scope.params.tranferInfo.show_user_status=1;
						}
					}else{
						$scope.params.errMsg="拒绝失败";
					}
					$scope.params.errSymbol=true;
					setTimeHide();
				});
			//提交
			}else if($scope.params.symbol==11){
				MyTaskService.goUpstairs($scope.goUpdtariParam).then((response) => {
					if(response.success){
						var index = $scope.params.index;
						$scope.params.errMsg="提交上级成功";
						if($scope.symbol==3){
							$scope.params.tranferInfo.system_status=3;
							$scope.params.tranferInfo.show_user_status=0;
						}else{
							$scope.params.tranferInfo.system_status=$scope.params.tranferInfo.system_status+1;
							$scope.params.tranferInfo.show_user_status=1;
						}
					}else{
						$scope.params.errMsg="提交上级失败";
					}
					$scope.params.errSymbol=true;
					setTimeHide();
				});
			}
			showAndHide("hide");
		};
    }
})();
