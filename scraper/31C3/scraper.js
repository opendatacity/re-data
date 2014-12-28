/* get node modules */
var fs = require('fs');
var path = require('path');

/* get npm modules */
var scrapyard = require('scrapyard');
var moment = require('moment');
var ent = require('ent');
var cheerio = require('cheerio');
var sanitizeHtml = require('sanitize-html');
var parseCSV = require('csv-parse');
var async = require('async');
var md5 = require('MD5');
var ical = require('ical');
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


var log = require(path.resolve(__dirname, '../../api/lib/log.js'));
var json_requester = require('../lib/json_requester');

var baseURL = "http://events.ccc.de/congress/2014/Fahrplan/"
var schedule_url = baseURL + "schedule.json";
var speakers_url = baseURL + "speakers.json";
var eventId = "31c3";

// for debugging we can just pretend rp14 was today
var originalStartDate = new Date(Date.UTC(2014, 11, 27, 10, 15, 0, 0));
var fakeDate = new Date(Date.UTC(2014, 11, 7, 0, 0, 0, 0));
var sessionStartDateOffsetMilliSecs = 0; //fakeDate.getTime() - originalStartDate.getTime();

var dayYearChange = 0;
var dayMonthChange = 0;
var dayDayChange = 0;

// console.log("Real date: " + originalStartDate);
// console.log("Fake date: " + fakeDate);


// http://hls.stream.c3voc.de/hls/sN_L_Q.m3u8
// N ∈ [1;5], L ∈ {native, translated}, Q ∈ {hd, sd, slides}. 

// Livestream test
var streamURLs = {
	"31c3-saal-1": "http://hls.stream.c3voc.de/hls/s1_native_hd.m3u8",
	"31c3-saal-2": "http://hls.stream.c3voc.de/hls/s2_native_hd.m3u8",
	"31c3-saal-g": "http://hls.stream.c3voc.de/hls/s3_native_hd.m3u8",
	"31c3-saal-6": "http://hls.stream.c3voc.de/hls/s4_native_hd.m3u8"
};

var colors = {};
colors[eventId + "-hardware-making"] = [110.0, 80.0, 180.0, 1.0]; // 4
colors[eventId + "-security-safety"] = [255.0, 90.0, 70.0, 1.0]; // 1
colors[eventId + "-ethics-society-politics"] = [255.0, 130.0, 50.0, 1.0]; // 2
colors[eventId + "-art-beauty"] = [255.0, 160.0, 0.0, 1.0]; // 3
colors[eventId + "-science"] = [132.0, 88.0, 223.0, 1.0]; // even lighter purple
colors[eventId + "-entertainment"] = [65.0, 20.0, 90.0, 1.0]; // 5
colors[eventId + "-ccc"] = [29.0, 29.0, 29.0, 1.0];
colors[eventId + "-other"] = [107.0, 107.0, 107.0, 1.0];

var allFormats = {
	'discussion': { id:'discussion', label_en:'Discussion' },
	'talk':    { id:'talk',    label_en:'Talk'       },
	'workshop':   { id:'workshop',   label_en:'Workshop'   }
}

var allLevels = {
	'beginner':         { id:'beginner',     label_en:'Beginner'     },
	'intermediate':     { id:'intermediate', label_en:'Intermediate' },
	'advanced':         { id:'advanced',     label_en:'Advanced'     }
};

var allLanguages = {
	'en': { id:'en', label_en:'English' },
	'de': { id:'de', label_en:'German' },	
};

