#!/usr/bin/env node

/* get npm modules */
var colors = require("colors");

module.exports = {
	args: function(a) {
		var o = []; for (var i = 0; i < a.length; i++) o.push(a[i]); return o;
	},
	info: function() {
		var args = module.exports.args(arguments)
		args.unshift("[INFO]".inverse.bold.cyan);
		console.error.apply(this, args);
	},
	error: function() {
		var args = module.exports.args(arguments)
		args.unshift("[ERR!]".inverse.bold.red);
		console.error.apply(this, args);
	},
	critical: function() {
		var args = module.exports.args(arguments)
		args.unshift("[CRIT]".inverse.bold.cyan);
		console.error.apply(this, args);
		process.exit();
	},
	done: function() {
		console.error("<3".magenta.bold, "made with datalove".magenta);
	}
};