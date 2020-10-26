		//webUrl(IP段)
		WebUrlIp = "http://m.ejomoo.com/";
		//全局变量
		window.base = WebUrlIp + 'wap/api/app/';
		// window.base = 'http://m.ejomoo.com/wap/api/app/';
//		window.base = 'http://172.20.114.224:8080/api/app/';
//		window.base = 'http://192.168.4.113:8080/api/app/';
//		window.baseURL = 'http://mtest.jomoo.com.cn';
//		
//		window.base = window.baseURL + '/wap/api/app/';

		 //上传图片
		window.baseUpload = window.base+"upload";
		 //访问接口
		 window.basePath = window.base+"appCall?";
	    //首页地址
	    homePageUrl = WebUrlIp + "live200919/livepresale.html";
		
		// 正式环境: true, 测试本地环境： false (底部导航栏切换)
		var processEnv = false;
		var copyBaseURL = processEnv ? window.baseURL : '../../..';

//      $(document).ready(function () {
        (function () {
			var random = new Date().getTime();
			//处理请求JS文件缓存
			var element = document.getElementsByTagName("script");
			for (var i = 0; i < element.length; i++) {
			 if (element[i].src) {
				if (element[i].src.indexOf('?') > -1) {
				element[i].src = element[i].src + '&timestreap=' + random;
				} else {
				element[i].src = element[i].src + '?timestreap=' + random;
				}
			 }
			};
			//处理CSS文件缓存
			var link = document.getElementsByTagName("link");
			for (var i = 0; i < link.length; i++) {
				if (link[i].href) {
					link[i].href = link[i].href + '?timestreap=' + random;
				}
			}
		//window.onload = function (){
	        //刷新会员登录信息

			//会员为空则不请求该方法
			var customerUuid = localStorage.getItem("userId");
			if (isEmpty(customerUuid)) {
				// if(sessionStorage.getItem('noBandWX') != '1') {
            	// 	quiteLogin();
            	// }
				return;
			}
    	     
		     var token = localStorage.getItem('token');
		     var sessionId = localStorage.getItem('sessionId');
            if(customerUuid != '' && customerUuid != null && customerUuid != 'undefined'){
            	var DES3Str = DES3.encrypt("123456789012345678901234",'{"opeType":"getCustomer","map":{"customerUuid":"'+customerUuid+'","token":"'+token+'","sessionId":"'+sessionId+'"}}');
				var url =window.basePath+'jsonParam='+DES3Str;
				$.ajax({
					type: 'POST',
			        url: url ,
			        async: false,
			        dataType: 'json',
			        success: function(data){
			        	// console.log(data);
			        	//会员未登录，删除浏览器缓存id
			        	if(data.return_code == "51"){
			            	localStorage.removeItem("customerName");
			            	localStorage.removeItem("mobliePhone");
			            	localStorage.removeItem("customerType");
			            	localStorage.removeItem("userId");
			            	// if(sessionStorage.getItem('noBandWX') != '1') {
							// 	quiteLogin();
							// }
			        	}
			        	
			        	if(data.return_code == "0"){
			        		localStorage.setItem("customerName",data.customer.customerName);
			            	localStorage.setItem("mobliePhone",data.customer.username);
			            	localStorage.setItem("customerType",data.customer.customerType);
			            	// 判断批发商城图标是否显示
						    if(data.customer.customerType == "2"){
						        $("#wholesaleBtn").show();
						    }else{
						        $("#wholesaleBtn").hide();
						    }
			        	}
			        	
			        },
				})
            }
            
            
            //wap端联合登录用户名
    var alliance_name = getCookie("alliance_name");
    //联合登录密码为某固定值
	var alliances = alliance_name.split("|");
    var alliance_username = alliances[0];
	var alliance_password = alliances[1];
    var alliance_customerUuid = localStorage.getItem("userId");//用户的uuid
    if(alliance_username == '' || alliance_username == null || alliance_username == 'undefined'){

    } else {
        //返利网联合的登录
		if (alliance_customerUuid == '' || alliance_customerUuid == null || alliance_customerUuid == 'undefined') {
            var info = "{'opeType':'customerToLogin','map':{'mobile':'"+ alliance_username.replace(/\"/g, "") +"','password':'"+ alliance_password.replace(/\"/g, "") +"'}}";
            var DES3Str = DES3.encrypt("123456789012345678901234",info);
            var loginUrl =window.basePath+'jsonParam='+DES3Str;
            $.ajax({
                url:loginUrl,
                type:'POST',
                dataType:'JSON',
                async:false,
                success:function(data) {
                    console.log(data);
                    if (data.return_code != "0") {
                        mui.alert(data.message, '提示');
                        window.location.href="http://m.ejomoo.com/h5/templet/shop/index.html";
                    } else {
                        var customer = data.customer;
                        var userId = customer.uuid;
                        var isGeneralize = customer.isGeneralize;
                        var customerType = customer.customerType;

                        localStorage.setItem("userId",userId);
                        localStorage.setItem("token",data.token);
                        localStorage.setItem("sessionId",data.sessionId);
                        localStorage.setItem("customerName",customer.customerName);
                        localStorage.setItem("mobliePhone",customer.customerName);
                        localStorage.setItem("customerType",customerType);

                    }
                }
            });
		}
	}
//  }
	})();
        
	    //判断是微信进入 还是浏览器进入
	    function isWeiXin(){
    	    var ua = window.navigator.userAgent.toLowerCase();
    	    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    	        return true;
    	    }else{
    	        return false;
    	    }
    	}

		mui.init({
			swipeBack:false //启用右滑关闭功能
		});

	    var slider = mui(".sub-banner");
		slider.slider({ interval: 5000 });



        $(function(){
			//此处为首页导航栏购物车显示效果
			var buynum = localStorage.getItem("buyNum");
			var temp = "<span  class=\"mui-badge\">"+buynum+"</span>";
			if(buynum != '0' && buynum != null){
				$(".cartNum").append(temp);
			}

			$(".formUpImgs").attr("action",window.baseUpload);

			$(document).on('click','.m_backtop',function(){
				$("html,body").animate({scrollTop:'0px'},300);
			  return false;
			});


     		//九牧头部下拉导航
			$(document).on('click','.top_classify,.top_nav',function(e){
				$(".tag-top").toggle();
				var display =$('.tag-top').css('display');
				if(display == 'block'){
				  $(document).one("click", function () {
				   $(".tag-top").hide();
			    });
			  }
			});

			$(document).on('click','.top_classify,.tag-top,.top_nav', function(e){
				event.stopPropagation();
			});

			$(document).on('click','.m_discount', function(e){
			   event.stopPropagation();
			});

	        $(window).scroll(function(){
	//            if($(window).scrollTop()>1000){
	//				$(".FreeNav").addClass("appear");
	//
	//            } else {
	//				$(".FreeNav").removeClass("appear");
	//            }//1000像素时导航栏出现



				 if($(window).scrollTop()>1000){
					$("#ReturnTop").addClass("ReturnTop");
	            } else {

					$("#ReturnTop").removeClass("ReturnTop");
	            }//2000像素时返回顶部标志出现
	        });

		    $("#ReturnTop").click(function(){
                $('html,body').animate({'scrollTop':0},800);
            });

		   //跳转购物车
			$(document).on('click','#cart',function(){
				var timeStamp = new Date().getTime();//加上时间戳 确保每次都是新的页面
				var url = copyBaseURL+'/h5/templet/cart/cart.html?time='+ timeStamp;
				var userId= localStorage.getItem('userId');
				var token = localStorage.getItem('token');
				var sessionId = localStorage.getItem('sessionId');
				if(userId != null && userId != "" ){
					var cartNum = cartproductNum();
					if(cartNum == 0){
						window.location.href = url;
					}else{
						window.location.href = url;
					}
				}else{
					mui.alert('当前用户未登录','提示',function(){
						localStorage.setItem("comeAddress", url);
						window.location.href = copyBaseURL+ '/h5/templet/login/login1.html';
					})
				}
			});
			//首页右上角点击跳转购物车
			$("#gotocart").click(function(){
				var url ='../../../h5/templet/cart/cart.html'
				toLogin(url);
			});

			//点击首页
			$(document).on('click','#portal',function(){
					window.location.href= copyBaseURL + '/h5/templet/shop/index.html';
			})
			//点击分类
			$(document).on('click','#category',function(){
					window.location.href= copyBaseURL + '/h5/templet/category/category.html';
			})
			//点击限时特卖
			$(document).on('click','#limitSale',function(){
					window.location.href= copyBaseURL + '/h5/templet/shop/limit-sale.html';
			})
			//点击批发集采区
			$(document).on('click','#wholesaleBtn',function(){	
				window.location.href= copyBaseURL + '/h5/templet/wholesale/wholesale.html';
			})


			//点击我的，判断用户是否登录
			$(document).on('click','#mine',function(){	
				var userId= localStorage.getItem('userId');
				if(userId != null && userId != "" ){
					window.location.href= copyBaseURL + '/h5/templet/personal/mine.html';
				}else{
					localStorage.setItem("comeAddress", copyBaseURL + "/h5/templet/personal/mine.html");
					window.location.href = copyBaseURL + '/h5/templet/login/login1.html';
				}
			})

			//搜索页面的得到焦点事件
			$('#m_searchbox').click(function(){
				window.location.href = copyBaseURL + '/h5/templet/search/initSearch.html';
			});

			//Safair收藏二级页面跳转到浏览器的问题
            if(('standalone' in window.navigator)&&window.navigator.standalone){
                var noddy,remotes=false;
                document.addEventListener('click',function(event){
                    noddy=event.target;
                    while(noddy.nodeName!=='A'&&noddy.nodeName!=='HTML') noddy=noddy.parentNode;
                    if('href' in noddy&&noddy.href.indexOf('http')!==-1&&(noddy.href.indexOf(document.location.host)!==-1||remotes)){
                        event.preventDefault();
                        document.location.href=noddy.href;
                    }
                },false);
            }

            //wap端推广(多麦CPS)
            var alliance_ad = getQueryString("alliance_ad");
            if (!isEmpty(alliance_ad)) {
                setCookie("alliance_ad",alliance_ad,30);
            }
        });

        // 底部下拉弹出框展示事件
		function slide_show(obj){
			if ($(obj).is(".slide_modal")) {
				$(obj).fadeIn(200);
			}else{
				$(obj).slideDown(200);
			}
			if ( $(".opacitys").length < 1) {
				$('<div class="opacitys"></div>').appendTo("body").fadeIn(200);
			} else {
				$(".opacitys").fadeIn(200);
			}
			ModalHelper.afterOpen();
			$(document).on("click",".opacitys",function(){
				slide_hide(obj);
			});

		}

		// 底部下拉弹出框隐藏事件
		function slide_hide(obj){
			if ($(obj).is(".slide_modal")) {
				$(obj).fadeOut(200);
			}else{
				$(obj).slideUp(200);
			}
			$(".opacitys").fadeOut(200);
			ModalHelper.beforeClose();
		}

		// 底部下拉弹出框默认隐藏事件
		$(document).on("click","[data-slide='miss']",function(){
			var obj = $(this).parents(".slide_box");
			if (obj.length <= 0) {
				var obj = $(this).parents(".slide_modal");
			}
			slide_hide(obj);
		});

		// 手机验证码获取倒计时
		var countdown = 60;
		function settime(val) {
			if (countdown == 0) {
				val.removeClass("disabled");
				val.text("获取验证码");
				countdown = 60;
			} else {
				val.addClass("disabled");
				val.text("重新发送(" + countdown + "s)");
				countdown--;
				setTimeout(function() {
					settime(val)
				},1000)
			}
		}


		/*点亮星星*/
		$("#star i").click(function(){
			$(this).siblings().removeClass("on");
			$(this).addClass("on").prevAll().addClass("on");
		});



