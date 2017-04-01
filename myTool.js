/**
 * Created by Xujing on 17/3/21.
 */
var X = {
	/**
		* @param 雪花效果
		* @param {Object} obj 信息
		* @param num 雪花数目
	    * @param sdx X轴速度
	    * @param sdy Y轴速度
	    * @param imgSrc 图片地址
	    * @param imgNum 图片个数
	*/
	flower:function(param){
		var obj = {
			num : param.num || 3 ,  
			sdx : param.sdx || 6 ,
			sdy : param.sdy || 3 ,
			imgSrc : param.imgSrc ,
			imgNum : param.imgNum || 1 
		}
		//获取mycanvas画布
		var can = document.createElement("canvas");
		var screenWidth = $("body").width();
		var style = [
		    "width:" + screenWidth + "",
		    "height:" + document.documentElement.clientHeight + "px",
		    "position:absolute",
		    "top:0",
		    "pointer-events: none",
		    "left:0",
		    "z-index:2"
		];
		can.style.cssText = style.join(";");
		document.body.appendChild(can);
		
		var cxt = can.getContext("2d");
		//画布宽度
		var wid = window.innerWidth;
		//画布高度
		var hei = window.innerHeight;
		can.width = wid;
		can.height = hei;
		//雪花数目
		var flower = obj.num;
		//雪花坐标、半径
		var arr = []; //保存各圆坐标及半径
		for (var i = 0; i < flower; i++) {
		    arr.push({
		        x: Math.random() * wid,
		        y: Math.random() * hei,
		        r: (2*Math.PI)/4,
		        mx:Math.random() * obj.sdx + 1,
		        my:Math.random() * obj.sdy + 1,
		    })
		}
		//画花瓣
		function Drawflower() {
		    cxt.clearRect(0, 0, wid, hei);
		    
		    for(var j = 1,l=obj.imgNum+1;j<l;j++){
		    	drawFlowers(j)
		    }

		    //cxt.rotate((2*Math.PI)/4)
		    flowerFall();
		    cxt.closePath();
		}
		
		function drawFlowers(n){
	    	var img = new Image();
		    img.src = obj.imgSrc+n+".png";
		    for (var i = 0; i < flower/obj.imgNum; i++) {
		        var p = arr[i+(n-1)*(flower/obj.imgNum)];
	    		cxt.save();
//			        cxt.moveTo(p.x, p.y);
		        cxt.translate(p.x,p.y);
		        cxt.rotate(p.r-=0.05);
		        cxt.drawImage(img, -img.width/2, -img.height/2, img.width , img.height);
			    cxt.restore();
		        //
		    }
	    }
		
		//雪花飘落
		function flowerFall() {
		    for (var i = 0; i < flower; i++) {
		        var p = arr[i];
		        p.y += Math.random() + p.my;
		        if (p.y > hei) {
		            p.y = 0;
		        }
		        p.x += Math.random() + p.mx;
		        if (p.x > wid) {
		            p.x = 0;
		        }
		    }
		}
		setInterval(Drawflower, 1000/60);
	},
	/**
		* @param 移动端适配方案
		* @param width psd宽度
	*/
	resizeWindow : function(width){
		var dw = document.documentElement.clientWidth,
	        fontSize = ( dw / (width || 640)) * 40 + "px";
	    document.getElementsByTagName("html")[0].style.fontSize = fontSize;
	},
	/**
		* @param 图片裁剪及边框实现
		* @param {Object} obj 信息
	*/
	imgCrop:function(){
//		 dom
//		 '<div id="event02">
//				<div id="event02_word"></div>
//				<div class="style03" id="event_photo">
//					<p>1. 請先上傳照片。 2.選擇妳喜歡的圖框樣式。 3.確認樣式後，即可上傳分享FB。<br />
//					</p>
//
//					<div id="photo_choice"><img src="images/photo_a_btn.jpg" width="200" height="131" alt="" style="background-color: #000000" />&nbsp;&nbsp;&nbsp;<img src="images/photo_b_btn.jpg" width="200" height="131" alt="" style="background-color: #000000" />&nbsp;&nbsp;&nbsp;<img src="images/photo_c_btn.jpg" width="200" height="131" alt="" style="background-color: #000000" /></div>
//
//				</div>
//
//				<div id="photo_view"><canvas id="photo_canvas" style="width: 640px;height: 420px;"></canvas>
//					<!--<img name="" src="images/photo_c.jpg" width="640" height="420" alt="" style="background-color: #ccc" />--></div>
//				<div id="photo_btn">
//					<a><img src="images/btn_upload.png" width="152" height="56" id="Image" /><input type="file" class="upload_pic" id="upload" /></a>&nbsp;&nbsp;
//					<a><img src="images/btn_share.png" width="292" height="56" id="Image2" /></a>
//				</div>
//			</div>'
		var input = document.getElementById("upload"),
			perPic,
			picN = 0,
			imageFacebook,
			imgBG = new Image(),
			img = new Image();;

		function readFile() {
			var file = this.files[0];
			if(!/image\/\w+/.test(file.type)) {
				
			}
			var reader = new FileReader();
			reader.readAsDataURL(file);
			//当文件读取成功便可以调取上传的接口
			reader.onload = function(e) {
				var data = this.result.split(',');
				var tp = (file.type == 'image/png') ? 'png' : 'jpg';
				var a = data[0];
				//需要上传到服务器的在这里可以进行ajax请求      
				img.src = this.result;
				perPic = this.result;
				img.onload = function(){
					ox = 0;
					oy = 0;
					drawCanvas()
				}
			}
		};

		var canvas = document.getElementById("photo_canvas");
		var offsetX = canvas.offsetLeft,
			offsetY = document.getElementById("photo_view").offsetTop + document.getElementById("event02").offsetTop,
			mousedown = false;
		function eventDown(e) {
			if(perPic) {
				e.preventDefault();
				mousedown = true;
				if(e.changedTouches) {
					e = e.changedTouches[e.changedTouches.length - 1];
				}
				ow = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0,
				oh = (e.clientY + document.body.scrollTop || e.pageY) - offsetY || 0;
			}	
		}
		function eventUp(e) {
			if(perPic) {
				e.preventDefault();
				mousedown = false;
			}	
		}
        var ox = 0,
            oy = 0,
            ow = 0,
            oh = 0;
		function eventMove(e) {
			if(perPic) {
				e.preventDefault();
				if(mousedown) {
					if(e.changedTouches) {
						e = e.changedTouches[e.changedTouches.length - 1];
					}
					var x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0,
						y = (e.clientY + document.body.scrollTop || e.pageY) - offsetY || 0;
						ox -= (x - ow);
						oy -= (y - oh);
						ow = x;
						oh = y;
//							with(ctx) {
//								beginPath()
//								arc(x, y, 20, 0, Math.PI * 2);
//								fill();
//							}
     				drawCanvas()
				}
			}
		}

		canvas.addEventListener('touchstart', eventDown);
		document.addEventListener('touchend', eventUp);
		canvas.addEventListener('touchmove', eventMove);
		canvas.addEventListener('mousedown', eventDown);
		document.addEventListener('mouseup', eventUp);
		canvas.addEventListener('mousemove', eventMove);

		function drawCanvas(x,y) {
			var x = ox || 0,
			    y = oy || 0;
			var can = document.getElementById("photo_canvas");
			var screenWidth = 640;
			var cxt = can.getContext("2d");
			//画布宽度
			var wid = screenWidth;
			//画布高度
			var hei = 420;
			can.width = wid;
			can.height = hei;
			cxt.clearRect(0, 0, wid, hei);
			if(perPic) {
				var w = img.width,
					h = img.height,
					wl, wh;
				if( w/h >= (32/21) ){
					w = 420 * w / h;
					h = 420;
					wl = x > 0 ? ( x > (w - 640) ? -(w - 640) : -x ) : 0;
					wh = 0;
				}else {
					h = 640 * h / w;
					w = 640;
					wl = 0;
					wh = y > 0 ? ( y > (h-420) ? - (h-420) : -y ) : 0;
				}
				console.log(wl+'------'+wh)
				cxt.drawImage(img, wl, wh, w, h);
				cxt.drawImage(imgBG, 0, 0, imgBG.width, imgBG.height);
				cxt.closePath();
				ox = -wl;
				oy = -wh;
			} else {
				cxt.drawImage(imgBG, 0, 0, imgBG.width, imgBG.height);
			}
		}
		$('#photo_choice>img').click(function() {
			switch($(this).index()) {
				case 0:
					imgBG.src = "images/photo_a.png";
					break;
				case 1:
					imgBG.src = "images/photo_b.png";
					break;
				case 2:
					imgBG.src = "images/photo_c.png";
					break;
			}
			imgBG.onload = function() {
				drawCanvas();
//							picN = $(this).index();
			}	
		})
		$('#photo_choice>img').eq(0).click();
		$('#Image2').click(function() {
			if(perPic) {
				imageFacebook = canvas.toDataURL("image/png");
				$.post('../manager/image/createBy64.json', {
					imgStr: imageFacebook
				}, function(r) {
					console.log(r)
					alert(1)
				})
			}
		})
		if(typeof FileReader === 'undefined') {
			//result.innerHTML = "抱歉，你的浏览器不支持 FileReader";       
			input.setAttribute('disabled', 'disabled');
		} else {
			input.addEventListener('change', readFile, false);
		}
	},
	/**
		* @param 星星效果
		* @param {Object} oDom 父级dom节点
	*/
	star : function (oDom) {
        var no = 20,
            left = document.body.clientWidth - 100,
            top = 500,
            domHtml = "";
        for (var i = 0; i < no; i++) {
            var l = parseInt(Math.random() * left),
                t = parseInt(Math.random() * top),
                w = parseInt(Math.random() * (120 - 50 + 1) + 50, 10),
                s = parseInt(Math.random() * 3000);
            var styles = [
                "left:" + l + "px",
                "top:" + t + "px",
                "width:" + w + "px",
                "animation: scale1 1500ms " + parseInt(Math.random() * top) + "ms infinite ease-in-out",
                "-moz-animation: scale1 1500ms " + parseInt(Math.random() * top) + "ms infinite ease-in-out",
                "-webkit-animation: scale1 1500ms " + parseInt(Math.random() * top) + "ms infinite ease-in-out"
            ];
            styles = styles.join(";");
            domHtml += '<img style="' + styles + '" class="star" src="images/star.png"/>'
        }
        $(oDom).append(domHtml);
    },
    /**
		* @param 星星环绕效果		
	*/
	starAround : function(obj){
//		dom
//		<div class="characterList">
//			<div class="box1">
//				<div class="wrapper">
//					<ul>
//						<li>
//							<a href="javascript:void(0);">
//								<img src="images/character/louis_select.png" />
//							</a>
//						</li>
//						<li>
//							<a href="javascript:void(0);">
//								<img src="images/character/louis_normal.png" />
//							</a>
//						</li>
//						<li>
//							<a href="javascript:void(0);">
//								<img src="images/character/louis_select.png" />
//							</a>
//						</li>
//					</ul>
//				</div>
//				<span></span>
//			</div>
//		</div>
		var f = obj;
		var can = document.createElement("canvas");
		var screenWidth = f.width();
		var style = [
		    "width:" + f.width() + "",
		    "height:" + f.height() + "px",
		    "position:absolute",
		    "bottom:20px",
		    "pointer-events: none",
		    "left:0"
		];
		can.style.cssText = style.join(";");
		f.css('position','relative').append(can);
		
		var cxt = can.getContext("2d");
		//画布宽度
		var wid = f.width();
		//画布高度
		var hei = f.height();
		can.width = wid;
		can.height = hei;
		//雪花数目
		var Bubble = 40;
//		画图片
        var imgBG = new Image();
	    imgBG.src = obj.find('img').attr('src');
    	beginAct();
		//雪花坐标、半径
		var imgs = [];
		for(var j = 1,l=4;j<l;j++){
			imgs[j] = new Image();
			imgs[j].src = "./images/effect/bubble"+j+".png"
		}
		var arr,rxy,DrawTimer,drawOnce; //星星数组，初始位置，定时器，运动整体方向
	
			
		function beginAct(){
			clearInterval(DrawTimer);
			arr = [];
			drawOnce = true;
			rxy = {
				x : 0,
				y : hei
			}
			for (var i = 0; i < Bubble; i++) {
				if( i % 3 == 0 ){              //3个点一排
					rxy.x += 30;
					rxy.y+=Math.random() * 15;
				}
				var oR = Math.random()* 4;
			        oR = oR > 3 ? ( oR > 3 ? 3.4 : 3.2 ) : ( oR > 1 ? 3 : 2.8);
			    arr.push({
			        x: rxy.x -= Math.random() * 30,   //x轴位置 
			        y: rxy.y += Math.random() * 2,    //y轴位置
			        r: oR,                            //y轴速度
			        rx : oR,                          //x轴位置
			        z: 1-Math.random()*2>0?1:-1,      //
			        d : true,                         //运动方向 
			        img : i > Bubble/3 ? ( i > Bubble/3*2 ? 1 : 2 ) : 3   //图片选择 
			    })
//			    Math.ceil(Math.random()*3
			}
			DrawTimer = setInterval(DrawBubbles, 1000/60);
		}
		function DrawBubbles() {	
			console.log(1)
		    cxt.clearRect(0, 0, wid, hei);
		    for (var i = 0; i < Bubble; i++) {
		        var p = arr[i];
		        if( !p.d ){
		        	cxt.moveTo(p.x, p.y);
		        	cxt.drawImage(imgs[p.img], p.x, p.y, 20 , 20);
		        }
		    }
		    cxt.drawImage(imgBG,  0, 0, imgBG.width , imgBG.height);
            for (var i = 0; i < Bubble; i++) {
		        var p = arr[i];
		        if( p.d ){
		        	cxt.moveTo(p.x, p.y);
		        	cxt.drawImage(imgs[p.img], p.x, p.y, 20 , 20);
		        }
		    }
		    if( drawOnce ) BubbleUp();
		      else BubbleDown();
		    cxt.closePath();
		}
		
		function drawBubbles(n){
		    for (var i = 0; i < Bubble/3; i++) {
		        var p = arr[i+(n-1)*(Bubble/3)];
	    		cxt.moveTo(p.x, p.y);
		        cxt.drawImage(imgs[n], p.x, p.y, 20 , 20);
		    }
	    }
		function BubbleDown() {
		    for (var i = 0; i < Bubble; i++) {
		        var p = arr[i];
		        p.y += p.r;
	        	if (p.y > hei + 500) {
		        	checkBubble();
		        }	
		    }
		}
		function checkBubble(){
			var c = true;
			for (var i = 0; i < Bubble; i++) {
		        var p = arr[i];
		        if (p.y < hei) {
		        	c = false;
		        	break;
		        }
		    }
			c && clearInterval(DrawTimer);
		}
		function BubbleUp() {
		    for (var i = 0; i < Bubble; i++) {
		        var p = arr[i];
		        p.y -= p.r;
		        if (p.y < -500) {
		        	drawOnce = false;
		        	for (var i = 0; i < Bubble; i++) {
				        var p = arr[i];
				        p.x = Math.random()*wid;
				        p.r = Math.random()*4+4;
				    }
		        	break;
		        }
                if( p.d ){
                	p.x += p.rx;
                	if( p.x >= wid ) p.d = !p.d;
                }else{
                	p.x -= p.rx;
                	if( p.x <= 0 ) p.d = !p.d;
                }
		    }
		}
//		
		return function overAct(){
			clearInterval(DrawTimer);
		}
	}
}
