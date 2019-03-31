const assert = require('assert');

const tracealyzer = require('./../index');

const TRACE_FILE = './test/data/trace.json';

const result = tracealyzer(TRACE_FILE);

it('fps should be reported correctly', function() {
	assert.equal(result.rendering.fps.mean, 8.94);
	assert.equal(result.rendering.fps.hi, 9345.79);
	assert.equal(result.rendering.fps.lo, 2);
	assert.equal(result.rendering.fps.sd, 1264.72);
	assert.equal(result.rendering.fps.variance, 1599518.62);
});

it('should report layoutTrashing by counting forcedReflowEvents', function() {
	assert.equal(result.rendering.forcedReflowEvents, 82);
});

it('should report firstPaintTime', function() {
	assert.equal(result.rendering.firstPaint, 0.031781);
});

it('should report categories and their total time', function() {
	assert.equal(result.profiling.categories["rendering"], 440.5760000050068);
	assert.equal(result.profiling.categories["scripting"], 2477.3910000920296);
	assert.equal(result.profiling.categories["painting"], 83.19600003957748);
});

it('should report events', function() {
	assert.equal(Object.keys(result.profiling.events).length, 17);
});

it('should report functions', function() {
	assert.equal(Object.keys(result.profiling.functions).length, 898);
});

it('should report userFunctions', function() {
	assert.equal(Object.keys(result.profiling.userFunctions).length, 533);
});