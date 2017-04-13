(function () {
	'use strict';

  angular
  	.module('app')
  	.run(setupPrivateFakeBackend);

  //setupFackBackend for backend-less developement
  function setupPrivateFakeBackend($httpBackend) {

    // facke authenticate api end point
    $httpBackend.whenGET('http://192.168.3.168:8090/getBalances').respond(function (method, url, data) {
			// get parameters from post request
      var params = angular.fromJson(data);
      console.log("Fakebackend for getBalances says hello");
      // check user credentials and return fake jwt token if valid
      return response(1,null,[ { 'symbol' : 'BTC', balance: 100, frozen: 20 } ]);
    });

    $httpBackend.whenGET(/^\w+.*/).passThrough();
    $httpBackend.whenPOST(/^\w+.*/).passThrough();
    function response(success,message,data){
      return [200,  {status: {success: success, message: message}, result: data}];
    }
  }
})();
