var fs = require('fs');
var path = require('path');

exports.scrape = function (callback) {
	require('../lib/drupal_scraper').scrape(
		{
			event_id: 'rp13',
			schedule_url: 'http://13.re-publica.de/rp13-schedule.xml'
		},
		function (data) {
			var videos = fs.readFileSync(path.resolve(__dirname, 'knownvideos.json'), 'utf8');
			videos = JSON.parse(videos);

			var videoLookup = {};
			Object.keys(videos).forEach(function (key) {
				var video = videos[key];
				if (video.eventId) videoLookup[video.eventId] = video;
			})

			data.forEach(function (entry) {
				if (entry.type != 'session') return;
				var sessionId = parseInt(entry.id.split('-').pop(), 10);
				if (!videoLookup[sessionId]) return;
				
				var video = videoLookup[sessionId];
				var service = 'unbekannt';
				if (video.video_url.indexOf('youtube.com') >= 0) service = 'youtube';
				if (video.video_url.indexOf('vimeo.com'  ) >= 0) service = 'vimeo';
				
				entry.videos.push({
					thumbnail:video.thumbnail,
					title:video.video_title,
					url:video.video_url,
					service:service
				})

			})

			callback(data);
		}
	);
}