(function () {
    'use strict';

    angular
        .module('app')
        .controller('CoinWithdrawalController', CoinWithdrawalController);

    function CoinWithdrawalController($scope,MyTaskService,BankDepositService,AuditService,Util) {
		$scope.params = {
			mytask:[],
			dialogMes:"",
			symbol:0,
			index:-1,
			user_id:'',
			allFlag:true,
			rejectFlag:true,
			errMsg:"",
			errSymbol:false,
			userinfoFlag:false,
			userInfo:{},
			markets:[]
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
			is_currencys:'WITHDRAWAL',
			row:0,
			count:10
		};
		
		//初始化查询
		(function init(){
			$scope.symbol = window.localStorage['symbols'];
			if($scope.symbol==0){
				$scope.params.rejectFlag = false;
			}
			queryCoinBankTask(params);
			getMarkets();
		})();
		
		//时间确定按钮
		$scope.startClick = function(){
			var starttime = $("#starttimewith").val().replace("年","-").replace("月","-").replace("日","");
			var endtime = $("#endtimewith").val().replace("年","-").replace("月","-").replace("日","");
			$scope.params.starttime = starttime;
			$scope.params.endtime = endtime;
			if($scope.params.starttime==""){
				Util.dialog("请选择开始时间");
			}else if($scope.params.endtime==""){
				Util.dialog("请选择结束时间");
			}else{
				params.start_time = $scope.params.starttime;
				params.end_time = $scope.params.endtime;
				console.log(params)
				queryCoinBankTask(params);
			}
		};
		
		function queryCoinBankTask(params){
			//查询数字货币充提任务
			MyTaskService.queryCoinBankTask(params).then((response) => {
				console.log(response)
				//leval
				if(response.success){
					$scope.params.mytask = response.data;
					$scope.mytaskMiddle = $scope.params.mytask;
				}
			});
		};
		
		//查询所欲市场
		function getMarkets(){
			AuditService.getMarkets({}).then((response) => {
				if(response.success){
					$scope.params.markets=response.data;
				}
			});
		}
		
		//点击账户类型
		$scope.assetType = function(e,asset){
			var target = e.target;
			$(target).addClass('bk-t-msaCh');
			$(target).siblings().removeClass('bk-t-msaCh');
			params.asset_type = asset;
			queryCoinBankTask(params);
		};
		
		//点击搜索按钮
		$scope.search = function(){
			if($scope.params.user_id == ""){
				queryBankTask(params);
				$scope.params.userinfoFlag = false;
				$scope.params.userInfo = {};
				$scope.params.user_id = "";
			}else{
				var userparams ={
					'customer_user_id':$scope.params.user_id
				};
				queryCustomerInfo(userparams);
			}
		};
		
		//点击查询
		$scope.queryTask = function(e,show_user_status){
			var target = e.target;
			$(target).addClass('bk-t-msaCh');
			$(target).siblings().removeClass('bk-t-msaCh');
			if(show_user_status!=undefined){
				var mytaskArr = [];
				for(var i=0;i<$scope.mytaskMiddle.length;i++){
					var item = $scope.mytaskMiddle[i];
					if(item.show_user_status == show_user_status){
						mytaskArr.push(item);
					}
				}
				$scope.params.mytask = mytaskArr;
			}else{
				$scope.params.mytask = $scope.mytaskMiddle;
			}
		};
		
		//取消删除用户搜索结果、
		$scope.userInfoHide = function(){
			$scope.params.userinfoFlag = false;
			$scope.params.userInfo = {};
			$scope.params.user_id = "";
			queryCoinBankTask(params);
		};
		
		//查询用户信息
		function queryCustomerInfo(user_id){
			BankDepositService.queryCustomerInfo(user_id).then((response) => {
				if(response.success){
					if(response.data.length!=0){
						$scope.params.userinfoFlag = true;
						$scope.params.userInfo = response.data[0];
						if(response.data[0].id!=undefined || response.data[0].id!=0){
							params.customer_user_id = response.data[0].id;
							queryCoinBankTask(params);
						}
					}else{
						$scope.params.userinfoFlag = false;
						$scope.params.errMsg="没查到用户信息!";
						$scope.params.errSymbol=true;
						setTimeHide();
						$scope.params.mytask = [];
						$scope.mytaskMiddle = [];
					}
				}
			});
		};
		
		//查询我的人民币充提任务
		function queryBankTask(params){
			MyTaskService.queryBankTask(params).then((response) => {
				console.log(response);
				if(response.success){
					$scope.params.mytask = response.data;
					$scope.mytaskMiddle = $scope.params.mytask;
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
		$scope.reject = function(transefer_id,system_status,index){
			showAndHide("show");
			$scope.params.symbol = 9;
			$scope.params.index = index;
			$scope.params.dialogMes = "您确定拒绝该操作吗？"
			$scope.rejectData.transefer_id=transefer_id;
			$scope.rejectData.system_status=-1;
		};
		//异常
		$scope.abnormal = function(){
			showAndHide("show");
			$scope.params.symbol = 10;
			$scope.params.dialogMes = "您确定将该操作加入异常吗？"
		};
		
		//提交上级
		$scope.goUpstairs = function(bank_transfer_id,system_status,customer_user_id,amount,is_currency,show_user_status,leval,index,asset_type){
			showAndHide("show");
			$scope.params.index = index;
			$scope.params.symbol = 11;
			$scope.params.dialogMes = "您确定提交该操作吗？"
			$scope.goUpdtariParam.leval=leval;
			$scope.goUpdtariParam.asset_type=asset_type;
			$scope.goUpdtariParam.transefer_id=bank_transfer_id;
			$scope.goUpdtariParam.system_status=system_status+1;
			$scope.goUpdtariParam.show_user_status=show_user_status;
			if($scope.symbol==3){
				$scope.goUpdtariParam.system_status=0;
				$scope.goUpdtariParam.show_user_status=0;
			}
			$scope.goUpdtariParam.customer_user_id=customer_user_id;
			$scope.goUpdtariParam.amount=amount;
			$scope.goUpdtariParam.is_currency=is_currency;
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
				MyTaskService.rejectCoinFun($scope.rejectData).then((response) => {
					if(response.success){
						var index = $scope.params.index;
						$scope.params.errMsg="拒绝成功";
						$scope.params.mytask[index].assign_role_id = $scope.symbol;
						$scope.params.mytask[index].show_user_status=-1;
					}else{
						$scope.params.errMsg="拒绝失败";
					}
					$scope.params.errSymbol=true;
					setTimeHide();
				});
			//提交
			}else if($scope.params.symbol==11){
				MyTaskService.goCoinUpstairs($scope.goUpdtariParam).then((response) => {
					console.log(response)
					if(response.success){
						var index = $scope.params.index;
						Util.dialog("提交上级成功");
						$scope.params.mytask[index].assign_role_id = $scope.params.mytask[index].assign_role_id+1;
						if($scope.symbol==3){
							$scope.params.mytask[index].assign_role_id = 3;
							$scope.params.mytask[index].system_status=3;
							$scope.params.mytask[index].show_user_status=0;
							}
					}else if(response.message='ERR_AMOUNT_EXCCED_FAIL'){
						Util.dialog("提现额度超过单笔提现额度，请拒绝!");
					}else{
						Util.dialog("提交上级失败");
					}
				});
			}
			showAndHide("hide");
		};
    }
})();