//json字符串  解析
function strToJson(str){
    var json = eval('(' + str + ')');
    return json;
}

// 进入活动商品详情
function activeProductInfo(productIndex,skuNo,productUuid,activityUuid){
	// 首页配活动转换
	if(isNaN(productIndex)) {
		var objs = {
			'seckill': '2',
			'groupbuy': '3',
			'fightgroup': '4',
			'presaleActivities': '5',
			'ontrial': '6'
		}
		var productIndex = objs[productIndex];
	}
	var productIndexbox = parseInt(productIndex);
	localStorage.setItem("productUuid",productUuid);
	var linkInfo = "skuNo="+skuNo+"&activityUuid="+activityUuid+"&productIndex="+productIndex+"";
	switch(productIndexbox)
	{
	case 2:  // 秒杀商品
		window.location.href="../../../h5/templet/detail/b2b-details-seckill.html?"+linkInfo+"";
		break;
	case 3:  // 团购商品
		window.location.href="../../../h5/templet/detail/b2b-details-groupbuy.html?"+linkInfo+"";
		break;
	case 4:  // 拼团商品
		window.location.href="../../../h5/templet/detail/b2b-details-fightgroups.html?"+linkInfo+"";
		break;
	case 5:  // 预售商品
		window.location.href="../../../h5/templet/detail/b2b-details-presell.html?"+linkInfo+"";
		break;
	case 6:  // 试用商品
		window.location.href="../../../h5/templet/detail/b2b-details-ontrial.html?"+linkInfo+"";
		break;
	};
}

