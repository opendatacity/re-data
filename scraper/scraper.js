#!/usr/bin/env node

var fs = require("fs");
var path = require('path');
var async = require('async');

var db = require('./lib/db');
var dump = require('./lib/dump');

var log = require(path.resolve(__dirname, '../api/lib/log.js'));

if (!fs.exists('./config/scrapers.js')) {
	console.log("Please create config/scrapers.js. See config/scrapers.js.example for an example.");
	process.exit(-1);
}
var scrapers = require('./config/scrapers.js');

async.eachSeries(
	scrapers,
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
