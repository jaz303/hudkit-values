var test = require('tape');
var values = require('..');

test("property - get", function(assert) {

	var p = values.property('foo', 100);

	assert.equal(p.get(), 100);
	assert.end();

});

test("property - set", function(assert) {

	var p = values.property('foo', '', function(v, set) {
		set(v.toUpperCase());
	});

	p.set('hello');

	assert.equal(p.get(), 'HELLO');
	assert.end();

});

test("property - connect called immediately", function(assert) {

	var p = values.property('foo', 'RAA');

	var observed = null;
	p.connect(function(newValue) {
		observed = newValue;
	});

	assert.equal(observed, 'RAA');
	assert.end();

});

test("property - connect", function(assert) {

	var p = values.property('foo', 0, function(v, set) {
		set(v * 2);
	});

	var observed = null;
	p.connect(function(newValue) {
		observed = newValue;
	});

	p.set(10);

	assert.equal(observed, 20);
	assert.end();

});

test("property - disconnect", function(assert) {

	var p = values.property('foo', 'abc');

	var called = 0;
	var dc = p.connect(function() { called++; });

	dc();
	dc();

	p.set(10);

	assert.equal(called, 1);
	assert.end();

});

test("signal - connect/emit", function(assert) {

	var s = values.signal('foo');

	var res;
	s.connect(function(a, b, c) {
		res = a + b + c;
	});

	s.emit(1, 2, 3);

	assert.equal(res, 6);
	assert.end();

});

test("signal - disconnect", function(assert) {

	var s = values.signal('foo');

	var called = false;
	var dc = s.connect(function() { called = true; });

	dc();
	dc();

	s.emit("foobar");

	assert.equal(called, false);
	assert.end();

});