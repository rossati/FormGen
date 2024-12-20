<style>
td {
  border: 1px solid rgb(160 160 160);
  padding: 5px
}
caption {
  padding: 10px;
  font-weight: bold;
}
</style>
<table>
  <caption>
    Data received
  </caption>
<?php

ksort($_REQUEST,SORT_STRING|SORT_FLAG_CASE);
foreach ($_REQUEST as $key => $value) {
	if (is_array($value)) $value = implode(", ",$value);
	echo "<tr><td style='text-align:right'>$key<td>$value";
}
foreach ($_FILES as $k => $fl) {
	echo "<tr><td colspan='2'>$k";
	foreach ($fl as $item => $value) {
		echo "<tr><td>$item<td>$value";
	}
}
?>
</table>