// 进入五星定制详情
function customizedbox(obsDesignId){
	window.location.href="../../../h5/templet/detail/b2b-details-customized.html?obsDesignId="+obsDesignId+"";
}



// 进入商品详情页
function productInfo(productUuid,productType,backurl){
	if (backurl)
	{
		sessionStorage.setItem("setCurrentPageForPreviousPage", backurl);
	}
	var comeAddress =window.location.href;
	localStorage.setItem("comeAddress",comeAddress);
	// 判断商品类型
	productType = parseInt(productType);
	switch(productType)
	{
	case 03:  // 批发商品
		window.location.href="../../../h5/templet/detail/b2b-details-wholesale.html?productUuid="+productUuid+"&productIndex=7";
		break;
	case 11:  // 展示商品
		window.location.href="../../../h5/templet/detail/b2b-details-exhibition.html?productUuid="+productUuid+"&productIndex=8";
		break;
	case 13:  // 单品定制商品
		window.location.href="../../../h5/templet/detail/b2b-details-singlecustomized.html?productUuid="+productUuid+"&productIndex=9";
		break;
	case 14:  // 优惠券商品
		window.location.href="../../../h5/templet/detail/b2b-details-coupon.html?productUuid="+productUuid+"&productIndex=10";
		break;
	case 15:  // 商用商品
		window.location.href="../../../h5/templet/detail/b2b-details-commercial.html?productUuid="+productUuid+"&productIndex=11";
	case 16:  // C2F定制商品
		window.location.href="../../../h5/templet/detail/b2b-details-c2f.html?productUuid="+productUuid+"&productType=16&productIndex=16";
		break;
	case 12:  // O2O商品
		window.location.href="../../../h5/templet/detail/b2b-details.html?productUuid="+productUuid+"&productIndex=1&productType=12";
		break;
	default:  // 普通商品
		window.location.href="../../../h5/templet/detail/b2b-details.html?productUuid="+productUuid+"&productIndex=1";
	};
}

//进入 投诉详情页
function complaintInfo(complaintsUuid){

	var comeAddress =window.location.href;
	localStorage.setItem("comeAddress",comeAddress);
	localStorage.setItem("complaintsUuid",complaintsUuid);
	window.location.href="../../../h5/templet/customer_service/complaintDetail.html";
}

//进入限时特卖活动页面    & A_1
function limitActiveInfo(activityId){
	localStorage.setItem("activityId",activityId);
	window.location.href="../../../h5/templet/shop/limit-sale-detail.html";
}

//进入立即购买页面
function payMoneyNow(productId){
	window.location.href="../../../h5/templet/detail/b2b-details.html?productUuid="+productId+"";
}

