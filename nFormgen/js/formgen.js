// jsForm generator ************************
// formgen 0.4.1 20 December 2024
// free to use but no warranties
// El Condor - Condor Informatique - Turin
// *****************************************
if (typeof(window.$) != "function") var $ = id => document.getElementById(id);  // wrap getElementById
class fGen {
	static version = "0.4.1 20 December 2024"
	static formCount = 0;	// for form without name or popup form
	static createNode(tag,id,style) {
		var node = document.createElement(tag);
		if (id != undefined) node.setAttribute("id",id);
		if (style != undefined) node.style.cssText = style;
		return node
	}
	static createWidget = function(id,list) {
		var obj =  new fGen("fg_Dummy",list)
		var table = fGen.fragment.querySelector(".fg_Table")
		if ($(id) != null) {
			var tableR = $(id).closest("table")
			if (tableR != null) {
				var tr = $(id).closest("tr")
				tr.after(table.rows[0])
			}
		}
		obj = null
	}
	static deleteWidget = id => $(id).closest("tr").remove()
	static fragment = ""
	static extractTokens = function(s, delimiter) { // if delimiter true returns delimiters
		if (delimiter == undefined) var delimiter = false
		const reSplitTokens = /("[^"]*")|('[^']*')|(\S+)/g	// thank to Taky
		var matchs = [...(s).matchAll(reSplitTokens)]		// ... copies array
		var a = []
		matchs.forEach(match => {
			if (!delimiter && match[3] == undefined) {	// if match[3] there aren't delimiters
				match[0] = match[0].substr(1,match[0].length -2)
			}
			a[a.length] = match[0]
		});
		return a
	}
	static fg_dictionary = {};
	static fg_Set = function(rsp,frm,fld) {
		var prefix = frm.fg_jsForm.prefix
		if ($(prefix+fld) == undefined && $(fld) == undefined) console.log("field",fld,"or id nonexistent")
		else {
			const handle = $(prefix+fld) != undefined ? $(prefix+fld) : $(fld)
			switch (handle.nodeName) {
				case "IMG":
					if (fGen.hasGraphicFile(rsp)) fGen.showImage(handle.id,rsp)
					break;
				case "INPUT":
				case "TEXTAREA":
					if (handle.list != undefined && rsp.split(/,\s*/).length > 1) {	// is list type
						handle.form.fg_createOptions(handle.list.id,rsp);
					} else handle.value = rsp;
					break;
				case "SELECT":
					handle.form.fg_createOptions(handle.id,rsp);
					break;
				default:
					handle.innerHTML = rsp;
			}
		}
	}
	static setObjPosition = function(ID,top,left) {
		var link = $(ID)
		link.style.top = (top  > -1 ? top : 0.5 * (window.innerHeight - link.offsetHeight))+"px";
		link.style.left = (left > -1 ? left : 0.5 * (window.innerWidth - link.offsetWidth))+"px";
	}
//*******************************************************************
// Source of Mike Hall modified by El Condor Mars 2021 October 2024
//*******************************************************************
	static dragObj = {};
	static dragStart = function (id) {
		fGen.dragObj[id] = {elNode: $(id)}
		var dragObj = fGen.dragObj[id]
		dragObj.first = true
		dragObj.startLeft = parseInt(dragObj.elNode.style.left, 10);
		dragObj.startTop = parseInt(dragObj.elNode.style.top, 10);
		if (isNaN(dragObj.startLeft)) dragObj.startLeft = 0;
		if (isNaN(dragObj.startTop)) dragObj.startTop = 0;
		var x = dragGo.bind(event,dragObj)
		document.addEventListener("mousemove", x, true);	// Capture mousemove and mouseup events on the page.
		document.addEventListener("mouseup", (id) => {delete fGen.dragObj[id];document.removeEventListener("mousemove", x, true)}, {once: true});
		function dragGo(dragObj,event) {
			var x = event.clientX + window.scrollX;			// Get cursor position respect to the page.
			var y = event.clientY + window.scrollY;
			if (dragObj.first) {
				dragObj.first = false
				dragObj.startLeft -= x
				dragObj.startTop -= y
			}
			// Move drag element by the same amount the cursor has moved.
			dragObj.elNode.style.left = (dragObj.startLeft + x) + "px";
			dragObj.elNode.style.top = (dragObj.startTop  + y) + "px";
			event.preventDefault();
		}
	}
	static hash2arrayValues = function(h) {
		var a = []
		Object.keys(h).forEach(f => {a[a.length] = h[f]})
		return a
	}
	static hasGraphicFile = f => /.+?\.(png|gif|jpe?g|ico|bmp)([:\t].+)?/i.test(f)
	static isGraphicFile = f => /.+?\.(png|gif|jpe?g|ico|bmp)$/i.test(f)
	static showImage = function(id,rsp) {
		var x = /(?:(?<t1>.*?):)?(?<i>.+\.(png|gif|jpe?g|ico|bmp))(?::(?<t2>.*))?/mi.exec(rsp).groups
		if (x != null) {
			var {t1="", i,t2="" } = x
			$(id).src = i
			if (t1 != "") $(id).previousSibling.innerHTML = t1
			if (t2 != "") $(id).nextSibling.innerHTML = t2
		}
	}
	static timeStamp = d => d.toISOString().slice(0,19).replace("T"," ")
	static translate = (w) => {
		if (/^".*"$|^'.*'$/.test(w)) w = w.substr(1,w.length-2)	// drops delimiters
		w = w.replace(/\\x[0-9A-F]{1,5}/gi,s => String.fromCharCode(parseInt("0"+s.substring(1))));
	return (fGen.fg_dictionary[w] == undefined) ? w : fGen.fg_dictionary[w]
}
constructor(idDiv,param) {
	this.formGen(idDiv,param)
	fGen.formCount++
}
addControl (controls,name,control) {
	if (controls[name] == undefined) controls[name] = Array()
	controls[name].push(control);
}
genImgTag(txt) {
	var items = txt.split(/([^\s]+?\.(?:png|gif|jpe?g|ico|bmp))/gmi);
	items.forEach(item => {
		if (fGen.isGraphicFile(item)) txt = txt.replace(item,`<img src='${item}' class='fg_alignImg'>`)
		else txt = txt.replace(item.trim(0),fGen.translate(item.trim()))
	});
	return txt
}
createErase(id,value) {return `<span class='fg_Erase' onClick='$("${id}").value = "${value}"'>&#x2718;</span>`}
createOptions(id,listItems) {	// lists and combos
	const aItems = this.splitKeyValue(listItems);
	var opt = ""
	aItems.forEach(aItem => {
		if (aItem[0] == "") opt += "<optgroup label='"+aItem[1]+"'>"
		else {
			opt += `<option Value='${aItem[0].replace(/'/g,"&#39;")}'>${fGen.translate(aItem[1])}</option>`
		}
	})
	if ($(id) == null) return opt;	// when invoked in form building
	var x = $(id).type == "text" ? $(id+"_List") : $(id);
	x.innerHTML = opt;
	x.selectedIndex = -1
}
dateChanged(frm) {
	var field = event.target.name
	var value = frm[field].value
	if (value == "") {
		frm[field].value = frm[field].dataset.value
		event.stopImmediatePropagation()
	} else frm[field].dataset.value = value
}
fg_link(frm,field,link,type) {	// type -1 -> Group, 0 -> key, 1 -> Exposed
	var linkID = $(frm.getAttribute("id") + link) || $(link)
	if (linkID != undefined) {
		var value = frm[field].value
		var opt = frm[field].options
		if (type > 0) value = opt[opt.selectedIndex].text	// exposed
		if (type < 0) value = opt[opt.selectedIndex].parentNode.nodeName == "OPTGROUP" ? opt[opt.selectedIndex].parentNode.label : ""
		if (linkID.nodeName == "TEXTAREA") linkID.value += ((linkID.value != "")?"\n":"") + value
		else if (linkID.nodeName == "DIV" || linkID.nodeName == "SPAN") linkID.innerHTML = value	// comment
		else linkID.value = value
	}
}
splitKeyValue(itms) {	// return array of items
	var aRet = [];
	if (!itms.match(/^\s*$/)) {
		const aSplit = itms.split(/,\s*/)
		for (var i in aSplit) {
			if (i == 0 || !/^\s*$/.test(aSplit[i])) {    // not empty (except the first one)
				var a = aSplit[i].split(/=/);
				aRet[aRet.length] = [a[0],(a.length > 1) ? a[1]:a[0]];
			}
		}
	}
	return aRet;
}
formGen (idDiv,param) {
/* ************************* some functions *********************** */
	var check = function(frm,widget) {	// can control all form or only the widget
		if (widget == undefined) var widget = "";
		var aErrors = [];
		for (var field in controls) {
			if (frm[field] == undefined)
				console.log("Control",field,"not exists")
			else {
				var aItems = controls[field];
				if (widget != "" && widget.name != field) continue;
				var wdgValue = (widget == "") ? frm[field].value : widget.value;
				if (frm[field].style != undefined) frm[field].style.borderColor = "gray";
				aItems.forEach(el => {
					var err = false;
					var [operator,operand,signal] = el
					switch (operator.toLowerCase()) {
						case "is":
							if (operand.toLowerCase() == "mail") {
								err = (wdgValue != "" && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(wdgValue));
							} else if (operand.toLowerCase() == "required") {
								err = (/^\s*$/.test(wdgValue));
							} else {	// my be a regular expression
								err = (wdgValue != "" && !RegExp(operand).test(wdgValue));
							}
							break;
						case "call":
							if (typeof window[operand] == "function") err = (!window[operand](frm,field,wdgValue));
							else console.log(operand, "isn't a function")
							break;
						case "==": case "!=": case ">": case ">=": case "<": case "<=":
							if (wdgValue != "") {
								if (widgets[operand] != undefined ) operand = $(widgets[operand].ID).value
								if (RegExp(numericTypes).test(widgets[field].type)) err = !eval("Number(wdgValue) "+operator+" operand")
								else err = !eval("wdgValue "+operator+" operand")
							}
					}
					if (err) {
						aErrors[aErrors.length] = field+": " + fGen.translate(signal);
						if (frm[field].style != undefined) frm[field].style.borderColor = "red";
					}
				});
			}
		}
		return aErrors;
	};
	var storeDefaults = function(items) {	// used for store defaults
		if (!Array.isArray(items)) items = fGen.extractTokens(items);
		items.forEach(el  => {
			const [name,value] = el.replace(/\s*[=]/,"0x00").split("0x00");
			if (value != undefined) {
				if (widgets[name] == undefined) console.log(name + " isn't a field")
				else widgets[name].default = value;
			};
		});
	}
	var fg_setEvent = function (name,parms) {
		if (fg_setEvent.count == undefined) fg_setEvent.count = 0;
		if (events[name] == undefined) events[name] = []
		parms.count = ++fg_setEvent.count
		parms.event = parms.event.toLowerCase()
		events[name][events[name].length] = parms
	}
	var fg_handle = function (frm,button) {	// send request
		const jsForm = frm.fg_jsForm;
		if (button == "fg_Cancel") {
			frm.innerHTML = "<input type=hidden name='fg_Button' value='fg_Cancel'>"
		} else {
			frm.fg_Button.value = button;
			var formData = frm.fg_formFields(frm);
			var aErrors = check(frm);		// data control ******************
			if (aErrors.length > 0)	return alert("Errors:\n"+aErrors.join("\n"));
		}
		if (jsForm.server != "" && jsForm.call == "" && button != "fg_Cancel") {		// only URI
				if (jsForm.encoding != undefined) frm.encoding = "multipart/form-data";	// for files
				frm.action = jsForm.server;
				frm.target = jsForm.target;
				frm.submit();
		} else if (jsForm.server == "" && jsForm.call != "") {		// only call function
			window[jsForm.call](frm);
		} else if (jsForm.server != "" && jsForm.call != "" && button != "fg_Cancel") {	// call Ajax receive in function
			if (jsForm.encoding != undefined) frm.encoding = "multipart/form-data";	// for files
			fGen.prototype.ajax(jsForm.server,frm,jsForm.call,jsForm.parm);
		} else {													// no uri no function
			if(button != "fg_Cancel" && jsForm.static == 0) $(jsForm.containerID).innerHTML = fGen.prototype.showData(formData);
			else if (button == "fg_Cancel") $(jsForm.containerID).innerHTML = ""
		}
		if (jsForm.static == 0) {
			intervals.map(h => {clearInterval(h)});	// setTimeaut(s)
			$(frm.id+"fg_CSS").remove()
			frm.remove()
		} else {
			if(button != "fg_Cancel" && jsForm.static > 1) {
				setTimeout(function(){fGen.prototype.setDefaults(frm,0)},100);		// 1 static, 2 reset form
			}
		}
	}
	var fg_handleEnter = function (frm,field) {	// for capture enter key
		if (event.key == "Enter") {
			event.preventDefault();
			fg_handle(frm,event.target.name);
		}
	}
	var fg_handleEvents = function (frm,events,count) {
		evnt = event.type
		events.forEach((el) => {
			var {server:fnz = "",call:jsFnz = "",field:fieldName = "",parm,parm2,count:eventCount} = el
			if (fnz != "") {	// server function (URI)
				if ($(fieldName) == null) {
					if ($(jsForm.prefix+fieldName) == null) console.log(fieldName + ": field ID not present")
				}
				if (fnz == "submit") {
					if (el.event == "enter") fg_handleEnter($(jsForm.ID),jsForm.prefix+fieldName);
					else fg_handle(frm,fieldName);
				} else {
					fGen.prototype.ajax(fnz,frm,jsFnz,parm,parm2);
				}
			} else {	// only javascript function
				if (evnt != "keydown" || el.event != "enter" || event.key == "Enter") {
					if (typeof jsFnz == "function") {	// the case of internal function like fg_handle
						jsFnz(frm,fieldName,parm,parm2);
					} else if (window[jsFnz] != undefined) {
						if (jsFnz == "alert") {alert(fGen.translate(parm))}
						else window[jsFnz](jsForm.prefix+fieldName,parm,frm);
					} else if (typeof fGen[jsFnz.replace(/^fGen\./,"")] == "function") {fGen[jsFnz.replace(/^fGen\./,"")](jsForm.prefix+fieldName,parm,frm)
					} else console.log(jsFnz, "isn't a function")
				}
			}
		})
	}
	var fg_handleInput = function (frm,field) {	// for check numeric
		if (fg_handleInput.re == undefined) fg_handleInput.re = {positive:/[^\d]/,integer:/[^-\d]/,float:/[^-.\d]/}
		var v = frm[field].value
		var key = event.key
		var widget = widgets[field]
		if (fg_handleInput.re[widget.type].test(key)) frm[field].value = v.replace(key,"")
		else {
			var caret = event.target.selectionStart
			if (widget.type == "float" && key == "." && v.match(/\./g).length > 1)
					frm[field].value = v.substring(0,caret-1) + v.substring(caret)
			if (widget.type != "positive" && key == '-') {
				frm[field].value = v.substring(0,caret-1) + v.substring(caret)
				if ((frm[field].value.match(/-/) || []).length == 0) frm[field].value = "-"+frm[field].value
			}
		}
	}
	var fg_handleTab = function (oldTag) {
		if (event.target.type == "button") {
			var tabs = document.getElementsByClassName("fg_Tab");
			for (let i = 0; i < tabs.length; i++) {
				if (tabs[i].style.display != "none") {
					tabs[i].style.display = "none";
					$(tabs[i].id.replace(/_Table/,"_Tab")).style.cssText = "color: #aaa"
				}
			}
			var tab = $(jsForm.prefix + event.target.name+"_Table")
			tab.style.cssText = "visibility:visible";
			event.target.style.cssText = `color: black`
		}
	}
	var fg_setDefaults = (frm,target,parm) => {this.setDefaults(frm,parm);}
	var createButton = function(f) {
		if (typeof f == "string") f = fGen.extractTokens(f)
		var [type,name,caption,...extra] = f
		caption = fGen.prototype.genImgTag(caption)
		var cls = fGen.hasGraphicFile(f[2]) ? "fg_GButton" : (caption.length > 1 ? "fg_Button" : "fg_CButton")
		cls = getParms(extra,"class", cls)
		var b = `\n<button type=button name='${name}' id='${jsForm.prefix + name}'`
		b += has(extra,"width") ? " style='width:"+getParms(extra,"width")+"px'" : ""
		if (/^fg_Reset\d*/.test(name)) fg_setEvent(name,{event:"click",call:fg_setDefaults,parm:name.replace(/^fg_Reset(\d*)/,(match, p1) => p1 != "" ? p1 : "0")})
		else {if (events[name] == undefined ) fg_setEvent(name,{event:"click",call:fg_handle,field:name})		}
		b += ` class='${cls}'>${caption}`
		return b+`</button>${(f.inline != undefined) ? fGen.translate(f.inline) : ""}`;
	};
	const contains = (h,parm) => {
		const re = new RegExp("^"+parm+"\\s*=|^"+parm+"$","i");
		return h.findIndex(el => re.test(el))
	};
	var getCallParms = function(h,obj,wdg) {
		obj.call = getParms(h,"call")
		obj.parm = ""
		if (obj.call != "") {
			var a = (/(.+?) +(.*)/).exec(obj.call)
			if (a != null) {
				obj.call = a[1]
				obj.parm = a[2]
			}
			if (window[obj.call] == undefined && fGen[obj.call.replace(/^fGen\./,"")] == undefined) {
				wdg[wdg.length] = `C '' "${obj.call} isn't a function" class fg_Error`
				obj.call = ""
			}
		}
	}
	var getParms = function(h,parm,def) {
		const indx = contains(h,parm)
		if (indx == -1) return def != undefined ? def : ""
		var a = h[indx].replace(/\s*=\s*/,"0x00").split("0x00")
		if (a.length > 1) return a[1];
		return indx < h.length-1 ? h[indx+1] : (def != undefined ? def : "")
	}
	var getParmsKey = function(h,parm,def) {
		const indx = contains(h,parm);
		if (indx == -1) return def != undefined ? def : ""
		return h[indx].split(/\s*=\s*/,1).toString().toLowerCase()
	}
	var has = (h, parm) => contains(h,parm) > -1 ? true:false
	var normalizeLabel = l => {
		l = l.replace(/(_[a-zA-Z])/, x => " " +x.substr(1,1).toLowerCase())			// aaa_bbb
		l = l.replace(/([a-z])([A-Z])/, (mtch,p1,p2) => p1+" " +p2.toLowerCase())	// aaaBbb
		return l.substr(0,1).toUpperCase() + l.substr(1)
	}
	var saveDefault = function(c,frmID,name) {	// for combo, list and defaults
		if (name.endsWith('*')) {storeDefaults(c,defaults)}	// this is the default list
		else {
			if (widgets[name] == undefined) console.log(name + " isn't a field")
			else {
				if (widgets[name][0] != "CMB" && widgets[name][0] != "L") widgets[name].default = c
				else fGen.fg_Set(c,$(frmID),name)
			}
		}
	}
	var setValue = function(fld,value) {
		var type = widgets[fld][0];
		var id = jsForm.prefix+fld;	// the name of control
		if (type == "T" || type == "H" || type == "L" || type == "S") {
			$(id).value = value;	// text and hiddens
			if (type == "S") $("s_"+id).value = value
		} else if (type == "CMB") {
			if (value == "") $(id).selectedIndex = -1
			else {
				$(id).value = value;
				const index = $(id).options.selectedIndex
				if (index != -1) $(id).form[fld+"_Exposed"].value = $(id).options[index].text	// my be value isn't in combo
				else console.log("Default value",value,"for",fld,"not in list")
			}
		} else if (type == "C") {
			$(id).innerHTML = value.replace("\\n","<br>")
		} else if (type == "DATE") {
			if (value.toLowerCase() == "today") {
				$(id).value = new Date().toISOString().slice(0,10)
			} else $(id).value = value
			$(id).dataset.value = $(id).value	// data old
		} else if (type == "B") {
			$(id).disabled = has(widgets[fld].slice(3),"disabled")
		} else if (type == "R") {
			if ($(id+value) != null) $(id+value).checked = true;
			else console.log("Default value",value,"for",fld,"not in list")
		} else if (type == "CKL") {
		} else if (type == "CKB") {
			$(id).checked = has(widgets[fld].slice(3),"on")
			$(id).value = value
		} else if (type == "I" && value != "") fGen.showImage(id,value);
	}
	var formFields = function(frm) {	// ret = true sets names of modified fields
		if (typeof frm == "string") frm = $(frm)
		var f = {};
		for (i = 0; i < frm.length; i++) {
			name = frm.elements[i].name.replace("[]","");
			if (name == "") continue	//  slider has no name
			const fieldID = $(frm.elements[i].id)
			type = (widgets[name] != undefined) ? widgets[name][0] : ""
			switch (frm.elements[i].type) {
				case "checkbox":
					f[name] = (frm.elements[i].checked)?frm.elements[i].value:"";
					break;
				case "button":
					f[name] = frm.elements[i].innerHTML;
					break;
				case "radio":
					if (frm.elements[i].checked) f[name] = frm.elements[i].value;
					break;
				case "select-multiple": case "select-one":
					const fld = frm.elements[i].options;
					var exp = [];
					var grp = {};
					f[name] = []
					for (var j = 0; j < frm.elements[i].options.length; j++) {
						if (fld[j].selected) {
							f[name].push(fld[j].value);
							exp.push(fld[j].text)
							const optg = fld[j].parentNode;
							if (optg.nodeName == "OPTGROUP") grp[optg.label] = ""
						}
					}
					f[name] = f[name].join(",")
					frm[name+"_Exposed"].value = exp.join(", ")
					frm[name+"_Group"].value = Object.keys(grp).join(", ")
					break
				default:
					f[name] = frm.elements[i].value
			}
			if (type == "CKL") {
				f[name] = 0
				this.splitKeyValue(widgets[name][3]).forEach(item => {if (frm[item[0]].checked) f[name] += 1});
				frm[name].value = f[name]
			}
		}
		f.fg_TimeStamp = fGen.timeStamp(new Date());
		if (formFields.formData != undefined) {
			var v = []
			for (const name in formFields.formData) {
				if (!name.startsWith("fg_") && formFields.formData[name] != f[name]) v.push(name);
			}
			frm.fg_Changed.value = v.join(", ");
			f.fg_Changed = frm.fg_Changed.value
			frm.fg_TimeStamp.value = f.fg_TimeStamp;
		} else formFields.formData = f
		return f
	}
/* ************************* end some functions *************************/
	if (idDiv.trim() == "") idDiv = "fg_PopUp"+fGen.formCount;
	if(!$(idDiv)) {	// if div is not present is create as PopUp
		var link = document.body.appendChild(fGen.createNode('DIV',idDiv,"visibility:hidden"));
		link.className = 'fg_PopUp';
	}
	if (param == "" || param == undefined) var param = "C '' Nodata!";
	var aLists = {};			// Lists and combos array
	var aGets = new(Array);		// GETs array
	var widgets = {};			// widgets array and properties
	var events = {};			// key name event = [function, param,...]
	var wdgEvent = {B:"click",T:"Enter",R:"change",CKB:"change",CMB:"change",DATE:"change"}
	var hiddens = {fg_Button:"",fg_Changed:"",fg_TimeStamp:""} // Hiddens data
	var llText = 50;			// limit from text and textarea
	var controls = {}			// controls
	var defaults = [];			// defaults
	var intervals = new Array();	// setInterval handlers
	const numericTypes = "integer|float|positive"
	var typeOfButton = 0;		// 1 if alternative Ok button(s), 2 standard buttons
	var bottomButtons = []
	var tabCount = 0
	var styles = `.fg_Buttons {text-align:center;padding:3px 0}
.fg_Error {color:red}
.fg_Number {text-align:right;margin-right:12px}
.fg_Erase {color:#888;margin-left:-12px}
.fg_See {margin-left:6px;font-size:20px}
.fg_ButtonTab {border-top-right-radius:15px;height:30px;min-width:80px;border:1px solid #000;padding:5px;border-bottom:none}
.fg_Button,.fg_ButtonTab,.fg_Erase,.fg_See,.fg_CButton,.fg_GButton {cursor:pointer}
.fg_CButton {border:none;background:rgba(0,0,0,0);font-size:18px}
.fg_Button:disabled, .fg_GButton:disabled, .fg_CButton:disabled{cursor: not-allowed;}
.fg_GButton {border:none;background:none}
.fg_Slider {width:3em;padding-left: 4px;border:none;background:rgba(0,0,0,0)}
.fg_UType {border:none;background:rgba(0,0,0,0)}
.fg_alignImg {padding: 0 3px;vertical-align:middle;}
.fg_Table td {padding:3px 2px}
.fg_alignAfter {display: grid;grid-template-columns: max-content repeat(3,1rem);align-items: center;}`
	var okTypes = {T:2,CKB:3,CMB:2,L:1.5,S:3,R:2,DATE:2,CKL:3}	// to establish the buttons to display
	var lengths = {S:150,T:20,C:0,L:0,CMB:0,R:0}	// if no length is provided is 20 characters for texts
	var numberLength = {integer:10,float:11,positive:9,text:20}
	var acceptedTypes = {B:"B",C:"C",COMMENT: "C",CKB:"CKB",CKL:"CKL",CMB:"CMB",CONTROL: "CHECK",DEFAULTS:"DEFAULT",DICTIONARY:"DICT",
						I:"I", IMAGE:"I",IMG:"I",L:"L",LIST:"L",R:"R",RDB:"R",REQUIRED:"REQ",S:"S",SLIDER:"S",TAB:"TAB",H:"H",HIDDEN:"H",DATE:"DATE",T:"T",TEXT: "T"}
	var jsForm = {containerID:idDiv,static:0,server:"",call:"",ground:'rgba(0,0,0,0)',eventOnStart:"",ID:"fg_frm"+fGen.formCount,
		left:-1,prefix:"",title:"",target:"_blank",top:-1} // Form data
// ******************************* start build *************************
	var wdg = param.split(/\r\n|\r|\n/)		// all line separators Windows, MacOS, Unix
	var i,j,k;
	var lone = 0;		// 0 no widget, 2 only one CMB or Radio, > 2 some widgets
	for (i=0;i<wdg.length; i++) {
		if (/^\s*$|^\/\/.*/.test(wdg[i])) continue	// empty or comment
		var field = fGen.extractTokens(wdg[i])
		while (field.length < 4) {field.push("")}
		field[0] = field[0].toUpperCase();			// upper-case widget name
		if (acceptedTypes[field[0]] != undefined) field[0] = acceptedTypes[field[0]]
		var [type,name,label,...extra] = field;
		if (type == "FORM") {
			if (field[1] != "" && $(field[1]) != undefined) {
				wdg[wdg.length] = `C '' "${field[1]} the form ID exists!" class fg_Error`
				field[1] = ""
			}
			jsForm.prefix = field[1]
			if (field[1] == "") field[1] = "fg_" + i;	// generated name
			else jsForm.ID = field[1]
			var extra = field.slice(2)
			jsForm.server = getParms(extra,"server")
			if (has(extra,"set")) getCallParms(["call","fGen.fg_Set "+getParms(extra,"set")],jsForm,wdg)
			else getCallParms(extra,jsForm,wdg)	// extract call
			jsForm.ground = getParms(extra,"ground",jsForm.ground)
			jsForm.top = getParms(extra,"top",-1)
			jsForm.left = getParms(extra,"left",-1)
			jsForm.target = getParms(extra,"target","_blank")
			jsForm.title = field[2]
			if (has(extra,"static")) jsForm.static = 1
			if (has(extra,"reset")) jsForm.static = 2
			jsForm.eventOnStart = getParms(extra,"onStart")
			if (jsForm.eventOnStart != "" && window[jsForm.eventOnStart] == undefined) wdg[wdg.length] = `C '' jsForm.eventOnStart isn't a function" class fg_Error`
			widgets[field[1]] = []
			widgets[field[1]].ID = jsForm.prefix+"fg_Title"	// It's actually the title ID
			widgets[field[1]].push(...field);
		} else if (type == "CHECK") {
			this.addControl(controls,field[1],field.slice(2))
		} else if (type == "CSS") {styles += "\n"+wdg[i].replace(/Css\s+/i,"")
		} else if (type == "DEFAULT") {
			defaults.push(field.slice(1))
		} else if (type == "DICT") {
			const fnz = getParms(field,"from")
			if (fnz != "" && typeof window[fnz] == "function") {
				if (typeof window[fnz] == "function") fGen.fg_dictionary = window[fnz](getParms(field,fnz))
			} else if (typeof window[field[1]] == "object") fGen.fg_dictionary = window[field[1]];
		} else if (type == "EVENT") {
			name = getParms(field,"on","fg_unknown")
			var eventParms = {field:name,event:field[1]}
			var fnz = getParmsKey(field,"call|set|alert").toLowerCase()
			if (fnz != "") {
				eventParms.parm = getParms(field,fnz)	// it's Ok for Set and alert
				if (fnz == "set") eventParms.call = fGen.fg_Set
				else if (fnz == "alert") {
					eventParms.call = fnz
				} else {
					getCallParms(field,eventParms,wdg)
				}
			}
			if (has(field,"submit")) {eventParms.server = "submit"}
			if (has(field,"server")) {eventParms.server = getParms(field,"server")}
			fg_setEvent(name,eventParms)
		} else if (type == "REQ") {
			for (var j=1;j<field.length; j++) if (field[j] != "") this.addControl(controls,field[j],Array("is","required","required"));
		} else if (type == "GET") {
			aGets.push([field[1],field[2],getParms(field,"every","0")])
		} else {		// widgets
			if (acceptedTypes[type] == undefined) {
				field = ["C","fg_" + i, "Unknown type: "+type,"class","fg_Error"]
				type = "C";
			}
			if (field[1] == "") field[1] = "fg_" + i;	// generated name
			name = field[1]
			widgets[name] = []
			widgets[name].width = getParms(extra,"width",(lengths[type] == undefined ? 20 : lengths[field[0]]))
			widgets[name].default = getParms(extra,"value|default")
			widgets[name].place = getParmsKey(extra,"after|below")
			widgets[name].placeField = getParms(extra,"after|below","")
			if (type == "B") {
				if(!has(extra,"inline|after|below")) typeOfButton =  typeOfButton | (/fg_Cancel|fg_Reset|fg_Ok/.test(name) ? 2 : 1)
				else widgets[name].inline = getParms(extra,"inline")
			}
			if (okTypes[type] != undefined) lone += okTypes[type];
			if (type != "I" && field[2] == "") field[2] = normalizeLabel(field[1]);	// label
			widgets[name].push(...field);
			var evnt = getParms(field.slice(2),"event")
			if (evnt != "") {
				var f = fGen.extractTokens(wdg[i],true)
				wdg[wdg.length] = `Event ${evnt} on '${name}' ${f.slice(contains(f,evnt) + 1).join(" ")}`
			} else if (type != "EVENT") {
				var iCall = contains(field.slice(2),"call|submit|alert|server")
				var field2 = fGen.extractTokens(wdg[i], true)
				if (iCall > -1 && wdgEvent[type] != undefined) {
					wdg[wdg.length] = `Event ${wdgEvent[type]} on '${name}' ${field2.slice(iCall+2,iCall+4).join(" ")}`
					if (/server/i.test(field2[iCall+2])) {
						iCall = contains(field.slice(2),"call|alert|set")
						if (iCall > -1) wdg[wdg.length-1] += " " + field2.slice(iCall+2,iCall+4).join(" ")
					}
				}
			}
		}
	}
	if (lone > 2 || lone == 0) {
		if (lone > 2) {
			if (widgets.fg_Ok == undefined && (typeOfButton & 1) != 1) bottomButtons[bottomButtons.length] = createButton("B fg_Ok Ok",0)
			if (widgets.fg_Reset == undefined) bottomButtons[bottomButtons.length] = createButton("B fg_Reset Reset",0)
		}
		if (widgets.fg_Cancel == undefined && jsForm.static != 1) bottomButtons[bottomButtons.length] = createButton("B fg_Cancel Cancel",0)
		typeOfButton |= 2	// standard button(s) exists
	}
	var prefix = jsForm.prefix
	var formID = jsForm.ID
	var styleTag = document.head.appendChild(fGen.createNode("style",formID+"fg_CSS"))
	styleTag.type = "text/css"
	styleTag.innerText = styles
	var tableHead = (jsForm.title != "") ? `<thead><tr><th colspan=2 id="${prefix+"fg_Title"}" class='fg_Title'>${this.genImgTag(jsForm.title)}</td></tr></thead>` : ""
	var tableCommon = ""
	var tableBody = ""
	var tableFoot = ""
	var frm =  ""
	var aWidgets = Object.keys(widgets);
	defaults.forEach(def => storeDefaults(def))
	var loneField = ""
	for (let i = 0;i<aWidgets.length;i++) {
		var wdgTag = ""
		var field = widgets[aWidgets[i]];
		var [type,name,label,...extra] = field;
		var widget = widgets[name]
		const IDName = prefix+name;
		if (extra.length == 0) extra = [""]
		var fieldLength = widget.width
		if (type == "FORM") continue
		if (type == "H") {
			if (widget.default == "") widget.default = label
			hiddens[name] = label
			continue
		}
		widget.ID = IDName
		var divLabel = this.genImgTag(label);
		if (type == "TAB") {
			if (tabCount > 0) {
				tableBody += `${frm}<tr><td colspan=2 style='text-align:center'>${fGen.hash2arrayValues(bottomTabButtons).join("")}</td></tr></tbody>`;
			} else {
				if (frm != "") tableCommon = `<tbody>${frm}</tbody>`	// common part of all tabs
				tableBody = `<tbody><tr><td colspan=2 id='${formID+"fg_ButtonsTab"}'></tr></td></tbody>`
			}
			if (field[3] != "") divLabel = this.genImgTag(field[3])	// there is title
			var tabID = IDName+"_Table"
			frm = `<tbody class='fg_Table fg_Tab' id='${tabID}'>\n<tr><td class='fg_TabTitle' colspan=3 id='${IDName}'>${divLabel}</th></tr>`
			tabCount++
			var bottomTabButtons = {}
			bottomTabButtons["fg_Reset" + tabCount] = createButton("B fg_Reset" + tabCount + " Reset")
			continue
		}
		widget.tab = tabCount
		if (type == "C") {	// Comment fields
			var style = getParmsKey(extra,"center|right|justify")
			if (style != "") style = "text-align:"+style+";"
			if (fieldLength > 0) style += "display:inline-block;width:"+widget.width+"px"
			var rows = getParms(extra,"rows|row",0)
			if (rows > 0) style += ";height:"+rows*15+"px;overflow:auto"
			wdgTag = `*<span id='${IDName}' class='fg_Comment' style='${style}'>&nbsp</span>`
			if (widget.default == "") widget.default = divLabel
			else widget.default = this.genImgTag(widget.default);
			if (widget.place != "") wdgTag = wdgTag.substring(1)
		}
		if (type == "I") {	// Image field
			var isLabelGraficFile = fGen.hasGraphicFile(label)
			if (widget.default == "") widget.default = isLabelGraficFile ? label : (fGen.hasGraphicFile(field[3]) ? field[3] : "")
			wdgTag = "<span></span><img src='' id='" +IDName + "' class='fg_Image'";
			wdgTag += ((fieldLength != "") ? " height='" + getParms(extra,"height",150) +"'" : "")+"><span></span>";
			if (isLabelGraficFile || label == "") wdgTag = "*"+wdgTag;
		}
		if (type == "B") {
			wdgTag = createButton(field)
			if (!has(extra,"inline")) {
				if (!has(extra,"after|below")) {
					if (tabCount > 0) bottomTabButtons[name] = wdgTag
					else bottomButtons[bottomButtons.length] = wdgTag
				}
			} else wdgTag = "*" + wdgTag	// mark inline
		}
		if (type == "CKB") {	// Check box *******************
			wdgTag = "<input type='checkbox' id='"+IDName+"' name='"+name+"'" + (has(extra,"on") ? " checked " : "") + "/> "
			+ fGen.translate(extra[0]);
			if (widget.default == "") widget.default = "On"
		} else if (type == "CKL") {		// Check list ******************
			var aItems = this.splitKeyValue(extra[0]);
			hiddens[name] = 0
			widgets[name].type = "integer"
			aItems.forEach(aItem => {
				widgets[aItem[0]] = Array("CKB",aItem[0],aItem[1]);	// complete widgets
				if (aItem[0] == widget.default) widgets[aItem[0]][3] = "on"
				widgets[aItem[0]].default = "On"
				wdgTag += `<input type=checkbox id='${prefix+aItem[0]}' name='${aItem[0]}'/>${this.genImgTag(aItem[1])}<br>`
			})
			wdgTag = wdgTag.substring(-4)
		} else if (type == "CMB" || type == "L") {	// combo and List **************
			loneField = name
			if (type == "CMB") {
				hiddens[name + "_Group"] = ""
				hiddens[name + "_Exposed"] = ""
				wdgTag = "<SELECT id='"+IDName + "' name='"+name +"'>"+this.createOptions(IDName,extra[0])+"</SELECT>";
				var parm2 = has(extra,"exposed") ? 1 : (has(extra,"group") ? -1 : 0)
				if (has(extra,"link")) fg_setEvent(name,{event:"change",call:this.fg_link,field:name,parm:getParms(extra,'link',""),parm2:parm2})
			} else {
				wdgTag = `<input name='${name}' id='${IDName}' list='${IDName + "_List"}'/>`
				+ `<datalist name='${name}' id='${IDName + "_List"}'>${this.createOptions(IDName + "_List",extra[0])}</datalist>`
				wdgTag += this.createErase(IDName,widget.default);
			}
		} else if (type == "S") {			// ***************** Slider *********************
				var min = Number(getParms(extra,"From",0));
				var max = Number(getParms(extra,"To",100));
				if (min > max) [min,max] = [max,min]	// swap
				var step = getParms(extra,"Step",(max-min)*0.01);
				if (step > 1) step = Math.trunc(step)
				wdgTag = `\n<input type=range id='s_${IDName}' min='${min}' max='${max}' step='${step}'`
				wdgTag += " onChange='this.nextSibling.value = this.value'";
				wdgTag += ` style='width:${fieldLength}px;vertical-align:middle'/><input type=text readonly id='${IDName}' name='${name}' class='fg_Slider'>`;
		} else if (type == "T") {		// Text fields **************
			loneField = name
			widget.hint = fGen.translate(getParms(extra,"hint",""))
			if (fieldLength > llText || has(extra,"rows?|cols?")) {
				fieldLength = getParms(extra,"width",50);
				wdgTag = `<textarea cols=${getParms(extra,"cols?",Math.min(50,fieldLength))} rows=${getParms(extra,"rows?",Math.ceil(fieldLength / llText))}`
					+ ` placeholder='${widget.hint}' id='${IDName}' name='${name}' class='fg_TextArea'></textarea>`;
				if (!has(extra,"disabled")) wdgTag += this.createErase(IDName,widget.default);
			} else {
				var inputType = getParmsKey(extra,"password","text")
				var fileAttrib = ""
				if (has(extra,"file")) {
					inputType = "file"
					jsForm.encoding = "F";
					fileAttrib = (has(extra,"accept|filter")) ? " accept='"+getParms(extra,"accept|filter","")+"' ":"";
				}
				var txtType = getParmsKey(extra,numericTypes,"text")
				if (!has(extra,"width")) widget.width = numberLength[txtType]
				widget.type = txtType
				wdgTag = `<input type='${inputType}' id='${IDName}' name='${name}' size='${widget.width}' ${fileAttrib} value=''`
				if (txtType != "text") {
					wdgTag += " class='fg_Number'";
					fg_setEvent(name,{event:"keyup",call:fg_handleInput,field:name})
					if (txtType == "float") this.addControl(controls,name,Array("is","^[+-]?(?:\\d+|\\d+\\.\\d+)$","Incorrect number"))
					if (txtType == "integer") this.addControl(controls,name,Array("is","^[+-]?\\d+$","Incorrect number"))
				}
				if (widget.hint != "" && widget.hint.length > widget.hint) widget.title = widget.hint
				else if (widget.hint != "")	wdgTag += ` placeholder='${widget.hint}'`
				wdgTag += !has(extra,"disabled") ? "/>"+this.createErase(IDName,widget.default) : "/>";
				if (has(extra,"password")) wdgTag += `<span class='fg_See' onClick='alert($("${IDName}").value)'>&#x1F441;</span>`;
			}
		} else if (type == "R") {		// *************** Radio buttons *******************
			loneField = name
			var aItems = this.splitKeyValue(extra[0]);
			var rdbs = []
			aItems.forEach(aItem => {
				rdbs.push(`<input type=radio name='${name}' id='${IDName+aItem[0]}' value='${aItem[0]}'/>${this.genImgTag(aItem[1])}`)
			})
			wdgTag = rdbs.join(has(extra,"vertical")?"<br>":"")+ `\n<input type=radio name='${name}' id='${IDName}' value='' CHECKED style='display:none'>`;
		} else if (type == "DATE") {
			loneField = name
			wdgTag = `<input type='date' name='${name}' id='${IDName}' data-value=''>`;
			fg_setEvent(name,{event:"change",call:this.dateChanged})
		}
//		control after field existence
		if (widget.place != "" && widgets[widget.placeField] == undefined) {
				widget.place = ""
				console.log("field",widget.placeField,"doesn't exists")
		}
		if (wdgTag.startsWith("*")) frm += "\n<tr><td colspan='3'>" + wdgTag.substring(1)	// no label (inline buttons and comments)
		else if (widget.place == "" && type != "B") { // no after|below
			frm += "\n<tr><td class='fg_Label'>"+divLabel+"</td><td"+(wdgTag.substring(0,5) == "<text" ? " class='fg_alignAfter'":"")+">"+wdgTag;
		} else {
			widget.placeValue = (type != "B" && type != "CKB" && type != "C") ? `<span class='fg_Label'>${divLabel}</span>${wdgTag}` : wdgTag;
		}
	}
	if (tabCount > 0) {
		tableBody += `${frm}<tr><td colspan=2 style='text-align:center'>${fGen.hash2arrayValues(bottomTabButtons).join("")}</td></tr></tbody>`;
	} else tableCommon = "<tbody>"+frm+"</tbody>"
	if (typeOfButton != 0 && bottomButtons.length > 0) tableFoot = `<tfoot id="${formID}fg_Buttons"><tr><td colspan=2 class='fg_Buttons'>${bottomButtons.join("")}</td></tr></tfoot>`
	$(idDiv).innerHTML = `<div style='display:table' id="${formID}fg_Grid">
	<FORM id='${formID}' method='POST' class='fg_Form'>
<table class='fg_Table' id='${formID+"_Table"}' style='visibility:hidden'>
${tableHead}
${tableCommon}
${tableBody}
${tableFoot}
</table>
</FORM></div>`
	// add buttons after/below, titles, class, ...	*********************
	var iTab = 0
	Object.keys(widgets).forEach(f => {
		var place = widgets[f].place
		const [type,name,label,...extra] = widgets[f];
		if (place == "after" || place == "below") {
			var afterField = widgets[f].placeField
			if (widgets[afterField][0] == "FORM" || widgets[afterField][0] == "TAB") {
				$(widgets[afterField].ID).innerHTML +=  widgets[f].placeValue
				$(widgets[f].ID).style.cssText = "position:absolute;right:0;top:0"
			} else $(prefix+afterField).parentNode.innerHTML += ((place == "after") ? "" : "<br>") + widgets[f].placeValue
		}
		if (has(extra,"class")) $(widgets[f].ID).classList.add(getParms(extra,'class'))
		if (has(extra,"title")) $(widgets[f].ID).setAttribute("title",fGen.translate(getParms(extra,'title')))
		if (has(extra,"color")) $(widgets[f].ID).style.color = getParms(extra,'color')
		if (type == "T" && has(extra,"disabled")) {
			$(widgets[f].ID).classList.add("fg_UType")
			$(widgets[f].ID).setAttribute("readonly",true)
		}
		if (has(extra,"multiple")) {
			$(widgets[f].ID).multiple = true
			$(widgets[f].ID).setAttribute('name',name+"[]")
		}
		if (type == "TAB") {
			var buttonTabID = prefix + name + "_Tab"
			var b = `<button type='button' name='${name}' id='${buttonTabID}' class='fg_ButtonTab'>${fGen.translate(label)}</button>`
			$(formID+"fg_ButtonsTab").innerHTML += b
			$(buttonTabID).style.background = jsForm.ground
			var tab = $(prefix + name + "_Table");
			if (iTab++ < 1) {
				var firstTabID = tab
				$(prefix + name + "_Tab").style.cssText = `border-bottom: 1px solid ${jsForm.ground}`
				$(formID+"fg_ButtonsTab").addEventListener("click",fg_handleTab.bind(event))
			} else {
				$(prefix + name + "_Tab").style.color = "#aaa"
				tab.style.cssText = "display:none;"
			}
		}
	})
	//	 add hidden	****************************
	Object.keys(hiddens).forEach(f => {
		var hidden = $(formID).appendChild(fGen.createNode("input",prefix+f))
		hidden.setAttribute("type","hidden");
		hidden.setAttribute("name",f);
		hidden.setAttribute("value",hiddens[f]);
	})
	// add pointers	*****************************
	$(formID).fg_check = check.bind(this)
	$(formID).fg_createOptions = this.createOptions.bind(this)
	$(formID).fg_formFields = formFields.bind(this)
	$(formID).fg_jsForm = jsForm
	$(formID).fg_setValue = setValue.bind(this)
	$(formID).fg_widgets = widgets
// add events ***********************************
	Object.keys(events).forEach(f => {
		var eField = prefix+f
		if ($(eField) == null) console.log(eField + ": event field not present")
		else {
			events[f].forEach((el) => {
				var evnt = el.event == "enter" ? "keydown" : el.event
				if ($(eField).type == "radio") {
					const wdgs = $(formID).elements;
					for (let i = 0; i < wdgs.length; i++) {
						if (f == wdgs[i].name) $(wdgs[i].id).addEventListener(evnt,fg_handleEvents.bind(event,$(formID),events[f],el.count));
					}
				} else {
					$(eField).addEventListener(evnt,fg_handleEvents.bind(event,$(formID),events[f],el.count));
				}
			})
		}
	})
	// add lone events widget without buttons
	if (lone < 3 && lone != 0 && jsForm.static != 1) {
		switch (widgets[loneField][0]) {
			case "CMB": case "DATE":
				$(prefix+loneField).addEventListener("change",fg_handle.bind(event,$(formID),loneField))
				break
			case "T": case "L":
				if (has(widgets[loneField].slice(3),"file")) $(prefix+loneField).addEventListener("change",fg_handle.bind(event,$(formID),loneField))
				else $(prefix+loneField).addEventListener("keydown",fg_handleEnter.bind(event,$(formID),loneField));
				break
			case "R":
				$(formID).elements[loneField].forEach(radio => {
					$(radio.id).addEventListener("change",fg_handle.bind(event,$(formID),loneField))
				});
		}
	} else {
		$(formID).addEventListener("keydown", function(event) {
			if (event.key === "Enter") {
			event.preventDefault(); 	// Prevent form submission
		}
	   });
	}
/********************  handle GET pseudo type ********************/
	var ajaxCount = [0];
	for (var i=0;i<aGets.length;i++) {
		var [name, url,timeout] = aGets[i];	// GET,[* | name],URI[,timeout]
		ajaxCount[0]++;
		this.ajax(url,formID,saveDefault,name,"",ajaxCount)
		var timeout = parseInt(timeout,10);
		if (timeout > 99) intervals.push(setInterval(this.ajax.bind(),timeout,url,$(formID),fGen.fg_Set,name));	// recurrent requests
	}
	var totalWait = aGets.length * 2000
	const waitx = (delayTime) => new Promise((resolve) => setTimeout(resolve, delayTime));
	async function waitAjax(totalWait) {
		for(let t = totalWait;t > 0;t-=500) {
			await waitx(500);
			if (ajaxCount[0] == 0) break
		}
		if (ajaxCount[0] > 0) alert("Ajax timeout after "+totalWait + "ms");
		fGen.prototype.setDefaults($(formID),0);	// set defaults
		setTimeout((firstTabID) => {
			if ($(idDiv).classList.contains("fg_PopUp") || jsForm.top > -1 || jsForm.left > -1) {
				fGen.setObjPosition(idDiv,jsForm.top,jsForm.left)
				if ($(idDiv).classList.contains("fg_PopUp") && $(jsForm.ID)) $(jsForm.ID).addEventListener("mousedown", fGen.dragStart.bind(null,idDiv))
			}
			$(formID+"_Table").style.visibility = "visible"
			if (firstTabID != null) firstTabID.style.cssText = "visibility:visible;";
		}, 500)
		if (idDiv == "fg_Dummy") {fGen.fragment = $(idDiv);return}
		if (jsForm.eventOnStart != "") window[jsForm.eventOnStart]($(formID))
	}
	waitAjax(totalWait)
	return
}
}
fGen.prototype.ajax = function(url,frm,handler,parm1,parm2,ajaxCount) {
	var data = (typeof(frm) == "string")? frm :new FormData(frm);
	var ajx = new XMLHttpRequest();
	var fnz = function (count) {
		if (ajx.readyState == 4) {
			if (ajx.status == 200) {
				if (count != undefined) count[0]--
				var rsp = ajx.responseText
				if (handler != "") {
					if(typeof handler == "function") handler(rsp,frm,parm1,parm2)	// object function
					else if (typeof window[handler] == "function") window[handler](rsp,frm,parm1,parm2)
					else if (typeof fGen[handler.replace(/^fGen\./,"")] == "function") fGen[handler.replace(/^fGen\./,"")](rsp,frm,parm1,parm2)
					else console.log(handler,"isn't a function")
				}
			} else alert(`Error: ${ajx.status}, ${ajx.statusText}`);
		}
	}
	ajx.onreadystatechange = fnz.bind(event,ajaxCount)
	ajx.open("POST", url, true)
	if (typeof data != "object") {ajx.setRequestHeader("Content-type", "application/x-www-form-urlencoded")}
	ajx.send(data);
}
fGen.prototype.showData = function(data) {
	var r = "<table class='fg_Table'>";
	Object.keys(data).sort().forEach(key => {r += "<tr><td>"+key+"<td>"+data[key]});
	return r+"</table>";
}
fGen.prototype.setDefaults = function(frm,tab) {
	var widgets = frm.fg_widgets;
	for (var i in widgets) {
		if ((tab > 0 && tab == widgets[i].tab) || tab == 0 || tab  < 1) {
			frm.fg_setValue(widgets[i][1],widgets[i].default)
		}
	}
	if (tab < 1) frm.fg_formFields(frm);	// save initial form values
}