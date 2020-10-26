
//微信登录
//1.请求CODE
//应用唯一标识
//var appid="wx23e96199318b727e";

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


var base_url="http://m.ejomoo.com/wap";
// var base_url="http://m.ejomoo.com/wap";
//test
//var base_url="http://127.0.0.1:8080";

// 获取静默登录储存地址
var quiteComAdr = localStorage.getItem("quiteComAdr");

//获取code
var wxloginstate=localStorage.getItem("wxloginstate");

var Request = new Object();
Request = GetRequest();
var code=Request['code'];
var loginstate=Request['state'];
if(wxloginstate==loginstate && code !=null){
	getwechatInfo(code)
	// getopenid(code);
}else{
	if(!quiteComAdr) {
		alert("请求不合法");
	}
	
}

//第二步 通过code获取access_token
function getopenid(code) {
	var url = DES3.encrypt("123456789012345678901234", "{'opeType':'wxUnionSilenceLogin','map':{'code':'" + code + "'}}");
	url = window.basePath + 'jsonParam=' + url;
	//alert(url);
	$.ajax({
		url: url,
		type: "POST",
		dataType: 'json',
		success: function (data) {
			if(!quiteComAdr) {
				// if (data.return_code === "0") {
				// 	//返回会员对象。已绑定，跳转成功
				// 	if (data.customer) {
				// 		//直接登录
				// 		localStorage.setItem("userId", data.customer.uuid);
				// 		localStorage.setItem("token", data.token);
				// 		localStorage.setItem("sessionId", data.sessionId);
				// 		localStorage.removeItem("comeAddress");
						
				// 		// 清除手动退出
                //         localStorage.removeItem('ishandOut');
				// 		sessionStorage.removeItem("noBandWX");
                        
				// 		window.location.href = "../personalcenter.html";
				// 	} else {
				// 		if(data.access_token){
				// 			//jomoo商城调用 没有会员对象，获取token 然后去换unionId 去绑定
				// 			sessionStorage.setItem("access_token", data.access_token);
				// 			sessionStorage.setItem("refresh_token", data.refresh_token);
				// 			wechatLogin(data.openid);
				// 		}else{
				// 			//一账通调用 直接返回unionId 去绑定
				// 			sessionStorage.setItem("wechat_nickname",data.nickname);
				// 			sessionStorage.setItem("wechat_unionid",data.unionid);
				// 			sessionStorage.setItem("weixinOpenId",data.openid);
				// 			window.location.href ="bind.html";
				// 		}
				// 	}
				// }else {
				// 	alert(data.errmsg);
				// }
			}else {
				if (data.return_code === "0") {
					//没有会员对象。去获取token（老逻辑 获取到openid和access_token）
					console.log(data.openid)
					sessionStorage.setItem("bind_openid", data.openid);
					sessionStorage.setItem("access_token", data.access_token);
					sessionStorage.setItem("refresh_token", data.refresh_token);
					sessionStorage.setItem('noBandWX','1');
					window.location.href = quiteComAdr;
				}else {
					//未绑定会员
					localStorage.removeItem("quiteComAdr");
					sessionStorage.setItem('noBandWX','1');
					window.location.href = quiteComAdr;
				}
				// if (data.return_code === "0") {
				// 	//返回会员对象。已绑定，跳转成功
				// 	if (data.customer) {
				// 		//直接登录
				// 		localStorage.setItem("userId", data.customer.uuid);
				// 		localStorage.setItem("token", data.token);
				// 		localStorage.setItem("sessionId", data.sessionId);
				// 		localStorage.removeItem("comeAddress");
				// 		localStorage.removeItem("quiteComAdr");
				// 		sessionStorage.removeItem("noBandWX");
				// 		window.location.href = quiteComAdr;
				// 	} else {
				// 		//没有会员对象。去获取token（老逻辑 获取到openid和access_token）
				// 		sessionStorage.setItem("bind_openid", data.openid);
				// 		sessionStorage.setItem("access_token", data.access_token);
				// 		sessionStorage.setItem("refresh_token", data.refresh_token);
				// 		wechatLogin(data.openid);
				// 	}
				// }else {
				// 	//未绑定会员
				// 	localStorage.removeItem("quiteComAdr");
				// 	sessionStorage.setItem('noBandWX','1');
				// 	window.location.href = quiteComAdr;
				// }
			}
		}
	})
}

