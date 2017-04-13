(function () {
  'use strict';

  angular
    .module('app')
    .factory('MarketService', MarketService);

    MarketService.$inject = ['$http'];
    function MarketService($http) {
      var service = {};

      service.getOrderbook = getOrderbook;
      service.getChart = getChart;
      service.getSmChart = getSmChart;

      return service;
      function getOrderbook() {
            return $http.get('http://localhost:8090/depth', { headers: {}}).then(handleSuccess, handleError('Error getting all users'));
      }
      function getChart() {
        return $http.get('http://localhost:8090/candlestick/min1/ETCCNY', { headers: {}}).then(handleSuccess, handleError('Error getting chart data'));
      }

      function getSmChart(symbol, target, callback) {
        callback(symbol, target, [3,2,3,4,3,2,1,6]);
      }

      // private functions
      function handleSuccess(res) {
        if(res.data!=undefined && res.data.error==undefined)
          return { success: true, data: res.data };
        else
          return handleError(res);
      }

      function handleError(res) {
        if(res.error!=undefined)
          return { success: false, message: res.error };
        return { success: false, message: 'General connection error' };
      }
    }
})();
