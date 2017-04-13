(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    //RegisterController.$inject = ['UserService', 'RegisterService', '$location', '$rootScope', 'FlashService'];
    function RegisterController($scope,UserService, RegisterService, $location, $rootScope, FlashService,Util) {
        var vm = this;

        vm.register = register;

        vm.captcha={
          url:"",
          id:0,
          code:''
        }
		
		vm.error = {
			username: false,
			errorInfo:false
		};
		
		$scope.validUsername =function(username){
			if (username == undefined || Util.checkPhone(username) || Util.checkMail(username)){
				vm.error.username = false;
			}else{
				vm.error.username = true;
			}
		};
		
        function register() {
            vm.dataLoading = true;
            RegisterService.Register(vm.username, vm.captcha.id, vm.captcha.code)
              .then(function(response){
                if(response.success){
                  $location.path('/login')
                }
                else{
                  FlashService.Error(response.message);
                }
                vm.dataLoading=false;
              });
        }


        function show_captcha(){
          RegisterService.GetCaptcha()
            .then(function(response){
              //vm.captcha.url=response.data.imgUrl;
             // vm.captcha.id = response.data.id;
            });

        }

        show_captcha();
    }

})();
