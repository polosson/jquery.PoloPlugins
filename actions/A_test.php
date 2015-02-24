<?php /**
 *	Example of PHP ajax-actions treatment.
 *	License Creative Common "CC-BY-SA 4.0"
 *		http://creativecommons.org/licenses/by-sa/3.0/legalcode
 *		You can copy, redistribute and modify the code for any purpose, even commercially.
 *	Polosson 2015
 */
error_reporting(E_ALL & ~E_NOTICE);
/**
 * You can do some access auth checks here. Use:
 *		die({"error":"error", "message":"error message"});
 * to block access if needed.
 */

extract($_POST);

// Use the array $return to answer the request,
// with anything you want in addition to these 2 required:
$return['error'] = 'error';
$return['message'] = "Action '$action' unknown.";

try {

	if ($action == 'testOne') {
		// Treat the action here
		// Don't forget to use "throw" for your custom error reporting.
		// It will be treated as a normal error and will be smoothly collected
		// by the JS callbacks (see $.messageBox.js)
		$return['error'] = 'OK';
		$return['message'] = "OK, action testOne successful !";
		$return['data'] = $_POST;
	}

	if ($action == 'testTwo') {
		// Treat the action here
		$return['error'] = 'OK';
		$return['message'] = "OK, well done! Action 'testTwo' treated.";
		$return['data'] = $_POST;
	}

	if ($action == 'add') {
		// Treat the action here
		$return['error'] = 'OK';
		$return['message'] = "OK, the ROW was ADDED !!";
		$return['data'] = $_POST;
		$return['data']["newData"]['id'] = 4;
	}

	if ($action == 'edit') {
		// Treat the action here
		$return['error'] = 'OK';
		$return['message'] = "OK, the ROW was EDITED !!";
		$return['data'] = $_POST;
	}

	if ($action == 'delete') {
		// Treat the action here
		$return['error'] = 'OK';
		$return['message'] = "OK, the ROW was DELETED !!";
		$return['data'] = $_POST;
	}

}
catch(Exception $e) { $return['message'] = $e->getMessage(); }

echo json_encode($return, JSON_UNESCAPED_UNICODE);