(function () {
  'use strict';

  angular
    .module('app')
    .controller('SettingController', SettingController)
  	.controller('EmailController', EmailController)
  	.controller('PhoneController', PhoneController)
  	.controller('IdController', IdController)
  	.controller('AuthenticatorController', AuthenticatorController)
  	.controller('PasswordController', PasswordController)
  	.controller('ApiController', ApiController);

  SettingController.$inject = ['PrivateService', '$scope'];
  function SettingController(PrivateService, $scope) {
    var vm = this;

  } // end SettingController

  function EmailController(PrivateService, AuthenticationService, $scope, $translate, FlashService) {
		var vm = this;
    vm.email = email;

    function email() {
    	console.log("Hello EmailController")
      console.log(vm.oldEmail)
      console.log(vm.newEmail)

      PrivateService.SetEmail(vm.oldEmail, vm.newEmail)
      	.then(function(response) {
          if (response.success) {
            AuthenticationService.SetCredentials(response.data.token);
          } else {
            FlashService.Error(response.message);
          }
        });

    } // end email
  } // end EmailController


	function PhoneController(PrivateService, AuthenticationService, $scope, $translate, FlashService) {
    var vm = this;
    vm.phone = phone;

    function phone() {
      console.log("Hello PhoneController")
      console.log(vm.oldPhone)
      console.log(vm.newPhone)

      PrivateService.SetPhone(vm.oldPhone, vm.newPhone)
        .then(function(response) {
          if (response.success) {
            AuthenticationService.SetCredentials(response.data.token);
          } else {
            FlashService.Error(response.message);
          }
        });
    } // end phone
  } // end PhoneController


  // need to re-evaluate variables
  function IdController(PrivateService, $scope) {
		var vm = this;
    vm.id = id;

		function id() {
      console.log("Hello IdController")
      console.log(vm.oldId)
      console.log(vm.newId)
      console.log(vm.updateId)
    } // end id
  } // end IdController


  function AuthenticatorController(PrivateService, $scope) {
		var vm = this;
    vm.authenticator = authenticator;


    function authenticator() {
      console.log("Hello authenticator")
    } // end authenticator
  } // end AuthenticatorController


  function PasswordController(PrivateService, AuthenticationService, $location, $scope, $translate, FlashService) {
    var vm = this;
    vm.password = password;

    (function initController() {
      // some function if needed
    })();

    function password() {
      // vm.dataLoading = true;
      console.log("Hello from setting controller from")
      console.log(vm.oldPassword)
      console.log(vm.newPassword)

      PrivateService.SetPassword(vm.oldPassword, vm.newPassword)
        .then(function(response) {
					console.log(response)
          if (response.success) {
            AuthenticationService.SetCredentials(response.data.token);
            $location.path('/trade');
          } else {
            FlashService.Error(response.message);
            // vm.dataLoading = false
          }
      });
    } // end password
  } // end PasswordController


  function ApiController(PrivateService, $scope) {
    var vm = this;
    vm.api = api;

    function api() {
      console.log("Hello api");
    }

  } // PasswordController

})();
