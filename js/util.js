(function(){
	'use strict';
	angular
  	.module('app')
	.service('Util',function(){
		var UtilService = {};
		UtilService.checkPhone = checkPhone;
		UtilService.checkMail = checkMail;
		UtilService.dialog = dialog;
		
		function checkPhone(number){
			var regMobile = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
			return (regMobile.test(number)) ? true : false;
		};
		
		function checkMail(mail){
			var regMail = /^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.){1,4}[a-z]{2,3}$/;
			return (regMail.test(mail)) ? true : false;
		};
		
		//错误信息弹出框
		function dialog(msg){
			var html = document.createElement("div");
			html.setAttribute("class","msg-dialog");
			html.setAttribute("id","msg-dialog");
			html.innerHTML = msg;
			var body = document.querySelector("body");
			body.appendChild(html);
			setTimeout(function(){
				var msg_dialog = document.querySelector("#msg-dialog");
				body.removeChild(msg_dialog);
			},2000);
		};
		
		
		return UtilService;
	});
})()