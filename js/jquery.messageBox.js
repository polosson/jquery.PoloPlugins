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
			'message': "",
			'closeBtn': "x"
		};
		var opts = $.extend({}, defaults, options);
		clearTimeout(window.sto);
		$(opts.identifier).show().removeClass('hide alert-success alert-info alert-warning alert-danger').addClass(opts.cssClass);
		var msgDiv = $('<div class="mBmsg"></div>');
		msgDiv.html(opts.message);
		$(opts.identifier).html('').append(msgDiv);
		$(opts.identifier).prepend('<span class="close">'+opts.closeBtn+'</span>');
		$(opts.identifier).off('click', '.close');
		$(opts.identifier).on('click', '.close', function(){ $(this).parents(opts.identifier).fadeOut(500); });
		if (opts.cssClass == 'alert-info' || opts.cssClass == 'alert-danger') return;
		window.sto = setTimeout(function(){ $(opts.identifier).fadeOut(1500); }, 3000);
	};

	/**
	 * Listen to AJAX XHR errors
	 */
	$(document).off("ajaxError");
	$(document).on("ajaxError", function(e,x,s,thrownError){
		var msg = "Sorry, an error occured :<br />"+thrownError+"<br />"+x.responseText;
		$.messageBox({"cssClass":"alert-danger", "message":msg});
	});
	/**
	 * Listen to AJAX start/stop (i.e. to show a loading icon or text while sending ajax requests)
	 */
	$(document).ajaxStart(function(){
		$("#ajaxLoader").show();
		$('body').css('cursor', 'wait');
	});
	$(document).ajaxStop(function(){
		$("#ajaxLoader").hide();
		$('body').css('cursor', 'auto');
	});

}(jQuery));