#!/usr/bin/env node

var path = require('path');
var async = require('async');

var db = require('./lib/db');
var dump = require('./lib/dump');

var log = require(path.resolve(__dirname, '../api/lib/log.js'));

async.eachSeries(
	[
		// { module:require('./rp13/scraper.js'), db:true },
		// { module:require('./rp14/scraper.js'), db:true }
		{ module:require('./altconf14/scraper.js'), db:false }
	],
	function (item, callback) {
		item.module.scrape(function (data) {
			if (item.db) {
				db.update(data, function (data) {
					dump.dump(data);
					callback();
				});
			} else {
				dump.dump(data);
				callback();
			}
		});
	},
	function () {
		log.done();
	}
)
