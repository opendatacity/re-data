
/* get node modules */
var fs = require('fs');
var path = require('path');

/* get npm modules */
var scrapyard = require('scrapyard');
var moment = require('moment');
var ent = require('ent');

/* get local modules */
var log = require(path.resolve(__dirname, '../../api/lib/log.js'));

var locationTypes = {
	'rp13-location-stage-1': { label_de:'Stage 1', label_en:'Stage 1', floor:0, is_stage:true },
	'rp13-location-stage-2': { label_de:'Stage 2', label_en:'Stage 2', floor:0, is_stage:true },
	'rp13-location-stage-3': { label_de:'Stage 3', label_en:'Stage 3', floor:0, is_stage:true },
	'rp13-location-stage-4': { label_de:'Stage 4', label_en:'Stage 4', floor:0, is_stage:true },
	'rp13-location-stage-5': { label_de:'Stage 5', label_en:'Stage 5', floor:0, is_stage:true },
	'rp13-location-stage-6': { label_de:'Stage 6', label_en:'Stage 6', floor:0, is_stage:true },
	'rp13-location-stage-7': { label_de:'Stage 7', label_en:'Stage 7', floor:1, is_stage:true },

	'rp13-location-workshop-a': { label_de:'Workshop A', label_en:'Workshop A', floor:1, is_stage:true },
	'rp13-location-workshop-b': { label_de:'Workshop B', label_en:'Workshop B', floor:1, is_stage:true },
	'rp13-location-workshop-c': { label_de:'Workshop C', label_en:'Workshop C', floor:1, is_stage:true },
	'rp13-location-workshop-d': { label_de:'Workshop D', label_en:'Workshop D', floor:1, is_stage:true },

	'rp13-location-newthinking': { label_de:'Newthinking', label_en:'Newthinking', floor:0, is_stage:false },
	'rp13-location-re-publica':  { label_de:'re:publica',  label_en:'re:publica',  floor:0, is_stage:false },
	'rp13-location-global-innovation-lounge': { label_de:'Global Innovation Lounge', label_en:'Global Innovation Lounge', floor:0, is_stage:false },
}

/* track slug conversion */
var trackTypes = {
	"business-innovation": {id:"business-innovation", label_de:"Business & Innovation",  label_en:"Business & Innovation", sessions:[], color:[78.0, 209.0, 249.0, 1.0] },
	"science-technology":  {id:"science-technology",  label_de:"Wissenschaft & Technik", label_en:"Science & Technology",  sessions:[], color:[248.0, 154.0, 61.0, 1.0] },
	"politics-society":    {id:"politics-society",    label_de:"Politik & Gesellschaft", label_en:"Politics & Society",    sessions:[], color:[246.0, 105.0, 106.0, 1.0] },
	"research-education":  {id:"research-education",  label_de:"Forschung & Bildung",    label_en:"Research & Education",  sessions:[], color:[244.0, 79.0, 244.0, 1.0] },
	"culture":             {id:"culture",             label_de:"Kultur",                 label_en:"Culture",               sessions:[], color:[197.0, 167.0, 59.0, 1.0] },
	"media":               {id:"media",               label_de:"Medien",                 label_en:"Media",                 sessions:[], color:[108.0, 196.0, 58.0, 1.0] },
	"republica":           {id:"republica",           label_de:"re:publica",             label_en:"re:publica",            sessions:[], color:[7.0, 68.0, 85.0, 1.0] },
	"recampaign":          {id:"recampaign",          label_de:"re:campaign",            label_en:"re:campaign",           sessions:[], color:[56.0, 196.0, 182.0, 1.0] }
};

/* format slug conversion */
var formatTypes = {
	"Diskussion": {id:"discussion", label_de:"Diskussion", label_en:"Discussion"},
	"Vortrag":    {id:"talk",       label_de:"Vortrag",    label_en:"Talk"      },
	"Workshop":   {id:"workshop",   label_de:"Workshop",   label_en:"Workshop"  },
	"Aktion":     {id:"action",     label_de:"Aktion",     label_en:"Action"    }
};

