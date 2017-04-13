(function () {
    'use strict';

    angular
        .module('app')
        .controller('ModifyPasswordController', ModifyPasswordController);

    function ModifyPasswordController($scope,$location,ModifyPasswordService,Util) {
		
        var vm = this;
		$scope.params = {
			title:"修改密码",
			oldPsw:"",
			newPsw:"",
			renewPsw:"",
			add_submit:true
		};
		
		//创建管理员
		$scope.modifyPassword = function(){
			var data = {
				oldPsw:$scope.params.oldPsw,
				newPsw:$scope.params.newPsw
			}
			if($scope.params.oldPsw==""){
				Util.dialog("请填写旧密码");
			}else if($scope.params.newPsw==""){
				Util.dialog("请填写新密码");
			}else if($scope.params.newPsw != $scope.params.renewPsw ){
				Util.dialog("请两次密码不一致");
			}else{
				ModifyPasswordService.modifyPassword(data).then((response) =>{
					if(response.success){
						Util.dialog("恭喜，修改密码成功!");
						$location.path('/login');
						$scope.params.add_submit = false;
					}else{
						Util.dialog("对不起，修改密码失败!");
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
