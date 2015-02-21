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
		$retour['data'] = $_POST;
	}

	if ($action == 'testTwo') {
		$retour['error'] = 'OK';
		$retour['message'] = "OK, well done n°2";
		$retour['data'] = $_POST;
	}

	if ($action == 'add') {
		$retour['error'] = 'OK';
		$retour['message'] = "OK, the ROW was ADDED !!";
		$retour['data'] = $_POST;
		$retour['data']["newData"]['id'] = 4;
	}

	if ($action == 'edit') {
		$retour['error'] = 'OK';
		$retour['message'] = "OK, the ROW was EDITED !!";
		$retour['data'] = $_POST;
	}

	if ($action == 'delete') {
		$retour['error'] = 'OK';
		$retour['message'] = "OK, the ROW was DELETED !!";
		$retour['data'] = $_POST;
	}

}
catch(Exception $e) { $retour['message'] = $e->getMessage(); }

echo json_encode($retour, JSON_UNESCAPED_UNICODE);