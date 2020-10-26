$(function(){
	// 获取图片验证码
	var storage = window.localStorage;
	var storageSess = null;
	var registerJudge = localStorage.getItem("registerJudge");
	
	// 获取门店id 导购员id
	var shopUuid = getQueryString('shopUuid') || '';
	var accountUuid = getQueryString('accountUuid') || '';

	var reqisterImg = DES3.encrypt("123456789012345678901234",'{"opeType":"getCode"}');
    var reqisterImgUrl =window.basePath+'jsonParam='+reqisterImg;

    var extensionCode = getQueryString("extensionCode");
    if (typeof extensionCode != 'undefined' && extensionCode != null && extensionCode != '') {
		$("#extensionCode").val(extensionCode);
	}

    $.ajax({
    	url: reqisterImgUrl,
        type: "POST",
        dataType: "json",
        success: function(data){
        	console.log(data);
        	if(data.return_code == "0"){
				storage.setItem("storageSess",data.sessionId);
	        	var reqisterData = ""
	        	+'<img src="data:image/gif;base64,'+ data.code +'">';
	        	$(".verify-reqister-img").append(reqisterData);
        	}else{
        		mui.alert(data.message,'提示');
        	}

        },
			error:function(data){
				console.log(data);
				console.log('系统错误','提示');
			}
	})


	$("#verifyimg").click(function(){
		$.ajax({
    	url: reqisterImgUrl,
        type: "POST",
        dataType: "json",
        success: function(data){
        	if(data.return_code != "0"){
        		mui.alert(data.message,'提示');
        	}else{
        		storage.setItem("storageSess",data.sessionId);
	        	var reqisterData = ""
	        	+'<img src="data:image/gif;base64,'+ data.code +'">';
	        	$(".verify-reqister-img").html(reqisterData);
        	}

        	},
			error:function(data){
				console.log('系统错误','提示');
			}
		})
	})
    //获取手机号
	$("#iphone").blur(function(){
		var phone = $("#iphone").val();
		var reg = /^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/;
		if (!reg.test(phone)) {
			mui.alert('手机号码输入有误', '提示')
		}
	})
	// 点击获取手机验证码
	$(".verify-v-img a").click(function(){
		var phone = $("#iphone").val();
		var m_this = $(this);
        if($(this).hasClass("disabled")){
	  		return;
	  	}else{
			if(typeof phone=='undefined' || phone == null || phone == ''){
				mui.alert('验证码输入有误', '提示')
			}else{
			var groupStr2 = DES3.encrypt("123456789012345678901234",'{"opeType":"getMobileCode","map":{"mobile":"'+phone+'"}}');

			var groupUrl2 = window.basePath+'jsonParam='+groupStr2;
			$.ajax({
				url:groupUrl2,
				type:'POST',
				dataType:'JSON',
				success:function(data){
					
					if(data.return_code != "0"){
						mui.alert(data.message,'提示');
					}else{
						settime(m_this);
						localStorage.setItem("sessionId",data.sessionId);
					}
				},
				error:function(data){
					console.log(data);
					console.log('系统错误','提示');
				}
			})
			}
	  }
	})
	// 判断密码
	$("#password1").blur(function(){
		var pwd1 = $("#password1").val();
		if(typeof pwd1=='undefined' || pwd1 == null || pwd1 == ''){
			mui.alert('密码不能为空', '提示');
			return;
		}
		var pwdReg = /^[a-zA-Z0-9\D]{6,20}$/;
		if(!pwdReg.test(pwd1)){
			mui.alert('密码格式不对，密码6-20个字符，由英文、数字组成。', '提示');
			return;
		}
	})
	$("#password2").blur(function(){
		var pwd1 = $("#password1").val();
		var pwd2 = $("#password2").val();
		if(typeof pwd2=='undefined' || pwd2 == null || pwd2 == ''){
			mui.alert('密码不能为空', '提示');
			return;
		}
		var pwdReg = /^[a-zA-Z0-9\D]{6,20}$/;
		if(!pwdReg.test(pwd2)){
			mui.alert('密码格式不对，密码6-20个字符，由英文、数字组成。', '提示');
			return;
		}
		if(pwd1 != pwd2){
			mui.alert('密码不一致', '提示');
			return;
		}
	})

    $("#verifyNew").click(function(){
    	$(this).toggleClass("verify-new-bg01");
    })

	var saveFlag = false;
	$(".verify-btn").click(function(){
		if (saveFlag) {
			return;
		}
		saveFlag = true;
		
		var pwdReg = /^[a-zA-Z0-9\D]{6,20}$/;
		var sessionId = localStorage.getItem("sessionId");
		var storageSess = localStorage.getItem("storageSess");

		var inputImg = $("#inputImg").val();
		var phone = $("#iphone").val();
		var verifyphone = $("#verifyphone").val();
		
		var pwd1 = $("#password1").val();
		var pwd2 = $("#password2").val();
		if(typeof pwd1=='undefined' || pwd1 == null || pwd1 == ''){
			saveFlag = false;
			mui.alert('密码不能为空', '提示');
			return;
		}
		if(!pwdReg.test(pwd1)){
			saveFlag = false;
			mui.alert('密码格式不对，密码6-20个字符，由英文、数字组成。', '提示');
			return;
		}
		if(typeof pwd2=='undefined' || pwd2 == null || pwd2 == ''){
			saveFlag = false;
			mui.alert('密码不能为空', '提示');
			return;
		}
		if(!pwdReg.test(pwd2)){
			saveFlag = false;
			mui.alert('密码格式不对，密码6-20个字符，由英文、数字组成。', '提示');
			return;
		}
		if(pwd1 != pwd2){
			saveFlag = false;
			mui.alert('密码不一致', '提示');
			return;
		}

		if(!$("#verifyNew").is(".verify-new-bg01")){
			saveFlag = false;
			mui.alert('请阅读商城注册协议', '提示');
			return;
		}
		//一账通需要appid确认会员注册来源
		var appId = localStorage.getItem("appId",appId);
        var customerUuid = getQueryString("customerUuid");
		var reqisterStr = DES3.encrypt("123456789012345678901234",'{"opeType":"customerRegisterNew","map":{"appId":"'+appId+'","mobile":"'+phone+'","captcha":"'+verifyphone+'","tokenCode":"'+inputImg+'","password":"'+pwd1+'","pwdStrength":"2","sessionId":"'+sessionId+'","userId":"'+customerUuid+'","reSessionId":"'+storageSess+'","extensionCode":"'+extensionCode+'","shopUuid":"'+shopUuid+'","accountUuid":"'+accountUuid+'"}}');
		var reqisterUrl = window.basePath+'jsonParam='+reqisterStr;
		
		$.ajax({
			url:reqisterUrl,
			type:'POST',
			dataType:'JSON',
			success:function(data){
				if(data.return_code != "0"){
					saveFlag = false;
					mui.alert(data.message,'提示');
				}else{
					$(".verify-btn").text("正在注册中...");

                    //睿投dsp
                    _CWiQ.push(['_trackClick', 1]);
                    _CWiQ.push(['_trackReg', 1]);

					var customer = data.customer;
					var userId = customer.uuid;
					var customerType = customer.customerType;
					localStorage.setItem("userId",userId);
					localStorage.setItem("token",data.token);
					localStorage.setItem("sessionId",data.sessionId);
					localStorage.setItem("mobliePhone",phone);
					localStorage.setItem("customerType",customerType);
					
					//获取上一页路径是什么
					var relativePath = getUrlRelativePath();
                    var falg = toJump(relativePath);
                    if(falg){
                    	// 登陆跳转过来的 跳转到注册成功页
 						window.location.href='../../../h5/templet/login/register-success.html';
                    }else{
                    	// 其他页面跳转的 返回上一页
                    	if(window.history.length > 1){
				            window.history.back();
				        }else{
				            window.location.href='../../../h5/templet/login/register-success.html';
				        }
                    }
					
				}
			},
			error:function(data){
				saveFlag = false;
				console.log(data);
				mui.alert('系统错误','提示');
			}
		})
	})

	$("#verifyNewText").click(function(){
		var verifyNewStr = DES3.encrypt("123456789012345678901234",'{"opeType":"getPaltCongfig"}');
		var verifyNewUrl = window.basePath+'jsonParam='+verifyNewStr;
		$.ajax({
			url:verifyNewUrl,
			type:'POST',
			dataType:'JSON',
			success:function(data){
				// console.log(data)
				if(data.return_code != 0){
					mui.alert(data.message,"提示");
				}else{
					$(".reqister-new-box").fadeIn(300);
					$("#reqisterNewBoxTxt").html(data.congfigModel.customerReg);
				}
			}
		})
	})
	$("#reqisterNewBoxNext").click(function(){
		$(".reqister-new-box").fadeOut(200);
	})
});

