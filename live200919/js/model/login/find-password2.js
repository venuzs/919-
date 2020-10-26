$(function(){
	var pindEmail = localStorage.getItem("pindEmail");
	var pindPhone = localStorage.getItem("pindPhone");

	// 判断账号绑定手机或邮箱
	if(pindEmail == "" || pindPhone == ""){
		$("#verifyMRight").hide();
	}
	if(pindPhone == ""){
		$("#import").html(pindEmail);
	}else{
		$("#import").html(pindPhone);
	}
	
	if(pindEmail != "" && pindPhone != ""){
		// 弹出框选择验证方式
		$(".verify-checkbox a").click(function(){
            $(this).parent().addClass('verify-checkbox-bgimg').parent().siblings().children('div').removeClass('verify-checkbox-bgimg');
            if($(this).is(".verify-checkbox-a") == true){
                $(".verify-m-bg05").removeClass('verify-bg-imla');
                $(".verify-m-bg06").removeClass('verify-bg-imlb');
                $(".verify-txt-tel").html("手机验证");
                $(".verify-v-vt input").attr('placeholder','请输入手机验证码');
                $("#import").html(pindPhone);
            }else {
                $(".verify-m-bg05").addClass('verify-bg-imla');
                $(".verify-m-bg06").addClass('verify-bg-imlb');
                $(".verify-txt-tel").html("邮箱验证");
                $(".verify-v-vt input").attr('placeholder','请输入邮箱验证码');
                $("#import").html(pindEmail);
            }
            $(".verify-v-box").hide();
        })
		// 点击更改验证方式弹出框
        $(".verify-m-right").click(function(){
            $(".verify-v-box").show();
        })
	}




	// 获取验证码
    var textTel = null;
	$("#goclick").click(function(){
		var m_this = $(this);
        if($(this).hasClass("disabled")){
	  		return;
	  	}else{
			if($(".verify-txt-tel").text() === "手机验证"){
				textTel = $(".verify-txt-tel").text();
				localStorage.setItem("pindName",textTel);
				var reqister = DES3.encrypt("123456789012345678901234",'{"opeType":"getMobileCodeForFindPwd","map":{"mobile":"'+pindPhone+'"}}');
		    	var reqisterUrl = window.basePath+'jsonParam='+reqister;
				$.ajax({
					url:reqisterUrl,
					type:'POST',
					dataType:'JSON',
					success:function(data){
						console.log(data)
						if( data.return_code != 0){
							mui.alert(data.message,'提示');
						}else{
							settime(m_this);
							localStorage.setItem("pindSessionId",data.sessionId);
						}
					},
					error:function(data){
						console.log(data);
						mui.alert('系统错误','提示');
					}
				})
			}else if($(".verify-txt-tel").text() === "邮箱验证"){
				console.log("邮箱验证");
				textTel = $(".verify-txt-tel").text();
				localStorage.setItem("pindName",textTel);
				var reqister2 = DES3.encrypt("123456789012345678901234",'{"opeType":"findPwdCode","map":{"email":"'+pindEmail+'"}}');
		    	var reqisterUrl2 = window.basePath+'jsonParam='+reqister2;
				$.ajax({
					url:reqisterUrl2,
					type:'POST',
					dataType:'JSON',
					success:function(data){
						console.log(data)
						if( data.return_code != 0){
							mui.alert(data.message,'提示');
						}else{
							settime(m_this);
							localStorage.setItem("pindSessionId",data.sessionId);
						}
					},
					error:function(data){
						console.log(data);
						mui.alert('系统错误','提示');
					}
			})
		}
	}
	})

	// 点击下一步操作
	$("#verifyclick").click(function(){
		var pindSessionId = localStorage.getItem("pindSessionId");
		var pindName = localStorage.getItem("pindName");
		console.log(pindName);
		var textCode = $("#textcode").val();//输入获取到的验证码
		localStorage.setItem("textCode",textCode);
		//判断验证码输入框不为空
		if(typeof textCode =='undefined' || textCode == null || textCode == ''){
			mui.alert('验证码不能为空', '提示');
			return;
		}
		if( pindName === "手机验证"){
			var reqister = DES3.encrypt("123456789012345678901234",'{"opeType":"validateCode","map":{"type":"2","mobile":"'+pindPhone+'","captcha":"'+textCode+'","sessionId":"'+pindSessionId+'"}}');
	    	var reqisterUrl = window.basePath+'jsonParam='+reqister;
	    	$.ajax({
			url:reqisterUrl,
			type:'POST',
			dataType:'JSON',
			success:function(data){
				if(data.return_code != "0"){
					mui.alert(data.message,'提示');
				}else{
					localStorage.setItem("account",pindPhone);
					window.location.href='find-password3.html';
				}
			},
			error:function(data){
				console.log(data);
				mui.alert('验证码错误','提示');
			}
		})
		}else if( pindName === "邮箱验证"){
			var reqister = DES3.encrypt("123456789012345678901234",'{"opeType":"validateCode","map":{"type":"2","mobile":"'+pindEmail+'","captcha":"'+textCode+'","sessionId":"'+pindSessionId+'"}}');
	    	var reqisterUrl = window.basePath+'jsonParam='+reqister;
	    	$.ajax({
			url:reqisterUrl,
			type:'POST',
			dataType:'JSON',
			success:function(data){
				if(data.return_code != "0"){
					mui.alert(data.message,'提示');
				}else{
					localStorage.setItem("account",pindEmail);
					window.location.href='find-password3.html';
				}
			},
			error:function(data){
				console.log(data);
				mui.alert('验证码错误','提示');
			}
		})
		}

	})
})

