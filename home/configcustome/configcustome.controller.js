(function () {
    'use strict';

    angular
        .module('app')
        .controller('ConfigCustomerController', ConfigCustomerController);

    function ConfigCustomerController($scope,ConfigCustomerService) {
		$scope.params = {
			allData:[],
			user_id:''
		};
		//各种查询请求数句
		var params = {};
		//初始化查询
		(function init(){
			queryDepositAndWithdrawalsAll(params);
		})();
		
		//点击搜索按钮
		$scope.search = function(){
			if($scope.params.user_id == "" || $scope.params.user_id == undefined){
				delete params['user_id'] ;
				queryDepositAndWithdrawalsAll(params);
			}else{
				params.user_id=$scope.params.user_id
				queryDepositAndWithdrawalsById(params);
			}
		};
		
		//根据用户id查询限额
		function queryDepositAndWithdrawalsById(params){
			ConfigCustomerService.queryDepositAndWithdrawalsById(params).then((response) => {
				console.log(response)
				if(response.success){
					$scope.params.allData = response.data;
				}
			});
		}
		
		//查询所有的用户充提限额
		function queryDepositAndWithdrawalsAll(params){
			ConfigCustomerService.queryDepositAndWithdrawalsAll(params).then((response) => {
				console.log(response)
				if(response.success){
					$scope.params.allData = response.data;
				}
			});
		};
		
    }
})();
