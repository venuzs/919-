/*****************************************************************
 login类
 *****************************************************************/

$(function () {
    //时间戳
  var random = new Date().getTime()
  var activityNo = getQueryString('activityNo');
    //判断登陆url值有没有notlanded 表示，如果有跳转到首页，防止死循环
    // $(".mui_return").click(function () {
    //     var notlanded = getQueryString("notlanded");
    //     if (!isEmpty(notlanded)) {
    //         if (notlanded == "1") {
    //             window.location.href = "../../../h5/templet/shop/index.html";
    //         }
    //     } else {
    //         history.back(-1);
    //     }
    // })
    	
	$('.login-logo').click(function() {
		window.location.href = homePageUrl+'?activityNo='+ activityNo +'&v=' + random
	})

    //点击登录
    $("#loginbtn").click(function () {
        //判断登录方式 密码/验证码
        if ($('#m_password').is('.current')) {
            var username = $("#username").val();
            if (typeof username == 'undefined' || username == null || username == "") {
                mui.alert('用户名不能为空', '提示');
                return;
            }
            var password = $("#password").val();
            var passwordMd = DES3.encrypt("123456789012345678901234", password);
            if (typeof password == 'undefined' || password == null || password == "") {
                mui.alert('密码不能为空', '提示');
                return;
            }
            // 获取openId
            var openId = getQueryString("openId");
            var DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"customerToLogin","map":{"mobile":"' + username + '","password":"' + passwordMd + '"}}');
            if (typeof openId != 'undefined' && openId != null && openId != "") {
                DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"customerToLogin","map":{"mobile":"' + username + '","password":"' + passwordMd + '","openId":"' + openId + '"}}');
            }
            var loginUrl = window.basePath + 'jsonParam=' + DES3Str;
            $.ajax({
                url: loginUrl,
                type: 'POST',
                dataType: 'JSON',
                success: function (data) {
                    console.log(data);
                    if (data.return_code != "0") {
                        mui.alert(data.message, '提示');
                    } else {
                        var customer = data.customer;
                        var userId = customer.uuid;
                        var isGeneralize = customer.isGeneralize;
                        var customerType = customer.customerType;
                        localStorage.setItem("userId", userId);
                        localStorage.setItem("customerUuid", userId);
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("sessionId", data.sessionId);
                        localStorage.setItem("customerName", customer.customerName);
                        localStorage.setItem("mobliePhone", username);
                        localStorage.setItem("customerType", customerType);
                        
                        // 清除手动退出
                        localStorage.removeItem('ishandOut');

                        var comeAddress = localStorage.getItem("loginJump");

                        // 统计代码
                        window._agl && window._agl.push(['track', ['success', {t: 3}]]);

                        if (comeAddress == "undefined" || comeAddress == null || comeAddress == "") {
                            window.location.href = '../livepresale.html?activityNo='+activityNo + '&v=' +random;
                        } else {
                            localStorage.setItem("loginJump",'')
                            window.location.href = comeAddress
                        }
                    }
                }
            })
        } else {
            //验证码登录
            var phonename = $("#phonename").val();
            if (typeof phonename == 'undefined' || phonename == null || phonename == "") {
                mui.alert('手机号码不能为空', '提示');
                return;
            }
            var mobile = $.trim($("#phonename").val());
            var reg = /^1\d{10}$/;
            //var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[15678]|18[0-9]|14[579])[0-9]{8}$/;
            if (!reg.test(mobile)) {
                mui.alert('手机号码输入有误', '提示');
            }
            var captcha = $("#mobileCode").val();
            if (typeof captcha == 'undefined' || captcha == null || captcha == '') {
                mui.alert('验证码不能为空', '提示');
                return;
            }
            var sessionId = sessionStorage.getItem("codesessionId")
            var appId = localStorage.getItem("appId");
            var DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"loginByCode","map":{"appId":"' + appId + '","mobile":"' + phonename + '","captcha":"' + captcha + '","sessionId":"' + sessionId + '"}}');
            if (typeof openId != 'undefined' && openId != null && openId != "") {
                DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"loginByCode","map":{"appId":"' + appId + '","openId":"' + openId + '","mobile":"' + phonename + '","captcha":"' + captcha + '","sessionId":"' + sessionId + '"}}');
            }
            var loginUrl = window.basePath + 'jsonParam=' + DES3Str;
            $.ajax({
                url: loginUrl,
                type: 'POST',
                dataType: 'JSON',
                success: function (data) {
                    console.log(data);
                    if (data.return_code != "0") {
                        mui.alert(data.message, '提示');
                    } else {
                        var customer = data.customer;
                        var userId = customer.uuid;
                        var isGeneralize = customer.isGeneralize;
                        var customerType = customer.customerType;
                        localStorage.setItem("userId", userId);
                        localStorage.setItem("customerUuid", userId);
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("sessionId", data.sessionId);
                        localStorage.setItem("customerName", customer.customerName);
                        localStorage.setItem("mobliePhone", username);
                        localStorage.setItem("customerType", customerType);
                        
                        // 清除手动退出
                        localStorage.removeItem('ishandOut');

                        var comeAddress = localStorage.getItem("loginJump");
                        console.log(comeAddress);

                        // 统计代码
                        window._agl && window._agl.push(['track', ['success', {t: 3}]]);
                        
                        if (comeAddress == "undefined" || comeAddress == null || comeAddress == "") {
                            window.location.href = '../livepresale.html?activityNo='+activityNo + '&v=' +random;
                        } else {
                            localStorage.setItem("loginJump",'')
                            window.location.href = comeAddress
                        }
                    }
                }
            })
        }
    })

});





