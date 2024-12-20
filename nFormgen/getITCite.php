<?php
// parameters
//	none	at every call send a new quote
//  CR		change the Carriage Return into <br>
//	n=items	return the quote[items]
$ITCite = array(
	["Alan Perlis","Syntactic sugar causes cancer of the semicolon."],
	["Edsger Dijkstra","Object-oriented programming is an exceptionally bad idea which could only have originated in California."],
	["Edsger Dijkstra","It is practically impossible to teach good programming to students that have had a prior exposure to BASIC: as potential programmers they are mentally mutilated beyond hope of regeneration."],
	["Edsger Dijkstra","When FORTRAN has been called an infantile disorder, full PL/1, with its growth characteristics of a dangerous tumor, could turn out to be a fatal disease."],
	["Alan Perlis","When someone says I want a programming language in which I need only say what I wish done, give him a lollipop."],
	["Bjarne Stroustrup","If someone claims to have the perfect programming language, he is either a fool or a salesman or both."],
	["Bruce Powel Douglass","C treats you like a consenting adult. Pascal treats you like a naughty child. Ada treats you like a criminal."],
	["Edsger Dijkstra","APL is a mistake, carried through to perfection. It is the language of the future for the programming techniques of the past: it creates a new generation of coding bums."],
	["Anonymous","APL is a write only language"],
	["Robert Firth","One of the main causes of the fall of the Roman Empire was that, lacking zero, they had no way to indicate successful termination of their C programs."],
	["Alan Perlis","LISP programmers know the value of everything and the cost of nothing."],
	["Nicklaus Wirth","Software is getting slower more rapidly than hardware becomes faster."],
	["Edsger Dijkstra","La simplicité est une condition préalable à la fiabilité."],
	["Alan Perlis","Every program has (at least) two purposes: the one for which it was written, and another for which it wasn't."],
	["Erik Christopher Zeeman","Technical skill is mastery of complexity, while creativity is mastery of simplicity."],
	["Alan Perlis","There are two ways to write error-free programs; only the third one works."],
	["Alan Perlis","C programmers never die. They are just cast into void."],
	["Alan Perlis","A year spent in artificial intelligence is enough to make one believe in God."],
	["Alan Perlis","A language that doesn't affect the way you think about programming is not worth knowing."],
	["Geoge Steiner","Language is the main instrument of man’s refusal to accept the world as it is."]);
$cr = "<br>";
if (isset($_REQUEST["CR"])) {
	$cr = "\r\n";
}
if (isset($_REQUEST["n"])) {
	 $n = $_REQUEST["n"];	 
} else {
	 $n = mt_rand(0,count($ITCite)-1); 
}
echo $ITCite[$n][0].$cr.$ITCite[$n][1];
?>