function checkExtensionCode(){
    var upExtensionCode = $("#extensionCode").val();
    var flag = false;
    if(upExtensionCode){
        var DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"checkExtensionCode","map":{'
            + '"upExtensionCode":"' + upExtensionCode + '"}}');

        var url = window.basePath + 'jsonParam=' + DES3Str;

        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            async: false,
            success: function (data) {
                console.log(JSON.stringify(data));
                if (data.return_code != "0") {
                    mui.alert(data.message, '提示');
                    flag =  false;
                } else {
                    if (data.flag != '0') {
                        mui.alert(data.message, '提示');
                        flag =  false;
                    } else {
                        flag = true;
                    }
                }

            },
            error: function (data) {
                mui.alert("出错了");
                flag =  false;

            }
        });
        return flag;
    }
}

// 是否从登陆页面跳转 是则返回true
function toJump(relativeUrl) {
	var urlList = [];
	urlList.push("/login1.html");
	if(urlList.indexOf(relativeUrl) >= 0) {
		return true;
	} else {
		return false;
	}
}

//获取上一个页面的相对路径
function getUrlRelativePath() {　　　　
	var url = window.parent.document.referrer.toString();　　　
	if(isEmpty(url)) {
		return "";
	}　
	var arrUrl = url.split("//");
	var start = arrUrl[1].lastIndexOf("/");　　　　
	var relUrl = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符
	if(relUrl.indexOf("?") != -1) {　　　　　　
		relUrl = relUrl.split("?")[0];　　　　
	}　　　　
	return relUrl;　　
}