var allMaps = {
	'map-level0': {
		'event': eventId,
		'id': eventId + "-map-" + "level0",
		'type': "map",
		'label_de': "Congress Center Hamburg",
		'label_en': "Congress Center Hamburg",
		'floor_label_de': "Erdgeschoss",
		'floor_label_en': "Ground Floor",		
		"is_outdoor": true,
		"is_indoor": true,		
		"floor": 0,
		"order_index": 0,
		"area": {"width": 1000.0, 
		         "height": 530.0},
		"tiles": {
                    "base_url": "http://data.conference.bits.io/maps/31c3/floor0",
                    "large_image_url": "http://data.conference.bits.io/maps/31c3/floor0/mini.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
                    "size": {"width": 5940,
                             "height": 4320}
                },
	    "pois": []
	},
	'map-level1': {
		'event': eventId,
		'id': eventId + "-map-" + "level1",
		'type': "map",
		'label_de': "Congress Center Hamburg",
		'label_en': "Congress Center Hamburg",		
		'floor_label_de': "1. Obergeschoß",
		'floor_label_en': "1st floor",
		"is_outdoor": false,
		"is_indoor": true,		
		"floor": 1,
		"order_index": 1,
		"area": {"width": 1000.0, 
		         "height": 530.0},
		"tiles": {
                    "base_url": "http://data.conference.bits.io/maps/31c3/floor1",
                    "large_image_url": "http://data.conference.bits.io/maps/31c3/floor1/mini.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
           "size": {"width": 5940,
                    "height": 4320}
                },
	    "pois": []
	},
	'map-level2': {
		'event': eventId,
		'id': eventId + "-map-" + "level2",
		'type': "map",
		'label_de': "Congress Center Hamburg",
		'label_en': "Congress Center Hamburg",		
		'floor_label_de': "2. Obergeschoß",
		'floor_label_en': "2nd floor",
		"is_outdoor": false,
		"is_indoor": true,		
		"floor": 2,
		"order_index": 2,
		"area": {"width": 1000.0, 
		         "height": 530.0},
		"tiles": {
                    "base_url": "http://data.conference.bits.io/maps/31c3/floor2",
                    "large_image_url": "http://data.conference.bits.io/maps/31c3/floor2/mini.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
           "size": {"width": 5940,
                    "height": 4320}
                },
	    "pois": []
	},
	'map-level3': {
		'event': eventId,
		'id': eventId + "-map-" + "level3",
		'type': "map",
		'label_de': "Congress Center Hamburg",
		'label_en': "Congress Center Hamburg",		
		'floor_label_de': "3. Obergeschoß",
		'floor_label_en': "3rd floor",
		"is_outdoor": false,
		"is_indoor": true,		
		"floor": 3,
		"order_index": 3,
		"area": {"width": 1000.0, 
		         "height": 530.0},
		"tiles": {
                    "base_url": "http://data.conference.bits.io/maps/31c3/floor3",
                    "large_image_url": "http://data.conference.bits.io/maps/31c3/floor3/mini.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
           "size": {"width": 5940,
                    "height": 4320}
                },
	    "pois": []
	},
	'map-level4': {
		'event': eventId,
		'id': eventId + "-map-" + "level4",
		'type': "map",
		'label_de': "Congress Center Hamburg",
		'label_en': "Congress Center Hamburg",		
		'floor_label_de': "4. Obergeschoß",
		'floor_label_en': "4th floor",
		"is_outdoor": false,
		"is_indoor": true,		
		"floor": 4,
		"order_index": 4,
		"area": {"width": 1000.0, 
		         "height": 530.0},
		"tiles": {
                    "base_url": "http://data.conference.bits.io/maps/31c3/floor4",
                    "large_image_url": "http://data.conference.bits.io/maps/31c3/floor4/mini.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
           "size": {"width": 5940,
                    "height": 4320}
                },
	    "pois": []
	}				
};

// allMaps = {	'fake': {
// 		'event': eventId,
// 		'id': "fake",
// 		'type': "map",
// 		'label_de': "Congress Center Hamburg",
// 		'label_en': "Congress Center Hamburg",
// 		'floor_label_de': "Erdgeschoss",
// 		'floor_label_en': "Ground Floor",
// 		"is_outdoor": true,
// 		"is_indoor": true,
// 		"floor": 0,
// 		"order_index": 0,
// 		"area": {"width": 1000.0,
// 		         "height": 530.0},
// 		"tiles": {
//                     "base_url": "http://data.conference.bits.io/maps/31c3/floor0",
//                     "large_image_url": "http://data.conference.bits.io/maps/31c3/floor0/mini.png",
//                     "tile_size": 512,
//                     "tile_file_extension": "png",
//                     "size": {"width": 5940,
//                              "height": 4320}
//                 },
// 	    "pois": []
// 	} };

