
/* get node modules */
var fs = require('fs');
var path = require('path');

/* get npm modules */
var scrapyard = require('scrapyard');
var moment = require('moment');
var ent = require('ent');

/* get local modules */
var log = require(path.resolve(__dirname, '../../api/lib/log.js'));



/* track slug conversion */
var track_slugs = {
	"business-innovation": "Business & Innovation",
	"science-technology": "Science & Technology",
	"politics-society": "Politics & Society",
	"research-education": "Research & Education",
	"culture": "Culture",
	"media": "Media",
	"republica": "Re:publica",
	"recampaign": "Re:campaign"
};

/* format slug conversion */
var format_slugs = {
	"Diskussion": "discussion",
	"Vortrag": "talk",
	"Workshop": "workshop",
	"Aktion": "action"
};

/* level slug conversion */
var level_slugs = {
	"Beginner": "beginner",
	"Fortgeschrittene": "intermediate",
	"Experten": "advanced"
};

var sort_types = {
	"session": 1,
	"speaker": 2,
	"day": 3,
	"area": 4,
	"track": 5,
	"format": 6,
	"level": 7,
	"language": 8
};



/* helper functions */
var _nickname = function(str) {
	return str
	.toString()
	.toLowerCase()
	.replace(/^\s+|\s+$/g,'')
	.replace(/ä/g,'ae')
	.replace(/ö/g,'oe')
	.replace(/ü/g,'ue')
	.replace(/ß/g,'ss')
	.replace(/[^a-z0-9]/g,'-')
	.replace(/\-+/g,'-');
}

var _dehtml = function(str) {
	return ent.decode(str).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').replace(/^\s+|\s+$/g,'');
}

exports.scrape = function (options, callback) {

	var scraper = new scrapyard({
		cache: path.resolve(__dirname, '..', '.cache'), 
		debug: true,
		timeout: 300000,
		retries: 5,
		connections: 10
	});
	scraper.scrape(options.schedule_url, 'xml', 'utf8', function(err, xml) {
		if (err) log.critical("Scraper Error:", err);

		var data = [];

		/* talk to speaker map */
		var speaker_talks = {};

		/* double check arrays */
		var existing_areas = [];
		var existing_languages = [];
		var existing_tracks = [];
		var existing_formats = [];
		var existing_levels = [];
			
		/* iterate days */
		xml.schedule.day.forEach(function(day){

			/* push day */
			var day_id = [options.event_id, "day", day.$.index].join("-");
			var day_label = moment(day.$.date, "YYYY-MM-DD").format("D. MMMM");
			
			data.push({
				"id": day_id,
				"event": options.event_id,
				"type": "day",
				"label": day_label,
				"date": day.$.date
			});

			/* iterate areas, but only once */
			day.room.forEach(function(room){

				/* area id */
				var area_id = [options.event_id, "area", _nickname(room.$.name)].join("-");
				
				/* check if room is already in data */
				if (existing_areas.indexOf(area_id) < 0) {
					existing_areas.push(area_id);
				
					/* push room */
					data.push({
						"id": area_id,
						"event": options.event_id,
						"type": "area",
						"label": room.$.name,
						"stage": true,
						"level": null, // we don't know
						"shape": null // we don't know either
					});
				
				}
				
				/* iterate sessions */
				room.event.forEach(function(event){
					
					/* make id for session */
					var session_id = [options.event_id, "session", event.$.id].join("-");
					
					/* language */
					switch (event.language[0]) {
						case "English": 
							var lang_slug = "en";
							var lang_label = "English";
						break;
						case "German": 
							var lang_slug = "de";
							var lang_label = "Deutsch";
						break;
						default: 
							log.critical("Unknown Language:", event.language[0]);
						break;
					}

					/* track */
					var track_slug = event.track[0].toLowerCase().replace(/ & /g,'-').replace(/[^a-z\-]/g,'');
					if (!(track_slug in track_slugs)) log.critical("Unknown Track Slug:", track_slug);
					var track_label = track_slugs[track_slug];
					
					/* format */
					if (!(event.type[0] in format_slugs)) log.critical("Unknown Format Slug:", event.type[0]);
					var format_label = event.type[0];
					var format_slug = format_slugs[format_label];
					
					/* level */
					if (!(event.experience_level[0] in level_slugs)) log.critical("Unknown Level Slug:", event.experience_level[0]);
					var level_label = event.experience_level[0];
					var level_slug = level_slugs[level_label];
					
					/* speakers */
					var speakers = [];
					event.persons[0].person.forEach(function(person){
						if (typeof person.$.id === "undefined" || person.$.id === "") return; // defective person
						var speaker_id = [options.event_id, "speaker", person.$.id].join("-")
						speakers.push(speaker_id);
						if (!(speaker_id in speaker_talks)) speaker_talks[speaker_id] = [];
						speaker_talks[speaker_id].push(session_id);
					});
					
					/* timing */
					var _time = moment([day.$.date, event.start[0]].join(" "), "YYYY-MM-DD HH:mm");
					var _duration = parseInt(event.duration[0].replace(/[^0-9]/g,''),10);
					
					data.push({
						"id": session_id,
						"event": options.event_id,
						"type": "session",
						"status": "over", // all rp13 events are over :(
						"title": event.title[0],
						"photo": null, // there is no such thing :(
						"slides": event.slide.filter(function(s){ return (s !== ""); }),
						"abstract": _dehtml(event.abstract[0]),
						"description": _dehtml(event.description[0]),
						"url": null, // FIXME, the slug is empty, wtf.
						"begin": _time.format("YYYY-MM-DD[T]HH:mm:ssZ"),
						"end": _time.add('m', _duration).format("YYYY-MM-DD[T]HH:mm:ssZ"),
						"duration": _duration,
						"day": day_id,
						"area": area_id,
						"track": {
							"slug": track_slug,
							"label": track_label
						},
						"format": {
							"slug": format_slug,
							"label": format_label
						},
						"level": {
							"slug": level_slug,
							"label": level_label
						},
						"lang": {
							"slug": lang_slug,
							"label": lang_label
						},
						"videos": [],
						"slides": [],
						"speakers": speakers,
						"revision": 1,
						"last_modified": moment().format("YYYY-MM-DD[T]HH:mm:ssZ")
					});

				});

			});

		});
		
		/* iterate speakers */
		xml.schedule.speakers[0].speaker.forEach(function(speaker){
			
			var speaker_id = [options.event_id, "speaker", speaker.$.persons].join("-");
			data.push({
				"id": speaker_id,
				"event": options.event_id,
				"type": "speaker",
				"attendee": null,
				"name": speaker.fullname[0],
				"nickname": _nickname(speaker.fullname[0]), // mockup
				"photo": speaker.picture[0],
				"organization": speaker.organization[0],
				"position": speaker.position[0],
				"biography": speaker.biography[0],
				"links": [],
				"sessions": speaker_talks[speaker_id] // fill me later
			});
		});
		
		data.sort(function(a,b){
			return (sort_types[a.type] - sort_types[b.type]);
		});

		if (callback) callback(data);

	});

}