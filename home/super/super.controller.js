(function () {
    'use strict';

    angular
        .module('app')
        .controller('SuperController', SuperController);

    function SuperController($scope,SuperService) {
        var vm = this;
		$scope.params = {
			loginInfo:[],
			users:[],
			adminUsers:[],
			dialogMes:"",
			symbol:0,
			uid:0,
			index:-1,
			userType:'',
			errMsg:"",
			errSymbol:false
		};
		
		//获得登录信息
		SuperService.queryLoginInfo(0,10).then((response) => {
			if(response.success){
				$scope.params.loginInfo = response.data;
			}
		});
		
		//查询操作员
		SuperService.queryUsers(0,10).then((response) => {
			if(response.success){
				$scope.params.users = response.data;
			}
		});
		
		//查询管理员
		SuperService.queryAdminUsers(0,10).then((response) => {
			if(response.success){
				$scope.params.adminUsers = response.data;
			}
		});
		
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
						$scope.params.errMsg="冻结成功";
						($scope.params.userType=="admin")?$scope.params.adminUsers[index].status = 1:$scope.params.users[index].status = 1;
					}else{
						$scope.params.errMsg="冻结失败";
					}
					$scope.params.errSymbol=true;
					setTimeHide();
				});
			//注销
			}else if($scope.params.symbol==1){
				SuperService.cancellationUser($scope.params.uid).then((response) => {
					if(response.success){
						var index = $scope.params.index;
						$scope.params.errMsg="注销成功";
						($scope.params.userType=="admin")?$scope.params.adminUsers.splice(index,1):$scope.params.users.splice(index,1);
					}else{
						$scope.params.errMsg="注销失败";
					}
					$scope.params.errSymbol=true;
					setTimeHide();
				});
			//解冻
			}else{
				SuperService.unFrozen($scope.params.uid).then((response) => {
					
					if(response.success){
						var index = $scope.params.index;
						$scope.params.errMsg="解冻成功";
						($scope.params.userType=="admin")?$scope.params.adminUsers[index].status = 0:$scope.params.users[index].status = 0;
					}else{
						$scope.params.errMsg="解冻失败";
					}
					$scope.params.errSymbol=true;
					setTimeHide();
				});
			}
			showAndHide("hide");
		};
    }
})();
