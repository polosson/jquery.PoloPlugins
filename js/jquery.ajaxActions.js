
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
		 * Defaults functions and callbacks
		 * You can create more action's functions, while initializing the plugin.
		 * All you have to do is to be sure the name of the function matches the action name...
		 */
		var defaults = {
			"add":	   function(dataSet,dataID) { return addFunc(dataSet); },
			"edit":	   function(dataSet,dataID) { return editFunc(dataSet,dataID); },
			"delete":  function(dataSet,dataID) { return delFunc(dataSet,dataID); },
			onSuccess: function(R){
				$.messageBox({"cssClass":'alert-success', "message":R.message});
			},
			onFail:	function(R){
				$.messageBox({"cssClass":'alert-danger', "message":"Server error:<br />"+R.message});
			}
		};
		var table = this;
		var opts = $.extend({}, defaults, options);
		var buttons = table.find('button[data-button-action]');

		/**
		 * Listen clicks on action buttons to execute the associated function
		 */
		buttons.off('click');
		buttons.on('click', function(){
			var dest	= $(this).data('destination');
			var action	= $(this).data('button-action');
			var dataSet	= $(this).parents('[data-set]').data('set');
			var dataID	= $(this).parents('[data-row-id]').data('row-id');
			try {
				if (!opts[action])
					throw "This action does not have an assigned function.<br />Please create the function <b>'"+action+"'</b> in the plugin's settings.";
				var params = opts[action](dataSet,dataID);
				if (!params) return;
				if (typeof params !== 'object')
					throw "The function <b>'"+action+"'</b> does not return any parameters to send (expected an object). There might be an error.";
				params["action"]  = action;
				params["dataSet"] = dataSet;
				$.post(dest, params, function(R){
					if (R.error == 'OK')
						opts.onSuccess(R);
					else
						opts.onFail(R);
				}, 'json');
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
		function addFunc(dataSet){
			$.messageBox({"message":"Adding a row in '"+dataSet+"'..."});
			// todo
			return {"newData":"TODO"};
		}
		/**
		 * Edit function : to edit a row
		 * @param {STRING} dataSet The data name (i.e. SQL table)
		 * @param {STRING} dataID The ID of the row
		 * @returns {OBJECT} The row's new data, and its ID
		 */
		function editFunc(dataSet, dataID){
			$.messageBox({"message":"Editing the row #"+dataID+" in '"+dataSet+"'..."});
			// todo
			return {"rowID":dataID, "newData":"TODO"};
		}
		/**
		 * Del function : to delete a row
		 * @param {STRING} dataSet The data name (i.e. SQL table)
		 * @param {STRING} dataID The ID of the row
		 * @returns {OBJECT} The row's ID
		 */
		function delFunc(dataSet, dataID){
			if (!confirm("Delete this entry? Sure?")) return false;
			$.messageBox({"message":"Deleting the row #"+dataID+" in '"+dataSet+"'..."});
			return {"rowID":dataID};
		}

		return this;
	};
}(jQuery));