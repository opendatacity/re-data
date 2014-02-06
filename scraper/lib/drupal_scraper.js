
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
	"Beginner":         {id:"beginner",     label_de:"Beginner",         label_en:"Beginner"     },
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
						"track": track,
						"format": format,
						"level": level,
						"lang": language,
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