//进入店铺
function instore(b){
	//跳转到店铺首页
	localStorage.setItem('storeUuid',b);
	window.location.href = '../../../h5/templet/shop/shop-index2.html';
}

//首页分类里面的方法
function subCategory(subCategoryId){
	localStorage.setItem("subCategoryId",subCategoryId);
	window.location.href='../../../h5/templet/shop/stroeclass.html';
}

//P_L_C_0  品牌列表  分类
function categoryStrUuid(Str){
	localStorage.setItem("searchType","2");
	localStorage.setItem("searchTypeParam",Str);
	localStorage.setItem("searchKeyWord","商品列表");
	window.location.href = '../../../h5/templet/search/list-interaction.html';
}

//A_0效果页
function localherf(src){
	window.location.href=src;
}
//a_1  limitActiveInfo 同进入限时特卖详情相同方法

// P_L_O_0       进入品牌list效果页  brandList
function brandList(brandName){
	localStorage.setItem("searchType","3");
	localStorage.setItem("searchTypeParam",brandName);
	localStorage.setItem("searchKeyWord",brandName);
	window.location.href = '../../../h5/templet/search/list-interaction.html';
}


//展示公告
function showhtml(body,name){
	localStorage.setItem("body",body);
	localStorage.setItem("name",name);
	window.location.href = "../../../h5/templet/information/show.html";
}

//关键词搜索
function searchTypeWord(searchTypeWord,type){
	localStorage.setItem("searchType",type);
	localStorage.setItem("searchTypeParam",searchTypeWord);
	localStorage.setItem("searchKeyWord",searchKeyWord);
	window.location.href = '../../../h5/templet/search/list-interaction.html';
}

//获取优惠券效果
function getCoupon(couponId){
	var userId = localStorage.getItem('userId');
	var token = localStorage.getItem('token');
	var sessionId = localStorage.getItem('sessionId');
	var url = window.basePath+'jsonParam={"opeType":"receiveCoupon","map":{"customerUuid":"'+userId+'","couponDetailUuid":"'+couponId+'","token":"'+token+'","sessionId":"'+sessionId+'"}}';
	$.ajax({
		url:url,
		type: "POST",
		dataType:'json',
		success:function(data){
			mui.alert(data.message);
		}
	})
}

//解析进入会员中心页面
function personalPage(code){
	var customerUuid = localStorage.getItem("userId");
	if (code == "M_I_0") {  // 我的积分页面
		var locationurl = "../../../h5/templet/personal/integral.html";
	}else if (code == "M_P_0"){  // 我的收藏页面
		var locationurl = "../../../h5/templet/personal/collection.html";
	}else if (code == "M_C_0"){  // 我的优惠券页面
		var locationurl = "../../../h5/templet/personal/coupon.html";
	}else if (code == "C_L_U_0"){  // 我的优惠券页面
		var locationurl = "../../../h5/templet/activity/activity-luck.html";
	}
	if (typeof customerUuid == 'undefind' || customerUuid == null || customerUuid == '') {
        localStorage.setItem("comeAddress", locationurl);
        window.location.href = '../../../h5/templet/login/login1.html';
        return;
    }
	window.location.href = locationurl;
}

//店铺推荐
function recomendStore(){
	window.location.href ="../../../h5/templet/shop/recommended-shop.html";
}


$(".shop-subnav span i").click(function(){
	 	$(this).addClass("action").toggleClass("on");
});

//actionType 解析方法                                    当前所需的dom对象
function linkdetail(actionType){
	var strList = strToJson(actionType);
	var actionCode = strList.actionCode;
	var actionId = strList.actionId;
	var actionTitle = strList.actionTitle;

	if(actionCode == "S_0"){//店铺首页
			if(typeof actionId != "undefined" && actionId !=null && actionId!=""){
				action = "instore(\'"+actionId+"\')";
				return action;
			}
		return action
	}
	if(actionCode == "P_0"){//商品详情
		if(typeof actionId != "undefined" && actionId !=null && actionId!=""){
			if (!isEmpty(strList.productType)) {
				var type = strList.productType;
			}else{
				var type = "01";
			}
			action = "productInfo(\'"+actionId+"\',\'"+type+"\')";
			return action;
		}
		return action
	}
	if(actionCode == "F_0"){//五星定制方案详情
			if(typeof actionId != "undefined" && actionId !=null && actionId!=""){
				action = "productInfo(\'"+actionId+"\',16)";
				return action;
			}
		return action
	}
	if(actionCode == "A_3"){//店铺活动列表    暂无
		if(typeof actionId != "undefined" && actionId !=null && actionId!=""){
//			action = "productInfo(\'"+actionId+"\')";
//			localStorage.setItem("S_0",action);
			return action;
		}
		return action
	}
	if(actionCode == "A_0"){//活动内容页面暂无
		if(typeof actionId != "undefined" && actionId !=null && actionId!=""){
			action = "localherf(\'"+actionId+"\')";
			return action;
		}
		return action
	}
	if(actionCode == "A_1"){ //平台活动商品列表
		if(typeof actionId == "undefined" || actionId ==null || actionId!=""){
			action = "limitActiveInfo(\'"+actionId+"\')";
			return action;
		}
		return ""
	}
	if(actionCode == "P_L_O_0"){ //商品列表-品牌
		if(typeof actionId != "undefined" && actionId !=null && actionId!=""){
			action = "brandList(\'"+actionId+"\')";
			return action;
		}
		return action
	}
	if(actionCode == "P_L_C_0"){  //商品列表-分类
		if(typeof actionId != "undefined" && actionId !=null && actionId!=""){
			action = "categoryStrUuid(\'"+actionId+"\')";
			return action;
		}
		return action
	}
	if(actionCode == "M_I_0" || actionCode == "M_P_0" || actionCode == "M_C_0" || actionCode == "C_L_U_0"){  // 会员中心页面
		action = "personalPage(\'"+actionCode+"\')";
		return action;
	}
	if(actionCode == "Q_P_0"){ //关键字搜索商品列表
		if(typeof actionId != "undefined" && actionId !=null && actionId!=""){
			action = "searchTypeWord(\'"+actionId+"\','4')";
			return action;
		}
		return action
	}
	if(actionCode == "Q_S_0"){ //关键字店铺商品列表
		if(typeof actionId != "undefined" && actionId !=null && actionId!=""){
			action = "searchTypeWord(\'"+actionId+"\','1')";
			return action;
		}
		return action
	}
	if(actionCode == "S_RM_0"){ //店铺推荐
		if(typeof actionId != "undefined" && actionId !=null && actionId!=""){
			action = "recomendStore()";
			return action;
		}
		return action
	}
	if(actionCode == "A_0_1"){ //展示一段html
		if(typeof actionId != "undefined" && actionId !=null && actionId!=""){
			action = "showhtml(\'"+actionId+"\',\'"+actionTitle+"\')";
			return action;
		}
		return action
	}
	return "";

}