var allPOIs = {
	"poi-hall1": {
		"id": eventId + "-poi-hall1",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level4",
					   "x": 3520.0, "y": 2107.0}, 
					  {"map": eventId + "-" + "level3",
					   "x": 3520.0, "y": 2107.0}, 
					  {"map": eventId + "-" + "level2",
					   "x": 3520.0, "y": 1957.0}],
		"category": "session-location",
		"location": {"id": eventId + "-saal-1",
					 "label_de": "Saal 1",
					 "label_en": "Hall 1"},
		"label_de": "Saal 1",
		"label_en": "Hall 1",		
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},
	"poi-hall2": {
		"id": eventId + "-poi-hall2",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level4",
					   "x": 4694.0, "y": 1710.0},
					  {"map": eventId + "-" + "level3",
					   "x": 4694.0, "y": 1710.0},
					  {"map": eventId + "-" + "level2",
					   "x": 4694.0, "y": 1610.0}],
		"category": "session-location",		
		"location": {"id": eventId + "-saal-2",
					 "label_de": "Saal 2",
					 "label_en": "Hall 2"},
		"label_de": "Saal 2",
		"label_en": "Hall 2",
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},	
	"poi-halld": {
		"id": eventId + "-poi-halld",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level2",
					   "x": 4694.0, "y": 1710.0}],
		"category": "session-location",		
		"location": {"id": eventId + "-saal-d",
					 "label_de": "Saal D",
					 "label_en": "Hall D"},
		"label_de": "Saal D",
		"label_en": "Hall D",
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},
	"poi-halle": {
		"id": eventId + "-poi-halle",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level2",
					   "x": 643.0, "y": 2360.0}],
		"category": "session-location",		
		"location": {"id": eventId + "-saal-e",
					 "label_de": "Saal E",
					 "label_en": "Hall E"},
		"label_de": "Saal E",
		"label_en": "Hall E",
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},	
	"poi-hallf": {
		"id": eventId + "-poi-hallf",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level2",
					   "x": 653.0, "y": 2030.0}],
		"category": "session-location",		
		"location": {"id": eventId + "-saal-f",
					 "label_de": "Saal F",
					 "label_en": "Hall F"},
		"label_de": "Saal F",
		"label_en": "Hall F",
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},		
	"poi-halld": {
		"id": eventId + "-poi-halld",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level2",
					   "x": 663.0, "y": 2720.0}],
		"category": "session-location",		
		"location": {"id": eventId + "-saal-d",
					 "label_de": "Saal D",
					 "label_en": "Hall D"},
		"label_de": "Saal D",
		"label_en": "Hall D",
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},	
	"poi-hallg": {
		"id": eventId + "-poi-hallg",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level2",
					   "x": 2027.0, "y": 2040.0}],
		"category": "session-location",		
		"location": {"id": eventId + "-saal-g",
					 "label_de": "Saal G",
					 "label_en": "Hall G"},
		"label_de": "Saal G",
		"label_en": "Hall G",
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},			
	"poi-hall3": {
		"id": eventId + "-poi-hall3",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level0",
					   "x": 1938.0, "y": 1900.0}],
		"category": "session-location",		
		"location": {"id": eventId + "-saal-3",
					 "label_de": "Saal 3",
					 "label_en": "Hall 3"},
		"label_de": "Saal 3",
		"label_en": "Hall 3",
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},				
	"poi-hall6": {
		"id": eventId + "-poi-hall6",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level0",
					   "x": 4016.0, "y": 2464.0}],	
		"category": "session-location",		
		"location": {"id": eventId + "-saal-6",
					 "label_de": "Saal 6",
					 "label_en": "Hall 6"},
		"label_de": "Saal 6",
		"label_en": "Hall 6",		
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},
	"poi-hall13": {
		"id": eventId + "-poi-hall13",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level1",
					   "x": 4448.0, "y": 1498.0}],	
		"category": "session-location",		
		// "location": {"id": eventId + "-saal-13",
					 // "label_de": "Saal 13",
					 // "label_en": "Hall 13"},
		"label_de": "Saal 13",
		"label_en": "Hall 13",		
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},
	"poi-hall14": {
		"id": eventId + "-poi-hall14",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level1",
					   "x": 4625.0, "y": 1413.0}],	
		"category": "session-location",		
		// "location": "location-1",
		"label_de": "Saal 14",
		"label_en": "Hall 14",		
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},		
	// entertainment
	"poi-revolution9": {
		"id": eventId + "-poi-revolution9",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level0",
					   "x": 3478.0, "y": 3179.0}],	
		"category": "entertainment",		
		// "location": "location-1",
		"label_de": "Revolution #9",
		"label_en": "Revolution #9",		
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},
	"poi-heaven": {
		"id": eventId + "-poi-heaven",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level1",
					   "x": 3663.0, "y": 2735.0}],	
		"category": "organisation",		
		// "location": "location-1",
		"label_de": "Himmel",
		"label_en": "Heaven",	
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},	
	"poi-villa-straylight": {
		"id": eventId + "-villa-straylight",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level4",
					   "x": 3538.0, "y": 2764.0}],	
		"category": "session-location",		
		"location": "31c3-villa-straylight",
		"label_de": "Villa Straylight",
		"label_en": "Villa Straylight",	
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},	
	"poi-wordlounge": {
		"id": eventId + "-wordlounge",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level3",
					   "x": 2885.0, "y": 2794.0}],	
		"category": "session-location",		
		"location": "31c3-wordlounge",
		"label_de": "Wordlounge",
		"label_en": "Wordlounge",	
		"hidden": false,
		"priority": 1000,
		"beacons": []
	},	
	"poi-food-hall1-a": {
		"id": eventId + "-poi-food-hall1-a",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level2",
					   "x": 3881.0, "y": 2556.0}],	
		"category": "food",		
		// "location": eventId + "-wordlounge",
		"label_de": "Essen",
		"label_en": "Food",	
		"hidden": false,
		"priority": 500,
		"beacons": []
	},					
	"poi-food-hall1-b": {
		"id": eventId + "-poi-food-hall1-b",
		"event": eventId,	
		"type": "poi",			
		"positions": [{"map": eventId + "-" + "level2",
					   "x": 3175.0, "y": 2395.0}],	
		"category": "food",		
		// "location": eventId + "-wordlounge",
		"label_de": "Essen",
		"label_en": "Food",	
		"hidden": false,
		"priority": 500,
		"beacons": []
	}	
};

