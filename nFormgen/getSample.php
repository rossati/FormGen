<?PHP
$type = $_REQUEST["Type"];
if ($type == "Type") {
	echo "=Buttons,B=Button,R=Radio button,R vertical=Vertical Radio button,"
	."=Lists,CMB=Combo box,L=List,"
	."=Texts,C=Comment,T file=File,H=Hidden field,T Positive=Numeric,T integer=Numeric signed,"
	."T float=Numeric with decimals,T password=Password,T=Text,T readonly=Read only text,"
	."=Others,CKB=Check box,S=Slider";
}
if ($type == "Hellas") {echo "Alfa,Beta,Delta,Gamma,Epsilon";}
else if ($type == "Towns") {echo "London,Paris,Rome,Toulon,Toulouse,Turin,Zurich";}
else if ($type == "Defaults") {echo "Town=Turin Hellas=Alfa 'WidgetType=T file' Languages=Pascal 'HiddenField=El Condor'";}
else if ($type == "PSDefaults") {echo "Town Turin Hellas Alfa Languages Pascal";}
else if ($type == "Lang") {echo "Algol,Cobol,Fortran,JavaScript,Pascal,PHP";}
else if ($type == "Time") {date_default_timezone_set("Europe/Rome");echo date("h:i");}
else if ($type == "Version") {
	$r =  "<TABLE border='1'><TR><TD>fGen<TD>".$_REQUEST["version"];
    $r .= "<TR><TD>Apache version <TD>".$_SERVER["SERVER_SOFTWARE"];
    $r .= "<TR><TD>PHP version <TD>".phpversion();
    if (function_exists("gd_info")) {
        $gdinfo = gd_info();
        $r .= "<TR><TD>GD version <TD>".$gdinfo["GD Version"];
    } else $r .= "<TR><TD>GD<TD>Not installed";
	$r .= "<TR><TD>IP address<TD>".$_SERVER['REMOTE_ADDR'];
	$r .= "<TR><TD COLSPAN=2>Some icons by <a target='_blank' href='https://icons8.com'>Icons8</a></TABLE>";
	echo $r;
} else if ($type == "Images") {
	$extension = $_REQUEST["imageType"];
	if ($handle = opendir('images')) {
		$fl = "";
		while (false !== ($file = readdir($handle))) {
			if ($file != "." && $file != "..") {
				$path_parts = pathinfo($file);					
				if (".".strtolower($path_parts['extension']) == $extension) {
					$fl = $fl.",".$file;
				}
			}
		}
		closedir($handle);
		echo substr($fl,1);
	}
}
?>