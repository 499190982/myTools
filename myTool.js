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
			//当文件读取成功便可以调取上传的接口，想传哪里传哪里（PS： 你们可以把你们的靓照偷偷发给我！）      
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
	}
}
