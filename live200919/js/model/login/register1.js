$(function(){
	//获取参数信息
	var mobliePhone=localStorage.getItem("mobliePhone");
	
	var captcha = localStorage.getItem("captcha");
	var sessionId = localStorage.getItem("sessionId");
	
	$("#password").blur(function(){
		var password = $("#password").val();
		if(typeof password=='undefined' || password == null || password == ''){
			mui.alert('密码不能为空', '提示');
		}
	})
	
	$('#lijizhuces').click(function(){
		var password = $("#password").val();
		if(typeof password=='undefined' || password == null || password == ''){
			mui.alert('密码不能为空', '提示');
			return;
		}
		if(!/^[a-zA-Z0-9_-]{6,20}$/.test(password)){
			mui.alert('密码格式不对', '提示');
			return;
		}
		//password = $.md5(pswd);
		/*var url = 'http://117.78.36.35:9080/api/app/get/appCall';
		var jsonParam = '{"opeType":"customerRegister","map":{"mobile":'+mobliePhone+',"password":'+password+',"captcha":'+password+',"pwdStrength":"2"}}'
		window.location.href='register-success.html?mobliePhone='+mobliePhone+'&password='+pswd;*/
		var url = window.basePath+'jsonParam={"opeType":"customerRegister","map":{"mobile":"'+mobliePhone+'","password":"'+password+'","captcha":"'+captcha+'","pwdStrength":"2","sessionId":"'+sessionId+'"}}';
		$.ajax({
			url:url,
			type:'POST',
			dataType:'JSON',
			success:function(data){
				
				console.log(data);
				var data = strToJson(data)
				if(data.return_code != "0"){
					mui.alert(data.message, '提示');
				}else{
					localStorage.setItem("mobliePhone",mobliePhone);
					localStorage.setItem("captcha",captcha);
					localStorage.setItem("password",password);
					window.location.href='register-success.html';
				}
			},
			error:function(data){
				console.log(data);	
				mui.alert('系统错误','提示');	
			}
		})
	})
	
	
	
	
	
})