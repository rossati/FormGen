// ******************************************
// js popup generator V. 0.1.3 2 October 2024
// free to use but no warranties
// El Condor - Condor Informatique - Turin
// ******************************************
if (typeof(window.$) != "function") var $ = function (id) {return document.getElementById(id);};  // wrap getElementById
function waitForImages(container) {
//	Returns a Promise that is risolved when all container images are loaded
	const images = container.querySelectorAll("img");
	if (images.length === 0) return Promise.resolve(); // nessuna immagine, subito ok
	const promises = Array.from(images).map(img => {
	if (img.complete) {
		return Promise.resolve();
	} else {
		return new Promise(resolve => {
			img.addEventListener("load", resolve);
			img.addEventListener("error", resolve); // gestisce anche il caso errore
	  });
	}
  });
  return Promise.all(promises);
}
function popUp(parameters) {
	var clickOnce = function(event) {
		closePopUp(fade[1],initialOpacity);
		link.removeEventListener('click', clickOnce);
	};
	var mouseOut = function(event) {
		closePopUp(fade[1],initialOpacity);
		link.removeEventListener('mouseout', mouseOut);
	};
	var hitOnce = function(event) {
		if(event.key == parms.cancel) {
			closePopUp(fade[1],initialOpacity);
			window.removeEventListener("keydown",hitOnce);
		}
	};
	var closePopUp = function (t,initialOpacity) {			// close popup
		if (t > 0) fadeOut(link,t, initialOpacity)
		setTimeout(() => {
			if (status < 1) {
				link.parentNode.removeChild(link)
			} else {
				link.innerHTML = "";
				link.style.cssText = beforeStyle;
			}
		},1.2*t)
	}
	var fadeIn = function (elem, speed,initialOpacity) {	// fading function
		var opx = 0;
		var outInterval = setInterval(function() {
			elem.style.opacity = opx;
			if (opx < initialOpacity) opx += 0.02;
			else clearInterval(outInterval);
		},speed/50);
	}
	var fadeOut = function (elem, speed,initialOpacity) {	// fading function
		var opx = initialOpacity;
		var outInterval = setInterval(function() {
			elem.style.opacity = opx;
			if (opx > 0) opx -= 0.02;
			else {clearInterval(outInterval);}
		},speed/50);
	}
	this.memDragObj = {};
	var dragStart = function (id) {
		this.memDragObj[id] = {elNode: id}
		var dragObj = this.memDragObj[id]
		dragObj.first = true
		var size = id.getBoundingClientRect()
		dragObj.startLeft = Math.round(size.left);
		dragObj.startTop = Math.round(size.top);
		var e = dragGo.bind(event,dragObj)
		document.addEventListener("mousemove", e, true);	// Capture mousemove and mouseup events on the page.
		document.addEventListener("mouseup", (id) => {delete this.memDragObj[id];document.removeEventListener("mousemove", e, true)}, {once: true});
		function dragGo(dragObj,event) {
			var x = event.clientX + window.scrollX;			// Get cursor position respect to the page.
			var y = event.clientY + window.scrollY;
			if (dragObj.first) {
				dragObj.first = false
				dragObj.startLeft -= x
				dragObj.startTop -= y
				dragObj.elNode.style.removeProperty('transform');
				dragObj.elNode.style.width = dragObj.elNode.offsetWidth+"px"
			}
			// Move drag element by the same amount the cursor has moved.
			dragObj.elNode.style.left = (dragObj.startLeft + x) + "px";
			dragObj.elNode.style.top = (dragObj.startTop  + y) + "px"
			event.preventDefault();
		}
	}
	var parms = {width:-1,height:-1,top:-1,left:-1,id:"",cancel:"click",content:"<H1>?</h1>",style:"",class:"",fade:"",movable:false}
	for (key in parameters) parms[key.toLowerCase()] = parameters[key]
	var fade = (parms.fade+" 0 0").split(/\s+/);
	var initialOpacity = 1
	var status = (parms.id == "")? -1: ($(parms.id) != null)? 1: 0;	//	-1 no ID, 0 Id not present, 1 id exists
	var style = "";
	if (status < 1) {
		style += "position:absolute;display:inline-block;";
		style += `top:${parms.top == -1 ? "50%;" : parms.top+"px;"}`
		style += `left:${parms.left == -1 ? "50%;" : parms.left+"px;"}`
		if (parms.top == -1 && parms.left == -1) style += "transform: translate(-50%,-50%);"
		else if (parms.top == -1) style += "transform: translateY(-50%);"
		else if (parms.left == -1) style += "transform: translateX(-50%);"
		var link = document.body.appendChild(document.createElement("div"));
		if (parms.id != "") link.setAttribute('id', parms.id);
		if (parms.movable) link.addEventListener("mousedown", dragStart.bind(null,link))
	}
	else var link = $(parms.id)
	link.style.visibility = "hidden";
	if (parms.class != "") link.setAttribute('class', parms.class);
	var styleCursor = parms.movable ? "cursor:move;" : ""
	if (parms.content.search(/.gif$|.png$|.jpg$/i) >= 0) {parms.content = "<img src='" + parms.content +"'>";}
	link.innerHTML = parms.content;
	var beforeStyle = link.style.cssText;
	var observer = null
	waitForImages(link).then(() => {
		var images = link.getElementsByTagName("img");
		if (images.length == 1) {
			var image = images[0];
			if (parms.width > 0) image.style.width = parms.width+"px";
			if (parms.height > 0) image.style.height = parms.height+"px";
			if (parms.movable) image.style.cursor = `move`
		}
		link.style.cssText = `${styleCursor}${style}${parms.style}`
		initialOpacity = link.style.opacity == "" ? 1 : link.style.opacity;
		link.style.visibility = "visible";
		if (fade[0] > 0) {
			link.style.opacity = 0;
			fadeIn(link,fade[0], initialOpacity)
		}
	});
	if (typeof parms.cancel == "number") setTimeout(closePopUp,parms.cancel-fade[1],fade[1],initialOpacity);
	else if (typeof parms.cancel.toLowerCase() != "no") {
		if (parms.cancel.toLowerCase() == "click") {
			link.addEventListener("click",clickOnce);
		} else if (parms.cancel.toLowerCase() == "mouseout") { 
			link.addEventListener("mouseout",mouseOut);
		} else window.addEventListener("keydown", hitOnce);
	}
	return link;
}