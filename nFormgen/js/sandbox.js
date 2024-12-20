var infoTypes = {
	B: ["Button","The label field is the button caption or a graphic file\n"
		+"It supports:\n"
		+ "• After fieldName\n"
		+ "• Event eventType call|server function [parameter]\n"
		+ "• Event eventType alert message\n"
		+ "• Event eventType submit\n"
		+ "• Inline label the button is within the controls in the place of label\n"
		+ "• Title title\n"
		+ "• value|default value\n"
		+ "• Width nn the dimension of the button or image in pixels","",""],
	C: ["Comment","The label field is the comment shown\nThe comment can be After|Below another field\n"
	   +"Use center or right to modify alignement.","center","centered comment"],
	CKB: ["Check","The extra field can contain a possible description shown to the right of the check box.\n"
		+"Check box can appears after another control.","'check for consent'",""],
	CKL: ["Checklist","This type generates a set of check boxes.\nThe extra field contains a list of field names separated by , (comma); "
		+ "the field name is key if present, otherwise is value; value is the description that appears after the check box."
		+ "\nThe view name become a hidden text field that contains the number of check boxes selected.","'C=C, C++, C#,JS=JavaScript,PHP,PYTHON,RUBY,RUST'","JS"],
	CMB: ["Combo","Drop Down list: permits to choice a value from a list.\n"
		+"The extras fields contain the items in the form: key=value.\n"
		+"If there is only one combo (type CMB) in the form, the form has no buttons and it is exited when a list item is selected\n"
		+"It is possible to have a combo with items separated on group (optgroup tag), the group is identified by the syntax |=groupLabel",
		"=Linear,mm=millimeter,cm=centimeter,m=meter,km=kilometer,=Weight,g=gram,kg=kilogram,t=ton",""],
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
	"Date": ["Date","HTML 5\nThe possibly default must be in the form yyyy-mm-dd or today","","today"],
	"F": ["File","The extra field can contains a file filter(s), if many, they are separated by comma:\n"
		+"audio,*video,*|image/*\n.gif,.jpg,.png","file filter image/*,.pdf",""],
	"H": ["Hidden","An hidden field.","","This is an hidden field"],
	"L": ["List","L or LIST: is a text box associated to a list.\nThe items are on extra field separated by comma.","London,Paris,Rome,Toulon,Toulouse,Turin,Zurich","To"],
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
	U:  ["Unmod","Not modifiable field","disabled float","3.1315"]
}
var convertType = {B:"B",H:"H",IB:"B",GB:"B",N:"T",NF:"T",NS:"T",P:"T",RV:"R",F:"T",S:"S",R:"R",CKB:"CKB",CKL:"CKL",CMB:"CMB",L:"L",T:"T",U:"T"}
aSandBox = ["Form frm 'Try Sand Box' server echo.php call receive"];		// commands array
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
function sandBox(widget) {
	const frm = $(widget).form
	var type = (event.target.name == "type") ? frm.type.value : frm.textType.value;
	if (convertType[type] == "T") frm.textType.disabled = false
	else frm.textType.disabled = true
	const [name,help,extra,def] = infoTypes[type]
	$("help").value = help;
	$("Mail").disabled = (type != "T");
	if (type != "T") $("Mail").checked = false;
	$("fg_list").value = aSandBox.join("\n");
	$("length").value = "";
	$("name").value = name + "_" + aSandBox.length;
	$("label").value = name + " " + aSandBox.length;
	frm.default.value = def
	frm.realType.value = (convertType[type] != undefined) ? convertType[type] : type;
	frm.extra.value = extra;
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
	if (data.fg_Button.value != "fg_Cancel") {
		var res = "";
		if ($("fg_list").innerHTML == "") res = "Form frm 'Form Generator'\n"
		res += data.realType.value + " " + data.name.value + " '" + data.label.value + "'"
		res += " " + data.extra.value;
		if (data.length.value != "") res += " width " + data.length.value 
		if (data.default.value != "") res += " value '" + data.default.value + "' ";
		aSandBox[aSandBox.length] = res
		if (data.Required.checked) aSandBox[aSandBox.length] = "Required " + data.name.value;
		if (data.Mail.checked) aSandBox[aSandBox.length] = "Control " + data.name.value + " is mail 'incorrect mail form";
		$("fg_list").value = aSandBox.join("\n");
	}
}
var popUpInfo = `Use:<br>popUp(parameters)
	<br>Where parameters is for example:<br>
	{"id":"","cancel":"Delete","top":"-1","left":"-1","width":"-1",
	"height":"-1","content":popUpInfo,"style":"background:#ccc"}
	<br>`;
function popUpHelp() {
	var cancelType = $("Cancel").value;
	if (cancelType.toLowerCase() == "click") var howCancel = "Click for cancel";
	else var howCancel =  `Hit ${cancelType} key for cancel`;
	var cancel = $("Cancel").value;
	cancel = (isNaN(cancel)) ? cancel:Number(cancel);
	var parms = {"id":"","cancel":cancel,
				"top":$("Top").value,"left":$("Left").value,"width":$("Width").value,"height":$("Height").value,
				fade:"1500 1500",
				"content":popUpInfo+howCancel,"style":"background:#ccc;border-style:outset;"};
	popUp(parms);
	return false;
}
function showITCite(btn,n,form) {
	fGen.prototype.ajax("getITCite.php?n=" + n,form,
		function(c){$("quote").innerHTML = c})
}
function showData(field) {
	const form = $(field).form;
	var data = fGen.prototype.showData(form.fg_formFields(form))
	var parms = {cancel:"Click",top:-1,left:-1,fade:"1000 1000",
				content:data+"<div style='text-align:center'><span class='fg_Erase'>&#x2718;</span></div>",
				style:"background:#eed;border:3px outset blue;padding:3px;z-index:100"};
	popUp(parms);
}
function insertRow(id) {
	insertRow.count++
	var list = `
B delete%n  \\x2718 call fGen.deleteWidget inline
T attach%n ' ' after delete%n disabled width 40 value '${$(id).files[0].name}'
`
	var idAfter = id
	fGen.createWidget(idAfter,list.replace(/%n/g,insertRow.count))
}
insertRow.count = 0;