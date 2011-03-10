describe('jQuery Valium', function () {

	beforeEach(function (){
		this.addMatchers({
			toBeInstanceOf: function(klass){ return this.actual instanceof klass; },
			toBeVisible: function(){ return this.actual.css('display') !== 'none'; },
			toBeHidden: function(){ return this.actual.css('display') === 'none'; }
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
			field = $('#field');
			fieldMessage = $('#field-required');
		});

		it('should set invalid class on invalid fields', function(){
			field.change();
			expect(field.hasClass('invalid')).toBe(true);
		});
		
		it('should remove invalid class on valid fields', function(){
			field.change();
			field.val('something');
			field.change();
			expect(field.hasClass('invalid')).toBe(false);
		});

		it('should remove valid class on invalid fields', function(){
			field.change();
			expect(field.hasClass('valid')).toBe(false);
		});
		
		it('should set valid class on valid fields', function(){
			field.change();
			field.val('something');
			field.change();
			expect(field.hasClass('valid')).toBe(true);
		});
		
		it('should show jquery messages for invalid fields', function(){
			expect(fieldMessage).toBeHidden();
			field.change();
			expect(fieldMessage).toBeVisible();
		});
		
		it('should hide jquery messages for valid fields', function(){
			field.change();
			field.val('something');
			field.change();
			expect(fieldMessage).toBeHidden();
		});
		
		it('should create and show labels for string messages on invalid field', function(){
			form.valium({field:{required:{message:'string-required'}}});
			field.change();
			fieldMessage = form.find('label.invalid.required[for=field]');
			expect(fieldMessage).toBeVisible();
		});
		
		it('should hide created labels for string messages on valid field', function(){
			form.valium({field:{required:{message:'string-required'}}});
			field.change();
			fieldMessage = form.find('label.invalid.required[for=field]');
			field.val('something');
			field.change();
			expect(fieldMessage).toBeHidden();
		});
		
		it('should support hide/show functions for message if present', function(){
			var show = jasmine.createSpy();
			var hide = jasmine.createSpy();
			form.valium({field:{required:{message:{show:show,hide:hide}}}});
			field.change();
			expect(show).toHaveBeenCalledWith('required');
			field.val('something');
			field.change();
			expect(hide).toHaveBeenCalledWith('required');
		});

		xit('should trigger validation on change', function(){});
	});

});