var csvData = fs.readFileSync(__dirname + "/pois.csv");

var data   = [];
var allDays = {};
var allRooms = {};
var allSpeakers = {};
var allTracks = {};
var allSpeakers = {};

function addEntry(type, obj) {
	obj.event  = eventId;
	obj.type   = type;
	data.push(obj);
}

function alsoAdd(type, list) {
	Object.keys(list).forEach(function (key) {
		var obj   = clone(list[key]);
		obj.event = eventId;
		obj.type  = type;
		data.push(obj);
	})
}

function mkID(string) {
	return eventId + "-" + string.toString().replace(/[^A-Za-z0-9]+/g, '-').toLowerCase();
}

function parseDay(dayXML) {
	var date = dayXML.date;
		
	var comps = date.split("-");	
	var parseDate = new Date(date);
	parseDate.setUTCFullYear(parseDate.getUTCFullYear() + dayYearChange);
	parseDate.setUTCMonth(parseDate.getUTCMonth() + dayMonthChange);
	parseDate.setUTCDate(parseDate.getUTCDate() + dayDayChange);		
	
	
	var dateLabelDe = date;
	var dateLabelEn = date;
	
	var monthDay = parseDate.getUTCDate();
	switch (monthDay) {
	case 27:
		dateLabelDe = "Tag 1";
		dateLabelEn = "Day 1";		
		break;
	case 28:
		dateLabelDe = "Tag 2";
		dateLabelEn = "Day 2";		
		break;
	case 29:
		dateLabelDe = "Tag 3";
		dateLabelEn = "Day 3";		
		break;
	case 30:
		dateLabelDe = "Tag 4";
		dateLabelEn = "Day 4";		
		break;						
	default:
		
	}
	
	var id = mkID(dayXML.index);
	
	return {
	    "id": id,
	    "event": eventId,
	    "type": "day",
	    "label_en": dateLabelEn,
	    "label_de": dateLabelDe,
		"date": date
	};
}

