$(function(){
	var storage = window.localStorage;
	//获取验证吗参数
	var reqisterImg = DES3.encrypt("123456789012345678901234",'{"opeType":"getFindPwdCode"}');
    var reqisterImgUrl =window.basePath+'jsonParam='+reqisterImg;
    $.ajax({
    	url: reqisterImgUrl,
        type: "POST",
        dataType: "json",
        success: function(data){
        	storage.setItem("storageSess",data.sessionId);
        	var reqisterData = ""
        	+'<img src="data:image/gif;base64,'+ data.code +'">';
        	$(".verify-v-img").append(reqisterData);
        }
	})
	//点击图片更换验证码
	$("#verifyimg").click(function(){
		$.ajax({
    	url: reqisterImgUrl,
        type: "POST",
        dataType: "json",
        success: function(data){
        	storage.setItem("storageSess",data.sessionId);
        	var reqisterData = ""
        	+'<img src="data:image/gif;base64,'+ data.code +'">';
        	$(".verify-v-img").html(reqisterData);
        	}
		})
	})
	//用户名输入框的判断
	$("#verifyinput").blur(function() {
		var verifyInput = $("#verifyinput").val();
		if(typeof verifyInput=='undefined' || verifyInput == null || verifyInput == ''){
			mui.alert('用户名不能为空', '提示');
			return;
		}
	});
	//点击下一步向服务器传送数据
	$("#verifybtn").click(function(){
		var verifyInput = $("#verifyinput").val();//用户名
		var storageSess = localStorage.getItem("storageSess");//后台图形验证码的ID
		var imgValue = $("#imgvalue").val();//输入进文本框的图形验证码
		console.log(imgValue);
		console.log(storageSess);
		console.log(verifyInput);
		if(typeof verifyInput=='undefined' || verifyInput == null || verifyInput == ''){
			mui.alert('用户名不能为空', '提示');
			return;
		}
		if(typeof imgValue=='undefined' || imgValue == null || imgValue == ''){
			mui.alert('验证码不能为空', '提示');
			return;
		}
		var reqister = DES3.encrypt("123456789012345678901234",'{"opeType":"getInfoForFindPwd","map":{"loginName":"'+verifyInput+'","captcha":"'+imgValue+'","sessionId":"'+storageSess+'"}}');
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
					localStorage.setItem("pindEmail",data.email);
					localStorage.setItem("pindPhone",data.phone);
					window.location.href='find-password2.html';
				}
			}
    	})
	})
})