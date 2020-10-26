$(function(){
	//登录成功页
	var password=localStorage.getItem("password");
	var mobliePhone = localStorage.getItem("mobliePhone");
	var sessionId = localStorage.getItem("sessionId");
	
	$("#lijidenglu").click(function(){
		//立即登录
		localStorage.setItem("password",password);
		localStorage.setItem("mobilePhone",mobliePhone);
		window.location.href="login1.html";
	})
	
	
})