function parseSpeaker(speakerJSON) {
	var bio = "";
	if (speakerJSON.abstract) {
		bio = speakerJSON.abstract;
	}
	if (speakerJSON.description) {
		bio = bio + "\n\n" + speakerJSON.description;
	}
	
	var links = [];
	
	if (speakerJSON.links) {
		speakerJSON.links.forEach(function (link) {
			links.push({"url": link.url,
				        "title": link.title,
				        "service": "web",
				        "type": "speaker-link"});
		});
	}
	
	var result = {
		"id": mkID(speakerJSON.id),
		"type": "speaker",
		"event": eventId,
		"name": speakerJSON.full_public_name,
		"biography": bio,
		"links": links,
		"sessions": [] // fill me later
	};
	
	// de-htmlize
	// console.log(bio);	
	// $ = cheerio.load(bio);
	result["biography"] = sanitizeHtml(bio, {allowedTags: []});
	
	// sys.puts(sys.inspect(handler.dom, false, null));
	
	
	var imageHost = "https://events.ccc.de/congress/2014/Fahrplan";
	if (speakerJSON.photo) {
		result['photo'] = speakerJSON.photo;
	}
	if (speakerJSON.image) {
		var path = speakerJSON.image;
		path = path.replace(/\/medium\//,'/large/');
		result['photo'] = imageHost + path;
	}
	return result;
};

function parseRoom(roomName, index) {
    return {
      "id": mkID(roomName),
      "label_en": roomName.toString(),
      "label_de": roomName.toString(),		
      "is_stage": roomName.toString().match(/Saal /i) ? true : false,
      "floor": 0,
      "order_index": index,
      "event": eventId,
      "type": "location"
    };
};

function parseDate(dateString) {
	var date = new Date(dateString);
	var newMillis = date.getTime() + sessionStartDateOffsetMilliSecs;
	date.setTime(newMillis);
	return date;
};

function parseEnd(dateString, durationString) {
	var date = new Date(dateString);
	var time = date.getTime() / 1000;
	var match = durationString.toString().match(/(\d\d):(\d\d)/);
	var hours = new Number(match[1]);
	var minutes = new Number(match[2]);
	var seconds = time + (minutes * 60.0) + (hours * 60.0 * 60.0);
	date = new Date(seconds * 1000); 
	var newMillis = date.getTime() + sessionStartDateOffsetMilliSecs;
	date.setTime(newMillis);
	return date;	
}

function parseTrackFromEvent(eventXML) {
	var trackName = eventXML.track;
	var id = mkID(trackName);
	var color = colors[id];
	if (!color) {
		color = [207,94,28,1];
	}
	return {
		"id": id,
		"color":  color,
		"label_en": trackName.toString(),
        "label_de": trackName.toString()
	};
};

function normalizeXMLDayDateKey(date) {
	var parseDate = new Date(date);
	parseDate.setUTCFullYear(parseDate.getUTCFullYear() + dayYearChange);
	parseDate.setUTCMonth(parseDate.getUTCMonth() + dayMonthChange);
	parseDate.setUTCDate(parseDate.getUTCDate() + dayDayChange);		
	
	// console.log("normalized " + date );
	date = "" + parseDate.getUTCFullYear() + "-" + (parseDate.getUTCMonth() + 1)  + "-" + parseDate.getUTCDate();
	// console.log("to " + date );
	
	return date;
	
}

function parseEvent(event, day, room) {
	var urlBase = "http://events.ccc.de/2014/";
	
	var links = [];
	
	event.links.forEach(function (link) {
		links.push({
			"title": link["title"],
			"url": link["url"],
			"type": "other"
		});
	});
	
	var day = normalizeXMLDayDateKey(day["date"]);
	
	var eventTypeId = event.type.toString();
	// console.log("event type " + eventTypeId);
	if (eventTypeId == 'lecture') {
		eventTypeId = 'talk';
	} else if (eventTypeId == 'other') {
		eventTypeId = 'talk';
	}

	var session = {
		"id": mkID("session-" + event["guid"]),
		"title": event.title.toString(),
		"url": baseURL + "events/" +  event.id + ".html",
		"abstract": sanitizeHtml(event.abstract.toString(), {allowedTags: []}),
		"description": sanitizeHtml(event.description.toString(), {allowedTags: []}),
		"begin": parseDate(event.date),
		"end": parseEnd(event.date, event.duration),
		"track": allTracks[mkID(event.track)],
		"day": allDays[day],
		"location": allRooms[room.id],
		"format": allFormats[eventTypeId],
		"level": allLevels['advanced'],
		"lang": allLanguages[event.language.toString() ? event.language.toString() : 'en'],
		"speakers": [], // fill me later
		"enclosures": [], // fill me later
		"links": links
	};
	
	if (!session.format) {
		log.warn("Session " + session.id + " (" + session.title + ") has no format")
		session["format"] = allFormats['talk'];
	}
	
	if (event.subtitle.toString() != "") {
		session["subtitle"] = event.subtitle.toString();
	}
	
	// HACK: Fake one video for App Review
	// IF for Fnord News show
    // if (session['id'] == '31c3-session-mw1wjnnzwxzskm3ip5lg0g') {
    //     session.enclosures.push({
    //                 "url": "http://cdn.media.ccc.de/congress/2013/mp4/30c3-5490-de-en-Fnord_News_Show_h264-hq.mp4",
    //             "mimetype": "video/mp4",
    //             "type": "recording",
    //             "thumbnail": "http://static.media.ccc.de/media/congress/2013/5490-h264-iprod_preview.jpg"
    //            });
    // }
	
	var streamURL = streamURLs[session.location.id];
	if (streamURL) {
		session.enclosures.push({
			"url": streamURL,
			"mimetype": "video/mp4",
			"type": "livestream"
		});	
	}
	
	return session;
};


function handleResult(events, speakers, eventRecordings) {
	
	speakers.forEach(function (speaker) {
		var speakerJSON = parseSpeaker(speaker);
		addEntry('speaker', speakerJSON);
		
		allSpeakers[speakerJSON.id] = speakerJSON;
	});
	
	events.schedule.conference.days.forEach(function(day) {
		// Day
		// ---
   		var dayJSON = parseDay(day);
		allDays[normalizeXMLDayDateKey(dayJSON.date)] = dayJSON;
   	 	
   	 	var roomIndex = 0;
		var rooms = day.rooms;
		Object.keys(rooms).forEach(function (roomLabel) {
			// Room
			// ----
			var roomJSON = parseRoom(roomLabel, roomIndex);
			allRooms[roomJSON.id] = roomJSON;
			roomIndex++;
			
			var events = rooms[roomLabel];
			events.forEach(function (event) {
				// Track
				// -----
				var trackJSON = parseTrackFromEvent(event);
				allTracks[trackJSON.id] = trackJSON;
   			 
			 	// Event
				// -----
				var eventJSON = parseEvent(event, day, roomJSON);
				
				// Event Speakers
				// --------------
				event.persons.forEach(function (person) {
   						var personID = mkID(person["id"]);
   						var speaker = allSpeakers[personID];
   						
						if (speaker) {
							speaker.sessions.push({
								"id": eventJSON.id,
   								"title": eventJSON.title
							});

							var person = {"id": personID, 
   										  "name": speaker.name};
   							eventJSON.speakers.push(person);
						}
   				});
				
				// Videos
				// ------
				var recordingJSON = null;
				
				eventRecordings.forEach(function (element) {
					if (eventJSON.url == element.link) {
						console.log(element.link);
						recordingJSON = element;
					}
				});
				if (recordingJSON && recordingJSON.recording) {
					eventJSON.enclosures.push({
						"url": recordingJSON.recording.recording_url,
						"mimetype": "video/mp4",
						"type": "recording",
						"thumbnail": recordingJSON.thumb
					});						
				}
   				 
				addEntry('session', eventJSON);
			});
		});
		
	});
}

exports.scrape = function (callback) {
	console.log("scrape");

	
	var scraper = new scrapyard({
		cache: path.resolve(__dirname, '..', '.cache'), 
		debug: true,
		timeout: 300000,
		retries: 5,
		connections: 10
	});
	
	async.series(
		{
			// lectures: function (callback) {
			// 	json_requester.get({
			// 			urls: {
			// 				speakers: speakers_url,
			// 				schedule: schedule_url,
			// 			}
			// 		},
			// 		function (result) {
			// 			var speakers = result.speakers.schedule_speakers.speakers;
			// 			var schedule = result.schedule;
			//
			// 			handleResult(schedule, speakers, []);
			//
			// 			parsePOIsFromCSV(csvData, function (pois) {
			// 			    alsoAdd('day', allDays);
			// 			    alsoAdd('location', allRooms);
			// 			    alsoAdd('map', allMaps);
			// 			    alsoAdd('poi', pois);
			// 			    alsoAdd('track', allTracks);
			// 				alsoAdd('format', allFormats);
			// 				alsoAdd('language', allLanguages);
			//
			// 				callback(null, 'lectures');
			// 			});
			// 		});
			// },
			lectures: function (callback) {
				json_requester.get({
					urls: {conference: "http://api.media.ccc.de/public/conferences/54"}
				},
				function (result) {
					if (result.conference.events) {
						var videoAPICallURLs = {
							speakers: speakers_url,
							schedule: schedule_url,
						};
					console.log(result.conference.events);												
						result.conference.events.forEach(function (event) {
							videoAPICallURLs[event.guid] = event.url;
						});

						json_requester.get({urls: videoAPICallURLs},
							function (result) {
											   
								var speakers = result.speakers.schedule_speakers.speakers;
								var schedule = result.schedule;
								delete result.schedule;
								delete result.speakers;
			
								var eventRecordingJSONs = toArray(result);
								// console.log("result! ", eventRecordingJSONs);
								eventRecordingJSONs = eventRecordingJSONs.map(function (er) {
									var rercording = er.recordings.filter(function (rec, index, all) {
										return rec.mime_type == "video/mp4" || rec.mime_type == "vnd.voc/h264-hd";
									});
												   
									return {
										"link": er.link,
										"thumb": er.thumb_url,
										"recording": rercording.length > 0 ? rercording[0] : null
									};
								});
								
											   
								handleResult(schedule, speakers, eventRecordingJSONs);
	
								parsePOIsFromCSV(csvData, function (pois) {
									alsoAdd('day', allDays);
									alsoAdd('location', allRooms);
									alsoAdd('map', allMaps);
									alsoAdd('poi', pois);  
									alsoAdd('track', allTracks);
									alsoAdd('format', allFormats);
									alsoAdd('language', allLanguages);				
				
									callback(null, 'lectures');				
								});											   
							});						
					}
				});
			},
			sendezentrum: function (callback) {	
			    ical.fromURL('https://www.google.com/calendar/ical/ck0ov9f0t6omf205r47uq6tnh4%40group.calendar.google.com/public/basic.ics', {}, function(err, data) {
			         for (var k in data){
			           if (data.hasOwnProperty(k)) {
						   
						   var ev = data[k];
						   var start = ev.start;
						   
						   var matches = ev.summary.match(/(.+ )\(([^)]+)\)/i);
						   if (!matches) {
							   
							   console.log("Miss: " ,ev.summary);
							   continue;
							
						   }
						   var title = matches[1];
						   var people = matches[2];
						   if (people) {
						   	  people = people.split(/\band|\bund|\b,/i).map(function (item) {
								  return item.trim();
						   	  });
							  people = people.filter(function (item) {
								  var match = item.match(/jemand|gast/i);
								  if (match) {
									  return false;
								  } else {
									  return true;
								  }
							  });
						   }
						   console.log("Title: ", title);
						   console.log("People: ", people);
						   
						   var speakers = people.map(function (personname) {
							   var speaker = {
								   "event": eventId,
								   "id": mkID("sendezentrum-" + personname),
								   "name": personname,
								   "type": "speaker",
								   "photo": "",
								   "biography": "",
								   "links": []
							   };
							   // Hardcode some people
							   if (personname == "Tim Pritlove") {
								   speaker = allSpeakers["31c3-3809"];
							   } else if (personname == "Linus Neumann") {
								   speaker = allSpeakers["31c3-3995"];
							   }
							   return speaker;
						   });
						   allSpeakers[speakers.id] = speakers;
						   
						   var event = {
 							   "id": mkID(md5(ev.uid)),
							   "event": eventId,
							   "type": "session",
							   "title": title.trim(),
							   "abstract": "",
							   "description": "",
							   "begin": parseDate(start.toISOString()),
							   "end": parseDate(ev.end.toISOString()),
							   "lang": allLanguages["de"],
							   "format": title.match(/Workshop/i) ? allFormats["workshop"] : allFormats["talk"],
							   "level": allLevels["advanced"],
							   "enclosures": [],
							   "location": {},
							   "links": [],
							   "day": null,
							   "location": {
								   "event": eventId,
								   "floor": 1,
								   "id": "31c3-sendezentrum",
								   "is_stage": false,
								   "label_de": "Sendezentrum",
								   "label_en": "Broadcast Center",
								   "order_index": 10,
								   "type": "location"
							   },
							   "track": allTracks["31c3-art-culture"],
							   "url": ev.url,
							   "speakers": speakers.map(function (speaker) {
								   return {
									   "id": speaker.id,
									   "name": speaker.name
								   };
							   })
 						   };
						   
						   
						   
						   var day = normalizeXMLDayDateKey(event.begin);
						   event["day"] = allDays[day];
						   
						   allRooms[event.location.id] = event.location
						   
						   addEntry('session', event);
						   
						   // 			             console.log("Conference",
						   // ev.uid,
						   // 			               ev.summary,
						   // 			               'is in',
						   // start,
						   // 			               ev.location,
						   // 			               'on the', ev.start.getDate(), 'of', months[ev.start.getMonth()]);
						   
						   console.log(event);
			           }
			         }
					 callback(null, 'sendezentrum');
			       });
				
			}
		},
		function (err, results) {
			if (!err) {
				callback(data);
			} else {
				console.log(err);
			}
		}
		
	);
	

};

