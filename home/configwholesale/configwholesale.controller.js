(function () {
    'use strict';

    angular
        .module('app')
        .controller('ConfigWholesaleController', ConfigWholesaleController);

    function ConfigWholesaleController($scope,ConfigCustomerService) {
		$scope.params = {
			allData:[],
			middleData:[],
			id:''
		};
		
		//各种查询请求数句
		var params = {};
		//初始化查询
		(function init(){
			queryWholeSale(params);
		})();
		
		//点击搜索按钮
		$scope.search = function(){
			if($scope.params.id==undefined || $scope.params.id==""){
				$scope.params.allData = $scope.params.middleData;
			}else{
				var data = {};
				for(var i=0;i<$scope.params.allData.length;i++){
					var item = $scope.params.allData[i];
					if($scope.params.id==item.id){
						data = item
					}
				}
				$scope.params.allData = [];
				$scope.params.allData.push(data);
			}
			
		};
		
		//根据用户id查询限额
		function queryWholeSale(params){
			ConfigCustomerService.queryWholeSale(params).then((response) => {
				if(response.success){
					$scope.params.allData = response.data;
					$scope.params.middleData = response.data;
				}
			});
		}
    }
})();
