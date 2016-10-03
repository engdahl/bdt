<?php
$curl = curl_init();

curl_setopt_array($curl, array(
	CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'http://bouvet.guru/rekrytering_flera.php'
));

$res = curl_exec($curl);

$arr_lines = array_filter(explode(PHP_EOL, $res));

$arr_result = [];
$i = 0;
foreach($arr_lines as $line) {
	if(substr($line, 0, 7) == 'http://') { // Get only the relevant lines
		if(strpos($line, ' ') > -1) {
			$arr_result[$i]['url'] = substr($line, 0, strpos($line, ' '));
			$arr_result[$i]['comment'] = substr($line, strpos($line, ' '));
			$i++;
		} else {
			$arr_result[$i]['url'] = $line;
			$arr_result[$i]['comment'] = 'No comment provided';
			$i++;
		}
	}
}

// This block is optional, we're just making sure the image url actually resolves to something. This slows everything down of course but might be worth it in some cases. No foreach because we need the index later.
// ------------------------------------------------------------------------------------------------
$arr_invalid = [];
foreach($arr_result as $key => $value) { 
	curl_setopt_array($curl, array(
		CURLOPT_RETURNTRANSFER => 1,
    	CURLOPT_URL => $value['url']
    ));

    $res = curl_exec($curl);

    if(@!imagecreatefromstring($res)) { // If this returns true we have an actual image. We use this instead of checking content-type in curl because that is not a reliable value.
    	array_push($arr_invalid, $value);
    	$arr_result[$key] = '';
    }
}
// ------------------------------------------------------------------------------------------------

$arr_valid = array_filter($arr_result);

if(count($arr_valid) > 0) {
	$arr_combined['valid'] = array_values($arr_valid);
}
if(count($arr_invalid) > 0) {
	$arr_combined['invalid'] = array_values($arr_invalid);
}

if(isset($arr_combined) && count($arr_combined) > 0) {
	echo json_encode($arr_combined);
} else {
	echo 0;
}