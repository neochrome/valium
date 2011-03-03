(function($){

	$.fn.valium = function(method){
		if(methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if(typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' + method + ' doesn\'t exist on jQuery.valium');
		}
	};

	var methods = {
		init: function(rules){
			if(!rules){
				return this;
			}

			if(this.is('form')){
				this.find(':input').each(function(){
					methods.init.apply($(this), [rules[this.name] || {}]);
				});
			}

			if(this.is(":input")){
				var input = this;
				// if any rule has dependency to another field,
				// hook to that field's change event
				// also verify that rule name exists
				$.each(rules, function(ruleName, params){
					if(findRule(ruleName) === undefined){
						throw 'undefined validation rule: ' + ruleName;
					}
					if(!(params.other instanceof jQuery)){
						return;
					}
					params.other.bind('change.valium', function(){
						// trigger validation from dependency only if changed
						if(input.data('valium').hasChanged === true){
							methods.isValid.apply(input, [hideMessage, showMessage]);
						}
					});
				});
				// trigger validation on change
				input.bind('change.valium', function(){
					input.data('valium').hasChanged = true;
					methods.isValid.apply(input, [hideMessage, showMessage]);
				});
				// store rules & initial changed state on input field
				input.data('valium', {rules: rules, hasChanged: false});
			}

			return this;
		},

		isValid: function(valid, invalid) {
			valid = valid || $.noop;
			invalid = invalid || $.noop;

			if(this.is('form')){
				for(var i = 0, fields = this.find(':input'), max = fields.length; i < max; i++){
					if(!methods.isValid.apply($(fields[i]), [valid, invalid])){
						return false;
					}
				}
				return true;
			}

			if(this.is(':input')){
				var input = this;
				var valiumData = input.data('valium') || {};
				var rules = valiumData.rules || {};
				var isValid = true;
				// trigger all validation rules for the input field
				$.each(rules, function(ruleName, params){
					if(input.is(':checkbox')){ 
						value = input.is(':checked');
					}
					else if(input.is(':radio')) {
						var form = input.parents('form');
						var selectedInGroup = form.find(':input:radio[name=' + input.attr('name') + ']:checked');
						value = selectedInGroup.val() || '';
					}
					else { 
						value = input.val(); 
					}

					if(findRule(ruleName).apply(input, [value, params || {}])){
						valid.apply(input, [params.message || '', ruleName]);
					}
					else{
						isValid = false;
						invalid.apply(input, [params.message || '', ruleName]);
					}
				});
				return isValid;
			}
		}
	};

	function findMessageFor(input, rule){
		return $('label[for=' + input.attr('id') + '][class~=error][class~=' + rule + ']');
	}

	function hideMessage(message, rule){
		(message instanceof jQuery ? message : findMessageFor(this, rule)).hide();
		this.removeClass('error');
	}

	function showMessage(messageOrText, rule){
		var message = messageOrText instanceof jQuery ? messageOrText : findMessageFor(this, rule);
		if(message.length){
			message.show();
		}
		else{
			$('<label for="' + this.attr('id') + '" class="error ' + rule + '">' + messageOrText + '</label>').insertAfter(this);
		}
		this.addClass('error');
	}

	function findRule(name){
		return rules[name];
	}
	
	var rules = {
		required: function(value){
			return value !== false && value !== '';
		},
		range: function(value, params){
			return value === '' || Number(value) >= Number(params.min) && Number(value) <= Number(params.max);
		},
		greaterThan: function(value, params){
			return value === '' || params.other.val() === '' || Number(value) > Number(params.other.val());
		},
		lesserThan: function(value, params){
			return value === '' || params.other.val() === '' || Number(value) < Number(params.other.val());
		}
	};
})(jQuery);

