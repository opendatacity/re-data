#!/usr/bin/env node

/* require node modules */
var fs = require("fs");
var path = require("path");
var http = require("http");

/* require npm modules */
var cradle = require("cradle");
var express = require("express");

/* require local modules */
var log = require(path.resolve(__dirname, "lib/log.js"));

/* import config */
var config = require(path.resolve(__dirname, "../config.js"));

/* setup couchdb connection */
var db = null;
(function(){
	/* connect to couchdb */
	db = new cradle.Connection(config.db.host, config.db.port, config.db.options).database(config.db.database);
	/* create database if not existing*/
	db.exists(function(err, exists) {
		if (err) {
			log.critical("Database Connection Failed", err);
		} else if (!exists) {
			db.create(function(err){
				if (err) log.critical("Could not create Database", err);
				log.info("Database Created");
			});
		} else {
			log.info("Database ready.")
		}
	});
})();


// setup express

var app = express();

// enable Cross-Origin Resource Sharing
// http://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// api: events

app.get('/events', function(req, res) {
    fs.readFile(path.resolve(__dirname, "../scraper/config/events.json"), function (err, data) {
        replyList(err, data ? JSON.parse(data) : null, req.query, res);
    });
    
});

app.get('/events/:id', function(req, res) {
	db.view('events/id', {include_docs: true, descending: true, key: req.params.id}, function(err, data) {
		replyItem(err, data, req.query, res);
	});
});


// api: everything else

var types = [
	'days',
	'sessions',
	'speakers',
	'locations',
	'tracks',
	'formats',
	'levels',
	'languages',
	'maps',
	'pois'	
];

types.forEach(function (type) {

	app.get('/:event/'+type, function(req, res) {
		db.view('data/'+type, {include_docs: true, startkey: [req.params.event], endkey: [req.params.event, {}]}, function(err, data) {
			replyList(err, data, req.query, res);
		});
	});

	app.get('/:event/'+type+'/:id', function(req, res) {
		db.view('data/'+type, {include_docs: true, descending: true, key: [req.params.event, req.params.id]}, function(err, data) {
			replyItem(err, data, req.query, res);
		});
	});

})


// function for replying a list

function replyList(err, data, query, res) {
	if (err) {
		log.critical(err);
		res.json({ok:false});
	}

	data.filter(function(item) {
		if (item._deleted == undefined || item._deleted == false) {
			return true;
		} else {
			return false;
		};
	});

	// delete unnecessary fields _id and _rev
	data = data.map(function (item) {
		delete item._id;
		delete item._rev;
		return item;
	})

	// sort by id
	data.sort(function (a,b) {
		if (a.id < b.id) return -1;
		if (a.id > b.id) return 1;
		return 0;
	})

	// filter by last_modified
	if (query.last_modified) {
		var last_modified = parseFloat(query.last_modified);
		data = data.filter(function (item) {
			return (item.last_modified > last_modified);
		})
	}

	var count = data.length;

	// pagination
	if (query.start || query.count) {
		var startIndex = 0;
		var endIndex   = 1e10;

		if (query.start) startIndex = parseInt(query.start, 10);
		if (query.count) endIndex   = parseInt(query.count, 10) + startIndex;

		data = data.filter(function (item, index) {
			return (index >= startIndex) && (index < endIndex);
		})
	}

	// return result
	res.json({
		ok: true,
		count: count,
		data: data
	});
}


// function for replying a single item

function replyItem(err, data, query, res) {
	if (err) {
		log.critical(err);
		res.json({ok:false});
	}

	if (data.length != 1) {
		res.json({ok:false});
	}

	// delete unnecessary fields _id and _rev
	var item = data[0].doc;
	delete item._id;
	delete item._rev;

	// return result
	res.json({
		ok: true,
		count: 1,
		data: [item]
	});
}



// api: default

app.get('*', function(req, res){
  res.json({"rp-api": config.version});
});


// listen on either tcp or socket according to config

if ("port" in config.app) {
	app.listen(config.app.port, config.app.host, function(){
		log.info("Server ready, Listening on TCP/IP", config.app.host+':'+config.app.port);
	});
} else if("socket" in config.app) {
	var mask = process.umask(0);
	if (fs.existsSync(config.app.socket)) fs.unlinkSync(config.app.socket);
	app.listen(config.app.socket, function(){
		if (mask) { process.umask(mask); mask = null; }
		log.info("Server ready, Listening on Socket", config.app.socket);
	});
}

