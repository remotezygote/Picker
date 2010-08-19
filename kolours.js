/* A class to parse color values - based lossely on work by Stoyan Stefanov <sstoo@gmail.com> */
var Color = function(color){
	return({
		ok: false,
		isColor: true,
		fromHSV: function(hsv) {
			var i, f, p, q, t;
			hsv.h%=360;
			if(hsv.v==0) {
				this.r = this.g = this.b = 0;
				return(this);
			};
			hsv.s/=100;
			hsv.v/=100;
			hsv.h/=60;
			i = Math.floor(hsv.h);
			f = hsv.h-i;
			p = hsv.v*(1-hsv.s);
			q = hsv.v*(1-(hsv.s*f));
			t = hsv.v*(1-(hsv.s*(1-f)));
			if (i==0) {this.r=hsv.v; this.g=t; this.b=p;}
			else if (i==1) {this.r=q; this.g=hsv.v; this.b=p;}
			else if (i==2) {this.r=p; this.g=hsv.v; this.b=t;}
			else if (i==3) {this.r=p; this.g=q; this.b=hsv.v;}
			else if (i==4) {this.r=t; this.g=p; this.b=hsv.v;}
			else if (i==5) {this.r=hsv.v; this.g=p; this.b=q;}
			this.r = Math.floor(this.r*255);
			this.g = Math.floor(this.g*255);
			this.b = Math.floor(this.b*255);
			return(this);
		},
		init: function(color) {
			if(!color) color = "#000";
			if(typeof color=="string") {
				if (color.charAt(0) == '#') {
					color = color.substr(1,6);
				};
				color = color.replace(/ /g,'');
				color = color.toLowerCase();
				var patterns = [
					{
						matcher: /^(\w{2})(\w{2})(\w{2})$/,
						process: function (bits){
							return [
								parseInt(bits[1],16),
								parseInt(bits[2],16),
								parseInt(bits[3],16)
							];
						}
					},
					{
						matcher: /^(\w{1})(\w{1})(\w{1})$/,
						process: function(bits){
							return [
								parseInt(bits[1]+bits[1],16),
								parseInt(bits[2]+bits[2],16),
								parseInt(bits[3]+bits[3],16)
							];
						}
					}
				];
				for(var i=0;i<patterns.length;i++) {
					var bits = patterns[i].matcher.exec(color);
					if (bits) {
						channels = patterns[i].process(bits);
						this.r = channels[0];
						this.g = channels[1];
						this.b = channels[2];
						this.alpha = channels.length > 3 ? channels[3] : 1;
						this.ok = true;
					};
				};
				this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
				this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
				this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);
				this.alpha = (this.alpha < 0 || isNaN(this.alpha)) ? 1 : ((this.alpha > 1) ? 1 : this.alpha);
			} else if(typeof color=="object") {
				if(color.h!=undefined && color.s!=undefined && (color.v!=undefined || color.b!=undefined)) {
					if(color.b) color.v = color.b;
					this.fromHSV(color);
				} else if(color.c && color.m && color.y && color.k) {
				
				};
			} else if(typeof color=="object"&&color.length) {
				this.r = (color[0] < 0 || isNaN(color[0])) ? 0 : ((color[0] > 255) ? 255 : color[0]);
				this.g = (color[1] < 0 || isNaN(color[1])) ? 0 : ((color[1] > 255) ? 255 : color[1]);
				this.b = (color[2] < 0 || isNaN(color[2])) ? 0 : ((color[2] > 255) ? 255 : color[2]);
				this.alpha = (!color[3] || color[3] < 0 || isNaN(color[3])) ? 1 : ((color[3] > 1) ? 1 : color[3]);
				this.ok = true;
			} else {};
			return(this);
		},
		toHSV: function() {
			var x, val, f, i, hue, sat, val;
			hue = 0;
			var r = this.r, g = this.g, b = this.b;
			r/=255;
			g/=255;
			b/=255;
			x = Math.min(Math.min(r, g), b);
			val = Math.max(Math.max(r, g), b);
			if (x==val) return({h:0, s:0, v:val*100});
			f = (r == x) ? g-b : ((g == x) ? b-r : r-g);
			i = (r == x) ? 3 : ((g == x) ? 5 : 1);
			hue = Math.floor((i-f/(val-x))*60)%360;
			sat = Math.floor(((val-x)/val)*100);
			val = Math.floor(val*100);
			return({h:hue, s:sat, v:val});
		},
		brightness: function() {
			return(Math.sqrt(this.r*this.r*.241+this.g*this.g*.691+this.b*this.b*.068));
		},
		toHex: function() {
			var r = this.r.toString(16).replace(/\..*/,'');
			var g = this.g.toString(16).replace(/\..*/,'');
			var b = this.b.toString(16).replace(/\..*/,'');
			if (r.length == 1) r = '0' + r;
			if (g.length == 1) g = '0' + g;
			if (b.length == 1) b = '0' + b;
			return '#' + r + g + b;
		}
	}.init(color));
};
var Kolours = (function(options){
	return({
		options: {
			css: '.kolour-picker{-moz-border-radius:6px;-webkit-border-radius:6px;border:1px solid rgba(0,0,0,.5);background-color:#FFF;background-image:-webkit-gradient(linear,0% 0%,0% 100%,from(#FFFFFF),to(#EDEDED));padding:11px;display:inline-block;padding-bottom:7px;}.kolour-picker .marker,.kolour-picker .fn,.kolour-picker .bs{background-repeat:no-repeat;background-image:url(data:image/png;base64,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);}.kolour-picker .marker{background-position:top right;position:absolute;}.kolour-picker .fn{width:116px;height:116px;background-color:#0F0;background-position:top left;border:1px solid rgba(0,0,0,.5);display:inline-block;position:relative;cursor:crosshair;overflow:hidden;}.kolour-picker .fn .marker{width:9px;height:9px;background-position:-126px -5px;top:20%;left:20%;}.kolour-picker .bs{width:10px;height:116px;background-position:-116px top;border:1px solid rgba(0,0,0,.5);display:inline-block;position:relative;cursor:n-resize;margin:0 4px;}.kolour-picker .bs .marker{width:14px;height:5px;left:-2px;}.kolour-picker .inputs{display:inline-block;position:relative;top:-4px;}.kolour-picker input{display:block;width:50px;height:20px;-moz-border-radius:6px;-webkit-border-radius:6px;border:1px solid rgba(0,0,0,.25);}.kolour-picker input[type="text"]{width:50px;height:20px;padding:2px 3px;font-size:7pt;}.kolour-picker input[type="submit"]{border-color:rgba(0,0,0,.5);background-color:#ededed;background-image:-webkit-gradient(linear,0% 0%,0% 100%,from(#FFFFFF),to(#EDEDED));margin-top:3px;}',
			startColor: "#6dbd01",
			onPick: function() {},
			onUpdate: function() {},
			linkTo: false
		},
		init: function(options) {
			if(options) this.lO(options);
			if(this.options.linkTo) this.lnk(this.options.linkTo);
			this.aS(this.options.css);
			this.gB();
			window.setTimeout('Kolours.lC("'+this.options.startColor+'");',0);
			return(this);
		},
		lnk: function(elem) {
			if(elem) {
				this.be.style.position = "absolute";
				var pos = this.gP(elem);
				elem.onfocus = function(){Kolours.show();};
				elem.onclick = elem.onfocus;
				elem.onkeyup = function(ev){Kolours.tL.apply(Kolours,[ev]);};
				document.body.onclick = function(ev){
					var tgt = ev.target;
					if(tgt && !Kolours.c(tgt)){
						Kolours.hide();
					};
				};
				if(elem.value) this.options.startColor = elem.value;
				this.options.onPick = function(color,brightness,settext) {
					if(brightness && brightness < 125) Kolours.options.linked.style.color = "#FFF";
					else Kolours.options.linked.style.color = "#000";
					Kolours.options.linked.style.backgroundColor = color;
					if(settext==undefined || settext!=false) Kolours.options.linked.value = color;
				};
				this.options.onUpdate = this.options.onPick;
				this.options.linked = elem;
			};
		},
		c: function(e) {
			if(!e || !e.parentNode) return(false);
			if(e==this.be || (Kolours.options.linked && e==Kolours.options.linked)) return(true);
			while(e.parentNode){
				if(e==this.be || (Kolours.options.linked && e==Kolours.options.linked)) return(true);
				e = e.parentNode;
			}
			return(false);
		},
		lO: function(opts) {
			for(var key in opts) {
				this.options[key] = opts[key];
			};
		},
		aS: function(css) {
			var style = document.createElement('style');
			style.type = 'text/css';
			if(style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			};
			document.getElementsByTagName('head')[0].appendChild(style);
			return(style);
		},
		lC: function(color,settext) {
			this.currentColor = new Color(color);
			var hsv = this.currentColor.toHSV();
			this.current_hue = hsv.h;
			this.sC(this.currentColor.toHSV(),settext);
			var position = {
				h:(hsv.h/360)*this.be.bs.clientHeight,
				s:(hsv.s/100)*this.be.fn.clientWidth,
				v:((100-hsv.v)/100)*this.be.fn.clientHeight
			};
			this.be.fn.style.backgroundColor = new Color({h:hsv.h,s:100,v:100}).toHex();
			this.be.bs.marker.style.top = (position.h - (this.be.bs.marker.clientHeight/2))+"px";
			this.be.fn.marker.style.left = (position.s - (this.be.fn.marker.clientWidth/2))+"px";
			this.be.fn.marker.style.top = (position.v - (this.be.fn.marker.clientHeight/2))+"px";
		},
		sC: function(value,settext) {
			if(!value.h) value.h = this.current_hue;
			if(!value.s) value.s = this.currentColor.toHSV().s;
			if(!value.v) value.v = this.currentColor.toHSV().v;
			if(value.h!=this.currentColor.toHSV().h) {
				this.be.fn.style.backgroundColor = new Color({h:value.h,s:100,v:100}).toHex();
			};
			this.currentColor = new Color(value);
			if(settext==undefined || settext==true) this.be.text_box.value = this.currentColor.toHex();
			if(this.options.onUpdate) this.options.onUpdate.apply(window,[this.currentColor.toHex(),this.currentColor.brightness(),settext]);
		},
		gP: function(element) {
			var valueT = 0, valueL = 0;
			do {
				valueT += element.offsetTop  || 0;
				valueL += element.offsetLeft || 0;
				element = element.offsetParent;
			} while (element);
			return({"x":valueL,"y":valueT});
		},
		hBE: function(elem) {
			elem.onmousedown = function(ev){Kolours.bsMD.apply(Kolours,[ev]);};
			elem.onmousemove = function(ev){Kolours.bsMM.apply(Kolours,[ev]);};
			elem.onmouseup = function(ev){Kolours.bsMU.apply(Kolours,[ev]);};
		},
		bsMD: function(ev) {
			ev.currentTarget.is_dragging_bs = true;
		},
		bsMM: function(ev) {
			var tgt = ev.currentTarget;
			if(tgt.is_dragging_bs) {
				var position = {"h":(ev.clientY + (window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop)) - this.gP(tgt).y};
				if(position.h < 1) position.h = 1;
				if(position.h > tgt.clientHeight) position.h = tgt.clientHeight;
				tgt.marker.style.top = (position.h - (tgt.marker.clientWidth/2))+"px";
				position.h = (position.h/116)*360;
				this.current_hue = position.h;
				this.sC(position);
			};
		},
		bsMU: function(ev) {
			var tgt = ev.currentTarget;
			tgt.is_dragging_bs = false;
			var position = {"h":(ev.clientY + (window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop)) - this.gP(tgt).y};
			if(position.h < 0) position.h = 0;
			if(position.h > tgt.clientHeight) position.h = tgt.clientHeight;
			tgt.marker.style.top = (position.h - (tgt.marker.clientWidth/2))+"px";
			position.h = (position.h/tgt.clientHeight)*360;
			this.current_hue = position.h;
			this.sC(position);
		},
		hFE: function(elem) {
			elem.onmousedown = function(ev){Kolours.fnMD.apply(Kolours,[ev]);};
			elem.onmousemove = function(ev){Kolours.fnMM.apply(Kolours,[ev]);};
			elem.onmouseup = function(ev){Kolours.fnMU.apply(Kolours,[ev]);};
		},
		fnMD: function(ev) {
			ev.currentTarget.is_dragging_fn = true;
		},
		fnMM: function(ev) {
			var tgt = ev.currentTarget;
			if(tgt.is_dragging_fn) {
				var position = {"s":ev.clientX - this.gP(tgt).x, "v":(ev.clientY + (window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop)) - this.gP(tgt).y};
				if(position.s < 0) position.s = 0;
				if(position.s > tgt.clientHeight) position.s = tgt.clientHeight;
				if(position.v < 0) position.v = 0;
				if(position.v > tgt.clientWidth) position.v = tgt.clientWidth;
				tgt.marker.style.left = (position.s - (tgt.marker.clientHeight/2))+"px";
				tgt.marker.style.top = (position.v - (tgt.marker.clientWidth/2))+"px";
				position.s = (position.s/tgt.clientWidth)*100;
				position.v = 100-((position.v/tgt.clientHeight)*100);
				this.sC(position);
			};
		},
		fnMU: function(ev) {
			var tgt = ev.currentTarget;
			tgt.is_dragging_fn = false;
			var position = {"s":ev.clientX - this.gP(tgt).x, "v":(ev.clientY + (window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop)) - this.gP(tgt).y};
			if(position.s < 0) position.s = 0;
			if(position.s > tgt.clientHeight) position.s = tgt.clientHeight;
			if(position.v < 0) position.v = 0;
			if(position.v > tgt.clientWidth) position.v = tgt.clientWidth;
			tgt.marker.style.left = (position.s - (tgt.marker.clientHeight/2))+"px";
			tgt.marker.style.top = (position.v - (tgt.marker.clientWidth/2))+"px";
			position.s = (position.s/tgt.clientWidth)*100;
			position.v = 100-((position.v/tgt.clientHeight)*100);
			this.sC(position);
		},
		tL: function(ev) {
			this.lC(new Color(ev.currentTarget.value).toHSV(),false);
		},
		p: function(ev) {
			if(this.options.onPick) this.options.onPick.apply(window,[this.currentColor.toHex(),this.currentColor.brightness()]);
			this.hide();
		},
		gB: function() {
			if(this.be) return(this.be);
			this.be = document.createElement("div");
			this.be.setAttribute("class","kolour-picker");
			this.be.setAttribute("style","display:none;");
			this.be.fn = document.createElement("div");
			this.be.fn.setAttribute("class","fn");
			this.be.fn.marker = document.createElement("div");
			this.be.fn.marker.setAttribute("class","marker");
			this.be.fn.marker.innerHTML = " ";
			this.be.fn.appendChild(this.be.fn.marker);
			this.be.appendChild(this.be.fn);
			this.hFE(this.be.fn);
			this.be.bs = document.createElement("div");
			this.be.bs.setAttribute("class","bs");
			this.be.bs.marker = document.createElement("div");
			this.be.bs.marker.setAttribute("class","marker");
			this.be.bs.marker.innerHTML = " ";
			this.be.bs.appendChild(this.be.bs.marker);
			this.be.appendChild(this.be.bs);
			this.hBE(this.be.bs);
			var inputs = document.createElement("div");
			inputs.setAttribute("class","inputs");
			this.be.text_box = document.createElement("input");
			this.be.text_box.setAttribute("type","text");
			this.be.text_box.onkeyup = function(ev){Kolours.tL.apply(Kolours,[ev]);};
			inputs.appendChild(this.be.text_box);
			this.be.submit_button = document.createElement("input");
			this.be.submit_button.setAttribute("type","submit");
			this.be.submit_button.setAttribute("value","Pick");
			this.be.submit_button.onclick = function(ev){Kolours.p.apply(Kolours,[ev]);};
			inputs.appendChild(this.be.submit_button);
			this.be.appendChild(inputs);
			document.body.appendChild(this.be);
			return(this.be);
		},
		attach: function(options) {
			this.init(options);
		},
		show: function() {
			this.be.style.display = "inline-block";
			if(this.options.linked) {
				var pos = this.gP(this.options.linked);
				pos.xo = this.options.linked.clientWidth==0 ? parseInt(this.options.linked.style.width,10) : this.options.linked.clientWidth;
				pos.yo = this.options.linked.clientHeight==0 ? parseInt(this.options.linked.style.height,10) : this.options.linked.clientHeight;
				this.be.style.top = pos.y + pos.yo + "px";
				this.be.style.left = pos.x + pos.xo + "px";
				this.lC(this.options.linked.value,false);
			};
		},
		hide: function() {
			this.be.style.display = "none";
		}
	}.init(options));
})();