describe('jQuery Valium', function () {

	beforeEach(function (){
		this.addMatchers({
			toBeInstanceOf: function(klass){ return this.actual instanceof klass; }
		});
	});

	it('should support jQuery chaining', function () {
		var form = build();
		var returnValue = form.valium();

		expect(returnValue).toBeInstanceOf(jQuery);
	});

	it('should validate empty forms', function(){
		var form = build();
		form.valium();

		expect(form.valium('isValid')).toBe(true);
	});


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
		}
	};

});
