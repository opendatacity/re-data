var path = require('path');
var async = require('async');
var scrapyard = require('scrapyard');
var log = require(path.resolve(__dirname, '../../api/lib/log.js'));

exports.get = function (options, callback) {

	var urls = options.urls;
	urls = Object.keys(urls).map(function (key) {
		return {
			key: key,
			url: urls[key]
		}
	})

	var result = {};

	var scraper = new scrapyard({
		cache: path.resolve(__dirname, '..', '.cache'), 
		debug: true,
		timeout: 300000,
		retries: 5,
		connections: 10
	});

	async.eachLimit(
		urls,
		2,
		function (item, callback) {
			scraper.scrape(item.url, 'json', 'utf8', function(err, data) {
				if (err) log.critical('Scraper Error in JSON_Requester:', err);
				result[item.key] = data;
				callback();
			})
		},
		function () {
			callback(result);
		}
	)
}