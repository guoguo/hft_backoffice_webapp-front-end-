(function () {
    'use strict';

    angular
        .module('app')
        .controller('TradingDeskController', TradingDeskController);

    function TradingDeskController($scope, LiveService, $rootScope) {
        var vm = this;


        $scope.orderbook={
          ask: [],
          bid: []
        }

        $scope.setForm = setForm;

        initController();

        function initController() {
            loadOrderbook()
          }

          vm.form={
            buy: {
              amount: '',
              limit: ''
            },
            sell: {
              amount: '',
              limit: ''
            },
            stop_loss: {
              amount: '',
              limit: ''
            }
          }



        function set_orderbook_ask(data){
          $scope.orderbook.ask=data;
        }

        function loadOrderbook() {
          LiveService.subscribeOrderbookAsk(
            function(){
              return {
          init: function(data){
            //Init
            $scope.orderbook.ask=data;
            $scope.$apply();
          },
          add : function(index, data){
            //Insert ite;
            $scope.orderbook.ask.splice(index,0,data);
            $scope.$apply();
          },
          remove : function(index, count){
            //Remove data
            $scope.orderbook.ask.splice(index,count);
            $scope.$apply();
          }
        }
      }
    );
    LiveService.subscribeOrderbookBid(
            function(){
              return {
          init: function(data){
            //Init
            $scope.orderbook.bid=data;
            $scope.$apply();
          },
          add : function(index, data){
            //Insert ite;
            $scope.orderbook.bid.splice(index,0,data);
            $scope.$apply();
          },
          remove : function(index, count){
            //Remove data
            $scope.orderbook.bid.splice(index,count);
            $scope.$apply();
          }
        }
      }
        );


        }

        function setForm(type, amount, limit){
          vm.form[type].amount=amount;
          vm.form[type].limit=limit;
        }

    }
})();
