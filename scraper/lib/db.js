/* require node modules */
var path = require('path');

/* require npm modules */
var cradle = require('cradle');

/* require local modules */
var log = require(path.resolve(__dirname, '../../api/lib/log.js'));

/* import config */
var config = require(path.resolve(__dirname, '../../config.js'));

exports.update = function (data, callback) {
	couch(function (db) {
		callback(data);
	})
}

var couch = function(callback) {
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
