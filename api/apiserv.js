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

/* setup express */
var app = express();

/* api: events */

app.get('/events', function(req, res){
	db.view('events/id', {include_docs: true, descending: true}, function(err, data){
		/* FIXME: handle some errors */
		var result = [];
		data.forEach(function(d){
			result.push({
				"id": d.id,
				"label": d.label,
				"title": d.title,
				"date": d.date,
				"locations": d.locations,
				"url": d.url
			});
		});
		res.json(result);
	});
});

app.get('/events/:id', function(req, res){
	db.view('events/id', {include_docs: true, descending: true, key: req.params.id}, function(err, data){
		if (err || data.length !== 1) return res.json({});
		var data = data.pop().doc;
		res.json({
			"id": data.id,
			"label": data.label,
			"title": data.title,
			"date": data.date,
			"locations": data.locations,
			"url": data.url
		});
	});
});



app.get('*', function(req, res){
  res.json({"rp-api": config.version});
});

/* listen on either tcp or socket according to config */
if ("port" in config.app) {
	app.listen(config.app.port, config.app.host, function(){
		log.info("Server ready, Listening on TCP/IP", config.app.host+':'+config.app.port);
	});
} else if("socket" in config.app) {
	app.listen(config.app.socket, function(){
		log.info("Server ready, Listening on Socket", config.app.socket);
	});
}

