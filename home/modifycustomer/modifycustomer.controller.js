(function () {
    'use strict';

    angular
        .module('app')
        .controller('ModifyCustomerController', ModifyCustomerController);

    function ModifyCustomerController($scope,$stateParams,ModifyCustomerService,Util) {
		
        var vm = this;
		$scope.params = {
			title:"修改用户信息",
			simgle_limit:"",
			accumulate_limit:"",
			add_submit:true,
			addFlag:false
		};
		
		var queryparams = {};
		var user_id = $stateParams.user_id;
		
		var levals = ['leval1','leval2','leval3','leval4','leval5'];
		
		(function(){
			queryparams={
				user_id:user_id
			}
			queryCustomerUserById(queryparams);
		})();
		
		//查询某个用户信息
		function queryCustomerUserById(queryparams){
			ModifyCustomerService.queryCustomerUserById(queryparams).then((response) =>{
				console.log(response);
				if(response.success){
					$scope.params.id = response.data[0].id;
					$scope.params.created_at = response.data[0].created_at;
					$scope.params.deleted = response.data[0].deleted;
					$scope.params.blocked = response.data[0].blocked;
					$scope.params.vip_level = response.data[0].vip_level;
					$scope.params.phone = response.data[0].phone;
					$scope.params.email = response.data[0].email;
				}else{
					Util.dialog("没有查到相关数据!");
				}
			});
		}
		
		//修改默认限额
		$scope.modifyCustomerUser = function(){
			var data = {
				user_id:user_id,
				vip_level:$scope.params.vip_level,
				phone:$scope.params.phone,
				email:$scope.params.email
			}
			if($scope.params.vip_level==""){
				Util.dialog("请输入用户等级");
			}else if($scope.params.phone==""){
				Util.dialog("请输入电话");
			}else if($scope.params.email==""){
				Util.dialog("请输入邮箱");
			}else{
				ModifyCustomerService.modifyCustomerUser(data).then((response) =>{
					if(response.success){
						Util.dialog("恭喜，修改用户信息成功!");
						$scope.params.add_submit = false;
					}else{
						Util.dialog("对不起，修改用户信息失败!");
					}
				});
			}
		};
		//返回
		$scope.back = function(){
			window.history.go(-1);
		}
		
    }
})();
