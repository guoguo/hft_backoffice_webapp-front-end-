(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService','baseInfo'];
    function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService,baseInfo) {
      var service = {};

      let SERVER = baseInfo.tokenUrl;

        service.debug = true;
        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        service.SERVER = SERVER;

        return service;

        // Login
        // calls _send function, which validates JSON token
        function Login(username, password) {
          return _send("get", { username: username, password: password });
        }

        // _send function get/returns token, and test if successful
        // method: get
        // params: username, password, etc
      function _send(method, params) {
        console.log({
          "method" : method,
          "params" : params
        });

          // Get JSON Web token test in private functions
          // res: is object that contains the token
          return $http.post(SERVER + method , params ,{ headers : {}}).then(
            function(res){
              if(service.debug)
                console.log({
                  "method" : method,
                  "params" : params,
                  "result" : res.data
                });
              return handleSuccess(res);
            },
            function(res){
              return handleError(res);
            });
         } // end _send

        // private functions
        function handleSuccess(res) {
          if(res.data!=undefined && res.data.status.success!=undefined && res.data.status.success)
            return { success: true, data: res.data.result};
          else
            return handleError(res);
        } // end handleSuccess

        function handleError(res) {
            return { success: false, message: res };
        } // end handleError



        function SetCredentials(token) {
            $rootScope.globals = { token:token };
            // store userdetails in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
			console.log($rootScope.globals);
            $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
        } // end SetCredentials

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            //$http.defaults.headers.common.Authorization = 'Basic';
        } // end of ClearCredentials

    } // end AuthenticationService


    // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

})();