// 获取商品类型方法
// function getProdutType(uuid){
// 	var productType = "";
// 	// 通过接口获取商品类型
// 	var producttypestr = DES3.encrypt("123456789012345678901234",'{"opeType":"getProductByUuid","map":{"productUuid":"'+uuid+'"}}');
//     var producttypeUrl =window.basePath+'jsonParam='+producttypestr;
//     $.ajax({
//         url: producttypeUrl,
//         type: "POST",
//         dataType: "json",
//         async:false,
//         success: function(data){
//         	if (data.return_code == "0" && data.product.productType != null && data.product.productType != "") {
//         		productType = data.product.productType;
//         	}else{
//         		productType = "01";
//         	}
//         }
//     })
//     return productType;
// }

//登录跳转
function toLogin(url){
	var userId= localStorage.getItem('userId');
	var token = localStorage.getItem('token');
	var sessionId = localStorage.getItem('sessionId');
	if(userId != null && userId != "" ){
		window.location.href = url;
	}else{
		mui.alert('当前用户未登录','提示',function(){
			window.location.href = '../login/login1.html';
		})
	}
}



//获取当前页面url，存入缓存
function setAgoPageUrl(){
	// var urlNow = window.location.href;
	// sessionStorage.setItem("urlNow",urlNow);//为保证session的key不重复，不宜设置过短。
	sessionStorage.setItem("setCurrentPageForGetPreviousPage",location.href);
}

//获取当前页面的来源，获取不到就默认首页。
//备注：在微信公众号上，当某个页面选择从浏览器打开时，是获取不到session的值的，会显示404错误，故设置默认值
function getAgoPageUrl(){
	var urlNowPage = sessionStorage.getItem("setCurrentPageForPreviousPage") || homePageUrl;
	console.log("需要返回页是: " + urlNowPage);
	var backurl = urlNowPage == '' ? homePageUrl : urlNowPage;
	sessionStorage.setItem("setCurrentPageForPreviousPage", ''); // 重置
	window.location.href = backurl;
}

//跳转到之前的页面
function jumpTOBeforPage(){
	var ref = "";
	if (document.referrer.length > 0) {
        ref = document.referrer;
     }
    try {
       if (ref.length == 0 && opener.location.href.length > 0) {
        ref = opener.location.href;
      }
    } catch (e) {
       location.href = homePageUrl;
    }
    if (ref != "") {
    	location.href = ref;
    }else{
    	location.href = homePageUrl;
    }

}

//如果token或者session失效登录
function toLoginAjax(returnCode){
	if(returnCode == '49'||returnCode=='50'||returnCode=='51'){
		mui.alert('当前用户未登录','提示',function(){
			window.location.href = '../login/login1.html';
		})
	}
}

//从哪里来到哪里去，记录下当前页面，登录后取到这个url再跳回去
function toLoginAjax(returnCode,url){
	if(returnCode == '49'||returnCode=='50'||returnCode=='51'){
		mui.alert('当前用户未登录','提示',function(){
			localStorage.setItem("comeAddress",url);
			window.location.href = '../login/login1.html?notlanded=1';
		})
	}
}

//删除购物车
function delCart(productAttrForDel){
	var productAttrForDel = localStorage.getItem("productAttrForDel");
	window.location.href = '../../../h5/templet/cart/cart.html';
}

//购物车商品数量、
function cartproductNum(){
	var userId = localStorage.getItem("userId");
	var token = localStorage.getItem("token");
	var sessionId = localStorage.getItem("sessionId");
	var url = window.basePath+'jsonParam={"opeType":"getCart","map":{"customerUuid":"'+userId+'","token":"'+token+'","sessionId":"'+sessionId+'"}}';
	var cartNum = 0;
	$.ajax({
		url:url,
		type: "POST",
		dataType:'json',
		async : false,
		success:function(data){
			if(data.return_code == "0"){
				var object = data.carts;
				 for (var obj in object){
					 var reg = /^(cart_).*/;
	        		 if (reg.test(obj)){
	        			 var mingxiInfo = object[obj];
	        			 cartNum = cartNum + mingxiInfo.length;
	        		 }
				}

			}else{
				cartNum = 0;
			}
		}
	})
	return cartNum;
}

