(function () {
    'use strict';
    //let myapp = angular.module('myapp', ["highcharts-ng"]);
  angular.module('app', ['ui.router', 'ngCookies', 'ngMockE2E','pascalprecht.translate','ngMessages'])
    .config(config).config(function ($translateProvider) {
            $translateProvider.useStaticFilesLoader({
              prefix: 'lang/',
              suffix: '.json'
            });
            $translateProvider.registerAvailableLanguageKeys(['en', 'de', 'zh'], {
                'en-US': 'en',
                'en-UK': 'en',
                'de-DE': 'de',
                'zh-ZH': 'zh'
            });
            $translateProvider.useSanitizeValueStrategy('escapeParameters');

           	$translateProvider.preferredLanguage('en-US');
		}).run(run);

    config.$inject = ['$stateProvider','$urlRouterProvider'];
	
    function config($stateProvider, $urlRouterProvider) {


      $stateProvider.state('login',{
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'login/login.view.html',
        controllerAs: 'vm'
      })

      .state('register',{
        url: '/register',
        controller: 'RegisterController',
        templateUrl: 'register/register.view.html',
        controllerAs: 'vm'
      })

      // private is the sidebar and menu
      // We pass this to all of our menu views
      .state('private',{
        abstract: true,
        templateUrl: 'private/private.view.html'
      })

      .state('private.tradingdesk',{
        url: '/trade',
        controller: 'TradingDeskController',
        templateUrl: 'trading-desk/trading-desk.view.html',
        controllerAs: 'vm'
      })

      .state('private.overview',{
        url: '/overview',
        controller: 'OverviewController',
        templateUrl: 'overview/overview.view.html',
        controllerAs: 'vm'
      })

      .state('private.setting', {
        abstract: true,
        templateUrl: 'setting/setting.view.html',
        controller: 'SettingController',
        controllerAs: 'vm'
      })

      .state('private.setting.email', {
        url:'/setting/email',
        controller: 'EmailController',
        templateUrl: 'setting/pages/email.view.html',
        controllerAs: 'vm'
      })

      .state('private.setting.phone', {
        url:'/setting/phone',
        controller: 'PhoneController',
        templateUrl: 'setting/pages/phone.view.html',
        controllerAs: 'vm'
      })

      .state('private.setting.id', {
        url:'/setting/id',
        controller: 'IdController',
        templateUrl: 'setting/pages/id.view.html',
        controllerAs: 'vm'
      })

      .state('private.setting.authenticator', {
        url:'/setting/authenticator',
        controller: 'AuthenticatorController',
        templateUrl: 'setting/pages/authenticator.view.html',
        controllerAs: 'vm'
      })

      .state('private.setting.password', {
        url:'/setting/password',
        controller: 'PasswordController',
        templateUrl: 'setting/pages/password.view.html',
        controllerAs: 'vm'
      })

      .state('private.setting.api', {
        url:'/setting/api',
        controller: 'ApiController',
        templateUrl: 'setting/pages/api.view.html',
        controllerAs: 'vm'
      })
	  .state('home', {
        url:'/home',
        controller: 'HomeController',
        templateUrl: 'home/home.view.html',
        controllerAs: 'vm'
      })
	  .state('home.super', {
        url:'/super',
        controller: 'SuperController',
        templateUrl: 'home/super/super.view.html',
        controllerAs: 'vm'
      })
	  .state('home.addAdminUser', {
        url:'/addAdminUser',
        controller: 'AddAminUserController',
        templateUrl: 'home/addAminUser/addadminuser.view.html',
        controllerAs: 'vm'
      })
	  .state('home.modifyPassword', {
        url:'/modifyPassword',
        controller: 'ModifyPasswordController',
        templateUrl: 'home/modifypassword/modifypassword.view.html',
        controllerAs: 'vm'
      })
	  .state('home.mytask', {
        url:'/mytask',
        controller: 'MyTaskController',
        templateUrl: 'home/mytask/mytask.view.html',
        controllerAs: 'vm'
      })
	  .state('home.bankdeposit', {
        url:'/bankdeposit',
        controller: 'BankDepositController',
        templateUrl: 'home/bankdeposit/bankdeposit.view.html',
        controllerAs: 'vm'
      })
	  .state('home.bankwithdrawal', {
        url:'/bankwithdrawal',
        controller: 'BankWithdrawalController',
        templateUrl: 'home/bankwithdrawal/bankwithdrawal.view.html',
        controllerAs: 'vm'
      })
	  .state('home.bankdetail', {
        url:'/bankdetail/:user_id/:tranfer_id',
        controller: 'BankDetailController',
        templateUrl: 'home/bankdetail/bankdetail.view.html',
        controllerAs: 'vm'
      })
	  .state('home.audit', {
        url:'/audit',
        controller: 'AuditController',
        templateUrl: 'home/audit/audit.view.html',
        controllerAs: 'vm'
      })
	  .state('home.config', {
        url:'/config',
        controller: 'ConfigDataController',
        templateUrl: 'home/config/config.view.html',
        controllerAs: 'vm'
      })
	  .state('home.modifyconfig', {
        url:'/modifyconfig/:configId/:asset_type',
        controller: 'ModifyConfigController',
        templateUrl: 'home/modifyconfig/modifyconfig.view.html',
        controllerAs: 'vm'
      })
	  .state('home.configcustome', {
        url:'/configcustome',
        controller: 'ConfigCustomerController',
        templateUrl: 'home/configcustome/configcustome.view.html',
        controllerAs: 'vm'
      })
	  .state('home.modifyconfigcustome', {
        url:'/modifyconfigcustome/:user_id/:asset_type/:is_currency',
        controller: 'ModifyConfigCustomerController',
        templateUrl: 'home/modifyconfigcustome/modifyconfigcustome.view.html',
        controllerAs: 'vm'
      })
	  .state('home.coindeposit', {
        url:'/coindeposit',
        controller: 'CoinDepositController',
        templateUrl: 'home/coindeposit/coindeposit.view.html',
        controllerAs: 'vm'
      })
	  .state('home.coinwithdrawal', {
        url:'/coinwithdrawal',
        controller: 'CoinWithdrawalController',
        templateUrl: 'home/coinwithdrawal/coinwithdrawal.view.html',
        controllerAs: 'vm'
      })
	  .state('home.coindetail', {
        url:'/coindetail/:user_id/:is_currency/:tranfer_id',
        controller: 'CoinDetailController',
        templateUrl: 'home/coindetail/coindetail.view.html',
        controllerAs: 'vm'
      })
	  .state('home.bankartificial', {
        url:'/bankartificial',
        controller: 'BankArtificialController',
        templateUrl: 'home/bankartificial/bankartificial.view.html',
        controllerAs: 'vm'
      })
	  .state('home.privilege', {
        url:'/privilege',
        controller: 'PrivilegeController',
        templateUrl: 'home/privilege/privilege.view.html',
        controllerAs: 'vm'
      })
	  .state('home.customer', {
        url:'/customer',
        controller: 'CustomerController',
        templateUrl: 'home/customer/customer.view.html',
        controllerAs: 'vm'
      })
	  .state('home.modifycustomer', {
        url:'/modifycustomer/:user_id',
        controller: 'ModifyCustomerController',
        templateUrl: 'home/modifycustomer/modifycustomer.view.html',
        controllerAs: 'vm'
      });
		
	  
      $urlRouterProvider.otherwise('/login');

    }

  run.$inject = ['$rootScope', '$location', '$cookies', '$http', '$httpBackend'];
  function run($rootScope, $location, $cookies, $http, $httpBackend) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.token) {
            //$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.token;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();
