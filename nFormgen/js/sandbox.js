// ***************************************
// FormGen JS sandbox 22 January 2026
// El Condor - Condor Informatique - Turin
// ***************************************
var infoTypes = {
	B: ["Button","The label field is the button caption or a graphic file\n"
		+"It supports:\n"
		+ "- After fieldName\n"
		+ "- Event eventType call|server function [parameter]\n"
		+ "- Event eventType alert message\n"
		+ "- Event eventType submit\n"
		+ "- Inline label the button is within the controls in the place of label\n"
		+ "- Title title\n"
		+ "- value|default value\n"
		+ "- Width nn the dimension of the button or image in pixels","",""],
	C: ["Comment","The label field is the comment shown\nThe comment can be After|Below another field\n"
	   +"Use center or right to modify alignement.","align center color green","centered green comment"],
	CKB: ["Check","The extra field can contain a possible description shown to the right of the check box.\n"
		+"Check box can appears after another control.","'check for consent'",""],
	CKL: ["Checklist","This type generates a set of check boxes.\nThe extra field contains a list of field names separated by , (comma); "
		+ "the field name is key if present, otherwise is value; value is the description that appears after the check box."
		+ "\nThe view name become a hidden text field that contains the number of check boxes selected.","'C=C\\x2c C++\\x2c C#,JS=JavaScript,PHP,PYTHON,RUBY,RUST'","JS"],
	CMB: ["Combo","Drop Down list: permits to choice a value from a list.\n"
		+"The extras fields contain the items in the form: key=value.\n"
		+"If there is only one combo (type CMB) in the form, the form has no buttons and it is exited when a list item is selected\n"
		+"It is possible to have a combo with items separated on group (optgroup tag), the group is identified by the syntax |=groupLabel",
		"=Linear,mm=millimeter,cm=centimeter,m=meter,km=kilometer,=Weight,g=gram,kg=kilogram,t=ton",""],
	CSS: ["","Insert a CSS rule.\nA rule must be in a single line.","positive",""],
	GB: ["GraphicButton","Graphic button, the label field contains the source of the image.\nThe length, if present, is the dimension in pixels.\n"
		+"It can have a Event parameter and After|Below parameter.","",""],
	"IB": ["ImgButton","Inline button, the label field can be a text or a source ofimage.\nThe length, if present, is the dimension in pixels.\n"
		+"The extra field can contain a call to a function which is called instead of the form submission.",
		"inline 'Inline button' Event click alert 'Inline button'",""],
	I: ["Image","If label is not present the image occupies all the row.\n"
		+"Accepts the height, class and title parameters.",
		"images/condor.gif title 'El condor pasa'",""],
	N: ["Positive","Integer positive","positive","97"],
	NF: ["Float","Floating point number","float","3.14159"],
	NS: ["Integer","Integer number","integer","-121"],
	Date: ["Date","HTML 5\nThe possibly default must be in the form yyyy-mm-dd or today","","today"],
	"F": ["File","The extra field can contains a file filter(s), if many, they are separated by comma:\n"
		+"audio,*video,*|image/*\n.gif,.jpg,.png","file filter image/*,.pdf",""],
	"H": ["Hidden","An hidden field.","","This is an hidden field"],
	"L": ["List","L or LIST: is a text box associated to a list.\nThe items are on extra field separated by comma.","London,Paris,Rome,Toulon,Toulouse,Turin,Zurich","Turin"],
	R: ["Rdb","The extras fields contain the labels and value of each radio button.\nTo obtain a key instead of the label, the item must have the form: key=value:\n"
		+"Rdb,Status,,45,M=Married,S=Single,W=Widow\nThe length field determine the distance in pixel from the radio buttons items.","M=Married,S=Single,W=Widow","M"],
	P: ["Text","","Password hint 'Insert password'",""],
	RV: ["vRdb","The extras fields contain the labels and value of each radio button.\nTo obtain a key instead of the label, the item must have the form: key=value:<br>"
		+"The radio buttons are arranged vertically.\nRdb,Status,,45,M=Married,S=Single,W=Widow","North,South,West,East vertical","West"],
	S: ["Slider","S or SLIDER: the length of the slider is in pixel (default 150).\nThe extra field can contains the start, end and step values in the form start,end,step\n"
		+"e.g. from -5 to 5 step 0.5; if it is omitted, the values assumed are 0 100 and 1.\n"
		+"The result can have decimals depending on the difference from start and end value.","from -5 to 5 step 0.5",-3],
	T: ["Text","TEXT is synonym of T.\nIf the length exceed 50 characters it is generated a text area."
		+"\nThe extra field, if present, contains a text hint (HTML5 place-holder property).","hint 'insert the text'",""],
	U:  ["Unmod","Not modifiable field","disabled float","3.1315"],
	WT:	["Wide Text","If width greater of 4o or there is the parameters col or Row is generated a Textarea tag.","rows 3 Color green","Wide Text"]
}
var convertType = {B:"B",H:"H",IB:"B",GB:"B",N:"T",NF:"T",NS:"T",P:"T",RV:"R",F:"T",S:"S",R:"R",CKB:"CKB",CKL:"CKL",CMB:"CMB",L:"L",T:"T",U:"T",WT:"T",CSS:"CSS"}
widgetCount = 0;
function addSomeLanguage(c) {
	var lang = ("Python,Ruby,Basic,"+c).split(",");
	lang.sort()
	return lang.join(",")
}
function receive(c) {
	$("result2").innerHTML = c;
}
function controlWhithdraw(frm,field,value) {	// check Quantity withdrawn
	if (value > parseFloat(frm["Qty"].value)) return false;
	return true;
}
function onStartFormGen(frm) {
	frm.textType.disabled = true
}
var CSSForm = `
Form CSS 'CSS rules' call getCSS
CMB CSS '' 'CB=Cell border,GS=Ground silver,GT=Ground Teal,GW=Ground White,S=Shadow,TG=Text area ground'
`
function getCSS(frm) {
	const CSS = {GS:".fg_Table {background-color:silver}",S:".fg_Table {box-shadow: 12px 12px rgb(128 128 128 / 0.2)}",
				GT:".fg_Table, .fg_Table {background-color:teal}",GW:".fg_Table, .fg_Table {background-color:White}",
				TG:".fg_TextArea {color:red;background-color:#E0E0E0}",CB:".fg_Table td {border: 2px inset green}"}
	$("extra").value = CSS[frm.CSS.value];
}
function sandBox(widget) {
	const frm = $(widget).form
	var type = (event.target.name == "type") ? frm.type.value : frm.textType.value;
	frm.realType.value = (convertType[type] != undefined) ? convertType[type] : type;
	if (convertType[type] == "T") frm.textType.disabled = false
	else frm.textType.disabled = true
	const [name,help,extra,def] = infoTypes[type]
	$("help").value = help;
	if (type != "CSS") {
		$("Mail").disabled = (type != "T");
		if (type != "T") $("Mail").checked = false;
		$("length").value = "";
		$("name").value = name + "_" + widgetCount;
		$("label").value = name + " " + widgetCount;
		frm.default.value = def
		frm.extra.value = extra;
	} else {
		new fGen("",CSSForm);
	}
	switch (type) {
		case "S":
			$("length").value = 150;
			break;
		case "I":
			$("extra").value = "images/SagraSanMichele.png";
			$("length").value = 237
			break;
		case "GB":
			$("label").value = "images/clock.png";
			break;
		case "IB":
			$("label").value = "images/faro.ico";
			break;
	}
}
function receiveDataForm(data) {
	if (data.fg_Button.value != "fg_Cancel" && data.type.selectedIndex > -1) {
		widgetCount++;
		var res = $("fg_list").value == "" ? "Form frm 'Try Sand Box' server echo.php call receive" : ""
		res += `\n${data.realType.value} `
		if (data.realType.value != "CSS") {
			res += `${data.name.value} '${data.label.value}' ${data.extra.value}`
			if (data.length.value != "") res += " width " + data.length.value 
			if (data.default.value != "") res += " value '" + data.default.value + "' ";
			if (data.Required.checked) res +=  "\nRequired " + data.name.value;
			if (data.Mail.checked) res += "\nControl " + data.name.value + " is mail 'incorrect mail form'";
		} else res += data.extra.value;
		$("fg_list").value += res;
	}
}
	var popUpInfo = `Use:<br>popUp(parameters)
	<br>Where parameters are for example:<br>`;
