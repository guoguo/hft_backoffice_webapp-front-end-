(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    function LoginController($rootScope,$scope, $location, AuthenticationService, FlashService, $translate, LiveService,Util) {
        var vm = this;
        vm.login = login;
		vm.error = {
			errorInfo:false,
			errMsgLogin:'用户名或密码错误'
		};
        (function initController() {
            AuthenticationService.ClearCredentials();
        })();
		
		$scope.submitLogin = function(e){
			var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
               login();
            }
		};
        function login() {
            AuthenticationService.Login($scope.username, $scope.password)
          	.then((response) => {
				console.log(response);
                if (response.success) {
					$rootScope.username = $scope.username;
                    AuthenticationService.SetCredentials(response.data.token);
					$rootScope.loginStatus=0;
                    $location.path('/home');
                } else {
					if(response.message.data.status.message=="ERR_MODIFY_PASSWORD_PLEASE"){
						$rootScope.loginStatus=1;
						AuthenticationService.SetCredentials(response.message.data.result.token);
						$location.path('/home');
					}else{
						vm.error.errorInfo = true;
						vm.error.errMsgLogin = response.message.data.status.message;
						FlashService.Error(response.message);
					}
				}
			})
		};
    }

})();
