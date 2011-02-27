describe("jQuery Valium", function () {

	var form = {};

	beforeEach(function () {
		this.addMatchers({
			toBeInstanceOf: function(klass){ return this.actual instanceof klass; }
		});


		$("#html-hook").empty();
		$('<form id="validation"> \
			<input name="min" id="min" type="text"/> \
			<input name="max" id="max" type="text"/> \
		</form>').appendTo("#html-hook");

		form = $("#validation");
	});

	it("should support jQuery chaining", function () {
		var returnValue = form.valium();

		expect(returnValue).toBeInstanceOf(jQuery);
	});

});