//分页model
function wmModelStr(nowPage,pageShow,totalNum,totalPage){
    if(pageShow == "" || pageShow == null){
    	 pageShow="20";
    }else{
    	 pageShow=pageShow;
    }
    if(nowPage == "" || nowPage == null){
   	     nowPage= "1";
    }else{
	     nowPage= nowPage;
    }
    if(totalNum == "" ){
    	totalNum =" ";
    }
    if(totalPage == "" ){
    	totalPage =" ";
    }
    /* wm.totalNum=totalNum;
    wm.totalPage=totalPage*/
	var wmModelStr = '{"nowPage":"'+nowPage+'","pageShow":"'+pageShow+'","totalNum":"'+totalNum+'","totalPage":"'+totalPage+'"}';
    return wmModelStr;
};

// 判断字符串是否为空   为空则返回true;否则返回false; add by jt 20160909
function isEmptyStr(str)
{
	var reg = /\S/;

	var v = true;

	(!reg.test(str)) ? v : v = false;

	return v;

}

//解析参与活动str   //返回一段html
function  zhuxiaoway(obj){ //<i class="by">包邮</i>
	var zhuxiaowayStr = '';
	if(typeof obj != 'undefined' && obj != null && obj.length>0){
		for(var i = 0 ; i<obj.length;i++){
			if(obj[i]=="1"){
				zhuxiaowayStr = zhuxiaowayStr + '<i class="mj">满减</i>';
			}else if(obj[i]=="2"){
				zhuxiaowayStr = zhuxiaowayStr + '<i class="by">包邮</i>';
			}else if(obj[i]=="3"){
				zhuxiaowayStr = zhuxiaowayStr + '<i class="dpz">单品赠</i>';
			}else if(obj[i]=="4"){
				zhuxiaowayStr = zhuxiaowayStr + '<i class="ddz">订单赠</i>';
			}else if(obj[i]=="5"){
				zhuxiaowayStr = zhuxiaowayStr + '<i class="dpdz">单品打折</i>';
			}else if(obj[i]=="6"){
				zhuxiaowayStr = zhuxiaowayStr + '<i class="dddz">订单打折</i>';
			}
		}
	}
	return zhuxiaowayStr;
}

function UrlRegEx(url) {
	//如果加上/g参数，那么只返回$0匹配。也就是说arr.length = 0   
	var re = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/i;
	//re.exec(url);   
	var arr = url.match(re);
	return arr;

}

//获取url参数的值，传的是参数名称(类型：String)，此方法在多个参数时比较好用
// 例如获取商品的uuid--var productUuid = getQueryString(productUuid);
function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null){
        return  unescape(r[2]);
    }
    return null;
}

// 判断微信环境
function isWeiXin()
{
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger')
    {
        return true;
    }
    else
    {
        return false;
    }
}

/**html转义*/
var entityMap = {
	"&" : "&amp;",
	"<" : "&lt;",
	">" : "&gt;",
	'"' : '&quot;',
	"'" : '&#39;',
	"/" : '&#x2F;'
};

function encodeHtml(str) {
	return String(str).replace(/[&<>"'\/]/g, function(s) {
		return entityMap[s];
	});
}

// 判断用户是否已登录
function preIsLogin(){
	var userId= localStorage.getItem('customerUuid');
	if(userId == null || userId == "" ){
		return false;
	}
	return true;
}

// 调用接口判断用户是否已登录、登录是否失效; 暂未用到
// function userIsLogin(){
// 	var isLogin = "";
// 	var token = localStorage.getItem("token");
//     var sessionId = localStorage.getItem("sessionId");
//     var userId = localStorage.getItem("userId");
// 	if(userId == null || userId == ""){
// 		return false;
// 	}else{
// 		var DES3Str = DES3.encrypt("123456789012345678901234",'{"opeType":"getCustomerInfo","map":{"customerUuid":"'+userId+'","sessionId":"'+sessionId+'","token":"'+token+'"}}');
// 		var url =window.basePath+'jsonParam='+DES3Str;
// 		$.ajax({
// 			url: url,
//             type: "POST",
//             dataType: "json",
//             async: false,
//             success: function(data){
//             	console.log(data);
//                 if(data.return_code == '0'){
// 					isLogin = "true";
// 				}else{
// 					isLogin = "false";
// 				}
//             }
//         });
//         if (isLogin == "true") {
//         	return true;
//         }else{
//         	return false;
//         }
// 	}
// }

// 定义函数解决移动端滚动穿透问题
var ModalHelper = (function(bodyCls) {
	var scrollTop;
	return {
	  afterOpen: function() {
	    scrollTop = document.scrollingElement.scrollTop;
	    document.body.classList.add(bodyCls);
	    document.body.style.top = -scrollTop + 'px';
	  },
	  beforeClose: function() {
	    document.body.classList.remove(bodyCls);
	    // scrollTop lost after set position:fixed, restore it back.
	    document.scrollingElement.scrollTop = scrollTop;
	  }
	};
})('modal-open');


