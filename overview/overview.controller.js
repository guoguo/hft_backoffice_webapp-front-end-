(function () {
    'use strict';

    angular
        .module('app')
    		.controller('OverviewController', OverviewController);

  function OverviewController(MarketService, PrivateService,PublicService, $scope) {

        var vm = this;

        vm.balances={};

		PrivateService.Balances()
            .then(function(balances) {
                vm.balances = balances.data;
                //vm.$apply();
            });
    var sm_graphs = [{
			symbol: 'BTCCNY',
      target: 'containerBTC'
    },{
			symbol: 'ETHCNY',
      target: 'containerETH'
    },{
			symbol: 'ETCCNY',
      target: 'containerETC'
    },{
			symbol: 'ZECCNY',
      target: 'containerZEC'
    },{
			symbol: 'ETPCNY',
      target: 'containerETP'
    }];

    sm_graphs.forEach( (_) => MarketService.getSmChart(_.symbol, _.target, drawSmallGraph) );

    function drawSmallGraph(symbol, target, data){

      Highcharts.stockChart(target, {

        rangeSelector: {
          selected: 1
        },

        title: {
          text: symbol
        },

        navigator: {
          enabled: false
        },

        series: [{
          name: symbol,
          data: data,
          tooltip: {
            valueDecimals: 2
          }
        }]
      });


      }
    }

})();
