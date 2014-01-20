#!/usr/bin/env node

/* require node modules */
var fs = require("fs");
var path = require("path");

/* require npm modules */
var cradle = require("cradle");

/* require local modules */
var log = require(path.resolve(__dirname, "../api/lib/log.js"));

/* import config */
var config = require(path.resolve(__dirname, "../config.js"));

/* data object */
var data = {};

/* load data */
["events","rp13-data"].forEach(function(d){
	data[d] = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/"+d+".json")));
});

/* purge current couchdb and create a new one. */
var couch = function(callback) {
	/* connect to couchdb */
	var db = new cradle.Connection(config.db.host, config.db.port, config.db.options).database(config.db.database);
	/* create database if not existing*/
	db.exists(function(err, exists) {
		if (err) {
			log.critical("Database Connection Failed", err);
		} else if (!exists) {
			db.create(function(err){
				if (err) log.critical("Could not create Database", err);
				log.info("Database Created");
				callback(db);
			});
		} else {
			db.destroy(function(err){
				if (err) log.critical("Could not destroy Database", err);
				log.info("Database destroyed");
				db.create(function(err){
					if (err) log.critical("Could not create Database", err);
					log.info("Database Created");
					callback(db);
				});
			});
		}
	});
};

couch(function(db){
	
	/* events design documents */
	db.save("_design/events", {
		views: {
			id: {
				map: function(doc) { if (doc.type === 'event') emit(doc.id); }
			}
		}
	}, function(err, res){
		if (err) log.critical("Could not save 'events' design", err);
		log.info("Saved 'events' design doc");
		/* insert events */
		db.save(data["events"], function(err, res){
			if (err) log.critical("Could not save 'events' data", err);
			log.info("Saved events");
			
			db.save("_design/data", {
				views: {
					sessions: { map: function(doc) { if (doc.type === 'session') emit([doc.event, doc.id]); }},
					speakers: { map: function(doc) { if (doc.type === 'speaker') emit([doc.event, doc.id]); }},
					areas: { map: function(doc) { if (doc.type === 'area') emit([doc.event, doc.id]); }} /*,
					sessions_day: { map: function(doc) { if (doc.type === 'area') emit([doc.event, doc.day, doc.id]); }},
					sessions_lang: { map: function(doc) { if (doc.type === 'area') emit([doc.event, doc.lang.slug, doc.id]); }},
					sessions_level: { map: function(doc) { if (doc.type === 'area') emit([doc.event, doc.level.slug, doc.id]); }},
					sessions_area: { map: function(doc) { if (doc.type === 'area') emit([doc.event, doc.lang.slug, doc.id]); }},
					sessions_lang: { map: function(doc) { if (doc.type === 'area') emit([doc.event, doc.lang.slug, doc.id]); }}, */
				}
			}, function(err, res){
			
				if (err) log.critical("Could not save 'rp13' design", err);
				log.info("Saved 'rp13' design doc");
				
				/* rp13 data */
				db.save(data["rp13-data"], function(err, res){
					if (err) log.critical("Could not save 'rp13' data", err);
					log.info("Saved rp13 data");
					log.done();
				});
			});
		});
	});
});

