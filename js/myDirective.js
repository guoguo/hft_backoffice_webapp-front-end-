(function(){
	'use strict';
	var app = angular.module('app',[]);
	app.directive('checkNum',function(){
		return {
			restrict:'AE',
			replace:true,
			link:function(scope, element, attrs){
				scope.test = function(){
					console.log(element);
				}
			}
		};
	});
})()