(function () {
    'use strict';

    angular
        .module('app')
        .controller('CustomerController', CustomerController);

    function CustomerController($scope,CustomerService,Util) {
		$scope.params = {
			mytasks:[],
			userInfo:{},
			customers:[],
			dialogMes:'',
			hide:false,
			type:'',
			index:0
		};
		
		//各种查询请求数句
		var params = {
			row:0
		};
		
		//初始化查询
		(function init(){
			$scope.symbol = window.localStorage['symbols'];
			if($scope.symbol==0){
				$scope.params.rejectFlag = false;
			}
			queryCustomerAllUsers(params);
		})();
		
		//删除
		$scope.deleteCustomerUser = function(user_id,index){
			params.user_id  = user_id;
			$scope.params.hide = true;
			$scope.params.index = index;
			$scope.params.type = 'delete';
			$scope.params.dialogMes = "确定删除该用户吗？";
		};
		
		//加入黑名单
		$scope.block = function(user_id,index){
			params.user_id = user_id;
			$scope.params.hide = true;
			$scope.params.index = index;
			$scope.params.type = 'frozen';
			$scope.params.dialogMes = "确定将该用户加入黑名单吗？";
		};
		
		//移除黑名单
		$scope.unblock = function(user_id,index){
			params.user_id  = user_id;
			$scope.params.hide = true;
			$scope.params.index = index;
			$scope.params.type = 'unfrozen';
			$scope.params.dialogMes = "确定将该用户移除黑名单吗？";
		};
		
		
		//取消按钮
		$scope.cancel = function(){
			$scope.params.hide = false;
		};
		
		//根据条件查询用户
		$scope.queryUser = function(e,type){
			var target = e.target;
			$(target).addClass('bk-t-msaCh');
			$(target).siblings().removeClass('bk-t-msaCh');
			if(type==-2){
				delete params.condition;
			}else if(type==0){
			    params.condition=1;
			}
			queryCustomerAllUsers(params);
		}
		
		//查询所有用户
		function  queryCustomerAllUsers(){
			CustomerService.queryCustomerAllUsers(params).then((response) => {
				console.log(response)
				if(response.success){
					$scope.params.customers = response.data;
				}
			});
		};

		//搜索按钮
		$scope.search =  function(){
			params.condition = $scope.params.condition;
			queryCustomerAllUsers();
		};
		
		//确定按钮
		$scope.sure= function(){
			if($scope.params.type=='delete'){
				CustomerService.deleteCustomerUser(params).then((response) => {
					if(response.success){
						$scope.params.customers[$scope.params.index].deleted=1;
						Util.dialog('删除用户成功');
					}else{
						Util.dialog('删除用户失败');
					}
				});
			}else if($scope.params.type=='frozen'){
				CustomerService.frozenCustomerUser(params).then((response) => {
					if(response.success){
						$scope.params.customers[$scope.params.index].blocked=1;
						Util.dialog('加入黑名单成功');
					}else{
						Util.dialog('加入黑名单失败');
					}
				});
				
			}else if($scope.params.type=='unfrozen'){
				CustomerService.unFrozenCustomerUser(params).then((response) => {
					if(response.success){
						$scope.params.customers[$scope.params.index].blocked=0;
						Util.dialog('移除黑名单成功');
					}else{
						Util.dialog('移除黑名单失败');
					}
				});
			}else if($scope.params.type=='blocked'){
				
			}
			$scope.params.hide = false;
		};
	}	
})();
