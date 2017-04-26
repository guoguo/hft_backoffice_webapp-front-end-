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
				if(response.success){
					$scope.params.customers = response.data;
					if(response.data.length!=0){
						$scope.params.allcount= Math.ceil($scope.params.customers[0].count/10);
						pagesFunction($scope.nowPage,$scope.params.allcount,'login');
					}
				}
			});
		};

		//搜索按钮
		$scope.search =  function(){
			params.condition = $scope.params.condition;
			queryCustomerAllUsers(params);
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
		
		$scope.nowPage = 0;
		$scope.mytasknowPage = 1;
		$scope.params.allcount = 0;
		$scope.leftPages = [1,2,3];
		$scope.mytaskleftPages = [1,2,3];
		//首页
		$scope.prev = function(type){
			if(type=='login'){
				if($scope.nowPage!=0){
					$scope.nowPage = 0;
				}
				params.row = $scope.nowPage;
				params.count = 10;
				queryCustomerAllUsers(params);
			}
		};
		
		//尾页
		$scope.next = function(type){
			if(type=='login'){
				if($scope.nowPage!=$scope.params.allcount){
					$scope.nowPage = $scope.params.allcount-1;
				}
				params.row = $scope.nowPage;
				params.count = 10;
				queryCustomerAllUsers(params);
			}
		};
		//点击当前页
		$scope.page = function(e,row,type){
			$(e.target).addClass("pages-Chosee");
			$(e.target).siblings().removeClass("pages-Chosee");
			if(type=='login'){
				params.row = row-1;
				params.count = 10;
				$scope.nowPage = row;
				queryCustomerAllUsers(params);
			}
		};
		
		//分页算法
		function pagesFunction(row,count,type){
			$scope.leftPages = [];
			if(row==0 && count<4){
				for(var i=1;i<=count;i++){
					$scope.leftPages.push(i);
				}
			}else if(row==0 && 4<=count){
				for(var i=1;i<=4;i++){
					$scope.leftPages.push(i);
				}
			}else if(row==count && 4<=count){
				for(var i=(count-2);i<=count;i++){
					$scope.leftPages.push(i);
				}
			}else if(row!=0 && row!=count && 4<=count){
				for(var i=(row-1);i<=(row+2);i++){
					$scope.leftPages.push(i);
				}
			}else if(row!=0 && row==count && 4<=count){
				for(var i=(row-1);i<=(row+2);i++){
					$scope.leftPages.push(i);
				}
			}else if(row!=0 && row!=count && count<4){
				for(var i=1;i<=3;i++){
					$scope.leftPages.push(i);
				}
			}else if(row!=0 && row==count && count<4){
				for(var i=1;i<=3;i++){
					$scope.leftPages.push(i);
				}
			}
			
		};
	}
})();
