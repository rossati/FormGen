// jsForm generator ************************
// formgen 0.4.4 15 January 2026
// free to use but no warranties
// El Condor - Condor Informatique - Turin
// *****************************************
if (typeof(window.$) != "function") var $ = id => document.getElementById(id);  // wrap getElementById
window.fGen = class fGen {
	static version = "0.4.4 15 January 2026";
	static formCount = 0;	// for form without name or popup form
	static lengths = {S:150,T:20,C:0,L:0,CMB:0,R:0,B:80}	// if no length is provided
	static createNode(tag,id,style) {
		var node = document.createElement(tag);
		if (typeof id == "object") {
			Object.keys(id).forEach(Attribute  => {node.setAttribute(Attribute,id[Attribute])})
		} else {
			if (id) node.setAttribute("id",id);
		}
		if (style) node.style.cssText = style;
		return node;
	}
	static setHiddenNode(frm,name,value) {
		if (frm[name] == undefined) frm.appendChild(fGen.createNode("input",{type:"hidden",name:name}))
		frm[name].value = value;
	}
	static getFormData(frm) {
		if (frm.tagName == "FORM") return new FormData(frm);		// form
		if (frm instanceof FormData) return frm;					// FormData
		if (typeof frm == "string") return new URLSearchParams(frm);// key=value&key=value...
		const frmData = new FormData();
		if (typeof frm == "object") {								// key;data
			Object.keys(frm).forEach(el  => frmData.append(el,frm[el]));
			return frmData;
		}
		return frm;
	}
	static getHTML = frm => {
		const f = $(frm);
		return ((f && f.tagName == "FORM")  ? `<Form>\n${f.innerHTML}\n</Form>\n<Style>\n${$(frm+"fg_CSS").innerHTML}\n</Style>` 
											: frm + " inexistent or not a Form id");
	}
	static createWidget(id,list) {
		if ($(id)) {
			new fGen("fg_Dummy",list)
			$(id).form.appendChild(fGen.fragment.hiddensFieldSet)
			console.log($(id).form.fg_jsForm)
			fGen.fragment.querySelectorAll('*[id]').forEach((w) => {w.setAttribute("id",$(id).form.fg_jsForm.prefix+w.id);});
			console.log(fGen.fragment.querySelectorAll('*[id]'))
			var table = fGen.fragment.querySelector(".fg_Table")
			if ($(id).closest("tr") != null) while (table.rows.length > 0) {
				$(id).closest("tr").after(table.rows[table.rows.length-1])
			}			
		} else console.log(id,"id non existent")
	}
	static deleteWidget = (idx,parm) => {
		if (parm != undefined && parm != "") idx = parm;
		const id = $(idx);
		if (id == null) console.log("Attempt to remove non existent id:",idx)
		else {
			if(id.nodeName == "FORM") id.remove()
			else {
				var frm = id.closest("tr").dataset.form
				if (!frm) id.closest("tr").remove()
				else document.querySelectorAll(`[data-form="${frm}"]`).forEach(item => {item.remove()});
			}
		}
	}
	static getAddedWidgets = id => document.querySelector("#"+id).querySelectorAll('[data-form]')
	static fragment = ""
	static extractTokens(s, quotes) { // quotes true returns quotes
		if (!quotes) var quotes = false
		const reSplitTokens = /("[^"]*")|('[^']*')|(\S+)/g	// thank to Taky
		var matchs = [...(s).matchAll(reSplitTokens)]		// ... copies array
		var a = matchs.map(match => {
			if (!quotes && !match[3]) {	// if match[3] there aren't quotes
				match[0] = match[0].substr(1,match[0].length -2);
			}
			return match[0];
		});
		return a
	}
	static fieldExist = (frm,field) => {
		var bool = $(frm.fg_jsForm.prefix+field);
		if (!bool) console.log("field",field,"non existent");
		return bool;
	}
	static fg_alert = (name,parm) => {if (typeof parm === "object") parm = name;alert(fGen.translate(parm))}
	static fg_enable = (name,target,frm) => {if (fGen.fieldExist(frm,target)) frm[target].disabled = false}
	static fg_disable = (name,target,frm) => {console.log(frm,target);if (fGen.fieldExist(frm,target)) frm[target].disabled = true}
	static fg_switch = (name,target,frm) => {if (fGen.fieldExist(frm,target)) frm[target].disabled = !frm[target].disabled}
	static fg_dictionary = {};
	static fg_Set(rsp,frm,fld) {
		var prefix = frm.fg_jsForm.prefix
		if (!$(prefix+fld) && !$(fld)) console.log("field",fld,"or id non existent")
		else {
			const handle = $(prefix+fld) ? $(prefix+fld) : $(fld)
			switch (handle.nodeName) {
				case "IMG":
					if (fGen.hasGraphicFile(rsp)) fGen.showImage(handle.id,rsp)
					break;
				case "INPUT":
				case "TEXTAREA":
					if (handle.list && rsp.split(/,\s*/).length > 1) {	// is list type
						handle.form.fg_createOptions(handle.list.id,rsp);
					} else handle.value = rsp;
					break;
				case "SELECT":
					var comboName = handle.name.replace("[]","")
					if (frm.fg_widgets[comboName][3] != "") rsp = `${frm.fg_widgets[comboName][3]},${rsp}`
					handle.form.fg_createOptions(handle.id,rsp);
					break;
				default: handle.innerHTML = rsp;
			}
		}
	}
	static isFunction = fnz => {
		var a = fnz.split(/\./)
		if (a.length == 1 && typeof window[a[0]] == "function") return window[a[0]]
		else if (a.length == 2 && window[a[0]] && typeof window[a[0]][a[1]] == "function") return window[a[0]][a[1]]
		return false
	}
	static setObjPosition = function(link,top,left) {
		link.style.top = (top  > -1 ? top : 0.5 * (window.innerHeight - link.offsetHeight))+"px";
		link.style.left = (left > -1 ? left : 0.5 * (window.innerWidth - link.offsetWidth))+"px";
	}
//*******************************************************************
// Source of Mike Hall modified by El Condor March 2021 October 2024
//*******************************************************************
	static dragObj = {};
	static dragStart(id) {
		fGen.dragObj[id] = {elNode: $(id)}
		var dragObj = fGen.dragObj[id]
		dragObj.first = true
		dragObj.startLeft = parseInt(dragObj.elNode.style.left, 10);
		dragObj.startTop = parseInt(dragObj.elNode.style.top, 10);
		if (isNaN(dragObj.startLeft)) dragObj.startLeft = 0;
		if (isNaN(dragObj.startTop)) dragObj.startTop = 0;
		var x = dragGo.bind(event,dragObj)
		document.addEventListener("mousemove", x, true);// Capture mousemove and mouseup events on the page.
		document.addEventListener("mouseup", (id) => {delete fGen.dragObj[id];document.removeEventListener("mousemove", x, true)}, {once: true});
		function dragGo(dragObj,event) {
			var x = event.clientX + window.scrollX;		// Get cursor position respect to the page.
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
	static hasGraphicFile = f => /.+?\.(png|gif|jpe?g|ico|bmp)([:\t].+)?/i.test(f)
	static isGraphicFile = f => /.+?\.(png|gif|jpe?g|ico|bmp)$/i.test(f)
	static showData(data) {
		var r = "<table class='fg_Table'>";
		Object.keys(data).sort().forEach(key => {r += "<tr><td>"+key+"<td>"+data[key]});
		return r+"</table>";
	}
	static showImage(id,rsp) {
		var x = /(?:(?<t1>.*?):)?(?<i>.+\.(png|gif|jpe?g|ico|bmp))(?::(?<t2>.*))?/mi.exec(rsp).groups
		if (x != null) {
			var {t1="", i,t2="" } = x
			$(id).src = i
			if (t1 != "") $(id).previousSibling.innerHTML = t1
			if (t2 != "") $(id).nextSibling.innerHTML = t2
		}
	}
	static timeStamp = d => d.toISOString().slice(0,19).replace("T"," ")
	static convertHex = (w) => w.replace(/\\x[0-9A-F]{1,5};?/gi,s => String.fromCharCode(parseInt("0"+s.substring(1))));
	static translate = (w) => {
		if (/^".*"$|^'.*'$/.test(w)) w = w.substr(1,w.length-2)	// drops quotes
		w = fGen.convertHex(w);
	return (fGen.fg_dictionary[w] == undefined) ? w : fGen.fg_dictionary[w]
}
constructor(idDiv,param) {
	fGen.formCount++
	this.formGen(idDiv,param)
}
addControl(controls,name,control) {
	if (!controls[name]) controls[name] = Array()
	controls[name].push(control);
}
genImgTag(txt) {
	var items = txt.split(/([^\s]+?\.(?:png|gif|jpe?g|ico|bmp))/gmi);
	items.forEach(item => {
		if (fGen.isGraphicFile(item)) txt = txt.replace(item,`<img src='${item}' style='vertical-align:middle'>`)
		else txt = txt.replace(item.trim(0),fGen.translate(item.trim()))
	});
	return txt
}
createErase = (id,value) => `<span class='fg_Erase' onClick='$("${id}").value = "${value}"'>&#x2718;</span>`
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
fg_link(field,link,frm,type) {	// type -1 -> Group, 0 -> key, 1 -> Exposed
	var linkID = $(frm.getAttribute("id") + link) || $(link)
	if (linkID) {
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
	function check(frm) {	// can control all form
		var aErrors = [];
		for (var field in controls) {
			if (fGen.fieldExist(frm,field)) {
				var aItems = controls[field];
				var wdgValue = frm[field].value;
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
							if (fGen.isFunction(operand)) err = (!fGen.isFunction(operand)(frm,field,wdgValue));
							break;
						case "==": case "!=": case ">": case ">=": case "<": case "<=":
							if (wdgValue != "") {
								if (widgets[operand]) operand = $(widgets[operand].ID).value
								if (RegExp(numericTypes).test(widgets[field].type)) err = !eval("Number(wdgValue) "+operator+" operand")
								else err = !eval("wdgValue "+operator+" operand")
							}
					}
					if (err) {
						aErrors[aErrors.length] = field+": " + fGen.translate(signal);
						if (frm[field].style) frm[field].style.borderColor = "red";
					}
				});
			}
		}
		return aErrors;
	};
	function storeDefaults(items) {	// used for store defaults
		if (typeof items == "string") items = JSON.parse(items);
		Object.keys(items).forEach(el  => {
			if (items[el]) {
			if (widgets[el]) widgets[el].default = items[el];
			};
		});
	}
	function fg_setEvent(name,parms) {
		if (!events[name]) events[name] = []
		parms.event = parms.event.toLowerCase()
		events[name][events[name].length] = parms
	}
	function fg_handle(button,parm,frm) {	// send request
		var jsForm = frm.fg_jsForm;
		if (button != "fg_Cancel") {
			var aErrors = check(frm);		// data control ******************
			if (aErrors.length > 0)	return alert("Errors:\n"+aErrors.join("\n"));
			fGen.setHiddenNode(frm,"fg_Button",button)
			var data = fGen.showData(frm.fg_formFields(frm));	// add calculated fields
			if (jsForm.server != "" && jsForm.call == "") {		// only URI
					if (jsForm.encoding) {
						frm.encoding = "multipart/form-data";	// for files
						frm.method = "POST";
					}
					frm.action = jsForm.server;
					frm.target = jsForm.target;
					frm.submit();
			} else if (jsForm.server == "" && jsForm.call != "") {	// only call function
				jsForm.call(frm);
			} else if (jsForm.server != "" && jsForm.call != "") {	// call Ajax receive in function
				if (jsForm.encoding) frm.encoding = "multipart/form-data";	// for files
				fGen.prototype.ajax(jsForm.server,frm,jsForm.call,jsForm.parm);
			} else {												// no uri no function
				if(jsForm.static == 0) {
					setTimeout(d => {new fGen("",d)},100,`Form ${"fg_C"+fGen.formCount} '${jsForm.title}'\nC '' "${data}"`)
				}
			}
		}
		if (jsForm.static == 0 || button == "fg_Cancel" ) {	// clean
			intervals.forEach((h) => clearInterval(h));
			frm.remove()
			$(frm.id+"fg_CSS").remove()
			if (jsForm.popUp) $(idDiv).remove()
		} else if (jsForm.static == 2) {
			setTimeout(function(){fGen.prototype.setDefaults(frm,0)},100);		// 1 static, 2 reset form
		}
	}
	function fg_handleAjax(fnz,frm,jsFnz,parm,parm2,event) {
		fGen.setHiddenNode(frm,"fg_Button",event.target.name)
		frm.fg_formFields(frm);		// add the calculated fields
		fGen.prototype.ajax(fnz,frm,jsFnz,parm,parm2);
	}
	function fg_handleEnter(frm,field,fnz,parm) {	// for capture enter key
		if (event.key == "Enter") {
			event.preventDefault();
			if (typeof fnz == "function") fnz(field,parm,frm)
			else fg_handle(event.target.name,"",frm);
		}
	}
	function fg_handleInput(field,parm,frm) {	// for check numeric
		if (!fg_handleInput.re) fg_handleInput.re = {positive:/[^\d]/,integer:/[^-\d]/,float:/[^-.\d]/}
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
	const fg_handleTab = () => {
		if (event.target.type == "button") {
			Array.from(document.getElementsByClassName("fg_Tab")).forEach(tab => {
				if (tab.style.display != "none") {
					tab.style.display = "none";
					$(tab.id+"_Tab").style.cssText = "color: #aaa"
				}
			});
			var tab = $(jsForm.prefix + event.target.name)
			tab.style.cssText = "visibility:visible";
			event.target.style.cssText = `color: black`
		}
	}
	var fg_setDefaults = (target,parm,frm) => {this.setDefaults(frm,parm);}
	function createButton(f) {
		if (typeof f == "string") f = fGen.extractTokens(f)
		var [type,name,caption,...extra] = f
		caption = fGen.prototype.genImgTag(caption)
		var cls = fGen.hasGraphicFile(f[2]) ? "fg_GButton" : (caption.length == 1 || /^&#([0-9]{1,6}|x[0-9A-F]{1,6});$/i.test(caption)) ? "fg_CButton" : "fg_Button"
		var widthStyle = "";
		var fieldLength = getParms(extra,"width",0)
		if (fieldLength > 0) widthStyle = `style='width:${fieldLength}px'`
		else {
			if (caption.length == 1) widthStyle = `style='width:20px'`
			else if (cls != "fg_GButton") widthStyle = `style='width:${fGen.lengths["B"]}px'`
		}
		cls = getParms(extra,"class", cls)
		var b = `\n<button type=button name='${name}' id='${jsForm.prefix + name}' ${widthStyle}`
		if (/^fg_Reset\d*/.test(name)) fg_setEvent(name,{event:"click",call:fg_setDefaults,parm:name.replace(/^fg_Reset(\d*)/,(match, p1) => p1 != "" ? p1 : "0")})
		else {
			if (events[name] == undefined) fg_setEvent(name,{event:"click",call:fg_handle,field:name})
		}
		b += ` class='${cls}'>${caption}`
		return b+`</button>${(f.inline) ? fGen.translate(f.inline) : ""}`;
	};
	const contains = (h,parm,v) => {	// v is an array that contain index and token found
		const re = new RegExp("^("+parm+")\\s*=\\s*(.*)|^("+parm+")$","i");
		let array;
		for (let i=0;i<h.length;i++)  {
			array = re.exec(h[i])
			if (array !== null) {
				if (v) {
					v[0] = i;
					for (k=1,j=1;j < array.length;j++) {if (array[j] != undefined) v[k++]= array[j]}
				}
				return i;
			}
		}
		return -1;
	};
	var getCallParms = function(h,obj,wdg) {
		obj.call = getParms(h,"call",0)
		obj.parm = "";
		if (obj.call != 0) {
			var a = obj.call.split(/\s+/);
			obj.call = fGen.isFunction(a[0]);		// function
			if (a.length > 1) obj.parm = a[1];		// parameter
			if (!obj.call) {wdg[wdg.length] = `C '' "${a[0]} isn't a function" class fg_Error`}
		}
	}
	var getParms = function(h,parm,def) {
		var v = []
		const indx = contains(h,parm,v)
		if (indx == -1) return def ? def : ""
		if (v.length > 2) return v[2];
		return indx < h.length-1 ? h[indx+1] : (def != undefined ? def : "")
	}
	var getParmsKey = function(h,parm,def) {
		var v = []
		const indx = contains(h,parm,v);
		if (indx == -1) return def != undefined ? def : ""
		return v[1].toLowerCase()
	}
	var has = (h, parm,v) => contains(h,parm,v) > -1 ? true:false
	var normalizeLabel = l => {
		l = l.replace(/(_[a-zA-Z0-9])/, x => " " +x.substr(1,1).toLowerCase())			// aaa_bbb
		l = l.replace(/([a-z])([A-Z])/, (mtch,p1,p2) => p1+" " +p2.toLowerCase())	// aaaBbb
		return l.substr(0,1).toUpperCase() + l.substr(1)
	}
	var saveDefault = function(c,frmID,name,parm) {	// for combo, list and defaults
		if (parm != "" && fGen.isFunction(parm)) c = fGen.isFunction(parm)(c,$(frmID))
		if (!c) return;
		if (name.endsWith('*')) {storeDefaults(c)}	// this is the default list
		else {
			if (fGen.fieldExist($(frmID),name)) {
				if (widgets[name][0] != "CMB" && widgets[name][0] != "L") widgets[name].default = c
				else fGen.fg_Set(c,$(frmID),name)
			}
		}
	}
	var setValue = function(fld,value) {
		var type = widgets[fld][0];
		var id = jsForm.prefix+fld;	// control id
		if ($(id)) {
			if (/^(T|H|L|S)$/.test(type)) {
				$(id).value = value;	// text and hiddens
				if (type == "S") $("s_"+id).value = value
			} else if (type == "CMB") {
				if (value == "") $(id).selectedIndex = -1
				else {
					$(id).value = value;
					if ($(id).options.selectedIndex == -1) console.log("Default value",value,"for",fld,"not in list")
				}
			} else if (type == "C") {
				$(id).innerHTML = value
			} else if (type == "DATE") {
				if (value.toLowerCase() == "today") {
					$(id).value = new Date().toISOString().slice(0,10)
				} else $(id).value = value
			} else if (type == "B") {
				$(id).disabled = has(widgets[fld].slice(3),"disabled")
			} else if (type == "R") {
				if ($(id+value) != null) $(id+value).checked = true;
				else console.log("Default value",value,"for",fld,"not in list")
			} else if (type == "CKB") {
				$(id).checked = has(widgets[fld].slice(3),"on")
				$(id).value = value
			} else if (type == "I" && value != "") fGen.showImage(id,value);
		}
	}
	var formFields = function(frm) {
		if (typeof frm == "string") frm = $(frm)
		var f = {};
		Array.from(frm.elements).forEach((field) => {
			name = field.name.replace("[]","");
			switch (field.type) {
				case "checkbox":
					f[name] = (field.checked) ? field.value : "";
					break;
				case "radio":
					if (field.checked) f[name] = field.value;
					break;
				case "select-multiple": case "select-one":
					var grp = {};
					f[name] = []
					f[name+"_Exposed"] = Array.from(field.options).filter(j => j.selected).map(j => {
						f[name].push(j.value);
						const optg = j.parentNode;
						if (optg.nodeName == "OPTGROUP") grp[optg.label] = ""
						return j.text;
					}).join(", ");
					f[name] = f[name].join(", ");
					fGen.setHiddenNode(frm,name+"_Exposed",f[name+"_Exposed"]);
					fGen.setHiddenNode(frm,name+"_Group",Object.keys(grp).join(", "));
					f[name+"_Group"] = frm[name+"_Group"].value;
					break
				default:
					if (field.name != "") f[name] = field.value		// no slider
			}
			if (widgets[name] && widgets[name][0] == "CKL") {
				f[name] = 0;
				this.splitKeyValue(widgets[name][3]).forEach(item => {if (frm[item[0]].checked) f[name]++});
				frm[name].value = f[name];
			}
		});
		if (!formFields.formData) formFields.formData = f;
		else {
			const changed = Object.keys(formFields.formData).filter(name => formFields.formData[name] != f[name]).map(name=>name).join(", ");
			fGen.setHiddenNode(frm,"fg_Changed",changed);
			fGen.setHiddenNode(frm,"fg_TimeStamp",fGen.timeStamp(new Date()));
		}
		return f
	}
/* ************************* end some functions *************************/
	var styles = `.fg_Buttons {text-align:center;padding:3px 0}
.fg_Error {color:red}
.fg_Number {text-align:right;margin-right:12px}
.fg_Erase {color:#888;margin-left:-12px}
.fg_See {margin-left:6px;font-size:20px}
.fg_ButtonTab {border-top-right-radius:15px;height:30px;min-width:80px;border:1px solid #000;padding:5px;border-bottom:none;background:rgba(0,0,0,0)}
.fg_Button,.fg_ButtonTab,.fg_Erase,.fg_See,.fg_CButton,.fg_GButton,.fg_CheckBox {cursor:pointer}
.fg_CButton {border:none;background:none;font-size:16px}
.fg_Button:disabled, .fg_GButton:disabled, .fg_CButton:disabled.fg_CheckBox:disabled{cursor: not-allowed;}
.fg_GButton {border:none;background:none}
.fg_Slider {padding-left:5px;border:none;background:rgba(0,0,0,0)}
.fg_UType {border:none;background:rgba(0,0,0,0)}
.fg_alignAfter {display: grid;grid-template-columns: auto auto repeat(2,0.8rem);align-items: center;}`
	var jsForm = {static:0,server:"",call:"",eventOnStart:"",ID:"fg_form"+fGen.formCount,left:-1,prefix:"",
		title:"",target:"_blank",top:-1,popUp:false} // Form data
	if (idDiv.trim() == "") idDiv = "fg_PopUp"+fGen.formCount;
	if(!$(idDiv)) {	// div not present is create as PopUp
		var l = document.body.appendChild(fGen.createNode('DIV',idDiv,"visibility:hidden"));
		l.className = 'fg_PopUp';
		styles += ".fg_PopUp {position:absolute}\n.fg_PopUp .fg_Title {cursor:move}"
		jsForm.popUp = true
	}
	var hiddensFieldSet = fGen.createNode("span",idDiv+"fg_hiddens")
	if (param == "" || !param) var param = "C '' Nodata!";
	var aLists = {};			// Lists and combos array
	var gets = {};				// GETs array
	var widgets = {};			// widgets array and properties
	var events = {};			// key name event = [function, param,...]
	var wdgEvent = {B:"click",T:"enter",R:"change",CKB:"change",CMB:"change",DATE:"change",L:"enter",S:"change"}
	var hiddens = {}			// Hidden data
	var llText = 50;			// limit from text and textarea
	var controls = {}			// controls
	var defaults = {};			// defaults
	var intervals = new Array();	// setInterval handlers
	const numericTypes = "integer|float|positive"
	var bButtons = {fg_Ok:"B fg_Ok Ok",fg_Reset:"B fg_Reset Reset",fg_Cancel:"B fg_Cancel Cancel"}	// bottom buttons
	var tabCount = 0
	const loneTypes = Array("CMB","T","L","DATE","R")
	const otherWidgets = Array("S","CKL")
	var loneField = ""
	var numberLength = {integer:10,float:11,positive:9,text:20}
	var acceptedTypes = {B:"B",C:"C",COMMENT: "C",CKB:"CKB",CKL:"CKL",CMB:"CMB",CONTROL: "CHECK",DEFAULTS:"DEFAULT",DICTIONARY:"DICT",
						I:"I", IMAGE:"I",IMG:"I",L:"L",LIST:"L",R:"R",RDB:"R",REQUIRED:"REQ",S:"S",SLIDER:"S",TAB:"TAB",H:"H",HIDDEN:"H",DATE:"DATE",T:"T",TEXT: "T"}
// ******************************* start build *************************
	var wdg = param.split(/\r\n|\r|\n/)		// all line separators Windows, MacOS, Unix
	var i,j,k;
	var lone = 0;		// count widgets that can be lone
	for (i = 0;i<wdg.length;i++) {
		if (/^\s*$|^\/\/.*/.test(wdg[i])) continue	// empty or comment
		var field = fGen.extractTokens(wdg[i])
		while (field.length < 4) {field.push("")}
		field[0] = field[0].toUpperCase();			// upper-case widget type
		if (acceptedTypes[field[0]] != undefined) field[0] = acceptedTypes[field[0]]
		var [type,name,label,...extra] = field;
		if (type == "FORM") {
			if (name != "" && $(name)) {
				wdg[wdg.length] = `C '' "${name} the form ID exists" class fg_Error`
				field[1] = ""
			}
			jsForm.prefix = field[1]
			if (field[1] == "") field[1] = jsForm.ID	// generated name
			else jsForm.ID = field[1]
			var extra = field.slice(2)
			jsForm.server = getParms(extra,"server")
			if (has(extra,"set")) getCallParms(["call","fGen.fg_Set "+getParms(extra,"set")],jsForm,wdg)
			else getCallParms(extra,jsForm,wdg)	// extract call
			if (has(extra,"ground")) styles += `\n#${jsForm.ID}_Table {background:${getParms(extra,"ground")}}`
			jsForm.ground = getParms(extra,"ground",jsForm.ground)
			jsForm.top = getParms(extra,"top",-1)
			jsForm.left = getParms(extra,"left",-1)
			jsForm.target = getParms(extra,"target","_blank")
			jsForm.title = field[2]
			if (has(extra,"nobutton[s]?")) bButtons = {}
			if (has(extra,"static")) jsForm.static = 1;
			if (has(extra,"reset")) jsForm.static = 2
			jsForm.eventOnStart = getParms(extra,"onStart")
			if (jsForm.eventOnStart != "" && !fGen.isFunction(jsForm.eventOnStart)) {
				wdg[wdg.length] = `C '' "${jsForm.eventOnStart} isn't a function" class fg_Error`
				jsForm.eventOnStart = ""
			}
			widgets[field[1]] = []
			widgets[field[1]].push(...field);
		} else if (type == "CHECK") {
			this.addControl(controls,field[1],field.slice(2))
		} else if (type == "CSS") {
			var css = /css\s+(.+\{.+\})/i.exec(wdg[i]);
			if (css != null) styles += "\n"+css[1]
			else wdg[wdg.length] = `C '' 'CSS incorrect' class fg_Error`
		} else if (type == "DEFAULT") {
			field.slice(1).forEach(el  => {
				const [name,value] = el.replace(/\s*[=]/,"0x00").split("0x00");
				defaults[name] = value})
		} else if (type == "DICT") {
			const fnz = getParms(field,"from");
			if (fGen.isFunction(fnz)) fGen.fg_dictionary = fGen.isFunction(fnz)(getParms(field,fnz));			
			else if (typeof window[field[1]] == "object") fGen.fg_dictionary = window[field[1]];
		} else if (type == "EVENT") {
			for (const name of getParms(field,"on","fg_unknown").split(/\s*,\s*/)) {
				var eventParms = {field:name,event:field[1]}
				var fnz = getParmsKey(field,"alert|call|set|disable|enable|remove|switch")
				if (fnz != "") {
					eventParms.parm = getParms(field,fnz)	// it's Ok for Set and alert
					if (fnz == "set") eventParms.call = fGen.fg_Set
					else if (/disable|enable|switch/.test(fnz)) eventParms.call = fGen["fg_"+fnz]
					else if (fnz == "alert") eventParms.call = fGen.fg_alert
					else if (fnz == "remove") eventParms.call = fGen.deleteWidget;
					else getCallParms(field,eventParms,wdg)
				}
				if (has(field,"submit")) {eventParms.server = "submit"}
				if (has(field,"server")) {eventParms.server = getParms(field,"server")}
				if (typeof eventParms.call == "function" || eventParms.call == undefined) fg_setEvent(name,eventParms)
			}
		} else if (type == "REQ") {
			for (var f of field.slice(1)) {if (f != "") this.addControl(controls,f,Array("is","required","required"))}
		} else if (type == "GET") {gets[field[1]] = {url:field[2],every:getParms(field,"every","0"),call:getParms(field,"call")}
		} else {		// widgets
			if (!acceptedTypes[type]) {field = ["C","fg_" + i, "Unknown type: "+type,"class","fg_Error"]}
			if (field[1] == "") field[1] = "fg_" + i;	// generated name
			if (!/^[a-z][a-z0-9_\-]*$/i.test(field[1])) field = ["C","fg_" + i, "incorrect name: "+field[1],"class","fg_Error"]
			var [type,name,label,...extra] = field;		// necesse est
			widgets[name] = []
			widgets[name].default = fGen.convertHex(getParms(extra,"value|default"))
			widgets[name].place = getParmsKey(extra,"after|below")
			widgets[name].placeField = getParms(extra,"after|below","")
			if (loneTypes.indexOf(type) > -1) {
				lone++;
				loneField = name;
			} else if (otherWidgets.indexOf(type) > -1) lone += 1024;
			var field2 = fGen.extractTokens(wdg[i], true)	// token with delimiters
			if (type != "I" && label == "") {
				field[2] = normalizeLabel(field[1]);
				field2[2] = `'${field[2]}'`
			}
			widgets[name].source = field2.join(" ")
			widgets[name].push(...field);
			var parmValue = [];
			if (contains(field.slice(2),"event",parmValue) > 0) {
				wdg[wdg.length] = `Event ${field2[parmValue[0]+3]} on ${name} ${field2.slice([parmValue[0]+4]).join(" ")}`
			} else if (contains(field.slice(2),"call|submit|alert|server|disable|enable|remove|switch",parmValue) > 0) {
				if (wdgEvent[type] != undefined) {
					wdg[wdg.length] = `Event ${wdgEvent[type]} on ${name} ${field2.slice(parmValue[0]+2,parmValue[0]+4).join(" ")}`
					if (/server/i.test(field2[parmValue[0]+2])) {
						var iCall = contains(field.slice(2),"call|alert|set")
						if (iCall > -1) wdg[wdg.length-1] += " " + field2.slice(iCall+2,iCall+4).join(" ")
					}
				}
			}
		}
	}
	if ((lone & 0x3FF) == 1 && lone >> 10 == 0) bButtons = {}
	else if ((lone & 0x3FF) == 0 && lone >> 10 == 0) {
		delete bButtons.fg_Ok
		delete bButtons.fg_Reset
	}
	var prefix = jsForm.prefix
	var formID = jsForm.ID
	var tableHead = (jsForm.title != "") ? `<thead><tr><th colspan=2 id='${jsForm.ID}_Title' class='fg_Title'>${this.genImgTag(jsForm.title)}</td></tr></thead>` : ""
	var tableCommon = ""
	var tableBody = ""
	var tableFoot = ""
	var frm =  ""
	var aWidgets = Object.keys(widgets);
	
	storeDefaults(defaults)
	for (i = 0;i < aWidgets.length;i++) {
		var wdgTag = ""
		var field = widgets[aWidgets[i]];
		var [type,name,label,...extra] = field;
		var widget = widgets[name]
		const IDName = type != "FORM" ? prefix+name : name;
		widget.ID = IDName
		if (extra.length == 0) extra = [""]
		if (type == "FORM") continue
		if (type == "H") {
			if (widget.default == "") widget.default = label
			hiddens[name] = label
			continue
		}
		var divLabel = this.genImgTag(label);
		if (type == "TAB") {
			if (tabCount > 0) {
				tableBody += `${frm}<tr><td colspan=2 style='text-align:center'>${Object.values(bottomTabButtons).join("")}</td></tr></tbody>`;
			} else {
				if (frm != "") tableCommon = `<tbody>${frm}</tbody>`	// common part of all tabs
				tableBody = `<tbody><tr><td colspan=2 id='${formID+"fg_ButtonsTab"}'></tr></td></tbody>`
			}
			if (field[3] != "") divLabel = this.genImgTag(field[3])	// there is title
			frm = `<tbody id='${IDName}' class='fg_Tab'>\n<tr><td class='fg_TabTitle' colspan='3' id='${widget.ID}_Title'>${divLabel}</td></tr>`
			tabCount++
			var bottomTabButtons = {}
			bottomTabButtons["fg_Reset" + tabCount] = createButton(`B fg_Reset${tabCount} Reset`)
			continue
		}
		widget.tab = tabCount
		if (type == "C") {	// Comment fields
			var style = "text-align:" + getParms(extra,"align","left")
			var fieldLength = Number(getParms(extra,"width",-1))
			if (fieldLength > 0) style += ";display:inline-block;width:"+fieldLength+"px"
			var rows = getParms(extra,"rows|row",0)
			if (rows > 0) style += ";height:"+rows*15+"px;overflow:auto"
			wdgTag = ` id='${IDName}' class='fg_Comment' style='${style}'>`
			if (has(extra,"anchor")) divLabel = `<A href='${getParms(extra,"anchor")}' target='_blank'>${divLabel}</A>`
			if (widget.default == "") widget.default = divLabel
			else widget.default = this.genImgTag(widget.default);
			var tagType = has(extra,"after|below") ? "span" : "div"
			wdgTag = `<${tagType}${wdgTag}</${tagType}>`
			if (widget.place == "") wdgTag = "*"+wdgTag
		}
		if (type == "I") {	// Image field
			var isLabelGraficFile = fGen.hasGraphicFile(label)
			if (widget.default == "") widget.default = isLabelGraficFile ? label : (fGen.hasGraphicFile(field[3]) ? field[3] : "")
			wdgTag = "<span></span><img src='' id='" +IDName + "' class='fg_Image'";
			wdgTag += (has(extra,"height") ? " height='" + getParms(extra,"height") +"'" : "")+"><span></span>";
			if (isLabelGraficFile || label == "") wdgTag = "*"+wdgTag;
		}
		if (type == "B") {
			if(has(extra,"inline")) widget.inline = getParms(extra,"inline")
			wdgTag = createButton(field)
			if (!has(extra,"inline")) {
				if (!has(extra,"after|below")) {
					if (tabCount > 0) bottomTabButtons[name] = wdgTag
					else {
						bButtons[name] = widget.source
						if (!/fg_Cancel|fg_Reset|fg_Ok/.test(name)) delete bButtons.fg_Ok;
					}
				} else {if (name == "fg_Cancel") delete bButtons.fg_Cancel;}
			} else wdgTag = "*" + wdgTag	// mark inline
		}
		if (type == "CKB") {	// Check box *******************
			wdgTag = `<input type='checkbox' id='${IDName}' name='${name}'${(has(extra,"on") ? " checked" : "")} class='fg_CheckBox'/> ${fGen.translate(extra[0])}`
			if (widget.default == "") widget.default = "On"
		} else if (type == "CKL") {		// Check list ******************
			var aItems = this.splitKeyValue(extra[0]);
			hiddens[name] = 0
			widgets[name].type = "integer"
			aItems.forEach(aItem => {
				widgets[aItem[0]] = Array("CKB",aItem[0],aItem[1],(aItem[0] == widget.default) ? "on" : "");	// complete widgets
				widgets[aItem[0]].default = "On"
				wdgTag += `<input type=checkbox id='${prefix+aItem[0]}' name='${aItem[0]}' class='fg_CheckBox'/>${this.genImgTag(aItem[1])}<br>`
			})
			wdgTag = wdgTag.substring(-4)
		} else if (type == "CMB" || type == "L") {	// combo and List **************
			if (type == "CMB") {
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
				var edit = has(extra,"edit(?:able)?") ? "" : "readonly "
				wdgTag = `\n<input type=range id='s_${IDName}' min='${min}' max='${max}' step='${step}' onInput='this.nextSibling.value = this.value'`
				wdgTag += ` style='width:${getParms(extra,"width",fGen.lengths.S)}px;vertical-align:middle'/><input type=text size='10' ${edit}id='${IDName}' name='${name}' class='fg_Slider'>`;
				widget.type = "float"
		} else if (type == "T") {		// Text fields **************
			widget.hint = fGen.translate(getParms(extra,"hint",""))
			var fieldLength = Number(getParms(extra,"width","50"))
			if (fieldLength > llText || has(extra,"rows?|cols?")) {
				wdgTag = `<textarea cols=${getParms(extra,"cols?",Math.min(50,fieldLength))} rows=${getParms(extra,"rows?",Math.ceil(fieldLength/llText))}`
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
				widget.type = getParmsKey(extra,numericTypes,"text")
				var textLength = contains(extra,"width") ? numberLength[widget.type] : Number(getParms(extra,"width"))
				wdgTag = `<input type='${inputType}' id='${IDName}' name='${name}' size='${textLength}'${fileAttrib} value=''`
				if (widget.type != "text") {
					wdgTag += " class='fg_Number'";
					fg_setEvent(name,{event:"keyup",call:fg_handleInput,field:name})
					if (widget.type == "float") this.addControl(controls,name,Array("is","^[+-]?(?:\\d+|\\d+\\.\\d+)$","Incorrect number"))
					if (widget.type == "integer") this.addControl(controls,name,Array("is","^[+-]?\\d+$","Incorrect number"))
				}
				if (widget.hint != "" && widget.hint.length > widget.hint) widget.title = widget.hint
				else if (widget.hint != "")	wdgTag += ` placeholder='${widget.hint}'`
				wdgTag += !has(extra,"disabled") ? "/>"+this.createErase(IDName,widget.default) : "/>";
				if (has(extra,"password")) wdgTag += `<span class='fg_See' onClick='alert($("${IDName}").value)'>&#x1F441;</span>`;
			}
		} else if (type == "R") {		// *************** Radio buttons *******************
			var aItems = this.splitKeyValue(extra[0]);
			var rdbs = []
			aItems.forEach(aItem => {
				if (events[name]) {	// generate events for all buttons
					events[name].forEach(el => {el.field = name+aItem[0]});
					events[name+aItem[0]] = events[name]
				}
				rdbs.push(`<input type=radio name='${name}' id='${IDName+aItem[0]}' value='${aItem[0]}'/>${this.genImgTag(aItem[1])}`)
			});
			if (events[name] != undefined) delete events[name]
			wdgTag = rdbs.join(has(extra,"vertical")?"<br>":"")+ `\n<input type=radio name='${name}' id='${IDName}' value='' CHECKED style='display:none'>`;
		} else if (type == "DATE") {
			wdgTag = `<input type='date' name='${name}' id='${IDName}'>`;
		}
//		control after field existence
		if (widget.place != "" && !widgets[widget.placeField]) {
				widget.place = ""
				console.log("field",widget.placeField,"doesn't exists")
				wdgTag = "*" + wdgTag
		}
		if (wdgTag.startsWith("*")) frm += "\n<tr><td colspan='3'>" + wdgTag.substring(1)	// no label (inline buttons and comments)
		else if (widget.place == "" && type != "B") { // no after|below
			frm += "\n<tr><td class='fg_Label'>"+divLabel+"</td><td"+(wdgTag.substring(0,5) == "<text" ? " class='fg_alignAfter'":"")+">"+wdgTag;
		} else {
			widget.placeValue = (!/^B|CKB|C$/.test(type)) ? `<span class='fg_Label'>${divLabel}</span>${wdgTag}` : wdgTag;
		}
	}
	if (tabCount > 0) {
		tableBody += `${frm}<tr><td colspan=2 style='text-align:center'>${Object.values(bottomTabButtons).join("")}</td></tr></tbody>`;
	} else tableCommon = "<tbody>"+frm+"</tbody>"
	if (Object.keys(bButtons).length > 0 && idDiv != "fg_Dummy") {		// Object.keys(hash_table).length
		tableFoot = `<tfoot><tr><td colspan=2 class='fg_Buttons' id="${prefix}fg_Buttons">`
		Object.keys(bButtons).forEach(f => tableFoot += createButton(bButtons[f],0));
		tableFoot += `</td></tr></tfoot>`
	}
	$(idDiv).innerHTML = `
<FORM id='${formID}' class='fg_Form'>
<table class='fg_Table' id='${prefix+"_Table"}' style='visibility:hidden'>
${tableHead}
${tableCommon}
${tableBody}
${tableFoot}
</table>
</FORM>`
	// add buttons after/below, titles, class, ...	*********************
	var iTab = 0
	Object.keys(widgets).forEach(f => {
		var wdg = widgets[f]
		const [type,name,label,...extra] = wdg;
		if (/below|after/.test(wdg.place)) {
			var afterField = wdg.placeField
			var afterType = widgets[afterField][0]
			if (afterType == "FORM" || afterType == "TAB") {
				$(widgets[afterField].ID+"_Title").innerHTML += `<span style='float:right'>${wdg.placeValue}</span>`
			} else {
				if (wdg.place == "below") wdg.placeValue = `<br>${wdg.placeValue}`
				else {
					if (type == "T" && afterType == "T") wdg.placeValue = `<span style='float:right'>${wdg.placeValue}</span>`
				}
				$(prefix+afterField).parentNode.innerHTML += wdg.placeValue
			}
		}
		if ($(wdg.ID) != null) {
			if (has(extra,"class")) $(wdg.ID).classList.add(...getParms(extra,'class').split(/\s*,\s*|\s+/))
			if (has(extra,"title")) $(wdg.ID).setAttribute("title",fGen.translate(getParms(extra,'title')))
			if (has(extra,"color")) $(wdg.ID).style.color = getParms(extra,'color')
			if (type == "T" && has(extra,"disabled")) {
				$(wdg.ID).classList.add("fg_UType")
				$(wdg.ID).setAttribute("readonly",true)
			}
			if (has(extra,"multiple")) {
				$(wdg.ID).multiple = true
				$(wdg.ID).setAttribute('name',name+"[]")
			}
			if (type == "TAB") {
				var buttonTabID = prefix + name + "_Tab"
				var b = `<button type='button' name='${name}' id='${buttonTabID}' class='fg_ButtonTab'>${fGen.translate(label)}</button>`
				$(formID+"fg_ButtonsTab").innerHTML += b
				var tab = $(prefix + name);
				if (iTab++ < 1) {
					var firstTabID = tab
					$(formID+"fg_ButtonsTab").addEventListener("click",fg_handleTab.bind(event))
					$(formID+"_Table").style.width = `${tab.offsetWidth}px`
				} else {
					$(prefix + name + "_Tab").style.color = "#aaa"
					tab.style.cssText = "display:none;"
				}
			}
		}
	})
	//	 add hidden	****************************
	Object.keys(hiddens).forEach(f => {
		var hidden = hiddensFieldSet.appendChild(fGen.createNode("input",{id:prefix+f,type:"hidden",name:f,value:hiddens[f]}))
		if (idDiv == "fg_Dummy") hidden.setAttribute("data-form",jsForm.ID);
	})
	// add pointers	****************************
	var form = $(formID);
	if (iTab > 0) form.style.width = $(formID+"_Table").offsetWidth+"px";
	form.fg_check = check.bind(this)
	form.fg_createOptions = this.createOptions.bind(this)
	form.fg_formFields = formFields.bind(this)
	form.fg_jsForm = jsForm
	form.fg_setValue = setValue.bind(this)
	form.fg_widgets = widgets
	form.hiddensFieldSet = hiddensFieldSet
	if (lone == 1 && jsForm.static != 1 && idDiv != "fg_Dummy") {	// event for lone widgets (no buttons)
		var type = widgets[loneField][0];
		if (type == "CMB" || type == "DATE" || jsForm.encoding == "F") fg_setEvent(loneField,{event:"change",call:fg_handle,field:loneField})
		else if (type == "T" || type == "L") form[loneField].addEventListener("keydown",fg_handleEnter.bind(event,form,loneField));			
		else if (type == "R") {
			form.elements[loneField].forEach(r => {if (r.value != "") fg_setEvent(loneField+r.value,{event:"change",call:fg_handle,field:loneField+r.value})});
		}
	} else form.addEventListener("keydown", function(event) {if (event.key === "Enter") event.preventDefault()}); 	// Prevent form submission
	// add events ******************************
	Object.keys(events).forEach(f => {
		var eField = $(prefix+f)
		if (widgets[f] && widgets[f][0] == "S") eField = $("s_"+eField)
		if (eField == null) console.log(`Event for field ${f} not present`)
		else {
			events[f].forEach((el) => {
				var {server:fnz = "",call:jsFnz = "",field:fieldName = "",parm,parm2,event} = el
				if (fnz != "") {	// server function (URI)
					if (fnz == "submit") {
						if (event == "enter") eField.addEventListener("keydown",fg_handleEnter.bind(event,form,fieldName))
						else eField.addEventListener(event,fg_handle.bind(event,fieldName,"",form))
					} else {
						eField.addEventListener(event,fg_handleAjax.bind(event,fnz,form,jsFnz,parm,parm2))
					}
				} else {	// only javascript function
					if (event == "enter") eField.addEventListener("keydown",fg_handleEnter.bind(event,form,fieldName,jsFnz,parm))
					else eField.addEventListener(event,jsFnz.bind(event,fieldName,parm,form))
				}
			})
		}
	})
	if (idDiv == "fg_Dummy") {
		form.prepend(hiddensFieldSet)
		fGen.prototype.setDefaults(form,0);
		fGen.fragment = form;
		return
	}
/********************  handle GET pseudo type ********************/
	const tasks = Object.keys(gets).map(el => {
		const g = gets[el]
		var timeout = parseInt(g.every,10);
		if (timeout > 99) intervals.push(setInterval(this.ajax.bind(),timeout,g.url,form,fGen.fg_Set,el));	// recurrent requests
		return this.ajax(g.url,formID,saveDefault,el,g.call)
	});
	async function w(p) {
		await Promise.all(p).then(() => {
		setTimeout((firstTabID) => {			
			if (jsForm.popUp) {
				fGen.setObjPosition($(idDiv),jsForm.top,jsForm.left)
				$(jsForm.ID).addEventListener("mousedown", fGen.dragStart.bind(null,idDiv))
			}
			$(formID+"_Table").style.visibility = "visible"
			if (firstTabID != null) {
				$(formID+"_Table").style.height = `${$(formID+"_Table").offsetHeight}px`
				firstTabID.style.cssText = "visibility:visible";
			}
			var firstField = document.querySelector("#"+formID).querySelector("textarea:not([readonly]),input[type=text]:not([readonly])")
			if (firstField !== null) firstField.focus()
		}, 500)
		form.prepend(hiddensFieldSet);
		fGen.prototype.setDefaults(form,0);
		if (jsForm.eventOnStart != "") window[jsForm.eventOnStart](form)
		var styleTag = document.head.appendChild(fGen.createNode("style",formID+"fg_CSS"))
		styleTag.type = "text/css";
		styleTag.innerText = styles;
		});
	}
	w(tasks);
	return;
}
}
fGen.prototype.ajax = function(url,frm,handler,parm1,parm2) {
	return fetch(url,{method: "POST",body:fGen.getFormData(frm)})
		.then(r => {
			if (r.ok) {return r.text()};
			return `${r.statusText} ${url}`;
		})
		.then(text => {if (handler) {handler(text,frm,parm1,parm2)}})
		.catch(err => alert(err));
}
fGen.prototype.setDefaults = function(frm,tab) {
	var widgets = frm.fg_widgets;
	Object.keys(widgets).forEach(w => {
		if ((tab > 0 && tab == widgets[w].tab) || tab == 0) {frm.fg_setValue(w,widgets[w].default)}
	});
	if (tab < 1) frm.fg_formFields(frm);	// save initial form values
}