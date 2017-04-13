(function () {
    'use strict';

    angular
        .module('app')
        .controller('PrivilegeController', PrivilegeController);

    function PrivilegeController($scope,SuperService,MyTaskService,BankDepositService,AuditService,Util) {
		$scope.params = {
			users:[],
			mytasks:[],
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
			markets:[],
			iscurr:true
		};
		
		
		//初始化查询
		(function init(){
			$scope.symbol = window.localStorage['symbols'];
			if($scope.symbol==0){
				$scope.params.rejectFlag = false;
			}
			queryUsers(0,10);
		})();
		
		function queryUsers(row,cols){
			//查询操作员
			SuperService.queryUsers(row,cols).then((response) => {
				if(response.success){
					$scope.params.users = response.data;
				}
			});
		};
		//冻结或者注销用户
		$scope.frozen = function(uid,index,type,userType){
			$scope.params.uid = uid;
			$scope.params.symbol = type;
			$scope.params.index = index;
			$scope.params.userType = userType
			showAndHide("show");
			if(type==0){
				$scope.params.dialogMes = "您确定冻结该用户吗？"
			}else if(type==1){
				$scope.params.dialogMes = "您确定注销该用户吗？"
			}else{
				$scope.params.dialogMes = "您确定解冻该用户吗？"
			}
		};
		
		//时间确定按钮
		$scope.startClick = function(){
			var starttime = $("#starttimecion").val().replace("年","-").replace("月","-").replace("日","");
			var endtime = $("#endtimecion").val().replace("年","-").replace("月","-").replace("日","");
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
				queryCoinBankTaskDetail(params);
			}
		};
		
		
		
		
		//点击搜索按钮
		$scope.search = function(){
			if($scope.params.user_id == ""){
				queryCoinBankTaskDetail(params);
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
		
		
		
		//取消删除用户搜索结果、
		$scope.userInfoHide = function(){
			$scope.params.userinfoFlag = false;
			$scope.params.userInfo = {};
			$scope.params.user_id = "";
			queryCoinBankTaskDetail(params);
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
							queryCoinBankTaskDetail(params);
						}
					}else{
						$scope.params.userinfoFlag = false;
						Util.dialog("没查到用户信息!");
						$scope.params.mytasks = [];
						$scope.mytaskMiddle = [];
					}
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
			//冻结
			if($scope.params.symbol==0){
				SuperService.frozen($scope.params.uid).then((response) => {
					if(response.success){
						var index = $scope.params.index;
						Util.dialog("冻结成功");
						($scope.params.userType=="admin")?$scope.params.adminUsers[index].status = 1:$scope.params.users[index].status = 1;
					}else{
						Util.dialog("冻结失败");
					}
				});
			//注销
			}else if($scope.params.symbol==1){
				SuperService.cancellationUser($scope.params.uid).then((response) => {
					if(response.success){
						var index = $scope.params.index;
						Util.dialog("注销成功");
						($scope.params.userType=="admin")?$scope.params.adminUsers.splice(index,1):$scope.params.users.splice(index,1);
					}else{
						Util.dialog("您没有权限注销操作员!");
					}
				});
			}//解冻
			else if($scope.params.symbol==2){
				SuperService.unFrozen($scope.params.uid).then((response) => {
					if(response.success){
						var index = $scope.params.index;
						Util.dialog("解冻成功!");
						($scope.params.userType=="admin")?$scope.params.adminUsers[index].status = 0:$scope.params.users[index].status = 0;
					}else{
						Util.dialog("解冻失败!");
					}
				});
			}
			showAndHide("hide");
		};
    }
})();
