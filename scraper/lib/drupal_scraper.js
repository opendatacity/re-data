
/* get node modules */
var fs = require('fs');
var path = require('path');

/* get npm modules */
var scrapyard = require('scrapyard');
var moment = require('moment');
var ent = require('ent');

/* get local modules */
var log = require(path.resolve(__dirname, '../../api/lib/log.js'));

var location_list = {
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
	"business-innovation": {id:"business-innovation", label_de:"Business & Innovation", label_en:"Business & Innovation"},
	"science-technology":  {id:"science-technology",  label_de:"Science & Technology",  label_en:"Science & Technology" },
	"politics-society":    {id:"politics-society",    label_de:"Politics & Society",    label_en:"Politics & Society"   },
	"research-education":  {id:"research-education",  label_de:"Research & Education",  label_en:"Research & Education" },
	"culture":             {id:"culture",             label_de:"Culture",               label_en:"Culture"              },
	"media":               {id:"media",               label_de:"Media",                 label_en:"Media"                },
	"republica":           {id:"republica",           label_de:"Re:publica",            label_en:"Re:publica"           },
	"recampaign":          {id:"recampaign",          label_de:"Re:campaign",           label_en:"Re:campaign"          }
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

					var location = location_list[location_id];
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
						"track": track,
						"format": format,
						"level": level,
						"lang": language,
						"speakers": speakers,
						"enclosures": enclosures,
						"links": links,
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
				"name": speaker.fullname[0],
				"photo": speaker.picture[0],
				"organization": speaker.organization[0],
				"position": speaker.position[0],
				"biography": speaker.biography[0],
				"sessions": [] // fill me later
			});
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