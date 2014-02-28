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

	// Try to connect to CouchDB ...

	connectCouch(function (db, connection) {
		if (!db) {
			log.critical('Can not Update the Database');
			callback(data);
			return;
		}

		// ... and update the database

		updateCouchDB(db, data, function (data) {
			callback(data);
		})
	})
}

function updateCouchDB(db, data, callback) {

	// updateCouchDB deletes the SQL ... no wait ... updates the CouchDB

	// Since we want to check for changes for every entry,
	// it would be very slow to fetch each single item from the db and
	// compare it with the new item.
	// Instead we have a dbCache, that loads every e.g. session of an event
	// in a single query.

	var dbCache = new (function () {
		var me = this;

		// small lookup to find the corresponding CouchDB for item.type
		var couchDBViews = {
			'session':  'data/sessions',
			'speaker':  'data/speakers',
			'track':    'data/tracks',
			'location': 'data/locations',
			'day':      'data/days',
			'format':   'data/formats',
			'level':    'data/levels',
			'language': 'data/languages'
		}

		// Here be caches
		var caches = {};

		// check if you you can find the item in the db
		me.findInDB = function (item, callback) {

			// Which cache do we want to use? e.g. "rp13-session"
			var cacheKey = [item.event, item.type].join('-');

			if (caches[cacheKey]) {

				// This cache exists so use the item.id to find the item
				callback(caches[cacheKey][item.id]);

			} else {

				// Well the cache does not exists yet.
				// Lets find the name of the CouchDB view ...
				var couchDBView = couchDBViews[item.type];
				if (!couchDBView) {
					log.critical('Unknown Item Type "'+item.type+'"');
					callback(false);
				}

				// ... fetch every entry of this view ...
				log.info('Fetching "'+couchDBView+'" for "'+item.event+'"');
				db.view(couchDBView, {include_docs: true, startkey: [item.event], endkey: [item.event, {}]}, function(err, docs) {

					// ... and store these entries in a cache.
					var cache = {};
					docs.forEach(function (doc) {
						cache[doc.id] = doc;
					});
					caches[cacheKey] = cache;

					// Well, we should return the found item
					callback(cache[item.id]);
				})
			}
		}
		return me;
	})();

	// Now we have a super smooth db lookup with caching ...

	var last_modified = new Date();

	// ... so we could start to check every scraped item ...
	async.eachSeries(
		data,
		function (item, callback) {


			item.last_modified = last_modified;
			
			// ... if it already exsists in the database.
			dbCache.findInDB(item, function (doc) {

				if (doc) {

					// If it already exists then check if ...
					if (areEqual(doc, item)) {

						// ... it is still the same so set the last_modified date to the last known changes ...
						item.last_modified = doc.last_modified;
						callback();

					} else {

						// ... or if it should be updated in the database.
						log.info('Updating "'+item.id+'"');
						db.save(doc._id, item, function (err, res) {
							if (err) log.critical(err);
							if (item._id ) delete item._id ;
							if (item._rev) delete item._rev;
							callback()
						});

					}
				} else {

					// If it does not exists in the database, just add the damn thing!
					log.info('Adding "'+item.id+'"');
					db.save(item, function (err, res) {
						if (err) log.critical(err);
						if (item._id ) delete item._id ;
						if (item._rev) delete item._rev;
						callback()
					});

				}
			});
		},
		function () {
			callback(data);
		}
	);
}


function connectCouch(callback) {
	/* connect to couchdb */
	var connection = new cradle.Connection(config.db.host, config.db.port, config.db.options);
	var db = connection.database(config.db.database);
	/* create database if not existing*/
	db.exists(function(err, exists) {
		if (err) {
			log.critical('Database Connection Failed', err);
			callback(false, connection);
			return
		}
		if (exists) {
			callback(db, connection);
		} else {
			db.create(function(err){
				if (err) log.critical('Could not create Database', err);
				log.info('Database Created');
				callback(db, connection);
			});
		}
	});
};


function areEqual(obj1, obj2) {

	// Checks, if two objects are equal (enough)

	// We can ignore these keys
	var ignoreKeys = {
		'_id': true,
		'_rev': true,
		'last_modified': true
	};

	// Which keys are used by at least one object
	var allKeys = {};
	Object.keys(obj1).forEach(function (key) { allKeys[key] = true });
	Object.keys(obj2).forEach(function (key) { allKeys[key] = true });
	
	// Now check for differences for each key.
	var bothAreEqual = true
	Object.keys(allKeys).forEach(function (key) {
		// ignore ignoreKeys keys
		if (ignoreKeys[key]) return;

		// Hashing is done by JSON.stringify
		var value1 = JSON.stringify(obj1[key]);
		var value2 = JSON.stringify(obj2[key]);

		if (value1 != value2) {
			bothAreEqual = false;
			log.info(obj1.id+' changed at "'+key+'" from "'+value1+'" to "'+value2+'"');
		}
	});

	return bothAreEqual;
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
					sessions:  { map: function(doc) { if (doc.type === 'session')  emit([doc.event, doc.id]); }},
					speakers:  { map: function(doc) { if (doc.type === 'speaker')  emit([doc.event, doc.id]); }},
					tracks:    { map: function(doc) { if (doc.type === 'track')    emit([doc.event, doc.id]); }},
					locations: { map: function(doc) { if (doc.type === 'location') emit([doc.event, doc.id]); }},

					days:      { map: function(doc) { if (doc.type === 'day')      emit([doc.event, doc.id]); }},
					formats:   { map: function(doc) { if (doc.type === 'format')   emit([doc.event, doc.id]); }},
					levels:    { map: function(doc) { if (doc.type === 'level')    emit([doc.event, doc.id]); }},
					languages: { map: function(doc) { if (doc.type === 'language') emit([doc.event, doc.id]); }}
				}
			}
		);

		db.save(events, function(err, res){callback()})
*/
