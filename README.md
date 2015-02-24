## jquery.messageBox.js

#### Basic usage
First, create a hidden DIV or other HTML block, with **id="messageBox"**, somewhere in your html body.

`<div class="alert hide" id="messageBox"></div>`

Then, on DOM ready, just use:
<pre>$.messageBox({
	"cssClass": "alert-danger",
	"message": "Your error message"
});
</pre>

When **alert-success** and **alert-warning** classes are given, the message box will fade out 
automatically after **3 seconds**. With any other classes (like <i>"alert-info"</i> or <i>"alert-danger"</i>),
the message box will stay diplayed until you close it with the close button.

#### Options

There are 4 options available:
- **identifier** 	: The CSS selector for the div where to initialize the message box <i>(default "#messageBox")</i>
- **cssClass**   	: A CSS class to add to the message box (for design purpose) <i>(default "alert-info")</i>
- **message**		: The message to display <i>(default "")</i>
- **closeBtn**	: A string describing the close button <i>(default "x")</i>

<pre><code>$.messageBox({
	'identifier':	"#messageBox",
	'cssClass':	'alert-info',
	'message':	"Your info message",
	'closeBtn':	"x"
});</pre>

<hr />

## jquery.ajaxPostForm.js
A jquery plugin to help work with ajax forms.

Started with JQuery 2.0.1, and using Bootstrap CSS classes | Licence: GNU Affero 3.0

#### Basic usage

With a collection of inputs, textareas and selects within a &lt;div&gt; (or other container, like &lt;form&gt; or &lt;section&gt;), you can just add this when DOM is ready:

`$('#yourFormDiv').ajaxPostForm();`

This div **must contain** a button or submit input that have the class `.submitBtn`, and the following `data-` attributes:

#### Submit button inline parameters
<pre>
data-destination	-> string : Path to the server for the POST request *REQUIRED*
data-action			-> string : Name of the action to put in request *REQUIRED*
data-extra-params	-> object : Some additionnal parameters to send (optionnal)
</pre>

#### Options & callbacks

There are 4 options available:
- "submit"	: The CSS selector for the submit button (default ".submitBtn")
- "minInputLength" : Global minimum length for input or textarea fields (default 4)
- "maxInputLength"	: Global maximum length for input or textarea fields (0 = no limit) (default 0)
- "extraParams"	: Global additionnal parameters to send (can be null, to be set by inline 'data-' attributes) (default null)

