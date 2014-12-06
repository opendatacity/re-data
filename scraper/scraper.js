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

console.log("argv " + process.argv);

var usage = "usage: node scraper.js (import|resetDB|deleteEvent) [args]";

if (process.argv.length < 3) {
	console.log(usage);
	process.exit(-1);
}

var commands = new Array("import", "resetDB", "deleteEvent");
var command = process.argv[2];


if (command == "import") {
	// Scrape
	var scrapers = Object.keys(scrapers.scrapers).map(function (key) {
		return scrapers.scrapers[key];
	});
	
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
	
} else if (command == "deleteEvent") {
// Delete certain conf
	if (process.argv.length < 4) {
		console.log("For deleteEvent please provide event id as argument");
		console.log(usage);
		process.exit(-1);
	}
	
	var eventID = process.argv[3];
	
	console.log("Deleting all data for event " + eventID);

	db.delete(eventID, function(err) {
		
	});	
	
} else if (command == "resetDB") {
// Reset DB
	console.log("Resetting DB");
	db.reset();
	
} else {
	console.log("Unknown command " + command);
	
	console.log(usage);
	process.exit(-1);
}




