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

	it('should validate with no rules specified', function(){
		var form = build(function(form){
			form.text('field1');
		});
		form.valium();

		expect(form.valium('isValid')).toBe(true);
		expect(form.find('#field1').valium('isValid')).toBe(true);
	});

	it('form should be invalid when at least one field is invalid', function(){
		var form = build(function(form){
			form.text('field1');
			form.text('field2');
		});
		form.valium({field1:{required:{message:'required'}}});

		expect(form.find('#field1').valium('isValid')).toBe(false);
		expect(form.find('#field2').valium('isValid')).toBe(true);
		expect(form.valium('isValid')).toBe(false);
	});
	
	it('form should validate when all fields are valid', function(){
		var form = build(function(form){
			form.text('field1');
			form.text('field2');
			form.text('field3');
		});
		form.valium({
			field1:{required:{message:'required'}},
			field2:{required:{message:'required'}},
			field3:{required:{message:'required'}}
		});
		form.find('#field1').val('something');
		form.find('#field2').val('something');
		form.find('#field3').val('something');

		expect(form.find('#field1').valium('isValid')).toBe(true);
		expect(form.find('#field2').valium('isValid')).toBe(true);
		expect(form.find('#field3').valium('isValid')).toBe(true);
		expect(form.valium('isValid')).toBe(true);
	});

	it('should validate textboxes', function(){
		var form = build(function(form){
			form.text('field');
		});
		form.valium({field:{required:{message:'required'}}});
		expect(form.find('#field').valium('isValid')).toBe(false);
	});

	it('should validate textareas', function(){
		var form = build(function(form){
			form.textArea('field');
		});
		form.valium({field:{required:{message:'required'}}});
		expect(form.find('#field').valium('isValid')).toBe(false);
	});
	
	it('should validate dropdowns', function(){
		var form = build(function(form){
			form.select('field', {'':'(choose)', key1:'value1', key2:'value2'});
		});
		form.valium({field:{required:{message:'required'}}});
		expect(form.find('#field').valium('isValid')).toBe(false);
	});

	it('should validate checkboxes', function(){
		var form = build(function(form){
			form.check('field');
		});
		form.valium({field:{required:{message:'required'}}});
		expect(form.find('#field').valium('isValid')).toBe(false);
	});

	it('should validate radio buttons', function(){
		var form = build(function(form){
			form.radio('field', {key1:'value1', key2:'value2'});
		});
		form.valium({field:{required:{message:'required'}}});
		expect(form.find(':input[name=field]').valium('isValid')).toBe(false);
	});

});