There are 3 callbacks available:
- "onSubmit(R)"	: Invoked when the submit button is pressed. Must return TRUE in order to proceed submit (you can return FALSE, i.e. in case the user don't respect something). R is an object with: R.params -> the request (object) that will be posted, R.message -> The string "Sending request..."
- "onSuccess(R)"	: Invoked after post request succeeded. R is an object with: R.error -> The string "OK", R.message -> The success message itself (server response)
- "onFail(R)"	: Invoked when post request failed. R is an object with: R.error -> The string "error", R.message -> The error message itself

Example:
<pre>
$('#yourFormDiv, #anotherOne').ajaxPostForm({
	'submit': '.submitBtn',
	'minInputLength': 4,
	'maxInputLength': 20,
	'extraParams': {
		"happy":"yes",
		"tired":"nope"	// and as many as you need
	},
	onSubmit: function(R){
		console.log(R.data, R.message);
		// Must return TRUE in order to continue.
		return true;	// If returns FALSE, the request won't be sent.
	},
	onSuccess: function(R){
		console.log(R.error, R.message);
	},
	onFail: function(R){
		console.log(R.error, R.message);
	}
});
</pre>

#### Fields inline options (data- attributes on form fields)

One option is available to define rules for verification:
<pre>
data-rules: {"r":(bool),"m":(int),"M":(int),"f":(str)}
	r -> boolean (1 || 0) : Makes the field mandatory if 1
	m -> integer : Minimum length of input or textarear field
	M -> integer : Maximum length of input or textarear field
	f -> string  : Validation type for the field ("email", "password", or "phone")
</pre>

<hr />

## jquery.ajaxActions.js
A jquery plugin to help work with action buttons in a table of data.

Started with JQuery 2.0.1, and using Bootstrap CSS classes | Licence: GNU Affero 3.0

#### Basic usage

You must create a &lt;table&gt; with:
- The attributes `data-destination="path/to/server"` to define the location of the server side action handler, and `data-set="table_name"` to give the name of the data (i.e. SQL table name)
- In the **&lt;thead&gt;**, all &lt;th&gt;  must have the following attributes:
  * `data-editable="{true or false}"` : to tell if these data will be editable
  * `data-field="field_name"` : to give the data name of the column
  * The column where the action buttons will be must have attribute `data-field="__actions"`
- In the **&lt;tbody&gt;**:
  * each &lt;tr&gt must have the attribute `data-row-id=""` with the ID of the row.
  * each &lt;td&gt must have the attributes `data-field=""` that correspond to the data name of the column, and `data-value=""` which is the current value of the column for this row.
- The (hidden) **&lt;tfoot&gt;** must:
  * contain one row with exactly the same structure as one row of the &lt;tbody&gt;, except that the `data-value` attribute is not needed.
  * the string `{{val}}` is needed to describe the place where values will be displayed. (i.e. `<td data-field="id"># {{val}}</td>`) This way you can define custom classes, additionnal strings or html tags surronding the values.
- All **action buttons** must have the attributes `data-button-action="yourAction"`. There are 3 predefined actions:
  * "add": To add a row
  * "edit": To edit a row
  * "delete": To delete a row

Then you just have to add this when DOM is ready:

`$('#yourTable').ajaxActions();`

#### Example
Here is a basic usage example:
<pre>
&lt;table data-destination="actions/A_users.php" data-set="users" id="myActionTable"&gt;
	&lt;thead&gt;
		&lt;tr&gt;
			&lt;th data-editable="false" data-field="id"&gt;ID&lt;/th&gt;
			&lt;th data-editable="true"  data-field="name"&gt;Name&lt;/th&gt;
			&lt;th data-editable="true"  data-field="email"&gt;Email&lt;/th&gt;
			&lt;th data-editable="false" data-field="__actions"&gt;
				Actions &lt;button data-button-action="add"&gt;ADD&lt;/button&gt;
			&lt;/th&gt;
		&lt;/tr&gt;
	&lt;/thead&gt;
	&lt;tbody&gt;
		&lt;tr data-row-id="1"&gt;
			&lt;td data-field="id"	   data-value="1"&gt;# 1&lt;/td&gt;
			&lt;td data-field="name"  data-value="Polo"&gt;User &lt;b&gt;Polo&lt;/b&gt;&lt;/td&gt;
			&lt;td data-field="email" data-value="po@lo.son"&gt;&lt;a href="mailto:po@lo.son"&gt;po@lo.son&lt;/a&gt;&lt;/td&gt;
			&lt;td data-field="__actions"&gt;
				&lt;button data-button-action="edit"  &gt;Edit&lt;/button&gt;
				&lt;button data-button-action="delete"&gt;Delete&lt;/button&gt;
			&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/tbody&gt;
	&lt;tfoot class="hide"&gt;
		&lt;tr&gt;
			&lt;td data-field="id"&gt;# {{val}}&lt;/td&gt;
			&lt;td data-field="name"&gt;User &lt;b&gt;{{val}}&lt;/b&gt;&lt;/td&gt;
			&lt;td data-field="email"&gt;&lt;a href="mailto:{{val}}"&gt;{{val}}&lt;/a&gt;&lt;/td&gt;
			&lt;td data-field="__actions"&gt;
				&lt;button data-button-action="edit"  &gt;Edit&lt;/button&gt;
				&lt;button data-button-action="delete"&gt;Delete&lt;/button&gt;
			&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/tfoot&gt;
&lt;/table&gt;
&lt;script&gt;
	$(function(){							// Wait for DOM ready
		$('#myActionTable').ajaxActions();	// Plugin initialisation
	});
&lt;/script&gt;
</pre>

#### More options

Essentially, you can **set any action function** you need. You simply must be sure that the action name and its function name are the same.

Custom action's functions have **2 parameters** available, and **1 global** var is available to set:
- `dataSet`: the name of the data you specified on the table's `data-set` attribute
- `rowID`: the ID of the row given by the tr's `data-row-id` attribute
The global object variable **params** is available to define the request to send to the server.

A custom function must return a boolean:
- `TRUE` to proceed the ajax call right after the function finish
- `FALSE` to proceed later by clicking a `data-button-action="submit"` button that you create yourself.


Example of simple custom action button:
<pre>
&lt;table data-destination="actions/A_users.php" data-set="users" id="myActionTable"&gt;
	(...)
	&lt;button data-button-action="export"&gt;Export a row&lt;/button&gt;
	(...)
&lt;/table&gt;
</pre>

Now let's initialize our ajaxActions with a defined "export" method, which defines at the same time the params to pass via POST request: 
<pre>
$('#myActionTable').ajaxActions({
	"export": function(dataSet, rowID){	// custom function for action button "export"
		$.messageBox({"message":"Exporting #"+rowID+" from '"+dataSet+"'..."});
		params["dataSet"] = dataSet, params["rowID"] = rowID;
		return (confirm("Exporting this row to XML file ?"));
	}
});
</pre>

<hr />

That's it for now... Have fun!
