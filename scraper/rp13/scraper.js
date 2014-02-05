
exports.scrape = function (callback) {
	require('../lib/drupal_scraper').scrape(
		{
			event_id: 'rp13',
			schedule_url: 'http://13.re-publica.de/rp13-schedule.xml'
		},
		callback
	);
}