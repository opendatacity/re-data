/* get node modules */
var fs = require('fs');
var path = require('path');
var eventId = "32c3";

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
var icalendar = require('icalendar');

var log = require(path.resolve(__dirname, '../../api/lib/log.js'));
var json_requester = require('../lib/json_requester');

var halfnarp_schedule_url = "http://halfnarp.events.ccc.de/-/talkpreferences";

// for debugging we can just pretend rp14 was today
var originalStartDate = new Date(Date.UTC(2015, 7, 13, 10, 15, 0, 0));
var fakeDate = new Date(Date.UTC(2015, 7, 13, 10, 15, 0, 0));
var sessionStartDateOffsetMilliSecs = 0; //fakeDate.getTime() - originalStartDate.getTime();

var dayYearChange = 0;
var dayMonthChange = 0;
var dayDayChange = 0;

// console.log("Real date: " + originalStartDate);
// console.log("Fake date: " + fakeDate);


// http://hls.stream.c3voc.de/hls/sN_L_Q.m3u8
// N ∈ [1;5], L ∈ {native, translated}, Q ∈ {hd, sd, slides}. 

// http://halfnarp.events.ccc.de/-/talkpreferences

var sortOrderOfLocations = [

];

var poi2locationMapping = {
	"camp15-http-campmap-mazdermind-de-api-villages-id-1787": "camp15-milliways",
	"camp15-http-campmap-mazdermind-de-api-villages-id-1832": "camp15-spacevillage",
	"camp15-http-campmap-mazdermind-de-api-villages-id-1783": "camp15-foodhackingbase",
	"camp15-http-campmap-mazdermind-de-api-villages-id-1779": "camp15-amateur-radio"
	// "camp15-hackcenter-1"
};

var colors = {};


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

var allPOIs = {};
var data   = [];
var allDays = {};
var allRooms = {};
var allSpeakers = {};
var allTracks = {
	'other': { id:'other', label_de:'Other', label_en:'Other', color:[101.0, 101.0, 101.0, 1.0] }
};
var allSpeakers = {};

function addEntry(type, obj) {
	obj.event  = eventId;
	obj.type   = type;
	data.push(obj);
};

function alsoAdd(type, list) {
	Object.keys(list).forEach(function (key) {
		var obj   = clone(list[key]);
		obj.event = eventId;
		obj.type  = type;
		data.push(obj);
	})
};

function mkID(string) {
	return eventId + "-" + string.toString().replace(/[^A-Za-z0-9]+/g, '-').toLowerCase();
};

function normalizeXMLDayDateKey(date) {
	var parseDate = new Date(date);
	
	return date;	
};

function sessionFromJSON(json, id_prefix) {
	var sessionURL = "http://events.ccc.de/congress/2015/Fahrplan/events/" + json["event_id"] + ".html";
	
	var speakers = speakerFromString(json["speakers"]).map(function (speaker) {
		return {
				"id": speaker.id,
				"name": speaker.name
		};
	});
	
	var session = {
		"id": mkID(id_prefix + json["event_id"]),
		"title": json["title"],
		"description": json["abstract"],
		"url": sessionURL,
		"begin": null,
		"end": null,
		"duration": json["duration"],
		"location": null,
		"track": trackFromJSON(json), // fixme
		"format": allFormats['talk'],
		"lang": allLanguages['en'],
		"level": allLevels['intermediate'],
		"speakers": speakers,
		"enclosures": [],
		"links": []
	};
	
	return session;
};

function trackFromJSON(json) {
	var trackID = mkID(json.track_id);
	allTracks[trackID] = {'id': trackID, 
						  'label_en': json.track_name, 
						  'label_de': json.track_name,
						  'color': [101.0, 101.0, 101.0, 1.0] };
	
	return allTracks[trackID];
};



function speakerFromString(string) {
	var speakers = [];
	
	var names = string.split(",").map(function (item) {
		return item.trim();
	});
	
	names.forEach(function (speakerName) {
		var speakerID = mkID(speakerName.trim());
		if (speakerName == "") {
			return;
		}
		var speaker = allSpeakers[speakerID];
		if (speaker) {
			speakers.push(allSpeakers[speakerID]);
		} else {
			var speaker = {
				"id": speakerID,
				"name": speakerName.trim(),
				"biography": "",
				"links": [],
				"sessions": []
			};
			allSpeakers[speakerID] = speaker;
			speakers.push(speaker);
		}
	});
	
	return speakers;
};

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
			halfnarp: function (callback) {
				json_requester.get({
					urls: {halfnarp: halfnarp_schedule_url}
				},
				function (result) {
					
					
					result.halfnarp.forEach(function (item, index) {				
						var session = sessionFromJSON(item, '');
						
						addEntry('session', session);
					});
					
					
					callback(null, 'halfnarp');
				});
			}
		},
		function (err, results) {
			if (!err) {
				
				alsoAdd('track', allTracks);
				alsoAdd('format', allFormats);
				alsoAdd('level', allLevels);
				alsoAdd('language', allLanguages);
				alsoAdd('day', allDays);				
				alsoAdd('speaker', allSpeakers);				
				alsoAdd('map', allMaps);
				alsoAdd('poi', allPOIs);						
				
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
