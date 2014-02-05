#!/usr/bin/env node

var async = require('async');

var db = require('./lib/db');
var dump = require('./lib/dump');

async.eachSeries(
	[
		require('./rp13/scraper.js')
	],
	function (scraper, callback) {
		scraper.scrape(function (data) {
			db.update(data);
			dump.dump(data);
			callback();
		});
	},
	function () {
	}
)
