#!/usr/bin/env node

var db = require('./lib/db');
var dump = require('./lib/dump');

function finalize(data) {
	db.update(data);
	dump.dump(data);
}


require('./rp13/scraper.js').scrape(finalize);


