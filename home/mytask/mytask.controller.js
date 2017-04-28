(function () {
    'use strict';

    angular
        .module('app')
        .controller('MyTaskController', MyTaskController);

    function MyTaskController($scope,$state,MyTaskService,SuperService,BankDepositService,Util) {
        var vm = this;
		$scope.params = {
			loginInfo:[],
			user_id:'',
			users:[],
			adminUsers:[],
			mytask:[],
			mybanktask:[],
			mycointask:[],
			idcardtask:[],
			dialogMes:"",
			symbol:0,
			uid:0,
			index:-1,
			userType:'',
			errMsg:"",
			errSymbol:false,
			people:true,
			rejectFlag:true,
			coinflag:false,
			pramaflag:false
		};
		//提交上级数据
		$scope.goUpdtariParam={
			bank_transfer_id:0,
			system_status:1,
			customer_user_id:0,
			amount:0,
			is_currency:'',
			show_user_status:0
		};
		//拒绝数据
		$scope.rejectData={
			transefer_id:0,
			bank_transfer_id:0,
			system_status:1
		};
		
		var params = {
				is_currency:'DEPOSIT',
				transfer_type:'DEPOSIT',
				row:0,
				count:10
			};
		
		(function init(){
			$scope.symbol = window.localStorage['symbols'];
			if($scope.symbol!=3){
				$scope.params.people = false;
			}
			if($scope.symbol==0){
				$scope.params.rejectFlag = false;
			}
			queryData(params);
			queryLoginInfo(0,10);
			queryUsers(0,10);
			queryIdCardTask({});
		})();
		
		//点击查询
		$scope.queryTask = function(e,show_user_status){
			var target = e.target;
			$(target).addClass('bk-t-msaCh');
			$(target).siblings().removeClass('bk-t-msaCh');
			if(show_user_status!=undefined){
				var mytaskArr = [];
				for(var i=0;i<$scope.mytaskMiddle.length;i++){
					var item = $scope.mytaskMiddle[i];
					if(item.show_user_status == show_user_status){
						mytaskArr.push(item);
					}
				}
				$scope.params.mytask = mytaskArr;
				var mycointaskArr = [];
				for(var i=0;i<$scope.mytaskcoinMiddle.length;i++){
					var items = $scope.mytaskcoinMiddle[i];
					if(items.show_user_status == show_user_status){
						mycointaskArr.push(items);
					}
				}
				
				$scope.params.mycointask = mycointaskArr;
			}else{
				$scope.params.mytask = $scope.mytaskMiddle;
				$scope.params.mycointask = $scope.mytaskcoinMiddle;
			}
		};
		
		function queryCoinData(){
			//查询同步查询充值数据
			MyTaskService.queryCoinData(params).then((response) => {
				//leval
				if(!response.success){
					//Util.dialog("没有最新数据,同步!");
				}
				params.transfer_type='WITHDRAWAL';
				queryCoinWithdrawalData(params);
			});
		};
		
		function queryCoinWithdrawalData(){
			//查询同步查询提现数据
			MyTaskService.queryCoinData(params).then((response) => {
				//leval
				if(!response.success){
					//Util.dialog("没有最新数据,同步!");
				}
				params.transfer_type='DEPOSIT';
				queryBankTask(params);
			});
		};
		
		function queryData(){
			//查询同步查询数据
			MyTaskService.queryData(params).then((response) => {
				//leval
				if(!response.success){
					//Util.dialog("没有最新数据,同步!");
				}
				queryCoinData(params);
			});
		};
		
		function queryCoinBankTask(params){
			//查询数字货币充提任务
			MyTaskService.queryCoinBankTask(params).then((response) => {
				if(response.success){
					$scope.params.mycointask = response.data;
					$scope.mytaskcoinMiddle = $scope.params.mycointask;
					params.is_currencys = 'WITHDRAWAL';
					queryCoinBankTaskWith(params);
				}
			});
		};
		
		function queryCoinBankTaskWith(params){
			//查询数字货币提币任务
			MyTaskService.queryCoinBankTask(params).then((response) => {
				if(response.success){
					$scope.params.mycointask = $scope.params.mycointask.concat(response.data);
					$scope.mytaskcoinMiddle = $scope.mytaskcoinMiddle.concat(response.data);
					params.is_currencys = 'DEPOSIT';
				}
			});
		};
		function queryBankTask(params){
			//查询我的人民币充提任务
			MyTaskService.queryBankTask(params).then((response) => {
				if(response.success){
					$scope.params.mytask = response.data;
					$scope.params.mybanktask = response.data;
					$scope.mybanktaskMiddle = response.data;
					$scope.mytaskMiddle = $scope.params.mytask;
					params.is_currency = 'WITHDRAWAL';
					queryBankTaskWithdrawal(params);
				}
			});
		};
		
		function queryIdCardTask(params){
			//查询身份认证任务
			MyTaskService.queryIdCardTask(params).then((response) => {
				console.log(response)
				if(response.success){
					$scope.params.idcardtask = response.data;
				}
			});
		};
		
		function queryBankTaskWithdrawal(params){
			//查询我的人民币充提任务
			MyTaskService.queryBankTask(params).then((response) => {
				//leval
				if(response.success){
					$scope.params.mytask = $scope.params.mytask.concat(response.data);
					$scope.mytaskMiddle = $scope.mytaskMiddle.concat(response.data);
					params.is_currency = 'DEPOSIT';
					params.is_currencys = 'DEPOSIT';
					queryCoinBankTask(params);
				}
			});
		};
		
		function queryLoginInfo(row,cols){
			//获得登录信息
			SuperService.queryLoginInfo(row,cols).then((response) => {
				if(response.success){
					$scope.params.loginInfo = response.data;
					if(response.data.length!=0){
						$scope.params.allcount = Math.ceil(response.data[0].count/10);
					}
					
					//pagesFunction(1,$scope.params.allcount);
				}
			});
		};
		
		//点击查询人民币
		$scope.queryTaskBank = function(e,show_user_status){
			var target = e.target;
			$(target).addClass('bk-t-msaCh');
			$(target).siblings().removeClass('bk-t-msaCh');
			if(show_user_status!=undefined){
				var mytaskArr = [];
				for(var i=0;i<$scope.mybanktaskMiddle.length;i++){
					var item = $scope.mybanktaskMiddle[i];
					if(item.show_user_status == show_user_status){
						mytaskArr.push(item);
					}
				}
				$scope.params.mybanktask = mytaskArr;
			}else{
				$scope.params.mybanktask = $scope.mybanktaskMiddle;
				$scope.params.mybanktaskMiddle = $scope.mybanktaskMiddle;
			}
		};
		
		//取消删除用户搜索结果、
		$scope.userInfoHide = function(){
			$scope.params.userinfoFlag = false;
			$scope.params.userInfo = {};
			$scope.params.user_id = "";
			queryBankTask(params);
		};
		
		//点击搜索按钮
		$scope.search = function(){
			if($scope.params.user_id == ""){
				queryBankTask(params);
				$scope.params.userinfoFlag = false;
				$scope.params.userInfo = {};
				$scope.params.user_id = "";
			}else{
				var userparams ={
					'customer_user_id':$scope.params.user_id
				};
				queryCustomerInfo(userparams);
			}
		};
		
		//点击查看
		$scope.queryAuthor = function(user_id,id,index){
			$scope.params.index = index;
			params.id = id;
			params.user_id = user_id;
			showAndHideDl('show');
			MyTaskService.queryCustomerAuthorInfo(params).then((response) => {
				$scope.params.authorInfo = {};
				if(response.success){
					var data = response.data;
					for(var i=0;i<data.length;i++){
						var item = data[i];
						$scope.params.authorInfo.name = item.name;
						$scope.params.authorInfo.id_type = item.id_type;
						$scope.params.authorInfo.id_no = item.id_no;
						$scope.params.authorInfo.level = item.level;
						$scope.params.authorInfo.user_id = item.user_id;
						$scope.params.authorInfo.remark = item.remark;
						if(item.type=='back'){
							$scope.params.authorInfo.back = item.source
						}else if(item.type=='frand'){
							$scope.params.authorInfo.frand = item.source
						}else if(item.type=='face'){
							$scope.params.authorInfo.face = item.source
						}
					}
				}else{
					$scope.params.errMsg="查询身份认证信息失败";
					$scope.params.errSymbol=true;
					setTimeHide();
				}
			});
		};
		
		//不通过身份审核
		$scope.notPass = function(){
			params.remark = $scope.params.authorInfo.remark;
			MyTaskService.deleteCustomerAuthorInfo(params).then((response) => {
				showAndHideDl('hide');
				if(response.success){
					var index = $scope.params.index;
					$scope.params.errMsg="拒绝身份认证成功";
					$scope.params.idcardtask.splice(index,1);
				}else{
					$scope.params.errMsg="拒绝身份认证失败";
				}
				$scope.params.errSymbol=true;
				setTimeHide();
			});
		};
		
		//通过身份审核
		$scope.adopt = function(){
			params.remark = $scope.params.authorInfo.remark;
			MyTaskService.updateCustomerAuthorInfo(params).then((response) => {
				showAndHideDl('hide');
				if(response.success){
					var index = $scope.params.index;
					$scope.params.errMsg="身份认证成功";
					$scope.params.idcardtask.splice(index,1);
				}else{
					$scope.params.errMsg="身份认证失败";
				}
				$scope.params.errSymbol=true;
				setTimeHide();
			});
		};
				
		//查询用户信息
		function queryCustomerInfo(user_id){
			BankDepositService.queryCustomerInfo(user_id).then((response) => {
				if(response.success){
					if(response.data.length!=0){
						$scope.params.userinfoFlag = true;
						$scope.params.userInfo = response.data[0];
						if(response.data[0].id!=undefined || response.data[0].id!=0){
							params.customer_user_id = response.data[0].id;
							queryBankTask(params);
						}
					}else{
						$scope.params.userinfoFlag = false;
						$scope.params.errMsg="没查到用户信息!";
						$scope.params.errSymbol=true;
						
					}
				}
			});
		};
		
		$scope.nowPage = 0;
		$scope.mytasknowPage = 1;
		$scope.params.allcount = 0;
		$scope.params.mytaskallcount = 0;
		$scope.leftPages = [1,2,3];
		$scope.mytaskleftPages = [1,2,3];
		//首页
		$scope.prev = function(type){
			if(type=='login'){
				if($scope.nowPage!=1){
					$scope.nowPage =1;
				}
				queryLoginInfo($scope.nowPage,10);
				pagesFunction($scope.nowPage,$scope.params.allcount,'login');
			}else if(type=="mytask"){
				if($scope.mytasknowPage!=1){
					$scope.mytasknowPage =1;
				}
				params.row = 0;
				queryBankTask(params);
				queryCoinBankTask(params);
				pagesFunction($scope.mytasknowPage,$scope.params.mytaskallcount,'mytask');
			}
		};
		
		//尾页
		$scope.next = function(type){
			if(type=='login'){
				if($scope.nowPage!=$scope.params.allcount){
					$scope.nowPage = $scope.params.allcount;
				}
				queryLoginInfo($scope.nowPage,10);
				pagesFunction($scope.nowPage,$scope.params.allcount,'login');
			}else if(type=="mytask"){
				if($scope.mytasknowPage!=$scope.params.mytaskallcount){
					$scope.mytasknowPage = $scope.params.mytaskallcount;
				}
				pagesFunction($scope.mytasknowPage,$scope.params.mytaskallcount,'mytask');
			}
		};
		//点击当前页
		$scope.page = function(e,row,type){
			$(e.target).addClass("pages-Chosee");
			$(e.target).siblings().removeClass("pages-Chosee");
			if(type=='login'){
				queryLoginInfo($scope.nowPage,10);
				$scope.nowPage = row;
				pagesFunction(row,$scope.params.allcount,'login');
			}
			if(type=="mytask"){
				$scope.mytasknowPage = row;
				pagesFunction($scope.mytasknowPage,$scope.params.mytaskallcount,'mytask');
			}
		};
		
		//分页算法
		function pagesFunction(row,count,type){
			if(type=='login'){
				$scope.leftPages = [];
			}else if(type=="mytask"){
				$scope.mytaskleftPages = [];
			}
			if(row==0 && count<4){
				for(var i=1;i<=count;i++){
					$scope.leftPages.push(i);
				}
			}else if(row==0 && 4<=count){
				for(var i=1;i<=4;i++){
					$scope.leftPages.push(i);
				}
			}else if(row==count && 4<=count){
				for(var i=(count-2);i<=count;i++){
					$scope.leftPages.push(i);
				}
			}else if(row!=0 && row!=count && 4<=count){
				for(var i=(row-1);i<=(row+2);i++){
					$scope.leftPages.push(i);
				}
			}else if(row!=0 && row==count && 4<=count){
				for(var i=(row-1);i<=(row+2);i++){
					$scope.leftPages.push(i);
				}
			}else if(row!=0 && row!=count && count<4){
				for(var i=1;i<=count;i++){
					$scope.leftPages.push(i);
				}
			}else if(row!=0 && row==count && count<4){
				for(var i=1;i<=count;i++){
					$scope.leftPages.push(i);
				}
			}
			
		};
		
		function queryUsers(row,cols){
			//查询操作员
			SuperService.queryUsers(row,cols).then((response) => {
				if(response.success){
					$scope.params.users = response.data;
				}
			});
		};
		
		//判断是否是当前自己可以操作的数据
		$scope.isSelf = function(show_status,role_symbol){
			var is = false;
			if(show_status==1 && role_symbol==$scope.symbol){
				is = true;
			}
			return is;
		};
		
		//人民币下一条
		$scope.itemDetail = function(user_id,tranfer_id){
			$state.go('home.bankdetail', {user_id: user_id,tranfer_id:tranfer_id});
		};
		//数字货币下一条
		$scope.itemCoinDetail = function(user_id,is_currency,transfer_id){
			$state.go('home.coindetail', {user_id: user_id,is_currency: is_currency,tranfer_id:transfer_id});
		};
		//数字货币拒绝
		$scope.rejectCoin = function(bank_transfer_id,system_status,customer_user_id,is_currency,amount,index,asset_type){
			$scope.params.coinflag = true;
			showAndHide("show");
			$scope.params.symbol = 9;
			$scope.params.index = index;
			$scope.params.dialogMes = "您确定拒绝该操作吗？"
			$scope.rejectData.transefer_id=bank_transfer_id;
			$scope.rejectData.system_status=-1;
			$scope.rejectData.customer_user_id=customer_user_id;
			$scope.rejectData.amount=amount;
			$scope.rejectData.is_currency=is_currency;
			$scope.rejectData.asset_type=asset_type;
		};
		//拒绝
		$scope.reject = function(bank_transfer_id,system_status,customer_user_id,is_currency,amount,index,asset_type){
			showAndHide("show");
			$scope.params.symbol = 9;
			$scope.params.index = index;
			$scope.params.dialogMes = "您确定拒绝该操作吗？"
			$scope.rejectData.bank_transfer_id=bank_transfer_id;
			$scope.rejectData.system_status=-1;
			$scope.rejectData.customer_user_id=customer_user_id;
			$scope.rejectData.amount=amount;
			$scope.rejectData.is_currency=is_currency;
			$scope.rejectData.asset_type=asset_type;
		};
		//异常
		$scope.abnormal = function(bank_transfer_id,system_status,customer_user_id,is_currency,amount,index,asset_type){
			showAndHide("show");
			$scope.params.symbol = 10;
			$scope.params.index = index;
			$scope.params.dialogMes = "您确定异常该操作吗？"
			$scope.rejectData.bank_transfer_id=bank_transfer_id;
			$scope.rejectData.system_status=-3;
			$scope.rejectData.customer_user_id=customer_user_id;
			$scope.rejectData.amount=amount;
			$scope.rejectData.is_currency=is_currency;
			$scope.rejectData.asset_type=asset_type;
			$scope.params.coinflag = false;
		};
		//数字货币异常
		$scope.abnormalCoin = function(bank_transfer_id,system_status,customer_user_id,is_currency,amount,index,asset_type){
			showAndHide("show");
			$scope.params.symbol = 10;
			$scope.params.index = index;
			$scope.params.dialogMes = "您确定异常该操作吗？"
			$scope.rejectData.bank_transfer_id=bank_transfer_id;
			$scope.rejectData.system_status=-3;
			$scope.rejectData.customer_user_id=customer_user_id;
			$scope.rejectData.amount=amount;
			$scope.rejectData.is_currency=is_currency;
			$scope.rejectData.asset_type=asset_type;
			$scope.params.coinflag = true;
		};
		//提交数字货币上级
		$scope.goCoinUpstairs = function(bank_transfer_id,system_status,customer_user_id,amount,is_currency,show_user_status,leval,index,asset_type){
			showAndHide("show");
			$scope.params.coinflag = true;
			$scope.params.index = index;
			$scope.params.symbol = 11;
			$scope.params.dialogMes = "您确定提交该操作吗？"
			$scope.goUpdtariParam.leval=leval;
			$scope.goUpdtariParam.asset_type=asset_type;
			$scope.goUpdtariParam.transefer_id=bank_transfer_id;
			$scope.goUpdtariParam.system_status=system_status+1;
			$scope.goUpdtariParam.show_user_status=show_user_status;
			if($scope.symbol==3){
				$scope.goUpdtariParam.system_status=0;
				$scope.goUpdtariParam.show_user_status=0;
			}
			$scope.goUpdtariParam.customer_user_id=customer_user_id;
			$scope.goUpdtariParam.amount=amount;
			$scope.goUpdtariParam.is_currency=is_currency;
			
		};
		
		//提交上级
		$scope.goUpstairs = function(bank_transfer_id,system_status,customer_user_id,amount,is_currency,show_user_status,leval,index,method){
			$scope.params.coinflag = false;
			showAndHide("show");
			$scope.params.index = index;
			$scope.params.symbol = 11;
			$scope.params.dialogMes = "您确定提交该操作吗？"
			$scope.goUpdtariParam.leval=leval;
			$scope.goUpdtariParam.bank_transfer_id=bank_transfer_id;
			$scope.goUpdtariParam.system_status=system_status+1;
			$scope.goUpdtariParam.method=method;
			$scope.goUpdtariParam.show_user_status=show_user_status;
			if($scope.symbol==3){
				$scope.goUpdtariParam.system_status=0;
				$scope.goUpdtariParam.show_user_status=0;
			}
			$scope.goUpdtariParam.customer_user_id=customer_user_id;
			$scope.goUpdtariParam.amount=amount;
			$scope.goUpdtariParam.is_currency=is_currency;
			
		};
		
		//冻结或者注销用户
		$scope.frozen = function(uid,index,type,userType){
			$scope.params.uid = uid;
			$scope.params.symbol = type;
			$scope.params.index = index;
			$scope.params.userType = userType
			showAndHide("show");
			if(type==0){
				$scope.params.dialogMes = "您确定冻结该用户吗？"
			}else if(type==1){
				$scope.params.dialogMes = "您确定注销该用户吗？"
			}else{
				$scope.params.dialogMes = "您确定解冻该用户吗？"
			}
		};
		
		//显示隐藏
		function showAndHide(type){
			var hide = document.querySelector(".hide");
			var dialog = document.querySelector(".dialog");
			if(type=="show"){
				hide.style.display = "block";
				dialog.style.display = "block";
			}else{
				hide.style.display = "none";
				dialog.style.display = "none";
			}
		};
		
		//显示隐藏
		function showAndHideDl(type){
			var hide = document.querySelector(".hide");
			var dialog = document.querySelector(".my-dialog");
			if(type=="show"){
				hide.style.display = "block";
				dialog.style.display = "block";
			}else{
				hide.style.display = "none";
				dialog.style.display = "none";
			}
		};
		
		$scope.hideMethod = function(){
			var hide = document.querySelector(".hide");
			var mydialog = document.querySelector(".my-dialog");
			var dialog = document.querySelector(".dialog");
			hide.style.display = "none";
			dialog.style.display = "none";
			mydialog.style.display = "none";
		};
		
		//取消按钮
		$scope.cancel = function(){
			showAndHide("hide");
		};
		
		function setTimeHide(){
			setTimeout(function(){
				$scope.params.errSymbol = false;
				$scope.$apply();
			},3000);
		};
		
		//确定按钮
		$scope.sure = function(){
			//冻结
			if($scope.params.symbol==0){
				SuperService.frozen($scope.params.uid).then((response) => {
					if(response.success){
						var index = $scope.params.index;
						$scope.params.errMsg="冻结成功";
						($scope.params.userType=="admin")?$scope.params.adminUsers[index].status = 1:$scope.params.users[index].status = 1;
					}else{
						$scope.params.errMsg="冻结失败";
					}
					$scope.params.errSymbol=true;
					setTimeHide();
				});
			//注销
			}else if($scope.params.symbol==1){
				SuperService.cancellationUser($scope.params.uid).then((response) => {
					if(response.success){
						var index = $scope.params.index;
						$scope.params.errMsg="注销成功";
						($scope.params.userType=="admin")?$scope.params.adminUsers.splice(index,1):$scope.params.users.splice(index,1);
					}else{
						$scope.params.errMsg="注销失败";
					}
					$scope.params.errSymbol=true;
					setTimeHide();
				});
			//解冻
			}else if($scope.params.symbol==2){
				SuperService.unFrozen($scope.params.uid).then((response) => {
					if(response.success){
						var index = $scope.params.index;
						$scope.params.errMsg="解冻成功";
						($scope.params.userType=="admin")?$scope.params.adminUsers[index].status = 0:$scope.params.users[index].status = 0;
					}else{
						$scope.params.errMsg="解冻失败";
					}
					$scope.params.errSymbol=true;
					setTimeHide();
				});
			//拒绝
			}else if($scope.params.symbol==9){
				if($scope.params.coinflag){
					MyTaskService.rejectCoinFun($scope.rejectData).then((response) => {
						if(response.success){
							var index = $scope.params.index;
							$scope.params.errMsg="拒绝成功";
							$scope.params.mycointask[index].assign_role_id =  parseInt($scope.symbol);
							$scope.params.mycointask[index].show_user_status=-1;
						}else{
							$scope.params.errMsg="拒绝失败";
						}
						$scope.params.errSymbol=true;
						setTimeHide();
					});
				}else{
					MyTaskService.rejectFun($scope.rejectData).then((response) => {
						if(response.success){
							var index = $scope.params.index;
							$scope.params.errMsg="拒绝成功";
							$scope.params.mytask[index].assign_role_id = parseInt($scope.symbol);
							$scope.params.mytask[index].show_user_status=-1;
						}else{
							$scope.params.errMsg="拒绝失败";
						}
						$scope.params.errSymbol=true;
						setTimeHide();
					});
				}	
			//异常
			}else if($scope.params.symbol==10){
				if($scope.params.coinflag){
					MyTaskService.rejectCoinFun($scope.rejectData).then((response) => {
						if(response.success){
							var index = $scope.params.index;
							$scope.params.errMsg="加入异常成功";
							$scope.params.mycointask[index].assign_role_id =  parseInt($scope.symbol);
							$scope.params.mycointask[index].show_user_status=-1;
						}else{
							$scope.params.errMsg="加入异常失败";
						}
						$scope.params.errSymbol=true;
						setTimeHide();
					});
				}else{
					MyTaskService.rejectFun($scope.rejectData).then((response) => {
						if(response.success){
							var index = $scope.params.index;
							$scope.params.errMsg="加入异常成功";
							$scope.params.mytask[index].assign_role_id = parseInt($scope.symbol);
							$scope.params.mytask[index].show_user_status=-1;
						}else{
							$scope.params.errMsg="加入异常失败";
						}
						$scope.params.errSymbol=true;
						setTimeHide();
					});
				}	
			//提交
			}else if($scope.params.symbol==11){
				if($scope.params.coinflag){
					MyTaskService.goCoinUpstairs($scope.goUpdtariParam).then((response) => {
						if(response.success){
							var index = $scope.params.index;
							Util.dialog("提交上级成功");
							$scope.params.mycointask[index].assign_role_id = $scope.params.mycointask[index].assign_role_id+1;
							if($scope.symbol==3){
								$scope.params.mycointask[index].assign_role_id = 3;
								$scope.params.mycointask[index].system_status=3;
								$scope.params.mycointask[index].show_user_status=0;
							}
						}else if(response.message=='ERR_IS_LITTLE'){
							Util.dialog("该笔数据属于小额自动充值！");
						}else if(response.message='ERR_AMOUNT_EXCCED_FAIL'){
							Util.dialog("提现额度超过单笔额度，请拒绝!");
						}else if(response.message='ERR_AMOUNT_ACCUMULATE_LIMIT_FAIL'){
							Util.dialog("提现额度超过累计额度，请拒绝!");
						}else{
							Util.dialog("提交上级失败");
						}
					});
				}else{
					MyTaskService.goUpstairs($scope.goUpdtariParam).then((response) => {
						if(response.success){
							var index = $scope.params.index;
							Util.dialog("提交上级成功");
							$scope.params.mytask[index].assign_role_id = $scope.params.mytask[index].assign_role_id+1;
							if($scope.symbol==3){
								$scope.params.mytask[index].assign_role_id = 3;
								$scope.params.mytask[index].system_status=3;
								$scope.params.mytask[index].show_user_status=0;
							}
						}else if(response.message=='ERR_IS_LITTLE'){
							Util.dialog("该笔数据属于小额自动充值！");
						}else if(response.message='ERR_AMOUNT_EXCCED_FAIL'){
							Util.dialog("充值额度超过单笔额度，请拒绝!");
						}else if(response.message='ERR_AMOUNT_ACCUMULATE_LIMIT_FAIL'){
							Util.dialog("提现额度超过累计额度，请拒绝!");
						}else{
							Util.dialog("提交上级失败");
						}
						
					});
				}
			}
			showAndHide("hide");
		};
    }
})();