/* level slug conversion */
var levelTypes = {
	"Beginner":         {id:"beginner",     label_de:"Anfänger",         label_en:"Beginner"     },
	"Fortgeschrittene": {id:"intermediate", label_de:"Fortgeschrittene", label_en:"Intermediate" },
	"Experten":         {id:"advanced",     label_de:"Experten",         label_en:"Advanced"     }
};

/* level slug conversion */
var languageTypes = {
	"English": {id:"en", label_de:"Englisch", label_en:"English" },
	"German":  {id:"de", label_de:"Deutsch",  label_en:"German"  }
};

var sort_types = {
	"session": 1,
	"speaker": 2,
	"day": 3,
	"location": 4,
	"track": 5,
	"format": 6,
	"level": 7,
	"language": 8
};


var locationOrder = [ "rp13-location-stage-1",
                      "rp13-location-stage-2",
                      "rp13-location-stage-3",
                      "rp13-location-stage-4",
                      "rp13-location-stage-5",
                      "rp13-location-stage-6",
                      "rp13-location-stage-7",
                      "rp13-location-workshop-a",
                      "rp13-location-workshop-b",
                      "rp13-location-workshop-c",
                      "rp13-location-workshop-d",
                      "rp13-location-re-publica",
                      "rp13-location-newthinking",
                      "rp13-location-global-innovation-lounge" ];

