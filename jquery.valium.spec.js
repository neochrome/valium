describe('jQuery Valium', function () {

	beforeEach(function (){
		this.addMatchers({
			toBeInstanceOf: function(klass){ return this.actual instanceof klass; }
		});
	});

	it('should support jQuery chaining when initializing', function () {
		var form = build();
		var returnValue = form.valium();

		expect(returnValue).toBeInstanceOf(jQuery);
	});

	
	describe('when querying form validity', function(){
		it('should be valid when empty', function(){
			var form = build();
			form.valium();

			expect(form.valium('isValid')).toBe(true);
		});

		it('should be valid when no rules are specified', function(){
			var form = build(function(form){
				form.text('field1');
			});
			form.valium();

			expect(form.valium('isValid')).toBe(true);
			expect(form.find('#field1').valium('isValid')).toBe(true);
		});

		it('should be invalid when at least one field is invalid', function(){
			var form = build(function(form){
				form.text('field1');
				form.text('field2');
			});
			form.valium({field1:{required:{message:'required'}}});

			expect(form.find('#field1').valium('isValid')).toBe(false);
			expect(form.find('#field2').valium('isValid')).toBe(true);
			expect(form.valium('isValid')).toBe(false);
		});
		
		it('should be valid when all fields are valid', function(){
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
	});

	
	describe('should support validation on', function(){
		it('textboxes', function(){
			var form = build(function(form){
				form.text('field');
			});
			form.valium({field:{required:{message:'required'}}});
			expect(form.find('#field').valium('isValid')).toBe(false);
		});

		it('textareas', function(){
			var form = build(function(form){
				form.textArea('field');
			});
			form.valium({field:{required:{message:'required'}}});
			expect(form.find('#field').valium('isValid')).toBe(false);
		});
		
		it('dropdowns', function(){
			var form = build(function(form){
				form.select('field', {'':'(choose)', key1:'value1', key2:'value2'});
			});
			form.valium({field:{required:{message:'required'}}});
			expect(form.find('#field').valium('isValid')).toBe(false);
		});

		it('checkboxes', function(){
			var form = build(function(form){
				form.check('field');
			});
			form.valium({field:{required:{message:'required'}}});
			expect(form.find('#field').valium('isValid')).toBe(false);
		});

		it('radio buttons', function(){
			var form = build(function(form){
				form.radio('field', {key1:'value1', key2:'value2'});
			});
			form.valium({field:{required:{message:'required'}}});
			expect(form.find(':input[name=field]').valium('isValid')).toBe(false);
		});
	});


	describe('feedback', function(){
		var form;
		var field;
		var fieldMessage;

		beforeEach(function(){
			form = build(function(form){
				form.text('field');
				form.message('field-required', 'this field is required');
			});
			form.valium({field:{required:{message:$('#field-required')}}});
			field = form.find('#field');
			fieldMessage= form.find('#field-required');
		});

		it('should set error class on invalid fields', function(){
			field.change();
			expect(field.hasClass('error')).toBe(true);
		});
		
		it('should remove error class on valid fields', function(){
			field.change();
			field.val('something');
			field.change();
			expect(field.hasClass('error')).toBe(false);
		});

		xit('should create labels for string messages', function(){});
		xit('should show jquery message for invalid field', function(){});
		xit('should trigger validation on change', function(){});
		xit('should hide messages for valid fields', function(){});
		xit('should use hide/show function of message if present', function(){});
	});

});
