(function () {
    'use strict';

    angular
        .module('app')
        .controller('AuditController', AuditController);

    function AuditController($scope,MyTaskService,BankDepositService,AuditService) {
		$scope.params = {
			audits:[],
			dialogMes:"",
			user_id:'',
			allFlag:true,
			rejectFlag:true,
			errMsg:"",
			errSymbol:false,
			userinfoFlag:false,
			userInfo:{},
			markets:[]
		};
		
		//各种查询请求数句
		var params = {
			asset_type:'bank',
			row:0,
			count:10
		};
		
		//初始化查询
		(function init(){
			$scope.symbol = window.localStorage['symbols'];
			if($scope.symbol==0){
				$scope.params.rejectFlag = false;
			}
			queryTodayAudit(params);
			getMarkets();
		})();
		
		//时间确定按钮
		$scope.startClick = function(){
			var starttime = $("#starttimeaudit").val().replace("年","-").replace("月","-").replace("日","");
			var endtime = $("#endtimeaudit").val().replace("年","-").replace("月","-").replace("日","");
			$scope.params.starttime = starttime;
			$scope.params.endtime = endtime;
			if($scope.params.starttime==""){
				Util.dialog("请选择开始时间");
			}else if($scope.params.endtime==""){
				Util.dialog("请选择结束时间");
			}else{
				params.start_time = $scope.params.starttime;
				params.end_time = $scope.params.endtime;
				queryTodayAudit(params);
			}
		};
		
		//点击搜索按钮
		$scope.search = function(){
			if($scope.params.user_id == ""){
				$scope.params.userinfoFlag = false;
				$scope.params.userInfo = {};
				$scope.params.user_id = "";
				delete params['user_id'];
				queryTodayAudit(params);
			}else{
				var userparams ={
					'user_id':$scope.params.user_id
				};
				getUserInfoById(userparams);
				queryTodayAudit(params);
			}
		};
		
		//点击查询
		$scope.queryTask = function(e,is_cr_type){
			var target = e.target;
			$(target).addClass('bk-t-msaCh');
			$(target).siblings().removeClass('bk-t-msaCh');
			if(is_cr_type!=undefined){
				 params.is_currency = is_cr_type;
			}else{
				delete params['is_currency'];
			}
			queryTodayAudit(params);
		};
		
		//点击账户类型
		$scope.assetType = function(e,asset){
			var target = e.target;
			$(target).addClass('bk-t-msaCh');
			$(target).siblings().removeClass('bk-t-msaCh');
			if(asset!=undefined){
				params.asset_type = asset;
			}else{
				params.asset_type = 'bank';
			}
			queryTodayAudit(params);
		};
		
		//导出功能
		$scope.exportExcel = function(){
			
			
			
			AuditService.exportExcel(params).then((response) => {
				console.log(response)
				if(response.success){
					//$scope.params.audits=response.data;
				}
			});
		}
		//默认查询
		function queryTodayAudit(param){
			AuditService.queryTodayAudit(param).then((response) => {
				console.log(response)
				if(response.success){
					$scope.params.audits=response.data;
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
		
		//取消删除用户搜索结果、
		$scope.userInfoHide = function(){
			$scope.params.userinfoFlag = false;
			$scope.params.userInfo = {};
			$scope.params.user_id = "";
			delete params['user_id'];
			queryTodayAudit(params);
		};
		
		//查询用户信息
		function getUserInfoById(param){
			AuditService.getUserInfoById(param).then((response) => {
				if(response.success){
					if(response.data!=undefined){
						$scope.params.userinfoFlag = true;
						$scope.params.userInfo = response.data;
						params.user_id=$scope.params.user_id;
						queryTodayAudit(params);
					}else{
						$scope.params.userinfoFlag = false;
						$scope.params.errMsg="没查到用户信息!";
						$scope.params.errSymbol=true;
						setTimeHide();
						delete params['user_id'];
						queryTodayAudit(params);
					}
				}else{
					$scope.params.userinfoFlag = false;
					$scope.params.errMsg="没查到用户信息!";
					$scope.params.errSymbol=true;
					setTimeHide();
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
			
			showAndHide("hide");
		};
    }
})();
