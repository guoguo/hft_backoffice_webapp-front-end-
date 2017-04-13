(function () {
  'use strict';

  angular
    .module('app')
    .factory('LiveService', LiveService);

    LiveService.$inject = ['$http'];
    function LiveService($http) {

      var ws =null;

      var subscriptions = {
        'orderbook_ask' : null,
        'orderbook_bid' : null
      }

      var command_queue = [];

      setInterval(function(){
        if(command_queue.length>0){
          send(command_queue.shift())
        }
      }, 100)


      function update_orderbook_data(type, updates){

        updates.forEach(function(update){
            update_orderbook_data_step(type, update)
        })
      }

      function update_orderbook_data_step(type, step){

        switch(type){
          case 'ask':
            if(step.o=='i'){
              subscriptions.orderbook_ask().add(step.i, step.d)
            } else if(step.o=='d'){
              subscriptions.orderbook_ask().remove(step.i, step.c)
            }
            break;
          case 'bid':
            if(step.o=='i'){
              subscriptions.orderbook_bid().add(step.i, step.d)
            } else if(step.o=='d'){
              subscriptions.orderbook_bid().remove(step.i, step.c)
            }
            break;
        }
      }

      function initialize( callback ){
        ws = new WebSocket('ws://127.0.0.1:9000');

        ws.onmessage = function(ev) {
          var message = JSON.parse(ev.data)
          if(message.key!=undefined){
          switch (message.key) {
            case 'ORDERBOOK_ASK_INIT':
              if(subscriptions.orderbook_ask!=null)
                subscriptions.orderbook_ask().init(message.data)
              break;
            case 'ORDERBOOK_ASK_UPDATE':
              update_orderbook_data('ask',message.data)
              break;
            case 'ORDERBOOK_BID_INIT':
              if(subscriptions.orderbook_ask!=null)
                subscriptions.orderbook_bid().init(message.data)
              break;
            case 'ORDERBOOK_BID_UPDATE':
              update_orderbook_data('bid',message.data)
              break;
            default:

          }
        }
        };

        ws.onopen = function(){
          callback();
        }

        ws.onclose = function(){
          ws=null;
        }

      }

      function send(command){
          if(ws==null){
            initialize(function(){
              _send(command)
            });
          }
          else if(ws.readyState){
            _send(command)
          }
      }

      function _send(command){
        console.log( ' send: '+command)
        ws.send(command);
      }

      var service = {};

      service.subscribeOrderbookAsk = subscribeOrderbookAsk;
      service.subscribeOrderbookBid = subscribeOrderbookBid;

      return service;

      function subscribeOrderbookAsk(callback) {
          subscriptions.orderbook_ask = callback;
          command_queue.push('subscribe_orderbook_ask');
          setInterval ( () => {
            if(subscriptions.orderbook_ask != null){
              command_queue.push('subscribe_orderbook_ask');
            }
          }, 30000)
      }

      function subscribeOrderbookBid(callback) {
          subscriptions.orderbook_bid = callback;
          command_queue.push('subscribe_orderbook_bid');
          setInterval ( () => {
            console.log('renew')
            if(subscriptions.orderbook_bid != null){
              command_queue.push('subscribe_orderbook_bid');
            }
          }, 30000)
      }


    }
})();
