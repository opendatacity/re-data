#!/usr/bin/env node

var fs = require("fs");
var path = require('path');
var async = require('async');

var db = require('./lib/db');
var dump = require('./lib/dump');

var log = require(path.resolve(__dirname, '../api/lib/log.js'));

var scrapersPath = path.resolve(__dirname, 'config/scrapers.js');
if (!fs.existsSync(scrapersPath)) {
	console.log("Please create " + scrapersPath + ". See config/scrapers.js.example for an example.");
	process.exit(-1);
}
var scrapers = require(scrapersPath);

async.eachSeries(
	scrapers.scrapers,
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
