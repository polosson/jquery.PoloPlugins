
(function($) {
	/**
	 * Ajax action handling
	 * @param {OBJECT} options The settings above
	 *		@setting {STRING} submit		The submit button's identifier (css selector)
	 * @returns {OBJECT} the jQuery object instance
	 */
	$.fn.ajaxActions = function(options){
		// Multiple elements support
		if (this.length > 1){
			this.each(function(){
				$(this).ajaxActions(options);
			});
			return this;
		}
		/**
		 * GLOBAL VARS
		 */
		var table		= this;
		var buttons		= table.find('button[data-button-action]');
		var destination	= table.data('destination');
		var params		= {};
		buttons.prop('disabled', null);

		/**
		 * Defaults functions and callbacks
		 * You can create more action's functions, while initializing the plugin.
		 * All you have to do is to be sure the name of the function matches the "data-button-action" attribute.
		 */
		var defaults = {
			"add":	   function(dataSet,dataID) { return addRow(dataSet); },
			"edit":	   function(dataSet,dataID) { return editRow(dataSet,dataID); },
			"delete":  function(dataSet,dataID) { return delRow(dataSet,dataID); },
			"submit":  function(dataSet,dataID) { return initSubmitParams(dataSet,dataID); },
			"cancel":  function(dataSet,dataID) { return resetParams(dataSet,dataID); },
			onSuccess: function(R){
				$.messageBox({"cssClass":'alert-success', "message":R.message});
				if (params['action'] === "add")
					addRowToTable(R.data.newData);
				if (params["action"] === "edit")
					updateTableRow(R.data.newData, R.data.rowID);
				else
					resetParams(params['dataSet'], params["rowID"]);
			},
			onFail:	function(R){
				$.messageBox({"cssClass":'alert-danger', "message":"Server error:<br />"+R.message});
			}
		};
		var opts = $.extend({}, defaults, options);

		/**
		 * Listen clicks on action buttons to execute the associated function
		 */
		table.off('click', "button[data-button-action]");
		table.on('click', "button[data-button-action]", function(){
			var action	= $(this).data('button-action');
			var dataSet	= $(this).parents('[data-set]').data('set');
			var dataID	= $(this).parents('[data-row-id]').data('row-id');
			try {
				if (!opts[action])
					throw "This action does not have an assigned function.<br />Please create the function <b>'"+action+"'</b> in the plugin's settings.";
				if (opts[action](dataSet,dataID) !== true)
					return;
				if (typeof params !== 'object')
					throw "No parameters to send (expected an object). There might be an error.";
				if (!params['action'] || params['action'] == "")
					params['action'] = action;
				postParams();
			}
			catch(err) {
				$.messageBox({"cssClass":'alert-danger', "message":err});
			}
		});

		/**
		 * Add function : to add a row
		 * @param {STRING} dataSet The data name (i.e. SQL table)
		 * @returns {OBJECT} The new row's data
		 */
		function addRow(dataSet){
			$.messageBox({"message":"Adding a row in '"+dataSet+"'..."});
			params = {"action":"add", "rowID":0};
			buttons.prop('disabled', 'disabled');
			var line = '<tr data-row-id="0">';
			table.find('th').each(function(){
				var field	 = $(this).data("field");
				var editable = $(this).data("editable");
				line += '<td data-field="'+field+'" data-editable="'+editable+'">';
				if (editable)
					line += '<input type="text" class="form-control input-sm" />';
				if (field === "__actions")
					line += '<div class="btn-group">'
								+'<button class="btn btn-sm btn-success" data-button-action="submit">OK</button> '
								+'<button class="btn btn-sm btn-warning" data-button-action="cancel">Cancel</button>'
							+'</div>';
				line += '</td>';
			});
			line += '</tr>';
			var $line = $(line);
			table.find('tbody').prepend($line);
			return false;
		}
		/**
		 * Edit function : to edit a row
		 * @param {STRING} dataSet The data name (i.e. SQL table)
		 * @param {STRING} dataID The ID of the row
		 * @returns {OBJECT} The row's new data, and its ID
		 */
		function editRow(dataSet, dataID){
			$.messageBox({"message":"Editing the row #"+dataID+" in '"+dataSet+"'..."});
			params = {"action":"edit", "rowID":dataID};
			buttons.prop('disabled', 'disabled');
			var $line = $('tr[data-row-id="'+dataID+'"]');
			table.find('th').each(function(){
				var editable = $(this).data("editable");
				var fieldName = $(this).data("field");
				if (!editable && fieldName !== "__actions") return true;
				var $field	 = $line.find('td[data-field="'+fieldName+'"]');
				if (fieldName == "__actions") {
					$field.html('<div class="btn-group">'
									+'<button class="btn btn-sm btn-success" data-button-action="submit">OK</button> '
									+'<button class="btn btn-sm btn-warning" data-button-action="cancel">Cancel</button>'
								+'</div>');
					return true;
				}
				var oldVal	 = $field.data("value");
				$field.html('<input type="text" class="form-control input-sm" data-old-value="'+oldVal+'" value="'+oldVal+'" />');
			});
			return false;
		}
		/**
		 * Del function : to delete a row
		 * @param {STRING} dataSet The data name (i.e. SQL table)
		 * @param {STRING} dataID The ID of the row
		 * @returns {OBJECT} The row's ID
		 */
		function delRow(dataSet, dataID){
			if (!confirm("Delete this entry? Sure?")) return false;
			$.messageBox({"message":"Deleting the row #"+dataID+" in '"+dataSet+"'..."});
			params = {"action":"delete", "rowID":dataID};
			return true;
		}

		/**
		 * Click on valid button
		 * @param {STRING} dataSet The data name (i.e. SQL table)
		 * @param {STRING} dataID The ID of the row
		 * @returns {TRUE}
		 */
		function initSubmitParams(dataSet, dataID) {
			params['dataSet'] = dataSet;
			params['newData'] = {};
			var $line = $('tr[data-row-id="'+dataID+'"]');
			$line.find('input').each(function(){
				var field = $(this).parent('td').data('field');
				var value = $(this).val();
				params["newData"][field] = value;
			});
			return true;
		}

		/**
		 * Click on cancel button
		 * @param {STRING} dataSet The data name (i.e. SQL table)
		 * @param {STRING} dataID The ID of the row
		 * @returns {FALSE}
		 */
		function resetParams(dataSet, dataID) {
			var inputsLine = $('tr[data-row-id="'+dataID+'"]');
			if (["add","delete"].indexOf(params['action']) != -1)
				inputsLine.remove();
			if (params['action'] === "edit") {
				inputsLine.find('input').each(function(){
					var oldVal = $(this).data('old-value');
					var field  = $(this).parents('td').data("field");
					var model  = table.find('tfoot td[data-field="'+field+'"]').html();
					$(this).parent('td').html(model.replace(/\{\{val\}\}/, oldVal));
					$(this).remove();
				});
				var btnModel = table.find('tfoot td[data-field="__actions"]').html();
				inputsLine.find('td[data-field="__actions"]').html(btnModel);
			}
			$.messageBox({"message":""});
			params = {};
			buttons = table.find('button[data-button-action]');
			buttons.prop('disabled', null);
			return false;
		}

		/**
		 * Process the ajax POST
		 */
		function postParams() {
			console.log(params);
			$.post(destination, params, function(R){
				if (R.error == 'OK')
					opts.onSuccess(R);
				else
					opts.onFail(R);
			}, 'json');
		}

		/**
		 * Add a line to the table
		 * @param {OBJECT} rowData The data of the line to add.
		 */
		function addRowToTable(rowData) {
			var line = '<tr data-row-id="'+rowData["id"]+'">';
			table.find('th').each(function(){
				var field	 = $(this).data("field");
				var editable = $(this).data("editable");
				var model	 = table.find('tfoot td[data-field="'+field+'"]').html();
				line += '<td data-field="'+field+'" data-editable="'+editable+'" data-value="'+rowData[field]+'">'
						+ model.replace(/\{\{val\}\}/, rowData[field])
					+ '</td>';
			});
			line += '</tr>';
			table.append(line);
			buttons = table.find('button[data-button-action]');
			buttons.prop('disabled', null);
		}

		/**
		 * Update a line of the table after an edit
		 * @param {OBJECT} rowData The new data of the edited line.
		 */
		function updateTableRow(rowData, dataID) {
			var inputsLine = $('tr[data-row-id="'+dataID+'"]');
			inputsLine.find('input').each(function(){
				var field  = $(this).parents('td').data("field");
				var model  = table.find('tfoot td[data-field="'+field+'"]').html();
				$(this).parent('td').html(model.replace(/\{\{val\}\}/, rowData[field]));
				$(this).remove();
			});
			var btnModel = table.find('tfoot td[data-field="__actions"]').html();
			inputsLine.find('td[data-field="__actions"]').html(btnModel);
			buttons = table.find('button[data-button-action]');
			buttons.prop('disabled', null);
		}

		return this;
	};
}(jQuery));