/* helper functions */
var _id_ifier = function(str) {
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

		var existing_locations = [];
			
		/* iterate days */
		xml.schedule.day.forEach(function(day){

			/* push day */
			var day_id = [options.event_id, 'day', day.$.index].join('-');
			var day_label_de = moment(day.$.date, 'YYYY-MM-DD').lang('de').format('D. MMMM');
			var day_label_en = moment(day.$.date, 'YYYY-MM-DD').lang('en').format('D. MMMM');
			
			data.push({
				'id': day_id,
				'event': options.event_id,
				'type': 'day',
				'label_de': day_label_de,
				'label_en': day_label_en,
				'date': day.$.date
			});

			/* iterate locations, but only once */
			day.room.forEach(function(room){

				/* location id */
				var location_id = [options.event_id, "location", _id_ifier(room.$.name)].join("-");
				
				/* check if room is already in data */
				if (existing_locations.indexOf(location_id) < 0) {
					existing_locations.push(location_id);

					var location = locationTypes[location_id];
					if (!location) log.critical('Unknown Location:', location_id)
				
					/* push room */
					data.push({
						"id": location_id,
						"event": options.event_id,
						"type": "location",
						"label_de": location.label_de,
						"label_en": location.label_en,
						"is_stage": location.is_stage,
						"floor": location.floor, // we don't know
						"order_index": locationOrder.indexOf(location_id)
					});

				}

				/* iterate sessions */
				room.event.forEach(function(event){

					/* make id for session */
					var session_id = [options.event_id, "session", event.$.id].join("-");

					/* language */
					var language = event.language[0];
					if (!languageTypes[language]) log.critical("Unknown Language:", language);
					language = languageTypes[language];

					/* track */
					var track = event.track[0].toLowerCase().replace(/ & /g,'-').replace(/[^a-z\-]/g,'');
					if (!trackTypes[track]) log.critical("Unknown Track:", track);
					track = trackTypes[track];
					
					/* format */
					var format = event.type[0];
					if (!formatTypes[format]) log.critical("Unknown Format:", format);
					format = formatTypes[format];
					
					/* level */
					var level = event.experience_level[0];
					if (!levelTypes[level]) log.critical("Unknown Level:", level);
					level = levelTypes[level];
					
					/* speakers */
					var speakers = [];
					event.persons[0].person.forEach(function(person){
						if (typeof person.$.id === "undefined" || person.$.id === "") return; // defective person
						var speaker_id = [options.event_id, "speaker", person.$.id].join("-")
						speakers.push(speaker_id);
					});
					
					/* timing */
					var _time = moment([day.$.date, event.start[0]].join(" "), "YYYY-MM-DD HH:mm");
					var _duration = parseInt(event.duration[0].replace(/[^0-9]/g,''),10);

					var enclosures = [];
					var links = [];

					event.slide.forEach(
						function (url) {
							if (url !== '') {
								enclosures.push({
									url:url,
									mime:'application/pdf',
									type:'slides'
								})
							}
						}
					)
					
					data.push({
						"id": session_id,
						"event": options.event_id,
						"type": "session",
						"title": event.title[0],
						"abstract": _dehtml(event.abstract[0]),
						"description": _dehtml(event.description[0]),
						"url": null, // FIXME, the slug is empty, wtf.
						"begin": _time.format("YYYY-MM-DD[T]HH:mm:ssZ"),
						"end": _time.add('m', _duration).format("YYYY-MM-DD[T]HH:mm:ssZ"),
						"duration": _duration,
						'day': {
							'id': day_id,
							'label_de': day_label_de,
							'label_en': day_label_en,
							'date': day.$.date
						},
						"location": location_id,
						"track": { id:track.id, label_en:track.label_en, label_de:track.label_de },
						"format": format,
						"level": level,
						"lang": language,
						"speakers": speakers,
						"enclosures": enclosures,
						"links": links
					});

				});

			});

		});
		
		var known_speakers = {};

		/* iterate speakers */
		xml.schedule.speakers[0].speaker.forEach(function(speaker){
			
			var speaker_id = [options.event_id, "speaker", speaker.$.persons].join("-");
			if (known_speakers[speaker_id]) return;

			known_speakers[speaker_id] = true;

			data.push({
				"id": speaker_id,
				"event": options.event_id,
				"type": "speaker",
				"name": speaker.fullname[0],
				"photo": speaker.picture[0],
				"organization": speaker.organization[0],
				"position": speaker.position[0],
				"biography": speaker.biography[0],
				"links": [], // not supported for rp13
				"sessions": [] // fill me later
			});
		});

		Object.keys(trackTypes).forEach(function (key) {
			var track = trackTypes[key];
			data.push({
				'id': track.id,
				'event': options.event_id,
				'type': 'track',
				'label_de': track.label_de,
				'label_en': track.label_en,
				'color': track.color
			})
		});

		Object.keys(locationTypes).forEach(function (key) {
			var location = locationTypes[key];
			data.push({
				'id': key,
				'event': options.event_id,
				'type': 'location',
				'label_de': location.label_de,
				'label_en': location.label_en,
				'floor': location.floor,
				'is_stage': location.is_stage
			})
		});

		Object.keys(formatTypes).forEach(function (key) {
			var format = formatTypes[key];
			data.push({
				'id': format.id,
				'event': options.event_id,
				'type': 'format',
				'label_de': format.label_de,
				'label_en': format.label_en
			})
		});

		Object.keys(levelTypes).forEach(function (key) {
			var level = levelTypes[key];
			data.push({
				'id': level.id,
				'event': options.event_id,
				'type': 'level',
				'label_de': level.label_de,
				'label_en': level.label_en
			})
		});

		Object.keys(languageTypes).forEach(function (key) {
			var language = languageTypes[key];
			data.push({
				'id': language.id,
				'event': options.event_id,
				'type': 'language',
				'label_de': language.label_de,
				'label_en': language.label_en
			})
		});
		
		data.sort(function(a,b){
			return (sort_types[a.type] - sort_types[b.type]);
		});

		var lookup = {};

		data.forEach(function (entry) {
			lookup[entry.id] = entry;
		});

		// Filling Sessions of Speakers
		data.forEach(function (entry) {
			if (entry.type == 'session') {
				entry.speakers.forEach(function (speaker_id) {
					lookup[speaker_id].sessions.push(entry.id);
				})
			}
		});

		// Filling id arrays with more meta data
		data.forEach(function (entry) {
			switch (entry.type) {
				case 'session':

					var location = lookup[entry.location];
					entry.location = {
						'id':       location.id,
						'label_de': location.label_de,
						'label_en': location.label_en
					};

					entry.speakers = entry.speakers.map(function (id) {
						speaker = lookup[id];
						return {
							'id':   id,
							'name': speaker.name
						}
					})
				break;

				case 'speaker':

					entry.sessions = entry.sessions.map(function (id) {
						session = lookup[id];
						return {
							'id':   id,
							'title': session.title
						}
					})
				break;
			}
		})



		if (callback) callback(data);

	});

}