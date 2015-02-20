var sto;
(function($) {
	/**
	 * Display a message in a div
	 * @setting STRING identifier	The div's identifier (css selector)
	 * @setting STRING cssClass		The class name to set on the div
	 * @setting STRING message		The message to display
	 * @returns null
	 */
	$.messageBox = function(options) {
		var defaults = {
			'identifier': "#messageBox",
			'cssClass': 'alert-info',
			'message': ""
		};
		var opts = $.extend({}, defaults, options);
		clearTimeout(window.sto);
		$(opts.identifier).show().removeClass('hide alert-success alert-info alert-warning alert-danger').addClass(opts.cssClass);
		$(opts.identifier).find('.message').html(opts.message);
		if (opts.cssClass == 'alert-info' || opts.cssClass == 'alert-danger') return;
		window.sto = setTimeout(function(){ $(opts.identifier).fadeOut(1500); }, 3000);
	};

	/**
	 * Ajax posting form
	 * @param {OBJECT} options The settings above
	 *		@setting {STRING} submit		The submit button's identifier (css selector)
	 *		@setting {STRING} messageBox	The ajax return messages div's identifier (css selector)
	 *		@setting {FUNCTION} onSubmit	Callback function when submit button is clicked
	 *		@setting {FUNCTION} onSuccess	Callback function when ajax request successful
	 *		@setting {FUNCTION} onFail		Callback function when ajax request failed or error occured
	 * @returns {OBJECT} the jQuery object instance
	 */
	$.fn.ajaxPostForm = function(options){
		// Multiple elements support
		if (this.length > 1){
			this.each(function(){
				$(this).ajaxPostForm(options);
			});
			return this;
		}
		var form = this, stop = false, problems = "";
		/**
		 * Defaults settings and callbacks
		 */
		var defaults = {
			'submit': '.submitBtn',
			'minInputLength': 4,
			'maxInputLength': 0,
			'extraParams': null,
			onSubmit: function(R){
				$.messageBox({"cssClass":'alert-info', "message":R.message});
				return true;
			},
			onSuccess: function(R){
				$.messageBox({"cssClass":'alert-success', "message":R.message});
			},
			onFail: function(R){
				$.messageBox({"cssClass":'alert-danger', "message":R.message});
			}
		};

		var opts = $.extend({}, defaults, options);

		/**
		 * Listen to AJAX XHR errors
		 */
		$(document).off("ajaxError");
		$(document).on("ajaxError", function(e,x,s,thrownError){
			var msg = "Sorry, an error occured :<br />"+thrownError+"<br />"+x.responseText;
			opts.onFail({"error":"error", "message":msg});
		});
		/*
		 * Listen clicks on submit buttons to send data via POST request
		 */
		this.off('click', opts.submit);
		this.on('click', opts.submit, function(e){
			e.preventDefault();
			stop = false;
			try {
				var dest = $(this).data('destination');
				var params = getExtraParams();
				params["data"] = getAjaxForm();
				params["action"] = $(this).data('action');
				if (!opts.onSubmit({"params":params,"message":"Sending request..."}))
					return;
				if (!dest)
					throw "No destination specified... ('data-destination' attribute expected on the submit button)";
				if (!params["action"])
					throw "No action specified... ('data-action' attribute expected on the submit button)";
				if (stop)
					throw "Something is wrong:<ul>"+problems+"</ul>";
				$.post(dest, params, function(R){
					if (R.error == 'OK')
						opts.onSuccess(R);
					else
						opts.onFail(R);
				}, 'json');
			}
			catch(err) {
				opts.onFail({"error":"error","message":err});
			}
		});
		/**
		 * Initialize parameters of the POST request, and populate with option, or data-attribute
		 * @returns {OBJECT} extra parameters, or empty object
		 */
		function getExtraParams() {
			var params = form.find(opts.submit).data("extra-params");
			if (!params)
				params = opts.extraParams;
			return params || {};
		}
		/**
		 * Get the form data
		 * @returns {OBJECT} values of the form within an object
		 */
		function getAjaxForm() {
			var values = {};
			problems = "";
			form.find('input, textarea, select').each(function(i, elem){
				var type  = $(elem).prop('type');
				var name  = $(elem).prop('name');
				var value = $(elem).val();
				if (!validate(elem, value)) return true;
				if (type === 'checkbox') {
					if ($(elem).parent('label').hasClass('active')) {
						if (!values[name]) values[name] = new Array();
						values[name] = values[name].concat(value);
					}
					return true;
				}
				values[name] = value;
			});
			return values;
		}
		/**
		 * Validate an input or textarea 's value according to its data- attributes
		 * @param {OBJECT} elem		jquery dom element's instance
		 * @param {STRING} value	The value of the element
		 * @returns {BOOL} True if Ok, False if invalid
		 */
		function validate(elem, value) {
			var type  = $(elem).prop('type');
			var name  = $(elem).prop('name');
			var rules = $(elem).data('rules');
			var ok = true;
			$(elem).parent().removeClass('has-error');
			if (type === "text" || type === "password" || $(elem).is('textarea')){
				if ((rules && rules.m && value.length < rules.m) || value.length < opts.minInputLength) {
					ok = false;
					if (rules && rules.r === 1){
						problems += "<li>The '"+name+"' field is too short.</li>";
						stop = true;
					}
				}
				if ((rules && rules.M && value.length > rules.M) || (opts.maxInputLength !== 0 && value.length > opts.maxInputLength)) {
					ok = false;
					if (rules.r === 1){
						problems += "<li>The '"+name+"' field is too long.</li>";
						stop = true;
					}
				}
				if (rules && rules.f) {
					ok = checkFormat(rules.f, value);
					if (!ok && rules.r === 1){
						problems += "<li>The '"+name+"' field is invalid ('"+rules.f+"' format expected).</li>";
						stop = true;
					}
				}
			}
			if ($(elem).is('select') && (value === null || value === "")) {
				ok = false;
				if (rules && rules.r === 1){
					problems += "<li>The '"+name+"' field is missing.</li>";
					stop = true;
				}
			}
			if (type === 'radio') {
				if (!$(elem).parent('label').hasClass('active'))
					ok = false;
			}
			if (!ok && rules && rules.r === 1 && stop)
				$(elem).parent().addClass('has-error');
			return ok;
		}
		/**
		 *
		 * @param {STRING} type The format type ('email', 'password', or 'phone')
		 * @param {STRING} value The value to check
		 * @returns {BOOL} True if check passed, False otherwise
		 */
		function checkFormat(type, value){
			if (type === "email")
				return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(value));
			else if (type === "password")
				return (/^[\w&.\-\*]+$/.test(value));
			else if (type === "phone")
				return (/^[0-9]+$/.test(value));
			else return true;
		}

		return this;
	};
}(jQuery));