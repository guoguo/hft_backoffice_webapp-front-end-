(function () {
    'use strict';

    angular
        .module('app')
        .controller('ConfigDataController', ConfigDataController);

    function ConfigDataController($scope,ConfigDataService) {
		$scope.params = {
			allData:[],
			asset_type:''
		};
		//各种查询请求数句
		var params = {};
		//初始化查询
		(function init(){
			queryConfigDefaultLimit(params);
		})();
		
		//点击搜索按钮
		$scope.search = function(){
			if($scope.params.asset_type == "" || $scope.params.asset_type == undefined){
				delete params['asset_type'] ;
				queryConfigDefaultLimit(params);
			}else{
				params.asset_type=$scope.params.asset_type
				queryConfigDefaultLimit(params);
			}
		};
		
		//查询所有的默认充提限额
		function queryConfigDefaultLimit(params){
			ConfigDataService.queryConfigDefaultLimit(params).then((response) => {
				console.log(response);
				if(response.success){
					$scope.params.allData = response.data;
				}
			});
		};
		
    }
})();
