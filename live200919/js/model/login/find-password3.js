$(function(){

	var account = localStorage.getItem("account");
	var emailCaptcha = localStorage.getItem("textCode");
	var emailSessionId = localStorage.getItem("pindSessionId");
	var pwdReg = /^[a-zA-Z0-9\D]{6,20}$/;
	
	//密码1
	$("#newpass").blur(function(){
		var newPass = $("#newpass").val();
		if(typeof newPass=='undefined' || newPass == null || newPass == ''){
			mui.alert('密码不能为空', '提示');
			return;
		}
		if(!pwdReg.test(newPass)){
			mui.alert('密码格式不对，密码6-20个字符，由英文、数字组成。', '提示');
			return;
		}
	})
	
	$("#affirmpass").blur(function(){
		var newPass = $("#newpass").val();
		var affirmPass = $("#affirmpass").val();
		if(typeof affirmPass=='undefined' || affirmPass == null || affirmPass == ''){
			mui.alert('密码不能为空', '提示');
			return;
		}
		if(!pwdReg.test(affirmPass)){
			mui.alert('密码格式不对，密码6-20个字符，由英文、数字组成。', '提示');
			return;
		}
		if(newPass != affirmPass){
			mui.alert('密码不一致', '提示');
			return;
		}
	})
	
	$("#paddwordbtn").click(function(){
		var newPass = $("#newpass").val();
		var affirmPass = $("#affirmpass").val();
		
		if(typeof newPass=='undefined' || newPass == null || newPass == ''){
			mui.alert('密码不能为空', '提示');
			return;
		}
		if(!pwdReg.test(newPass)){
			mui.alert('密码格式不对，密码6-20个字符，由英文、数字组成。', '提示');
			return;
		}
		if(typeof affirmPass=='undefined' || affirmPass == null || affirmPass == ''){
			mui.alert('密码不能为空', '提示');
			return;
		}
		if(!pwdReg.test(affirmPass)){
			mui.alert('密码格式不对，密码6-20个字符，由英文、数字组成。', '提示');
			return;
		}
		if(newPass != affirmPass){
			mui.alert('密码不一致', '提示');
			return;
		}

		var reqister = DES3.encrypt("123456789012345678901234",'{"opeType":"resetCustomerPwd","map":{"mobileOrEmail":"'+account+'","password":"'+affirmPass+'","captcha":"'+emailCaptcha+'","sessionId":"'+emailSessionId+'","pwdStrength":"2"}}');
		var reqisterUrl = window.basePath+'jsonParam='+reqister;
		$.ajax({
			url:reqisterUrl,
			type:'POST',
			dataType:'JSON',
			success:function(data){
				
				console.log(data);
				if(data.return_code != "0"){
					mui.alert(data.message,'提示');
				}else{
					window.location.href='find-password-ok.html';
				}
			},
			error:function(data){
				console.log(data);
					mui.alert('系统错误','提示');
			}
		})
	})
})