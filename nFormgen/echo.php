<!DOCTYPE html>
<?php
define("UC_CANCEL","&#x2718;");
function insertCancel() {
    return <<<EOD
<span onclick="document.getElementById('fg_table').remove()" title="Close" id='fg_close'>
&#x2718;
</span>
EOD;
}
?>
<style>
#fg_table {
  border-collapse: collapse;
  margin:auto;
}
#fg_table caption {
  padding: 4px;
  font-weight: bold;
}
/* Nessun bordo generale */
#fg_table, #fg_table td {border: none;}
#fg_table td {padding: 3px;}
/* Bordi interni nel tbody */
#fg_body td {border: 1px solid #888;}

/* Simula una cornice unica attorno al blocco tbody */
#fg_body {
  border: 3px ridge rgb(0 64 64); /* bordo esterno del blocco */
}
#fg_body td:first-child { text-align: right}
#fg_body tr:nth-child(2n+1) {background: #EEE;}
#fg_body tr:nth-child(2n+2) {background: #DDD;}
/* Nessun bordo in thead e tfoot */
#fg_foot td {border: none;}
#fg_close {color:red;cursor: pointer;}
</style>
<table id='fg_table'>
  <caption>
    Data received
  </caption>
<tbody id='fg_body'>  
<?php
ksort($_REQUEST,SORT_STRING|SORT_FLAG_CASE);
foreach ($_REQUEST as $key => $value) {
	if (is_array($value)) $value = implode(", ",$value);
	echo "<tr><td>$key<td>$value";
}
foreach ($_FILES as $k => $fl) {
	echo "<tr><td colspan='2' style='text-align:center'>$k";
	foreach ($fl as $item => $value) {
		echo "\n<tr><td>$item<td>$value";
	}
}
?>
</tbody>
<tfoot id='fg_foot'><tr><th colspan='2' style='text-align:center'id='fg_Cancel'>
<?php
echo insertCancel();
?>
</th></tr></tfoot>
</table>