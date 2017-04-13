(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddAminUserController', AddAminUserController);

    function AddAminUserController($scope,AdminService,Util) {
		
        var vm = this;
		$scope.params = {
			roles:[],
			role:"",
			role_id:0,
			sex:"",
			genders:[{id:0,gender:'男'},{id:1,gender:'女'}],
			department:[],
			depart:"",
			title:"添加操作员",
			add_submit:true,
			add_reset:false
		};
		(function(){
			queryRole();
			queryDepartment();
		})();
		/*
		* @apiParam {String} name:用户名称
* @apiParam {String} email:用户邮箱
* @apiParam {String} role_id:角色id
* @apiParam {String} mobile:电话号码（座机 选填）
* @apiParam {String} phone:手机号码（座机）
* @apiParam {String} DEPARTMENT:部门
* @apiParam {String} GENDER:性别
* @apiParam {String} AUTH_AMOUNT:
		*/
		//查询角色
		function queryRole(){
			AdminService.getRoleInfo().then((response) =>{
				if(response.success){
					$scope.params.roles = response.data;
				}
			});
		};
		//查询所有部门
		function queryDepartment(){
			AdminService.queryDepartment().then((response) =>{
				console.log(response)
				if(response.success){
					$scope.params.department = response.data;
				}
			});
		};
		//创建管理员
		$scope.createUser = function(){
			var data = {
				name:$scope.name,
				email:$scope.email,
				role_id:$scope.params.role_id,
				mobile:$scope.mobile,
				phone:$scope.telephone,
				DEPARTMENT:$scope.params.depart,
				GENDER:$scope.params.sex,
				AUTH_AMOUNT:0
			}
			if($scope.name==""){
				Util.dialog("请填写姓名");
			}else if($scope.email==""){
				Util.dialog("请填写邮件");
			}else if($scope.params.role_id==0){
				Util.dialog("请选择权限");
			}else if($scope.mobile==""){
				Util.dialog("请填写手机号");
			}else if($scope.telephone==""){
				Util.dialog("请填写电话");
			}else if($scope.params.depart==""){
				Util.dialog("请选择部门");
			}else if($scope.params.sex==""){
				Util.dialog("请选择性别");
			}else{
				AdminService.createUser(data).then((response) =>{
					if(response.success){
						Util.dialog("恭喜，创建管理员成功!");
						$scope.params.add_submit = false;
					}else{
						Util.dialog("对不起，创建管理员失败!");
					}
				});
			}
		};
		//角色
		$scope.roleclick = function(pid,pname,typeid){
			$(this).parent().addClass("add-u-p-dt01li");
			$(this).parent().siblings().removeClass("add-u-p-dt01li");
			$("#"+typeid).css({display:"none"});
			if(typeid=="roles"){
				$scope.params.role = pname;
				$scope.params.role_id = pid;
			}else if(typeid=="sex"){
				$scope.params.sex = pname;
			}else if(typeid=="depart"){
				$scope.params.depart = pname;
			}
		};
		$scope.show = function(type){
			$("#"+type).css({display:"block"});
		};
		//返回
		$scope.back = function(){
			window.history.go(-1);
		}
		
    }
})();
