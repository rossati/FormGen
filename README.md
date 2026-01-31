# FormGen
<h3>Javascript form generator</h3>
Form generator, briefly FormGen, is a JavaScript script which contains the class fGen that allows build and handle forms.
<br>FormGen is sufficiently generalized for create a wide set of useful forms from simple message box to relative complex input forms, based on a list of controls or widgets (some text type, buttons, check boxes, lists, radio buttons, comment and images); moreover FormGen supports event management and server interaction by Ajax.
<br>The form presentation can be customized both via CSS both by the instructions present in the description of the widgets.
The form can be submitted or managed locally.
<br>Furthermore, the fGen class exposes some utility functions such as the management of floating objects, the creation of DOM objects, etc.
<h4>Try the Form generator</h4>
The form generator can be tested locally by installing the directory FormGen or its contents in a directory accessible from localhost.
It is also possible test accessing this <a href='https://www.condorinformatique.com/nFormgen' target='_blank'>site</a>. 
<h4>Using the form generator</h4>
The form builder is contained in <i>formgen.js</i> script which must be included in the HTML page.
The formgen.js script contains the class fGen; the creation of the form object is by the function:
    fGenObject = new fGen(containerID,control_list)
where containerID is a ID of div tag (it can also be a span or a td tag) which will contain the created form.
☞ If the id is not present, it is created a <div> tag useful for a movable form.
The second parameter is a characters constant or variable containing the list of controls (widgets).
<h4>Data description</h4>
Every control is characterized by a list of attributes separated by space(s) in this order:  Type, Field Name, Field Label, and Extra field(s). Controls are separated by line terminators1.
In addition to the controls there are some others information (Pseudo types) with different semantics.
Extra field(s)are attributes that depends of the control type.
<h4>Type</h4>
The Type is indifferent to the case:
Buttons, radio buttons, comments, check boxes, combo box and lists, images, texts, sliders and hidden fields.
  
See the documentation 
