/*****************************************************************
                  login类
*****************************************************************/

$(function(){
	
	// 登录成功绑定门店id，导购员id
	var shopUuid = getQueryString("shopUuid");
	var accountUuid = getQueryString("accountUuid");

	//判断登陆url值有没有notlanded 表示，如果有跳转到首页，防止死循环
	$(".mui_return").click(function(){
		var  notlanded = getQueryString("shopUuid");
	  if(!isEmpty(notlanded)){
			window.location.href="../../../h5/templet/shop/index.html";
		}else{
			history.back(-1);
		}
	})

	//点击登录
	$("#loginbtn").click(function(){
		var username = $("#username").val();

		if(typeof username =='undefined' || username == null || username == ""){
			mui.alert('用户名不能为空', '提示');
			return;
		}
		//验证码登录
		var mobile = $.trim($("#username").val());
		var reg = /^1\d{10}$/;
		//var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[15678]|18[0-9]|14[579])[0-9]{8}$/;
		if(!reg.test(mobile)) {
			mui.alert('手机号码输入有误', '提示');
		}
		var captcha = $("#mobileCode").val();
		if(typeof captcha == 'undefined' || captcha == null || captcha == '') {
			mui.alert('验证码不能为空', '提示');
			return;
		}
		var appId = localStorage.getItem("appId");
		var DES3Str = DES3.encrypt("123456789012345678901234",'{"opeType":"loginByCode","map":{"appId":"' + appId + '","mobile":"' + username + '","captcha":"' + captcha + '","sessionId":"' + sessionId + '","shopUuid":"' + shopUuid + '","shopAccountUuid":"' + accountUuid + '"}}');
		
		var loginUrl =window.basePath+'jsonParam='+DES3Str;
		$.ajax({
			url:loginUrl,
			type:'POST',
			dataType:'JSON',
			success:function(data){
				console.log(data);
				if(data.return_code != "0"){
					mui.alert(data.message,'提示');
				}else{
					var customer = data.customer;
					var userId = customer.uuid;
					var customerType = customer.customerType;

					localStorage.setItem("userId",userId);
					 localStorage.setItem("token",data.token);
					localStorage.setItem("sessionId",data.sessionId);
					localStorage.setItem("customerName",customer.customerName);
					localStorage.setItem("mobliePhone",username);
					localStorage.setItem("customerType",customerType);
					
					if( !isEmpty(shopUuid) && !isEmpty(accountUuid) ) {
						bindShopId(data.token,data.sessionId,userId,shopUuid,accountUuid);
					}else {
						window.location.href="../../../h5/templet/shop/index.html";
					}
				}
			}
		})
	});
});

function bindShopId (token,sessionId,userId,shopUuid,accountUuid) {
	var DES3Str = DES3.encrypt("123456789012345678901234",'{"opeType":"bindCustomerShop","map":{"token":"'+token+'","sessionId":"'+sessionId+'","customerUuid":"' + userId + '","shopUuid":"' + shopUuid + '","shopAccountUuid":"' + accountUuid + '"}}');
		var Url =window.basePath+'jsonParam='+DES3Str;
		$.ajax({
			url:Url,
			type:'POST',
			dataType:'JSON',
			success:function(data){
				console.log(data);
				if(data.return_code != "0"){
					mui.alert(data.message,'提示');
				}else{
					window.location.href="../../../h5/templet/shop/index.html";
				}
			}
		})
}
