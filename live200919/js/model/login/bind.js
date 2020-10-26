$(function () {
    var random = getQueryString("random");
    //QQ和支付宝登录绑定方式
    if (typeof random != 'undefind' && random != null && random != '') {
        var DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"getOauthInfoFromMem","map":{"random":"' + random + '"}}');
        var url = window.basePath + 'jsonParam=' + DES3Str;
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            async: false,
            success: function (data) {
                if (data.return_code != "0") {
                    mui.alert(data.message, '提示');
                } else {
                    $("#bindType").val(data.oauthType);
                    $("#bindOpenId").val(data.oauthUuid);
                }
            }
        })
        //微信登录绑定方式
    } else {
        var weixinOpenId = sessionStorage.getItem("weixinOpenId");
        if (typeof weixinOpenId != 'undefind' && weixinOpenId != null && weixinOpenId != '') {
            $("#bindType").val("3");
            $("#bindOpenId").val(weixinOpenId);
        }

        var bindUnionid = sessionStorage.getItem("wechat_unionid");
        if (typeof bindUnionid != 'undefind' && bindUnionid != null && bindUnionid != '') {
            $("#bindType").val("3");
            $("#bindUnionid").val(bindUnionid);
        }
    }

    $("#mobile").blur(function () {
        var mobliePhone = $("#mobile").val();
        if (typeof mobliePhone == 'undefind' || mobliePhone == null || mobliePhone == '') {
            mui.alert('手机号不能为空', '提示');
            return false;
        }

        var reg = /^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/;
        if (!reg.test(mobliePhone)) {
            mui.alert('手机号码输入有误', '提示');
            return false;
        }
    });

    function checkField() {
        var captcha = $("#yzmCode").val();
        var mobliePhone = $("#mobile").val();
        var reg = /^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/;
        if (!reg.test(mobliePhone)) {
            mui.alert('手机号码输入有误', '提示');
            return false;
        }
        ;
        if (typeof captcha == 'undefined' || captcha == null || captcha == '') {
            mui.alert('验证码不能为空!', '提示');
            return false;
        }
        return true;
    }

    // 判断密码
    $("#pwd").blur(function () {
        var pwd1 = $("#pwd").val();
        if (typeof pwd1 == 'undefined' || pwd1 == null || pwd1 == '') {
            mui.alert('密码不能为空', '提示');
            return;
        }
        var pwdReg = /^[a-zA-Z0-9\D]{6,20}$/;
        if (!pwdReg.test(pwd1)) {
            mui.alert('密码格式不对，密码6-20个字符，由英文、数字组成。', '提示');
            return;
        }
    })

    $("#repassword").blur(function () {
        var pwd1 = $("#pwd").val();
        var pwd2 = $("#repassword").val();
        if (typeof pwd2 == 'undefined' || pwd2 == null || pwd2 == '') {
            mui.alert('密码不能为空', '提示');
            return;
        }
        var pwdReg = /^[a-zA-Z0-9\D]{6,20}$/;
        if (!pwdReg.test(pwd2)) {
            mui.alert('密码格式不对，密码6-20个字符，由英文、数字组成。', '提示');
            return;
        }
        if (pwd1 != pwd2) {
            mui.alert('密码不一致', '提示');
            return;
        }
    })

    $("#bind").click(function () {
        $("#bind").val("正在绑定中...");
        $("#bind").attr("disabled", true);
        var username = $("#username").val();
        var password = $("#password").val();
        var bindType = $("#bindType").val();
        var bindOpenId = $("#bindOpenId").val();
        var bindUnionid = $("#bindUnionid").val();

        if (username == "") {
            mui.alert('用户名/手机号不能为空', '提示');
            $("#bind").val("绑定");
            $("#bind").attr("disabled", false);
            return false;
        }

        if (password == "") {
            mui.alert('密码不能为空', '提示');
            $("#bind").val("绑定");
            $("#bind").attr("disabled", false);
            return false;
        }

        if (typeof bindUnionid == 'undefined' || bindUnionid == null || bindUnionid == '') {
            bindUnionid = "";
        }

		var passwordMd = DES3.encrypt("123456789012345678901234", password);
		var DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"bindCustomer","map":{"username":"' + username + '","password":"' + passwordMd + '","oauthType":"' + bindType + '","oauthUid":"' + bindOpenId + '","unionid":"' + bindUnionid + '"}}');
		var url = window.basePath + 'jsonParam=' + DES3Str;
		$.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data.return_code != "0") {
                    mui.alert(data.message);
					$("#bind").val("绑定");
					$("#bind").attr("disabled", false);
                } else {
                    mui.alert('绑定成功', '提示');
                    var customer = data.customer;
                    var userId = customer.uuid;
                    var username = customer.customerName;
                    localStorage.setItem("userId", userId);
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("sessionId", data.sessionId);
                    localStorage.setItem("mobliePhone", username);
                    sessionStorage.removeItem("noBandWX");
                    window.location.href = "../../../h5/templet/personal/mine.html";
                }
            },
            error: function (data) {
                console.log("error");
            }
        });
    });


    $("#createbind").click(function () {
        $("#createbind").val("正在绑定中...");
        $("#createbind").attr("disabled", true);

        var mobile = $("#mobile").val();
        var password = $("#pwd").val();
        var repassword = $("#repassword").val();
        var yzmCode = $("#yzmCode").val();
        var bindType = $("#bindType").val();
        var bindOpenId = $("#bindOpenId").val();
        var bindUnionid = $("#bindUnionid").val();
        if (mobile == "") {
            mui.alert('手机号不能为空', '提示');
            return false;
        }
        if (password == "") {
            mui.alert('密码不能为空', '提示');
            return false;
        }
        if (yzmCode == "") {
            mui.alert('验证码不能为空', '提示');
            return false;
        }
        if (password != repassword) {
            mui.alert('两次输入密码不一致', '提示');
            return false;
        }
        if (typeof bindUnionid == 'undefined' || bindUnionid == null || bindUnionid == '') {
            bindUnionid = "";
        }

        //一账通需要appid确认会员注册来源
        var appId = localStorage.getItem("appId", appId);
        var captchaSessionId = localStorage.getItem("captchaSessionId");
        var DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"createAndBindCustomer","map":{"appId":"' + appId + '","registerName":"' + mobile + '","registerPwd":"' + password + '","verifyCode":"' + yzmCode + '","oauthType":"' + bindType + '","oauthUid":"' + bindOpenId + '","captchaSessionId":"' + captchaSessionId + '","unionid":"' + bindUnionid + '"}}');
        var url = window.basePath + 'jsonParam=' + DES3Str;
        $.ajax({
            url: url,
            type: "POST",
            dataType: "json",
            success: function (data) {

                console.log(data);
                if (data.return_code != "0") {
                    mui.alert(data.message, '提示');
					$("#createbind").val("新建账号并绑定");
					$("#createbind").attr("disabled", false);
                } else {
                    mui.alert('绑定成功', '提示');
                    var customer = data.customer;
                    var userId = customer.uuid;
                    var username = customer.customerName;
                    localStorage.setItem("userId", userId);
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("sessionId", data.sessionId);
                    localStorage.setItem("mobliePhone", username);
                    sessionStorage.removeItem("noBandWX");
                    window.location.href = "../../../h5/templet/personal/mine.html";
                }
            },
            error: function (data) {
                console.log("error");
            }
        });
    });