/*
*	deptId部门客服id参数
*	当传过来的deptId为空时，默认获取客服部门客服id参数
*	deptId为1获取电商部门客服id参数     
*   deptId为2获取客服部门客服id参数    服务支持频道
*   deptId为3获取工程部门客服id参数    工程部是商用商品
*   deptId为4获取五星定制部门客服id参数
*   deptId为5获取品牌部门客服id参数     关于我们 资源
*/
function getSmallEnergyServiceId(deptId){
	var DES3Str1 = DES3.encrypt("123456789012345678901234",'{"opeType":"getSmallEnergyServiceId","map":{"deptId":"'+deptId+'"}}');
    var url =window.basePath+'jsonParam='+DES3Str1;
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        success: function(data) {
        	
        	// sessionStorage.setItem("siteid",data.xnsiteid);
            $("#nav_right").attr("data-siteid",data.xnsiteid).attr("data-settingid",data.siteid).load("../../../h5/templet/shop/floatnav.html");//返回头部
			$(document).on('click','.service,.y_custom_service',function(){
               commonService(data.xnsiteid,data.siteid);
//				window.open("../../../h5/templet/shop/kefu.html?xnsiteid="+data.xnsiteid+"&siteid="+data.siteid);
			})

        }
    });
}

/*
* android禁止微信浏览器调整字体大小

*  这种方法会导致网页延迟大约1S
* 重写设置网页字体大小的事件
*设置网页字体为默认大小
*/
(function () {
　　if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
　　handleFontSize();
　　} else {
　　if (document.addEventListener) {
　　　　document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
　　} else if (document.attachEvent) {
　　　　document.attachEvent("WeixinJSBridgeReady", handleFontSize);
　　　　document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
　　}
}

function handleFontSize() {
　　WeixinJSBridge.invoke('setFontSizeCallback', {
　　'fontSize': 0
　　});
　　
　　WeixinJSBridge.on('menu:setfont', function () {
　　　　WeixinJSBridge.invoke('setFontSizeCallback', {

　　　　　　'fontSize': 0
　　　　});
　　});
　　}
})();

//公共空判断
function isEmpty(strVal) {
	if (strVal == '' || strVal == null || strVal == undefined || strVal == "undefined") {
		return true;
	} else {
		return false;
	}
}

//添加cookie
function setCookie (c_name, value, expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	cookieVal = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()+";path=/");
	document.cookie = cookieVal;
}