function parsePOIsFromCSV(data, callback) {
	parseCSV(csvData, {"delimiter": ";", 
					   "auto_parse": false,
					   "skip_empty_lines": true}, function(err, output) {
						   
			var pois = [];
			
			output.forEach(function (row) {
				// console.log(row);
				var id = row[0];
				
				if (id == 'id' || 
					id == '' || 
					id == ' ' || 					
					row[2] == '' || row[2] == ' ' ||
					row[3] == '' || row[3] == ' ') 
				{
					// console.log("skipping "  + row);
					return;
				}
				
				var poi = {
					"id": (eventId + "-pointofinterest-" + id),
					"type": "poi",
					"label_en": row[4],
 				    "label_de": row[5],
					"category": row[6],
					"positions": [], // fill me later
	                "hidden": false,
	                "priority": 1000,
					"beacons": []
				};
				
				var x = parseInt(row[2]);
				var y = parseInt(row[3]);
				var floors = row[1].split(",");				
				if (floors.length > 0 && floors[0] != '') {  
					for (var i = floors.length - 1; i >= 0; i--) {
						var floorID = eventId + "-map-level" + floors[i];
							poi.positions.push(
								{"map": floorID,
								 "x": x,
								 "y": y}
							);

					}
				}
				
				pois.push(poi);
			});
			
			callback(pois);		
	});
};