//判断如果openid已经绑定过会员，那么直接登录
//如果openid还没有绑定会员，则跳转到绑定手机号的页面
function wechatLogin(openid) {
	var DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"wechatLogin","map":{"openid":"' + openid + '"}}');
	var url = window.basePath + 'jsonParam=' + DES3Str;
	$.ajax({
		url: url,
		type: 'post',
		dataType: 'JSON',
		success: function (data) {
			if(!quiteComAdr) {
				if (data.return_code == "0") {
					//直接登录
					var customer = data.customer;
					var userId = customer.uuid;
					localStorage.setItem("userId", userId);
					localStorage.setItem("token", data.token);
					localStorage.setItem("sessionId", data.sessionId);
					localStorage.removeItem("comeAddress");
					// 清除手动退出
                    localStorage.removeItem('ishandOut');
					sessionStorage.removeItem("noBandWX");
					window.location.href = "../personalcenter.html";
				} else if (data.return_code == "5") {
					//跳转到绑定手机号的页面				
					sessionStorage.setItem("bind_openid", openid);
					var access_token = sessionStorage.getItem("access_token");
					//检查access_token
					checkWxAccessToken(access_token, openid);
					//sessionStorage.setItem("wechat_nickname","测试");
					//window.location.href ="bind_weixin.html";
				} else {
					mui.alert(data.message, '提示');
				}
			}else {
				if (data.return_code == "0") {
					//直接登录
					var customer = data.customer;
					var userId = customer.uuid;
					localStorage.setItem("userId", userId);
					localStorage.setItem("token", data.token);
					localStorage.setItem("sessionId", data.sessionId);
					localStorage.removeItem("quiteComAdr");
					sessionStorage.removeItem("noBandWX");
					window.location.href = quiteComAdr;
				}else {
					//未绑定会员
					localStorage.removeItem("quiteComAdr");
					sessionStorage.setItem('noBandWX','1');
					window.location.href = quiteComAdr;
				}
			}
		},
		error: function (xhr, msg) {
			alert(msg);
		},
	});
}

//检验授权凭证（access_token）是否有效
function checkWxAccessToken(access_token, openid) {
	var url = base_url + "/api/app/getUrl?opeType=checkAccessToken&access_token=" + access_token + "&openid=" + openid;
	$.ajax({
		url: url,
		type: "GET",
		dataType: 'json',
		success: function (data) {
			if (data.errcode == "0") {
				//获取用户个人信息
				getwechatInfo(access_token, openid);
			} else {
				//刷新access_token
				refreshWxAccessToken();
			}
		}
	});
}

//刷新或续期access_token使用
function refreshWxAccessToken(){
	var refresh_token=sessionStorage.getItem("refresh_token");
	var url =base_url+"/api/app/getUrl?opeType=refreshAccessToken&refresh_token="+refresh_token;
	$.ajax({
		url:url,
		type: "GET",
		dataType:'json',
		success:function(data){
			if(data.openid !=null){
				sessionStorage.setItem("access_token",data.access_token);
				getwechatInfo(data.access_token,data.openid);
			}else{
				alert(data.errmsg);
			}
		}
	});
}

//获取用户个人信息（UnionID机制）
function getwechatInfo(code){
	var url =base_url+"/api/app/getUrl?opeType=getAccessToken&code="+ code +"&appId=wx4e01e1488286aa5d&appSecret=02ab0236f9c0dffd44244932f3e48163";
	$.ajax({
		url:url,
		type: "GET",
		dataType:'json',
		success:function(data){
			sessionStorage.setItem("bind_openid", data.openid);
			//获取用户个人信息
			sessionStorage.setItem("wechat_nickname",data.nickname);
			sessionStorage.setItem("wechat_unionid",data.unionid);
			sessionStorage.setItem('noBandWX','1');
			//将用户openId放入缓存中和
			sessionStorage.setItem("weixinOpenId",data.openid);
			window.location.href = quiteComAdr;
		}
	});

}

