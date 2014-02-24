/* require node modules */
var path = require('path');
var async = require('async');

/* require npm modules */
var cradle = require('cradle');

/* require local modules */
var log = require(path.resolve(__dirname, '../../api/lib/log.js'));

/* import config */
var config = require(path.resolve(__dirname, '../../config.js'));

exports.update = function (data, callback) {
	connectCouch(function (db) {
		if (!db) {
			callback(data);
			return;
		}
		updateCouch(db, data, function (data) {
			callback(data);
		})
	})
}

function updateCouch(db, data, callback) {

	async.eachSeries(
		data,
		function (item, callback) {

			var couchView = couchViews[item.type];
			if (!couchView) {
				log.critical('Unknown Item Type "'+item.type+'"');
				callback();
			}

			db.view(couchView, {include_docs: true, key: [item.event, item.id]}, function(err, docs) {
				switch (docs.length) {
					case 0://fehlt
						log.info('Adding "'+item.id+'"');
						db.save(item, function () { callback() });
					break;
					case 1:
						var doc = docs[0].doc;
						if (areEqual(doc, item)) {
							item.last_modified = doc.last_modified;
							callback();
						} else {
							log.info('Updating "'+item.id+'"');
							db.save(doc._id, item, function () { callback() });
						}
					break;
					default:
						log.critical('Found "'+docs.length+'" Items');
						callback();
						//Irgendwas im Arsch
				}
			});
		},
		function () {
			callback(data);
		}
	);
}


var couchViews = {
	'session':'data/sessions',
	'speaker':'data/speakers',
	'track':'data/tracks',
	'location':'data/locations',
	'day':'data/days',
	'format':'data/formats',
	'level':'data/levels',
	'language':'data/languages'
}

function connectCouch(callback) {
	/* connect to couchdb */
	var db = new cradle.Connection(config.db.host, config.db.port, config.db.options).database(config.db.database);
	/* create database if not existing*/
	db.exists(function(err, exists) {
		if (err) {
			log.critical('Database Connection Failed', err);
			callback();
			return
		}
		if (exists) {
			callback(db);
		} else {
			db.create(function(err){
				if (err) log.critical('Could not create Database', err);
				log.info('Database Created');
				callback(db);
			});
		}
	});
};

function areEqual(obj1, obj2) {
	var ignoreKeys = {
		'_id': true,
		'_rev': true,
		'last_modified': true
	};

	var allKeys = {};
	Object.keys(obj1).forEach(function (key) { allKeys[key] = true });
	Object.keys(obj2).forEach(function (key) { allKeys[key] = true });
	
	var same = true
	Object.keys(allKeys).forEach(function (key) {
		if (ignoreKeys[key]) return;
		var value1 = JSON.stringify(obj1[key]);
		var value2 = JSON.stringify(obj2[key]);
		if (value1 != value2) {
			same = false;

			log.info(obj1.id+' changed at "'+key+'" from "'+value1+'" to "'+value2+'"');
		}
	});
	return same;
}

/*
	
	// Old Code for database, view and "events" generation

	var events = [
		// {
		// 	"type": "event",
		// 	"id": "rp14",
		// 	"label": "re:publica 14",
		// 	"title": "into the wild",
		// 	"date": ["2014-05-06","2014-05-08"],
		// 	"locations": [{
		// 		"label": "Station Berlin",
		// 		"coords": [52.49814,13.374538]
		// 	}],
		// 	"url": "http://14.re-publica.de/"
		// },
		{
			"type": "event",
			"id": "rp13",
			"label": "re:publica 13",
			"title": "IN/SIDE/OUT",
			"date": ["2013-05-06","2013-05-08"],
			"locations": [{
				"label": "Station Berlin",
				"coords": [52.49814,13.374538]
			}],
			"url": "http://13.re-publica.de/"
		}
	];


		
		db.save("_design/events", {
			views: {
				id: {
					map: function(doc) { if (doc.type === 'event') emit(doc.id); }
				}
			}
		});

		db.save("_design/data", {
				views: {
					sessions:  { map: function(doc) { if (doc.type === 'session') emit([doc.event, doc.id]); }},
					speakers:  { map: function(doc) { if (doc.type === 'speaker') emit([doc.event, doc.id]); }},
					tracks:    { map: function(doc) { if (doc.type === 'track') emit([doc.event, doc.id]); }},
					locations: { map: function(doc) { if (doc.type === 'location') emit([doc.event, doc.id]); }},

					days:      { map: function(doc) { if (doc.type === 'day') emit([doc.event, doc.day, doc.id]); }},
					formats:   { map: function(doc) { if (doc.type === 'format') emit([doc.event, doc.lang.slug, doc.id]); }},
					levels:    { map: function(doc) { if (doc.type === 'level') emit([doc.event, doc.level.slug, doc.id]); }},
					languages: { map: function(doc) { if (doc.type === 'language') emit([doc.event, doc.lang.slug, doc.id]); }}
				}
			}
		);

		db.save(events, function(err, res){callback()})
*/
