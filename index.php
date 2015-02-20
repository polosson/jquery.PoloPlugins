<!DOCTYPE html>
<html>
	<head>
		<title>jQuery.ajaxPostForm</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="author" content="polosson">

		<link rel="stylesheet" href="css/bootstrap.min.css" />
		<link rel="stylesheet" href="css/font-awesome.min.css" type="text/css"/>
		<script src="js/jquery-2.0.1.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="js/jquery.ajaxPostForm.js"></script>
	</head>
	<body>
		<div class="container-fluid">
			<div class="col-lg-6">
				<h3>Jquery plugin to send form via ajax POST</h3>
				<div id="testform" style="margin-top: 20px;">
					<div class="row">
						<div class="col-lg-2 text-right">
							INPUT
						</div>
						<div class="col-lg-10">
							<input type="text" class="form-control" autocomplete="off" name="input" />
						</div>
					</div>
					<div class="row">
						<div class="col-lg-2 text-right">
							PASSWORD
						</div>
						<div class="col-lg-10">
							<input type="password" class="form-control" autocomplete="off" name="passwd" />
						</div>
					</div>
					<div class="row">
						<div class="col-lg-2 text-right">
							TEXT
						</div>
						<div class="col-lg-10">
							<textarea class="form-control" autocomplete="off" data-rules='{"r":1}' name="textarea"></textarea>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-2 text-right">
							SELECT
						</div>
						<div class="col-lg-10">
							<select class="form-control" name="select">
								<option value=""></option>
								<option value="opt2">Option 2</option>
								<option value="opt3">Option 3</option>
								<option value="opt4">Option 4</option>
								<option value="opt5">Option 5</option>
							</select>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-2 text-right">
							MULTI SELECT
						</div>
						<div class="col-lg-10">
							<select class="form-control" style="height: 120px;" name="multiselect" multiple>
								<option value="opt1">Option 1</option>
								<option value="opt2">Option 2</option>
								<option value="opt3">Option 3</option>
								<option value="opt4">Option 4</option>
								<option value="opt5">Option 5</option>
							</select>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-2 text-right">
							CHECKBOXES
						</div>
						<div class="col-lg-10">
							<div class="btn-group" data-toggle="buttons">
								<label class="btn btn-sm btn-default active">
									<input type="checkbox" name="checkboxes" autocomplete="off" value="chk1" /> Checkbox 1
								</label>
								<label class="btn btn-sm btn-default">
									<input type="checkbox" name="checkboxes" autocomplete="off" value="chk2" /> Checkbox 2
								</label>
								<label class="btn btn-sm btn-default">
									<input type="checkbox" name="checkboxes" autocomplete="off" value="chk3" /> Checkbox 3
								</label>
								<label class="btn btn-sm btn-default">
									<input type="checkbox" name="checkboxes" autocomplete="off" value="chk4" /> Checkbox 4
								</label>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-2 text-right">
							RADIOS
						</div>
						<div class="col-lg-10">
							<div class="btn-group" data-toggle="buttons">
								<label class="btn btn-sm btn-default active">
									<input type="radio" name="radios" autocomplete="off" checked="checked" value="rad1" /> Radio 1
								</label>
								<label class="btn btn-sm btn-default">
									<input type="radio" name="radios" autocomplete="off" value="rad2" /> Radio 2
								</label>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-2 text-right">
						</div>
						<div class="col-lg-10">
							<button class="btn btn-success submitBtn" data-destination="actions/A_test.php" data-action="testOne">SEND</button>
						</div>
					</div>
				</div>


				<div id="testform2" style="margin-top: 50px;">
					<div class="row">
						<div class="col-lg-2 text-right">
							USER
						</div>
						<div class="col-lg-10">
							<input type="text" class="form-control" name="user" autocomplete="off" data-rules='{"r":1}' value="polosson" />
						</div>
					</div>
					<div class="row">
						<div class="col-lg-2 text-right">
							PASSWORD
						</div>
						<div class="col-lg-10">
							<input type="password" class="form-control" name="pass" autocomplete="off" data-rules='{"r":1,"m":6,"M":20}' value='mlkqdsdknv' />
						</div>
					</div>
					<div class="row">
						<div class="col-lg-2 text-right">
						</div>
						<div class="col-lg-10">
							<button class="btn btn-success submitBtn"
									data-destination="actions/A_test.php"
									data-action="testTwo"
									data-extra-params='{"extra1":"wouzah", "extra2":"wazaa"}'>
								SEND
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="col-lg-6">
				<div class="row">
					<h3>Message box</h3>
					<div class="alert hide" style="margin-top: 20px;" id="messageBox">
						<div class="message"></div>
					</div>
				</div>
			</div>
		</div>
	</body>
<script>
	$(function(){
		$.messageBox({'message':"Welcome !!"});
		$('#testform, #testform2').ajaxPostForm({
//			'extraParams': {"extra1":"wouzah", "extra2":"wazaa"},
			onSuccess: function(R){
				$.messageBox({"cssClass":'alert-info', "message":R.message+'<pre>'+JSON.stringify(R.data)+'</pre>'});
			}
		});
	});
</script>

</html>
