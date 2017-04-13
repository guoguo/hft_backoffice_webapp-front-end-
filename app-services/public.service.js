/**
* @author shenyuhang
* @date 2017-03-07
* @description  public service 公共接口调用
**/
(function() {
	'use strict';
  angular
    .module('app')
    .factory('PublicService', PublicService);

    PublicService.$inject = ['$http', '$cookies', '$rootScope'];
    function PublicService($http, $cookies, $rootScope) {
		var testFlag = "test";
		let service = {};

		let SERVER = 'http://192.168.0.211:8091/';

		service.debug = true;
		service.GetMarket = GetMarket;
		service.GetMarketSymbol = GetMarketSymbol;
		service.GetDepth = GetDepth;
		service.GetTicker = GetTicker;
		service.GetTrades = GetTrades;
		service.GetCandlestick = GetCandlestick;

		return service;

		//获得市场
		function GetMarket() {
			return _get("remark");
		}
		//获得具体某个市场
		function GetMarketSymbol(symbol) {
			return _get("getRemark/"+symbol);
		}

		//获得市场深度和某个市场深度
		function GetDepth(symbol) {
			return _get("depth/"+symbol);
		}
		
		//获得ticker和某个ticker
		function GetTicker(symbol) {
			return _get("ticker/"+symbol);
		}

		//获得trades和某个trades
		function GetTrades(symbol) {
			return _get("trades/"+symbol);
		}
		
		//获得candlestick和某个candlestick
		function GetCandlestick(timeSymbol,symbol) {
			return _get("candlestick/"+timeSymbol+"/"+symbol);
		}
		
		//get提交数据
		function _get(method, params) {
			return $http.get(SERVER + method+"?testFlag="+testFlag).then(
				function(res){
					return handleSuccess(res);
				},
				function(res){
					return handleError(res);
				}
			);
		} // end _get
		
		//请求成功处理函数
		function handleSuccess(res) {
			if(res.data!=undefined && res.data.status.success!=undefined && res.data.status.success)
				return { success: true, data: res.data.result};
			else
				return handleError(res);
		} // end handleSuccess

		//请求失败处理函数
		function handleError(res) {
			if(res.error!=undefined)
				return { success: false, message: res.error };
				return { success: false, message: 'General connection error' };
		} // end handleError
	
    }

})();
