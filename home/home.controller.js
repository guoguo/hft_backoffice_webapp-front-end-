(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);
    function HomeController($scope,$rootScope,$state,HomeService) {
        var vm = this;
		$scope.username = $rootScope.username;
		$scope.params = {
			menus:[]
		};
		
		//初始化
		(function(){
			menu();
		})();
		
		//查询菜单和权限信息
		function menu(){
			HomeService.getUserInfo().then((response) => {
				
				if(response.success){
					$scope.params.menus = response.data;
					var symbol = response.data[0].symbol;
					if(symbol==4){
						$state.go('home.super');
					}else if(symbol==3){
						if($rootScope.loginStatus==1){
							$state.go('home.modifyPassword');
						}else{
							$state.go('home.mytask');
						}
					}else if(symbol==2){
						if($rootScope.loginStatus==1){
							$state.go('home.modifyPassword');
						}else{
							$state.go('home.mytask');
						}
					}else if(symbol==1){
						if($rootScope.loginStatus==1){
							$state.go('home.modifyPassword');
						}else{
							$state.go('home.mytask');
						}
					}else if(symbol==0){
						if($rootScope.loginStatus==1){
							$state.go('home.modifyPassword');
						}else{
							$state.go('home.mytask');
						}
					}
					window.localStorage.setItem('symbols', symbol);
				}
			});
		};
		//菜单点击事件
		$scope.showMenu = function(e,type){
			var target = e.target;
			$(target).closest("a").addClass('home-leftaCh');
			$(target).closest("li").siblings().find("a").removeClass('home-leftaCh');
			$(target).closest("div").siblings().find("a").removeClass('home-leftaCh');
			$(target).closest("li").find(".hlcm-e").slideDown(300);
			$(target).closest("li").siblings().find(".hlcm-e").slideUp(300);
			if(type=='home'){
				if($scope.symbol==4){
					$state.go('home.super');
				}else{
					$state.go('home.mytask');
				}
			}
		}
		
    }
})();
