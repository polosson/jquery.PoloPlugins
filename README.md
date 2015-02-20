## jquery.ajaxPostForm.js
A jquery plugin to help work with ajax forms.

Started with JQuery 2.0.1, and using Bootstrap CSS classes | Licence: GNU Affero 3.0

### Basic
With a collection of inputs, textareas and selects within a &lt;div&gt; (or other container, like &lt;form&gt; or &lt;section&gt;), you can just add this when DOM is ready:

`$('#yourFormDiv').ajaxPostForm();`

This div **must contain** a button or submit that have the class `.submitBtn`, and the `data-` attributes:
- `data-destination="path/to/serverActionProcess.php"`
- `data-action="actionName"`

Additionnal parameters can also be sent with the `data-extra-params` attribute. For more options see above

### More options & callbacks
Here is an example of all options and callbacks functions you can use:
<pre>
$('#yourFormDiv, #anotherOne').ajaxPostForm({
	'submit': '.submitBtn',		// The CSS selector to identify the form's submit button
	'minInputLength': 4,		// Global minimum length for the input or textarea fields
	'maxInputLength': 20,		// Global maximum length for the input or textarea fields (0 = no limit)
	'extraParams': {			// Global additionnal parameters to send (can be null)
		"happy":"yes",
		"tired":"nope"
	},
	onSubmit: function(R){		// Invoked when submit button clicked
		// R is an object with :
		//		R.params	-> the request (object) that will be posted,
		//		R.message	-> The string "Sending request..."
		console.log(R.data, R.message);
		// Must return TRUE in order to continue.
		return true;			// If returns FALSE, the request won't be sent.
	},
	onSuccess: function(R){		// Invoked when post request succeed
		// R is an object with :
		//		R.error		-> The string "OK",
		//		R.message	-> The success message irself (server response)
		console.log(R.error, R.message);
	},
	onFail: function(R){		// Invoked when post request failed
		// R is an object with :
		//		R.error		-> The string "error",
		//		R.message	-> The error message itself
		console.log(R.error, R.message);
	}
});
</pre>

### Submit button inline parameters
These are "data-" attributes on submit button:
<pre>
data-destination	-> string : The path to the server for the POST request *REQUIRED*
data-action			-> string : The name of the action to send to the server *REQUIRED*
data-extra-params	-> object : Some additionnal parameters to send to the server (optionnal)
</pre>

### Fields inline parameters
These are "data-" attributes on form fields, to specify some extra options for validation:
<pre>
data-rules: {"r":(bool),"m":(int),"M":(int),"f":(str)}
	r -> boolean (1 || 0) : Makes the field mandatory if 1
	m -> integer : Minimum length of input or textarear field
	M -> integer : Maximum length of input or textarear field
	f -> string  : Function name to validate the field ("email", "password", or "phone")
</pre>

### Message box utility
There is a little utility which is used to display response / error messages from the server, and which can be used to display any message you want.

`$.messageBox({"cssClass":'alert-info',"message":"your message"});`

## jquery.ajaxActions.js
*TODO...*

That's it... Have fun!
