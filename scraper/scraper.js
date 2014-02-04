#!/usr/bin/env node

var db = require('db');
var dump = require('dump').dump;

function finalize(data) {
	db.update(data);
	dump(data);
}


require('./rp13/scraper.js').scrape(finalize);


