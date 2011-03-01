function build(fields){
	var form = new Form();
	(fields || function(){})(form);
	$('#html-hook').empty();
	form.html.appendTo($('#html-hook'));
	return form.html;
};

var Form = function(){
	this.html = $('<form id="form"></form>');
};
Form.prototype = {
	text: function(name){
		$('<input type="text" id="' + name + '" name="' + name + '" />').appendTo(this.html);
	},
	textArea: function(name){
		$('<textarea id="' + name + '" name="' + name + '"></textarea').appendTo(this.html);
	},
	select: function(name, options){
		var select = $('<select id="' + name + '" name="' + name + '"></select>');
		$.each(options, function(value, text){
			select.append($('<option value="' + value + '">' + text + '</option>'));
		});
		select.appendTo(this.html);
	},
	check: function(name){
		$('<input type="check" id="' + name + '" name="' + name + '" />').appendTo(this.html);
	},
	radio: function(name, options){
		var form = this.html;
		$.each(options, function(value, text){
			form.append($('<input type="radio" id="' + name + '-' + value + '" name="' + name +'" value="' + value + '"/>'));
			form.append($('<label for="' + name + '-' + value + '">' + text + '</label>'));
		});
	}
};
