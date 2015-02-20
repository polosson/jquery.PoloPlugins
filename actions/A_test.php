<?php
error_reporting(E_ALL & ~E_NOTICE);

extract($_POST);

$retour['error'] = 'error';
$retour['message'] = "Action '$action' inconnue.";

try {

	if ($action == 'testOne') {
		$retour['error'] = 'OK';
		$retour['message'] = "OK tout va bien 1 !!";
		$retour['data'] = $data;
	}

	if ($action == 'testTwo') {
		$retour['error'] = 'OK';
		$retour['message'] = "OK tout va bien 2 !!";
		$retour['data'] = $data;
	}

}
catch(Exception $e) { $retour['message'] = $e->getMessage(); }

echo json_encode($retour, JSON_UNESCAPED_UNICODE);