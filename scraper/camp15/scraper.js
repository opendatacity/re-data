/* get node modules */
var fs = require('fs');
var path = require('path');
var eventId = "camp15";

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

var additional_schedule_url = "http://data.conference.bits.io/data/camp15/voc/workshops.schedule.json";
var sendezentrum_schedule_url = "https://frab.camp.berlin.ccc.de/en/ber15/public/schedule.json";
var sendezentrum_speaker_url = "https://frab.camp.berlin.ccc.de/en/ber15/public/speakers.json";
var schedule_url = "http://events.ccc.de/camp/2015/Fahrplan/schedule.json";
var speakers_url = "http://events.ccc.de/camp/2015/Fahrplan/speakers.json";


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

var sortOrderOfLocations = [
	"camp15-project-2501",
	"camp15-simulacron-3",
	"camp15-a",
	"camp15-b",
	"camp15-stage",
	"camp15-workshop-tent",
	"camp15-dome",	
	"camp15-ber-stage",
	"camp15-ber-workshop-tent",
	"camp15-ber-dome",		
	"camp15-hackcenter-1",	
	"camp15-hackcenter-2",
	"camp15-hackcenter-3",
	"camp15-workshop-1",	
	"camp15-workshop-2",
	"camp15-noisy-square",
	"camp15-milliways",	
	"camp15-v01d",
	"camp15-amateur-radio",
	"camp15-foodhackingbase",
	"camp15-spacevillage",	
	"camp15-"
];

var poi2locationMapping = {
	"camp15-http-campmap-mazdermind-de-api-villages-id-1787": "camp15-milliways",
	"camp15-http-campmap-mazdermind-de-api-villages-id-1832": "camp15-spacevillage",
	"camp15-http-campmap-mazdermind-de-api-villages-id-1783": "camp15-foodhackingbase",
	"camp15-http-campmap-mazdermind-de-api-villages-id-1779": "camp15-amateur-radio"
	// "camp15-hackcenter-1"
};

var additionalPOIs = [
	{
		"label_de": "Project 2501",
		"label_en": "Project 2501",	
		"id": mkID("poi-project-2501"),
		"category": "session-location",
        "location": {
            "id": "camp15-project-2501", 
            "label_de": "Project 2501", 
            "label_en": "Project 2501"
        },		
		"hidden": false,
		"geo_position": {
			"lat": 53.030516375738,
			"long": 13.306140096802
		},
		"positions": [],
		"links": [],
		"priority": 100,
		"type": "poi"
	},
	{
		"label_de": "Simulacron-3",
		"label_en": "Simulacron-3",	
		"id": mkID("poi-simulacron-3"),
        "location": {
            "id": "camp15-simulacron-3", 
            "label_de": "Simulacron-3", 
            "label_en": "Simulacron-3"
        },				
		"hidden": false,
		"geo_position": {
			"lat": 53.032598292561,
			"long": 13.307631479837
		},
		"positions": [],
		"links": [],
		"priority": 100,
		"type": "poi",
		"category": "other"
	},
	{
		"label_de": "BER-Stage",
		"label_en": "BER-Stage",	
		"id": mkID("ber-stage"),
        "location": {
            "id": "camp15-stage", 
            "label_de": "Stage", 
            "label_en": "Stage"
        },				
		"hidden": false,
		"geo_position": {
			"lat": 53.03143,
			"long": 13.30917
		},
		"positions": [],
		"links": [],
		"priority": 100,
		"type": "poi",
		"category": "other"
	},
	{
		"label_de": "Sendezentrum Hack-Zelt",
		"label_en": "Sendezentrum Hacking-Tent",	
		"id": mkID("sendezentrum-hacking-tent"),
		"hidden": false,
		"geo_position": {
			"lat": 53.03163,
			"long": 13.30828
		},
		"positions": [],
		"links": [],
		"priority": 100,
		"type": "poi",
		"category": "other"
	},
	{
		"label_de": "Hacker Kino",
		"label_en": "Hacker Kino",	
		"id": mkID("hacker-kino"),
		"hidden": false,
		"geo_position": {
			"lat": 53.030833,
			"long": 13.308333
		},
		"positions": [],
		"links": [],
		"priority": 100,
		"type": "poi",
		"category": "entertainment"
	} 	   	    	
];

// Livestream test
var streamURLs = {
	// "camp15-saal-1": "http://hls.stream.c3voc.de/hls/s1_native_hd.m3u8",
};

