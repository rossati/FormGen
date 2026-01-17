// jsForm generator sandbox forms **********
// formgen 0.3.0 8 January 2026
// free to use but no warranties
// El Condor - Condor Informatique - Turin
// *****************************************
var agree = "form '' 'Enable example'"
+ "\nCKB Agree 'Consent cookies?' 'I agree' Switch Start"
+ "\nB Start '' disabled"
+ "\nB fg_Cancel &#x2718"
var controls = "Form frm Controls server echo.php call receive"
+ "\nT Mail ''  mail"
+ "\nRequired Mail Measure"
+ "\nControl Mail is mail 'badly formed'"
+ "\nCKL Lang 'Languages known'  'C=C\\x2c C++\\x2c C#,JS=JavaScript,PHP=images/php.png,PYTHON=images/python.png,RUBY,RUST' Default PHP"
+ "\nCMB Measure 'Measures units' =Linear,mm=millimeter,cm=centimeter,m=meter,km=kilometer,=Weight,g=gram,kg=kilogram,t=ton"
+ "\nT Qty Quantity positive"
+ "\nT wQty 'Quantity withdrawn' positive"
+`
S MinPressure Minimum From 20 To 160 width 180
S MaxPressure Maximum From 40 To 280 width 200
Control MinPressure < MaxPressure 'Minimum must be less of Maximum'`
+ "\nDefaults Qty=121"
+ "\nCheck wQty call controlWhithdraw 'excess quantity'"
+ "\nCheck Lang > 0 'Almost one language'"
var checkNumber = "T Number '' Float 'Insert Floating number'"
+ "\nControl Number >= -200 'Not allowed lesser -200'"
+ "\nControl Number <= 200 'Not allowed greater 200'"
+ "\nCheck Number is ^[-+]?\\d{1,3}(\\.\\d{1,2})?$ 'incorrect format'"
+ "\nC c1 'Floating point number<br>between -200.00 and 200.00 (two decimals)'"
var CustomSubmit = "Form form 'Example Form'"
+ "\nT Text '' width 30 hint 'Text placeholder'"
+ "\nS Slider '' From 34 To 43 step 0.1"
+ "\nT psw Password Password width 25 title 'Insert password'"
+ "\nT graphFile '' File filter .gif,.jpg,.png"
+ "\nControl psw is (?=.*\\d)(?=.*[A-Z])(?=.*[a-z]).{6,12} 'Almost one Uppercase, Lowercase and digit\\x0d from 6 to 12 characters'"
+ "\nB Start &#x270E; width 40 event click call 'myHandler echo.php'"
+ "\nDefaults Slider=37.5 psw=Corkone6"
+ "\nRequired graphFile"
var info = "Form frm 'Insert password' server echo.php call receive"
+ "\nT psw Password width 15 password hint 'Insert password'"
+ "\nB Info ? width 25 call infoPSW after psw"
+ "\nB fg_Cancel &#x2718; width 30 title 'Cancel form'"
+ "\nB fg_Reset \\x21B6 width 30 title 'Reset form'"
+ "\nB fg_Ok ✎ width 30 title Go!"
+ "\nRequired psw"
+ "\nControl psw is (?=.*\\d)(?=.*[A-Z])(?=.*[a-z]).{6,12} 'Six to twelwe chars, almost one Uppercase lowercase and digit'"
var noButtons = `CSS .fg_Table {background: rgba(0,0,0,0)}
Form frm2 '' server echo.php call receive
CMB Unit 'Measure Unit' =Linear,mm=millimeter,cm=centimeter,m=meter,km=kilometer,=Weight,g=gram,kg=kilogram,t=ton`
var radioButtons = `CSS .fg_Table,.fg_Title,.fg_Buttons {background:#acc}
CSS .fg_Table td, .fg_Table th {border: 1px solid #444}
CSS .fg_Table {border-collapse:collapse}
Form rdb 'Radio buttons example' server echo.php call receive
R Status ''  M=Married,S=Single,W=Widow
R Sex 'images/sex.png'  'M=&#9794; Male,F=&#9792; Female,N=Not specified'`
+ "\nR Output ''  E=images/excel.png,None"
+ "\nR Nations '' 'It=images/its.png Italia,Fr=images/frs.png France,"
+ "Es=images/ess.png España,Us=images/uss.png United States,El=images/els.png Ελλάδα' vertical"
+ "\nDefaults Nations=El Sex=M"
var staticForm = "Form fHBook 'No buttons Form' nobuttons"
+ "\nB Clock images/clock.png inline 'Get Time'"
+ "\nC Text ' ' width 100 after Clock"
+ "\nB xExcel images/excel.png alert 'Create Excel file' inline 'Excel file'"
+ "\nB ShowImage images/faro.ico inline 'Show image'"
+ "\nI Image '' height 200"
+ "\nB ShowCite images/new.png inline 'Show IT quote'"
+ "\nEvent click on ShowImage server getImage.php?NoTitle set Image"
+ "\nEvent click on Clock server getSample.php?Type=Time set Text"
+ "\nEvent click on ShowCite server getITCite.php set result3"
var form = `Form frm 'Complete Control Form' server echo.php ground #eee
B fg_Cancel \\x2718 width 30 title 'Cancel Form'
B fg_Reset \\x27f2 width 30 title Reset
B Start \\x270E width 30
T Name '' 'hint=Input field'`
+ "\nTab Complete"
+ "\nCMB MeasureUnit  '' '=Linear,mm=millimeter,cm=centimeter,m=meter,km=kilometer,=Weight,g=gram,kg=kilogram,t=ton'"
+ "\nList Town_List '' 'Turin,Milan, Rome,Naples,Bordeaux,Lion,Paris'"
+ "\nDate Date"
+ "\nCKB CheckBox '' 'Check for consent' On After Mail"
+ "\nRdb rdb 'Radio buttons' 1=One,2=Two,3=Three"
+ "\nS Slider ''  From 34 To 43 Step 0.1"
+ "\nT positiveNumber '' positive"
+ "\nT floatingNumber ''  Float"
+ "\nT Number 'Signed Number' integer After positiveNumber"
+ "\nT psw Password password 'hint=Insert password'"
+ "\nC '' 'This is a green comment' class green"
+ "\nC '' '*** This is a separator ***' align center"
+ "\nT Mail 'Mail address'"
+ "\nB changeUnit Change call changeMUnits After MeasureUnit Width 60 'title=Set time measures'"
+ "\nB Info images/info.png '' call infoPSW After psw"
+ "\nB ShowData images/see.png inline 'Show data' call showData"
+ "\nControl Number >= -200 'Not allowed lesser -200'"
+ "\nControl Number <= 200 'Not allowed greater 200'"
+ "\nControl Mail is mail incorrect"
+ "\nRequired Mail"
+ "\nControl psw is (?=.*\\d)(?=.*[A-Z])(?=.*[a-z]).{6,12} 'Six to twelwe chars, almost one Uppercase lowercase and digit'"
+ "\nDefaults Slider=37.5 psw=Corkone6 MeasureUnit=m Town_List=Venice"
+ `
Tab Attachements '' 'Attachements demo'
B InfoAttach images/info.png alert 'Demo insert widget' after Attachements
T WideField '' cols 50 rows 5
B Info2 images/info.png '' alert 'Wide field' After  WideField
T Protect 'Protect text' Value 'This is a Protected Field' disabled
T Attachement '' File Event change call insertRow width 40
`
var gets = "Form frmg2 'Get example' server echo.php call receive"
+ "\nT Widget '' disabled"
+ "\nCMB WidgetType '' '=Pseudo,Event,Form,Get' link Widget"
+ "\nCMB Hellas 'Greek letters' '' multiple"
+ "\nList Town"
+ "\nCMB Languages"
+ "\nHidden HiddenField"
+ "\nGet * getSample.php?Type=Defaults"
+ "\nGet WidgetType getSample.php?Type=Type"
+ "\nGet Town getSample.php?Type=Towns"
+ "\nGet Hellas getSample.php?Type=Hellas"
+"\nGET Languages getSample.php?Type=Lang"
var getExample ="Form frmg2 'Get example' server echo.php call receive"
+ "\nT Time '' disabled"
+ "\nT Widget '' disabled"
+ "\nT piGreco '' value 3.14159 float disabled"
+ "\nCMB WidgetType '' '=Pseudo,Event,Form,Get' link Widget"
+ "\nCMB Hellas 'Greek letters' '' multiple"
+ "\nList Town"
+ "\nCMB Languages"
+ "\nHidden HiddenField"
+ "\nB fg_Ok &#x270E; width 30"
+ "\nB fg_Cancel &#x2718; width 30 'title=Cancel Form'"
+ "\nB fg_Reset &#x21B6; width 30 'title=Reset Form'"
+ "\nGet * getSample.php?Type=Defaults"
+ "\nGet WidgetType getSample.php?Type=Type"
+ "\nGet Town getSample.php?Type=Towns"
+ "\nGet Hellas getSample.php?Type=Hellas"
+ "\nGET Time getSample.php?Type=Time"
+ "\nGET Languages getSample.php?Type=Lang call addSomeLanguage"
var EventSubmit = "Form fe 'Submit on Enter or Select' server echo.php call receive"
+ "\nT Name '' Event Enter Submit"
+ "\nCMB Category '' '=Anti,Antibiotic,Anti-inflammatory,"
+ "=Others,Beta-blocker,Cardiovascular,Dermatological,Endocrine,Gastroenterological,Gynecological,Neurological,Respiratory,Restorative'"
+ " Event change Submit"
var Comments = "Form fc 'Comments and error'"
+ "\nC '' \"The label field is the comment shown: "
+ "<br>Comment|C [fieldName] 'some comment' align [center|right|justify] [width nnn]"
+ "<br>Comment and C are synonym. "
+ "The comment can be aligned by inserting align center or right or justify. "
+ "Comments have the class fg_Comment.\" align Justify width 350"
+ "\nC '' <hr>"
+ "\nC '' 'images/faro.ico anchor comment with images images/its.png' anchor images/Bukavu.png"
+ "\nC '' 'Below an error shown by formGen'"
+ "\nLink combo text"
var formGenerator = "Form '' 'Form Generator' reset Call receiveDataForm onStart onStartFormGen"
+ "\nCMB type Type '=Buttons,B=Button,GB=Graphic button,IB=Inline button,R=Radio buttons,RV=Vertical Radio buttons,"
+ "=Lists,CMB=Combo box,L=List,CKL=Chek box list,=Texts,C=Comment,H=Hidden field,T=Text field,"
+"=Others,CKB=Check box,Date,I=Image,S=Slider,CSS'"
+"\nCMB textType '' 'P=Password,NF=Float,NS=Integer,N=Positive,F=File,U=Protect,WT=Wide Text' After type"
+ "\nT help 'Use of control' width 300 disabled"
+ "\nT name Name hint 'The name of the control'"
+ "\nT label Label width 30 hint 'The label shown'"
+ "\nT length Width integer After name"
+ "\nT extra 'Extra field(s)' width 200"
+ "\nT default 'Default value'"
+ "\nCKB Required Required 'Check if field is required'"
+ "\nCKB Mail 'Is mail?' 'Check if field is mail address'"
+ "\nControl name required"
+ "\nEvent change on type call sandBox"
+ "\nEvent change on textType call sandBox"
+ "\n Hidden realType"
var formTrans = `
T Mail Mail address '' width 25 hint 'Minimum 6 characters'
T Protect 'Protected text' value 'Not modifiable Field' disabled
CKB CheckBox 'Send info' 'Check for consent'
T Time '' disabled
C Comment Comment align center
B Save images/update.png 'inline=In line button' alert 'Not saved, only for demo'
GET Time getSample.php?Type=Time
CMB Hellas 'Greek letters' Alfa,Beta,Delta,Epsilon,Gamma
CSS .fg_Table td, .fg_Table th {outline: 1px solid #CCC;padding:1px}
CSS .fg_Table tr:nth-child(2n+2) {background-color:#fff;}
`
var Images = `CSS .fg_Label:after {content:"";}
Form frm 'Images' server echo.php call receive
I Image_1 'El Condor' images/condor.gif title 'El condor pasa'
I Image_2 'images/SagraSanMichele.png:Sacra di San Michele' class fg_Frame`
var dictionary = {"Mail address":{IT: "Indirizzo di posta",FR:"Adresse e-mail",EL:"Tαχυδρομική διεύθυνση"},
				Mail:{IT:"Posta elettronica",FR:"Courrier",ES:"Correo",EL:"ταχυδρομείο"},
				"Protected text":{IT:"Testo protetto",FR:"Tex protégé",ES:"Texto protegido",EL:"Προστατευμένο κείμενο"},
				"Not modifiable Field":{IT:"Campo non modificabile",FR:"Champ non modifiable",
				ES:"Campo no modificable",EL:"Μη τροποποιήσιμο πεδίο"},
				"Demo internationalization":{IT:"Demo internazionalizzazione",EL:"Επίδειξη διεθνοποίησης",
				FR:"Internationalisation de la démo",ES:"Internacionalización demo"},
				"Not saved, only for demo":{IT:"Non salvato, solo per demo",EL:"Δεν αποθηκεύτηκε, μόνο για επίδειξη",
				FR:"Non enregistré, uniquement pour la démo",ES:"No guardado, sólo para demostración."},
				"Greek letters":{IT:"Lettere greche",EL:"Ελληνικά γράμματα",FR:"Lettres grecques",ES:"Letras griegas"},
				"In line button":{IT:"Pulsante in linea",EL:"Κουμπί στη γραμμή",FR:"Bouton en ligne",ES:"botón en línea"},
				Time:{IT:"Ora",EL:"Τώρα",FR:"Heure",ES:"Horas"},
				"Minimum 6 characters":{IT:"Minimo 6 caratteri",FR:"Minimum 6 caractères",ES:"Mínimo 6 caracteres",EL:"Τουλάχιστον 6 χαρακτήρες"},
				"Send info":{IT:"Inviare informazioni",FR:"Envoyer informations",ES:"Enviar información",EL:"Στείλτε πληροφορίες"},
				"Check for consent":{IT:"Marcare per consenso",FR:"Marquer pour consentement",ES:"Marcar para consentimiento",
				EL:"Σημειώστε για συγκατάθεση"},
				Save:{IT:"Salvare",FR:"Sauver",ES:"Salvar",EL:"Αποθηκεύσετε"},
				"Alert in english":{IT:"Avviso in italiano",FR:"Avis en français",ES:"Aviso en español",EL:"Ανακοίνωση στα ελληνικά"},
				Comment:{IT:"Commento",FR:"Commentaire",ES:"Comentario",EL:"Σχόλιο"},
				Reset:{IT:"Ripristina",FR:"Réinitialiser",ES:"Reiniciar",EL:"Επαναφορά"},
				Cancel:{IT:"Chiudere",FR:"Fermer",ES:"Cerrar",EL:"Να κλείσω"},
				Ok:{ES:"Okay",FR:"Bien",EL:"Εντάξει"},
				Alfa:{EL:"Αλφα"},Beta:{EL:"βήτα"},Gamma:{EL:"Γάμμα"},Delta:{EL:"Δέλτα"},Epsilon: {EL:"Εψιλο"}
				}
var tryTimeout = "Form frm '' server echo.php call receive"
+ "\nC Time Clock"
+ "\nT wField 'IT Cite' width 250 disabled"
+ "\nImage Image '' '' height 200"
+ "\nGET Time getSample.php?Type=Time every 60000"
+ "\nGET wField getITCite.php?CR every 9000"
+ "\nGet Image getImage.php every 11000"
+ "\nB fg_Cancel &#x2718; width 40"

