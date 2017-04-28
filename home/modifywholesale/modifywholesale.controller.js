(function () {
    'use strict';

    angular
        .module('app')
        .controller('ModifyWholeSaleController', ModifyWholeSaleController);

    function ModifyWholeSaleController($scope,$stateParams,ModifyConfigCustomeService,Util) {
		
        var vm = this;
		$scope.params = {
			title:"修改大小额",
			wholesale_threshold:"",
			add_submit:true,
			addFlag:false
		};
		
		var queryparams = {};
		var id = $stateParams.id;
		var asset_type = $stateParams.asset_type;
		var is_currency = $stateParams.is_currency;
		id=="id" ? $scope.params.title="添加大小额" : $scope.params.title="修改大小额";
		
		var levals = ['leval1','leval2','leval3','leval4','leval5'];
		var dwData = ['DEPOSIT','WITHDRAVAL'];
		
		(function(){
			queryparams={
				id:id
			}
			id=="id" ? $scope.params.addFlag=true : queryWholeSaleById(queryparams);
		})()
		
		//查询大小额信息
		function queryWholeSaleById(queryparams){
			ModifyConfigCustomeService.queryWholeSaleById(queryparams).then((response) =>{
				console.log(response);
				if(response.success){
					$scope.params.id = response.data.id;
					$scope.params.desc = response.data.description;
					$scope.params.asset_type = response.data.asset_type;
					$scope.params.is_currency = response.data.is_currency;
					$scope.params.wholesale_threshold = response.data.wholesale_threshold/10000000;
				}else{
					Util.dialog("没有查到相关数据!");
				}
			});
		}
		
		//修改默认限额
		$scope.modifyDefaultLimit = function(){
			var data = {
				id:$scope.params.id,
				wholesale_threshold:$scope.params.wholesale_threshold
			}
			if(id=="id"){
				if(isNaN($scope.params.wholesale_threshold)){
					Util.dialog("单笔限额必须为数字");
				}else if($scope.params.wholesale_threshold==""){
					Util.dialog("请填写累计限额");
				}else{
					data.id = $scope.params.id
					data.desc = $scope.params.desc;
					data.asset_type = $scope.params.asset_type;
					data.is_currency = $scope.params.is_currency;
					data.wholesale_threshold = $scope.params.wholesale_threshold;
					ModifyConfigCustomeService.addWholeSale(data).then((response) =>{
						console.log(response)
						if(response.success){
							Util.dialog("恭喜，添加大小额成功!");
							$scope.params.add_submit = false;
						}else{
							Util.dialog("对不起，该类型账户大小额已经存在");
						}
					});
				}
			}else{
				if(isNaN($scope.params.wholesale_threshold)){
					Util.dialog("单笔限额必须为数字");
				}else if($scope.params.wholesale_threshold==""){
					Util.dialog("请填写累计限额");
				}else{
					ModifyConfigCustomeService.modifyWholeSale(data).then((response) =>{
						if(response.success){
							Util.dialog("恭喜，修改大小额成功!");
							$scope.params.add_submit = false;
						}else{
							Util.dialog("对不起，修改大小额失败!");
						}
					});
				}
			}
		};
		//返回
		$scope.back = function(){
			window.history.go(-1);
		}
		
    }
})();
