<?php
error_reporting(E_ALL & ~E_NOTICE);
// Do some access auth checks here

extract($_POST);

$retour['error'] = 'error';
$retour['message'] = "Action '$action' unknown.";

try {

	if ($action == 'testOne') {
		$retour['error'] = 'OK';
		$retour['message'] = "OK, well done n°1";
		$retour['data'] = $data;
	}

	if ($action == 'testTwo') {
		$retour['error'] = 'OK';
		$retour['message'] = "OK, well done n°2";
		$retour['data'] = $data;
	}

}
catch(Exception $e) { $retour['message'] = $e->getMessage(); }

echo json_encode($retour, JSON_UNESCAPED_UNICODE);