//
// "poi-hall1": {
// 	"id": eventId + "-poi-hall1",
// 	"event": eventId,
// 	"type": "poi",
// 	"positions": [{"map": eventId + "-" + "level4",
// 				   "x": 3520.0, "y": 2107.0},
// 				  {"map": eventId + "-" + "level3",
// 				   "x": 3520.0, "y": 2107.0},
// 				  {"map": eventId + "-" + "level2",
// 				   "x": 3520.0, "y": 1957.0}],
// 	"category": "session-location",
// 	"location": {"id": eventId + "-saal-1",
// 				 "label_de": "Saal 1",
// 				 "label_en": "Hall 1"},
// 	"label_de": "Saal 1",
// 	"label_en": "Hall 1",
// 	"hidden": false,
// 	"priority": 1000,
// 	"beacons": []
// },

////////////////
	//
	// scraper.scrape({ url: schedule_url,
	// 	type: 'xml',
	// 	encoding: 'utf8' },
	// 	function(err, xml) {
	// 		json_requester.get({
	// 			urls: {
	// 				speakers: speakers_json,
	// 				conferences_videos: 'http://api.media.ccc.de/public/conferences'
	// 			}
	// 		},
	// 		function (result) {
	// 			// In case of erro bail out
	// 			if (!err) {
	// 				// set global eventID
	// 				// eventId = (xml.schedule.conference[0].acronym + "").toLowerCase();
	// 				// 				    handleResult(xml,
	// 				// 				 	 		     result.speakers.schedule_speakers.speakers,
	// 				// 			 []);
	// 				// callback(data);
	// 				// return;
	//
	//
	// 				result.conferences_videos.conferences.forEach(function (conference) {
	// 					if (conference.acronym == eventId || conference.acronym == "30c3") {
	// 						json_requester.get({urls: {eventsForVideoJSON: conference.url}},
	// 							function (videoEventsResult) {
	// 								var videoAPICallURLs = {};
	// 								videoEventsResult.eventsForVideoJSON.events.forEach(function (event) {
	// 									videoAPICallURLs[event.guid] = event.url;
	// 								})
	//
	// 								json_requester.get({urls: videoAPICallURLs},
	// 												   function (eventResults) {
	// 													   // console.log("result!");
	// 													   var eventRecordingJSONs = toArray(eventResults);
	// 													   eventRecordingJSONs = eventRecordingJSONs.map(function (er) {
	//
	//
	// 														   var rercording = er.recordings.filter(function (rec, index, all) {
	// 															   return rec.mime_type == "video/mp4";
	// 														   });
	//
	// 														   return {"link": er.link,
	// 													   			   "thumb": er.thumb_url,
	// 															   	   "recording": rercording.length > 0 ? rercording[0] : null};
	// 													   });
	//
	// 				   									   handleResult(xml,
	// 				   									 			    result.speakers.schedule_speakers.speakers,
	// 																	eventRecordingJSONs);
	// 													   callback(data);
	// 												   });
	// 							});
	//
	// 					}
	// 				});
	//
	//
	//
	// 			} else {
	// 				console.log("error" + err);
	// 				callback(null);
	// 			}
	// 		});
	// 	});
	// };


function toArray(obj) {
	return Object.keys(obj).map(function (key) { return obj[key] })
}


function clone(obj) {
	var newObj = {};
	Object.keys(obj).forEach(function (key) {
		newObj[key] = obj[key];
	})
	return newObj;
}