function popUpHelp(btn,parm,frm) {
	var cancelType = frm.Cancel.value;
	var howCancel = `Hit ${cancelType} key for cancel`;
	if (cancelType.toLowerCase() == "click") howCancel = "Click for cancel";
	else if (!isNaN(cancelType)) {
		howCancel = `Disappears after ${cancelType} milliseconds`;
		cancelType = Number(cancelType)
	}
	var parms = {"id":"",Cancel:cancelType,fade:"1500 1500",Movable:false,
				Top:Number(frm.Top.value),Left:Number(frm.Left.value),Width:Number(frm.Width.value),Height:Number(frm.Height.value),
				content:frm.Images.value,"style":"background:#ccc;border-style:outset;"};
	var jParms = JSON.stringify(parms)
	const chars =  {'{"': '<pre>{\n   ', ',"': ',\n   ', '":': ':\t','}' : '\n}\n</pre>'};
	let regexp = new RegExp('{"|,"|":|}',"g");
	s = jParms.replace(regexp, m => chars[m]);
	parms.content = popUpInfo+s+howCancel;				
	popUp(parms);
	return false;
}
function showITCite(btn,n,form) {
	fGen.prototype.ajax("getITCite.php?n=" + n,form,
		function(c){$("quote").innerHTML = c})
}
function showData(field,parm,form) {
	var data = fGen.showData(form.fg_formFields(form))
	var parms = {cancel:"Click",top:-1,left:-1,fade:"1000 1000",
				content:data+"<div style='text-align:center'><span class='fg_Erase'>&#x2718;</span></div>",
				style:"background:#eed;border:3px outset blue;padding:3px;"};
	popUp(parms);
}
function insertRow(id,parm,form) {
	id = form[id];
	insertRow.count++
	var list = `
B delete%n  \\x2718 call fGen.deleteWidget inline
T attach%n File_%n after delete%n disabled width 40 value '${id.files[0].name}'
H hidden%n %n
T Comment%n '' width 35
`
	var idAfter = id.id
	fGen.createWidget(idAfter,list.replace(/%n/g,insertRow.count))
}
insertRow.count = 0;
insertFile.count = 0;
function insertFile(idx,id) {
	insertFile.count++
	var list = `
//B delete%n \\x2718 call 'fGen.deleteWidget frmAddFile' inline
B delete%n \\x2718 call fGen.deleteWidget inline
T attach_%n '' after delete%n width 40 File
H hidden_%n cucu%n
T Comment_%n '' width 35
`
	var idAfter = id
	fGen.createWidget(idAfter,list.replace(/%n/g,insertFile.count))
}