//获取cookie
function getCookie(c_name) {
	if(document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=")
		if(c_start != -1) {
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			if(c_end == -1) {
				c_end = document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}

	$(document).on("click",".m-skip", function(event){
	  	var userId = localStorage.getItem('userId');
		if(userId == null || userId == "" ){
			mui.alert('当前用户未登录!','提示',function(){
				window.location.href = '../../../h5/templet/login/login1.html';
			})
			return;
		}
	  	
	    var uuid = $(this).attr("data-id");
	    var type = $(this).attr("data-type");
	  
	   if('0'==type){
			customersScreenSigns();
		}else if('1'==type){
			$("#screen_coupon").load("../../../h5/templet/shop/screenCoupon.html");//返回头部
			openCoupon(uuid);
		}
	});
	
	//防重复点击
	var flag = true;

	// 签到
	function customersScreenSigns() {
		if(flag == false) {
			return;
		}
		flag = false;
		var token = localStorage.getItem("token");
		var sessionId = localStorage.getItem("sessionId");
		var userId = localStorage.getItem("userId");

		var DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"customerSigns","map":{"customerUuid":"' + userId + '","sessionId":"' + sessionId + '","token":"' + token + '"}}');
		var url = window.basePath + 'jsonParam=' + DES3Str;

		$.ajax({
			url: url,
			type: "POST",
			dataType: "json",
			success: function(data) {
				console.log(data)
				if("0" != data.return_code) {
					mui.alert("签到失败!", '提示',function(){
						window.location.reload(); // 刷新当前页面
					});
				}

				if("success" == data.success) {
					mui.alert("您已连续签到!" + data.sustainSignTimes + "天," + "本次签到获得" + data.integral + "积分", '提示',function(){
						window.location.reload(); // 刷新当前页面
					});
				}
				if("noRules" == data.success) {
					mui.alert("暂无规则，签到失败！", '提示',function(){
						window.location.reload(); // 刷新当前页面
					});
				}
				if("haveSigned" == data.success) {
					mui.alert("您今日已签到,请明日再来!", '提示',function(){
						window.location.reload(); // 刷新当前页面
					});
				}
				flag = true;
			},
			error: function(data) {
				console.log("error");
			}
		});
	}
	
	// 弹出优惠券信息
	function openCoupon(uuid) {
		
		if(flag == false) {
			return;
		}
		flag = false;

		var DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"openCoupon","map":{"uuid":"' + uuid + '"}}');
		var url = window.basePath + 'jsonParam=' + DES3Str;

		$.ajax({
			url: url,
			type: "POST",
			dataType: "json",
			success: function(data) {
				
				if("0" != data.return_code) {
					mui.alert("获取随屏红包优惠券信息失败！", '提示',function(){
						location.reload(); // 刷新当前页面
					})
				}else{
					var rewardScreenSign = data.rewardScreenSign;
					var couponList = data.couponList;
					if(rewardScreenSign != null && couponList != null){
						$("#couponTitle").html(rewardScreenSign.title);
						$("#rewscrsigUuid").val(rewardScreenSign.uuid);
						
						var length = couponList.length;
						var html = '<ol>';
						for (var i = 0; i < length; i++) {
							var coupon = couponList[i];
							var denomination = coupon.denomination;
							var couponTypeName = coupon.couponTypeName;
							html += '<li><p class="p1"><span>'+denomination+'</span>元</p><p class="p2">'+couponTypeName+'</p></li>'
						}
						html += '</ol>';
						
						$("#couponMsg").html(html);
							
					}
					$(".m_package").show();
					$(".m_opacitysbox").show();
				}
				flag = true;
			},
			error: function(data) {
				console.log("error");
			}
		});
	}
	
	// 领取优惠券红包
	$(document).on("click",".m-screenGetCoupon", function(event){
		if(flag == false) {
			return;
		}
		flag = false;
		var token = localStorage.getItem("token");
		var sessionId = localStorage.getItem("sessionId");
		var userId = localStorage.getItem("userId");
		var uuid = $("#rewscrsigUuid").val();
		var DES3Str = DES3.encrypt("123456789012345678901234", '{"opeType":"screenGetCoupon","map":{"uuid":"' + uuid + '","customerUuid":"' + userId + '","sessionId":"' + sessionId + '","token":"' + token + '"}}');
		var url = window.basePath + 'jsonParam=' + DES3Str;

		$.ajax({
			url: url,
			type: "POST",
			dataType: "json",
			success: function(data) {
				console.log(data)
				if("0" != data.return_code) {
					mui.alert("领取失败,"+data.message, '提示',function(){
						location.reload(); // 刷新当前页面
					})
					$(".m_package").hide();
					$(".m_opacitysbox").hide();
					
				}else{
					mui.alert("领取成功！", '提示',function(){
						location.reload(); // 刷新当前页面
					})
					$(".m_package").hide();
					$(".m_opacitysbox").hide();
				}

				flag = true;
			},
			error: function(data) {
				console.log("error");
			}
		});
	});
	
 	// 新人红包优惠券显示
 	$(document).on('click','.m_newpeople', function () {
 	 	$(".m_package").show();
 	 	$(".m_opacitys").show();
  	});
  	
  	// 新人红包优惠券关闭
  	$(document).on('click','.m_close,.m_opacitys', function () {
 	 	$(".m_package").hide();
 	 	$(".m_opacitysbox").hide();
  	}); 



//取值方法obtain
function obtain(key) {
    //无痕模式情况取cookie存储
    if (!isStorageSupported()) {
        var neme = $.cookie(key);
        return neme;
    } else {
        var neme = localStorage.getItem(key);
        return neme;
    }
}

//判断浏览器支不支持本地存储，如果不支持就用cookie存储
//存储公共方法 storage
// storage("key","value"); 存储使用方法
//storage("neme","nima",7); 设置7天过期{ expires: 7 }
// var obtain = obtain("key");    获取使用方法
// //clear("key");             删除使用方法
function storage(key, value, itme) {
    if (!isStorageSupported()) {
        //无痕模式情况下用cookie存储
        $.cookie(key, value, {expires: itme, path: '/'});
    } else {
        //不是无痕模式下用本地存储
        localStorage.setItem(key, value);
    }
}

//清楚本地存储跟cookie
function clear(key) {
    $.cookie(key, null, {path: '/'});
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
}


//判断ios 是不是无痕模式，如果是提示
function isStorageSupported() {
    if (typeof localStorage === 'object') {
        try {
            localStorage.setItem('localStorage', 1);
            localStorage.removeItem('localStorage');
            return true;
        } catch (e) {
            Storage.prototype._setItem = Storage.prototype.setItem;
            Storage.prototype.setItem;
        }
        return false;
    }
}


function toFix (value) {
    if(typeof(value)=='string'){
      return parseFloat(value).toFixed(2)
    }
    if (value != '' && value != undefined && value != null&&value !=0){
      return value.toFixed(2)//此处2为保留两位小数
    }
    return value
}

//微信静默登录
function quiteLogin () {
	var ua = window.navigator.userAgent.toLowerCase();
	// 登录目录下页面不登录
	if(window.location.pathname.indexOf('/login/') >= 0) return;
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    	var quiteComAdr = window.location.href;
		localStorage.setItem('quiteComAdr',quiteComAdr);
        //应用唯一标识
 	    var appid = "wx4e01e1488286aa5d";
		// var appid="wx3ff6ec02f32534d5";
		//重定向地址，需要进行UrlEncode
//		var redirect_uri = encodeURI("http://mtest.jomoo.com.cn/h5/templet/login/weixinlogin.html");
		var redirect_uri=encodeURI("http://m.ejomoo.com/live/login/weixinlogin.html");
		//应用授权作用域，拥有多个作用域用逗号（,）分隔，网页应用目前仅填写snsapi_login即可
		var scope="snsapi_base";
		//用于保持请求和回调的状态，授权请求后原样带回给第三方
		var state="jomoo"+new Date().getTime();
		var time=state;
		localStorage.setItem("wxloginstate",time);
		//微信客户端打开是·
		var url = "https://open.weixin.qq.com/connect/oauth2/authorize?";
			url = url + "appid=" + appid;
			url = url + "&redirect_uri=" + redirect_uri;
			url = url + "&response_type=code";
			url = url + "&pageType=wap";
			url = url + "&scope=" + scope;
			if (time != null) {
				url = url + "&state=" + time;
			}
			url = url + "#wechat_redirect";//进行URL的拼接
		// 获取code       
		window.location.href=url;        
	}
}