//获取短信验证码
    $("#getyzm").bind("click", captchaclick);
//60秒倒计时
    var countdown = 60;

    function settime() {
        if (countdown == 0) {
            $("#getyzm").bind("click", captchaclick);
            $("#getyzm").html("获取验证码");
            countdown = 60;
            return;
        } else {
            $("#getyzm").unbind("click");
            countdown--;
            $("#getyzm").html(countdown);
        }
        setTimeout(function () {
            settime()
        }, 1000)
    }

//发送验证码
    function captchaclick() {
        var mobliePhone = $("#mobile").val();
        var reg = /^(0|86|17951)?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/;
        if (typeof mobliePhone == 'undefined' || mobliePhone == null || mobliePhone == '') {
            mui.alert('手机号码不能为空!', '提示');
            return false;
        }
        if (!reg.test(mobliePhone)) {
            mui.alert('手机号码输入有误', '提示');
        } else {
            var DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"getMobileCode","map":{"mobile":"' + mobliePhone + '"}}');
            var url = window.basePath + 'jsonParam=' + DES3Str;
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'JSON',
                success: function (data) {
                    if (data.return_code != "0") {
                        mui.alert(data.message, '提示');
                    } else {
                        localStorage.setItem("captchaSessionId", data.sessionId);
                        //读秒
                        settime();
                    }
                },
                error: function (data) {
                    mui.alert('获取验证码超时，重新获取', '提示');
                }
            })
        }
    }

});