#!/usr/bin/env node

var path = require('path');
var async = require('async');

var db = require('./lib/db');
var dump = require('./lib/dump');

var log = require(path.resolve(__dirname, '../api/lib/log.js'));

async.eachSeries(
	[
		require('./rp13/scraper.js')
	],
	function (scraper, callback) {
		scraper.scrape(function (data) {
			db.update(data, function (data) {
				dump.dump(data);
				callback();
			});
		});
	},
	function () {
		log.done();		
	}
)
