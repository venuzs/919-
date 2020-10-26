/*****************************************************************
                  login类
*****************************************************************/

$(function(){

	//判断登陆url值有没有notlanded 表示，如果有跳转到首页，防止死循环
	$(".mui_return").click(function(){
		var  notlanded = getQueryString("notlanded");
	  if(!isEmpty(notlanded)){
			if(notlanded == "1"){
				window.location.href="../../../h5/templet/shop/index.html";
			}
		}else{
			history.back(-1);
		}
	})

	//点击登录
	$("#loginbtn").click(function(){
		var username = $("#username").val();
        // 获取openId
        var openId = getQueryString("openId");
        var extensionCode = getQueryString("extensionCode");

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
		var DES3Str = DES3.encrypt("123456789012345678901234",'{"opeType":"loginByCode","map":{"appId":"' + appId + '","mobile":"' + username + '","captcha":"' + captcha + '","sessionId":"' + sessionId + '"}}');
		if(typeof openId != 'undefined' && openId != null && openId != "") {
			DES3Str = DES3.encrypt("123456789012345678901234",'{"opeType":"loginByCode","map":{"appId":"' + appId + '","openId":"' + openId + '","mobile":"' + username + '","captcha":"' + captcha + '","sessionId":"' + sessionId + '"}}');
		}
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
					var isGeneralize = customer.isGeneralize;
					var customerType = customer.customerType;

					localStorage.setItem("userId",userId);
					 localStorage.setItem("token",data.token);
					localStorage.setItem("sessionId",data.sessionId);
					localStorage.setItem("customerName",customer.customerName);
					localStorage.setItem("mobliePhone",username);
					localStorage.setItem("customerType",customerType);

					//已申请牧客未审核或审核通过 。
					if(customer.generalizeAuditState == '1' || customer.generalizeAuditState == '2'){
                        window.location.href="../../../h5/templet/shop/index.html";
                    }else{
                        window.location.href="../../../h5/templet/personal/applyGeneralize.html?extensionCode="+ extensionCode;
                    }

				}
			}
		})
	});
});