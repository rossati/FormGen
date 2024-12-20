<?php
$images = array(
	["Rabbit lake","images/RabbitLake.jpg"],
	["Bukavu - DR Congo","images/Bukavu.png"],
	["Brousse on Burkina","images/Burkina.png"],
	["Mount Olympus","images/Olimpo.jpg"],
	["Conte Verde","images/ConteVerde.jpg"],
	["Sacra di San Michele","images/SagraSanMichele.png"]);	
$n = mt_rand(0,count($images)-1); 
if (!isset($_REQUEST["NoTitle"])) echo $images[$n][0].":";
echo $images[$n][1];
?>