// green [111.0, 139.0, 49.0, 1.0] 
// grey  [109.0, 109.0, 109.0, 1.0] 
// orange [221.0, 155.0, 64.0, 1.0]
// blue [98.0, 113.0, 152.0, 1.0]
// brown [147.0, 97.0, 63.0, 1.0]

var colors = {};
colors[eventId + "-hardware-making"] = [221.0, 155.0, 64.0, 1.0]; // orange
colors[eventId + "-security-safety"] = [98.0, 113.0, 152.0, 1.0]; // blue 
colors[eventId + "-ethics-society-politics"] = [111.0, 139.0, 49.0, 1.0]; // green
colors[eventId + "-art-beauty"] = [109.0, 109.0, 109.0, 1.0]; // grey
colors[eventId + "-science"] = [111.0, 139.0, 49.0, 1.0]; // green
colors[eventId + "-entertainment"] = [98.0, 113.0, 152.0, 1.0]; // blue
colors[eventId + "-failosophy"] = [147.0, 97.0, 63.0, 1.0]; // brown
colors[eventId + "-ccc"] = [109.0, 109.0, 109.0, 1.0]; // grey
colors[eventId + "-self-organized-sessions"] = [147.0, 97.0, 63.0, 1.0]; // brown
colors[eventId + "-other"] = [109.0, 109.0, 109.0, 1.0]; // grey

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

var allMaps = {};



var allPOIs = {};


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
	case 13:
		dateLabelDe = "Tag 1";
		dateLabelEn = "Day 1";		
		break;
	case 14:
		dateLabelDe = "Tag 2";
		dateLabelEn = "Day 2";		
		break;
	case 15:
		dateLabelDe = "Tag 3";
		dateLabelEn = "Day 3";		
		break;
	case 16:
		dateLabelDe = "Tag 4";
		dateLabelEn = "Day 4";		
		break;						
	case 17:
		dateLabelDe = "Tag 5";
		dateLabelEn = "Day 5";		
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
		"id": mkID(speakerJSON.full_public_name),
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

function parseRoom(roomName, index, namePrefix) {
	
	var roomName = roomName;
	if (namePrefix != null) {
		roomName = namePrefix + roomName;
	}
	
    return {
      "id": mkID(roomName),
      "label_en": roomName,
      "label_de": roomName,		
      "is_stage": roomName.toString().match(/Stage/i) ? true : false,
      "floor": 0,
      "order_index": index,
      "event": eventId,
      "type": "location"
    };
};

function generateIcalData(allSessions) {
	var ical = new icalendar.iCalendar();

	allSessions.forEach(function (session) {
		var event = new icalendar.VEvent(session.id);
		event["TZID"] = "Europe/Berlin";
		var summary = session.title;
		if (session.subtitle) {
			summary = summary + " – " + session.subtitle
		}
		event.setSummary(summary);

		var description = "";
		if (session.abstract && session.description) {
			description = session.abstract + "\n\n" + session.description;
		} else if (session.abstract) {
			description = session.abstract;
		} else if (session.description) {
			description = session.description;
		}
		event.setDescription(description);

		event.setLocation(session.location.label_en);
		event.setDate(session.begin, session.end);

		ical.addComponent(event);
	});

	// console.log(ical.toString());
	var filepath = __dirname + "/../../web/data/camp15/sessions.ics";
	filepath = path.normalize(filepath);
	console.log("PATH>>> ", path);
	fs.writeFile(filepath, ical.toString(), function (err) {
	});
};

function parseDate(dateString) {
	var date = new Date(dateString);
	var newMillis = date.getTime() + sessionStartDateOffsetMilliSecs;
	date.setTime(newMillis);
	if (date.getUTCMonth() != 7) {
		console.warn("WRONG DATE MONTH: ", date, " from date string ", dateString);
		date.setUTCMonth(7);

	}
	return date;
};

function parseEnd(dateString, durationString) {
	var date = new Date(dateString);
	var time = date.getTime() / 1000;
	var match = durationString.toString().match(/(\d?\d):(\d\d)/);
	var hours = new Number(match[1]);
	var minutes = new Number(match[2]);
	var seconds = time + (minutes * 60.0) + (hours * 60.0 * 60.0);
	date = new Date(seconds * 1000); 
	var newMillis = date.getTime() + sessionStartDateOffsetMilliSecs;
	date.setTime(newMillis);
	if (date.getUTCMonth() != 7) {
		console.warn("WRONG DATE MONTH: ", date, " from date string ", dateString);
		date.setUTCMonth(7);
	}	
	
	return date;	
}

function parseTrackFromEvent(eventXML) {
	var trackName = eventXML.track;
	if (trackName == null) trackName = "Other";
	// console.log(trackName);
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

function parseEvent(event, day, room, urlBase, locationNamePrefix) {
	var links = [];
	
	event.links.forEach(function (link) {
		var url = null;
		var title = null;
		if (typeof(link) === "string") {
			url = link;
			title = link;
		} else if (typeof(link) === "object" && link["title"] && link["url"]) {
			title = link["title"];
			url = link["url"];
		}
		if (url.indexOf("//") == 0) {
			url = "http:" + url;
		}
		
		links.push({
			"title": title,
			"url": url,
			"type": "session-link"
		});			
		
	});

	var day = normalizeXMLDayDateKey(day["date"]);
		
	var eventTypeId = event.type.toString();
	// console.log("event type " + eventTypeId);
	if (eventTypeId == 'lecture') {
		eventTypeId = 'talk';
	} else if (eventTypeId == 'other') {
		eventTypeId = 'talk';
	} else if (eventTypeId == 'meeting') {
		eventTypeId = 'workshop';		
	}

	console.log("-- -- -- -- -- --");
	var begin = parseDate(event.date);
	console.log(event.title);
	console.log(event.date);
	console.log(begin);	
	console.log("-- -- -- -- -- --");
		
	var otherDay = begin.getUTCFullYear() + "-" + (begin.getUTCMonth() + 1) + "-" + begin.getUTCDate();
	// console.log("--- " + event.title.toString() + " ---");
	// console.log("day " + day);
	// console.log("begin " + otherDay );


	var day = allDays[otherDay];
	// console.log("day ", day);
	// console.log(allDays);
	// console.log("------------");

	if (!day) {
		console.log("No valid day for " + event.title.toString() + " " + otherDay);
		return null;
	}

	var track = event.track;
	if (track == null) track = "Other";
	
	var locationNameDe = allRooms[room.id]["label_de"];
	var locationNameEn = allRooms[room.id]["label_en"];
	if (locationNamePrefix != null) {
		locationNameDe = locationNamePrefix + locationNameDe;
		locationNameEn = locationNamePrefix + locationNameEn;		
	}		
	
	var session = {
		"id": mkID("session-" + event["guid"]),
		"title": event.title.toString(),
		"url": urlBase + event.id + ".html",
		"abstract": sanitizeHtml(event.abstract.toString(), {allowedTags: []}),
		"description": sanitizeHtml(event.description.toString(), {allowedTags: []}),
		"begin": begin,
		"end": parseEnd(event.date, event.duration),
		"track": allTracks[mkID(track)],
		"day": day,
		"location": {
			"id": allRooms[room.id]["id"],
			"label_de": allRooms[room.id]["label_de"],
			"label_en": allRooms[room.id]["label_en"]
		},
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
    // if (session['id'] == 'camp15-session-3064add4-ab1e-4d05-84b8-d753b9733097') {
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


function handleResult(events, speakers, eventRecordings, urlBase, locationNamePrefix) {
	if (locationNamePrefix == null) {
		locationNamePrefix = "";
	}
	speakers.forEach(function (speaker) {
		var speakerJSON = parseSpeaker(speaker);
		addEntry('speaker', speakerJSON);
		
		if (!allSpeakers[speakerJSON.id]) {
			allSpeakers[speakerJSON.id] = speakerJSON;
		}
	});
	
	events.schedule.conference.days.forEach(function(day) {
		// Day
		// ---
   		var dayJSON = parseDay(day);
		allDays[normalizeXMLDayDateKey(dayJSON.date)] = dayJSON;
	});
	events.schedule.conference.days.forEach(function(day) {
   	 	var roomIndex = 0;
		var rooms = day.rooms;
		Object.keys(rooms).forEach(function (roomLabel) {
			// Room
			// ----
			var roomJSON = parseRoom(roomLabel, roomIndex, locationNamePrefix);
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
				var eventJSON = parseEvent(event, day, roomJSON, urlBase, locationNamePrefix);
				
				// Event Speakers
				// --------------
				event.persons.forEach(function (person) {
   						var personID = mkID(person["full_public_name"]);
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
					if (eventJSON && eventJSON.url == element.link) {
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
   				 
				if (eventJSON != null) {
					addEntry('session', eventJSON);
				}
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
			lectures: function (callback) {
				json_requester.get({
					urls: {conference: "http://api.media.ccc.de/public/conferences/66"}
				},
				function (result) {
					if (result.conference.events) {
						var videoAPICallURLs = {
							speakers: speakers_url,
							schedule: schedule_url,
							additional_schedule: additional_schedule_url,
							sendezentrum_schedule: sendezentrum_schedule_url,
							sendezentrum_speakers: sendezentrum_speaker_url
						};
										
						result.conference.events.forEach(function (event) {
							videoAPICallURLs[event.guid] = event.url;
						});

						json_requester.get({urls: videoAPICallURLs},
							function (result) {
											   
								// Main Events
								var speakers = result.speakers.schedule_speakers.speakers;
								var schedule = result.schedule;
								
								// Wiki Events								
								var additional_schedule = result.additional_schedule;
								
								// Sendezentrum Events																
								var sendezentrum_schedule = result.sendezentrum_schedule;
								var sendezentrum_speakers = result.sendezentrum_speakers.schedule_speakers.speakers;								
								
								var allSpeakers = {};
								
								
								delete result.schedule;
								delete result.speakers;
								delete result.additional_schedule;
								delete result.sendezentrum_schedule;
								delete result.sendezentrum_speakers;																

								var eventRecordingJSONs = toArray(result);

								eventRecordingJSONs = eventRecordingJSONs.map(function (er) {
																			console.log("er: ", er);
									var recording = er.recordings.filter(function (rec, index, all) {
										return rec.mime_type == "video/mp4" || rec.mime_type == "vnd.voc/h264-hd";
									});
											
											
									
									return {
										"link": er.link,
										"thumb": er.thumb_url,
										"recording": recording.length > 0 ? recording[0] : null
									};
								});
								

								handleResult(additional_schedule, speakers, eventRecordingJSONs, "https://events.ccc.de/camp/2015/Fahrplan/events/", "");
								handleResult(sendezentrum_schedule, sendezentrum_speakers, eventRecordingJSONs, "https://frab.camp.berlin.ccc.de/en/ber15/public/events/", "");
								handleResult(schedule, speakers, eventRecordingJSONs, "https://events.ccc.de/camp/2015/Fahrplan/events/", "");
								
								generateIcalData(data.filter(function (i) {
									return i.type == "session";
								}));
								
								callback(null, 'lectures');				
							});						
					}
				});
			},
			village_pois: function (callback) {
				json_requester.get({
					urls: {conference: "http://campmap.mazdermind.de/api/villages/"}
				},
				function (result) {
					var pois = [];
					
					result.conference.forEach(function (item) {						
						if (item.names.length < 1) return;
						
						var names = item.names.join(", ")
						var poi = {
							"id": mkID(item.maplink), // maplink contains a unique ID
							"type": "poi",							
							"label_en": names,
							"label_de": names,							
							"category": "other",
							"positions": [],
							"geo_position": {
								"lat": item.y,
								"long": item.x
							},
							"links": [], // fill later
							"hidden": false,
							"beacons": [],
							"priority": 100
						};

						if (item['websites']) {
							item.websites.forEach(function (link, index) {
								if (link.length == 0) return;
								poi.links.push({
									"url": link,
									"title": names[index],
									"type": "location-link"
								});
							});
						}
						
						if (poi2locationMapping[poi.id]) {
							console.log("Matched ", poi.id, " to ", poi2locationMapping[poi.id]);
							poi["location"] = {"id": poi2locationMapping[poi.id],
											   "label_en": names,
											   "label_de": names};
							if (poi.category == "other") {
								poi["category"] = "session-location";
							}
						} else {
							console.log("Not matched ", poi.io);
						}
						console.log("POI");						
						
						pois.push(poi);
					});
					
					additionalPOIs.forEach(function (poi) {
						pois.push(poi);
					});
					
					alsoAdd('poi', pois);
					
					callback(null, 'village_pois')
				});
			},
			// sendezentrum: function (callback) {
					 // 			    ical.fromURL('https://www.google.com/calendar/ical/ck0ov9f0t6omf205r47uq6tnh4%40group.calendar.google.com/public/basic.ics', {}, function(err, data) {
					 // 			         for (var k in data){
					 // 			           if (data.hasOwnProperty(k)) {
					 //
					 // 						   var ev = data[k];
					 // 						   var start = ev.start;
					 //
					 // 						   var matches = ev.summary.match(/(.+ )\(([^)]+)\)/i);
					 // 						   if (!matches) {
					 // 							   continue;
					 //
					 // 						   }
					 // 						   var title = matches[1];
					 // 						   var people = matches[2];
					 // 						   if (people) {
					 // 						   	  people = people.split(/\band|\bund|\b,/i).map(function (item) {
					 // 								  return item.trim();
					 // 						   	  });
					 // 							  people = people.filter(function (item) {
					 // 								  var match = item.match(/jemand|gast/i);
					 // 								  if (match) {
					 // 									  return false;
					 // 								  } else {
					 // 									  return true;
					 // 								  }
					 // 							  });
					 // 						   }
					 //
					 // 						   var speakers = people.map(function (personname) {
					 // 							   var speaker = {
					 // 								   "event": eventId,
					 // 								   "id": mkID("sendezentrum-" + personname),
					 // 								   "name": personname,
					 // 								   "type": "speaker",
					 // 								   "photo": "",
					 // 								   "biography": "",
					 // 								   "links": []
					 // 							   };
					 // 							   // Hardcode some people
					 // 							   if (personname == "Tim Pritlove") {
					 // 								   speaker = allSpeakers["31c3-3809"];
					 // 							   } else if (personname == "Linus Neumann") {
					 // 								   speaker = allSpeakers["31c3-3995"];
					 // 							   }
					 // 							   return speaker;
					 // 						   });
					 // 						   allSpeakers[speakers.id] = speakers;
					 // 						   var theLocation = {
					 // 								   "event": eventId,
					 // 								   "floor": 1,
					 // 								   "id": "31c3-sendezentrum",
					 // 								   "is_stage": false,
					 // 								   "label_de": "Sendezentrum",
					 // 								   "label_en": "Broadcast Center",
					 // 								   "order_index": 10,
					 // 								   "type": "location"
					 // 						   };
					 //
					 // 						   allRooms[theLocation.id] = theLocation;
					 //
					 // 						   var event = {
					 //  							   "id": mkID(md5(ev.uid)),
					 // 							   "event": eventId,
					 // 							   "type": "session",
					 // 							   "title": title.trim(),
					 // 							   "abstract": "",
					 // 							   "description": "",
					 // 							   "begin": parseDate(start.toISOString()),
					 // 							   "end": parseDate(ev.end.toISOString()),
					 // 							   "lang": allLanguages["de"],
					 // 							   "format": title.match(/Workshop/i) ? allFormats["workshop"] : allFormats["talk"],
					 // 							   "level": allLevels["advanced"],
					 // 							   "enclosures": [],
					 // 							   "location": {},
					 // 							   "links": [],
					 // 							   "day": null,
					 // 							   "location": theLocation,
					 // 							   "track": title.match(/Workshop/i) ? allTracks["31c3-art-culture"] : allTracks["31c3-entertainment"],
					 // 							   "url": ev.url,
					 // 							   "speakers": speakers.map(function (speaker) {
					 // 								   return {
					 // 									   "id": speaker.id,
					 // 									   "name": speaker.name
					 // 								   };
					 // 							   })
					 //  						   };
					 //
					 //
					 //
					 // 						   var day = normalizeXMLDayDateKey(event.begin);
					 // 						   event["day"] = allDays[day];
					 //
					 // 						   allRooms[event.location.id] = event.location
					 //
					 // 						   addEntry('session', event);
					 // 			           }
					 // 			         }
					 // callback(null, 'sendezentrum');
					 // 			       });
					 //
			// }
		},
		function (err, results) {
			if (!err) {
				alsoAdd('day', allDays);
				// console.log(allRooms);
				
				var moreIDs = sortOrderOfLocations.length;
				toArray(allRooms).sort().forEach(function (item) {
					if (sortOrderOfLocations.indexOf(item["id"]) >= 0) {
						item["order_index"] = sortOrderOfLocations.indexOf(item["id"]);
					} else {
						item["order_index"] = moreIDs;
						moreIDs++;	
					}
				});			
				
				alsoAdd('location', allRooms);
				alsoAdd('map', allMaps);
				alsoAdd('track', allTracks);
				alsoAdd('format', allFormats);
				alsoAdd('language', allLanguages);				
				
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
