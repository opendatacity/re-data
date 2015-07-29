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

var baseURL = "http://events.ccc.de/camp/2015/Fahrplan/"
var schedule_url = "http://data.c3voc.de/camp15/everything.schedule.json";
var speakers_url = baseURL + "speakers.json";
var eventId = "camp15";

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
	"camp15-a",
	"camp15-b",
	"camp15-hackcenter-1",	
	"camp15-hackcenter-2",
	"camp15-hackcenter-3",
	"camp15-workshop-1",	
	"camp15-workshop-2",
	"camp15-noisy-square",
	"camp15-spacevillage",
	"camp15-milliways",	
	"camp15-v01d",
	"camp15-amateur-radio",
	"camp15-foodhackingbase",
	"camp15-"
];

// Livestream test
var streamURLs = {
	// "camp15-saal-1": "http://hls.stream.c3voc.de/hls/s1_native_hd.m3u8",
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
	var urlBase = "http://events.ccc.de/2015/";
	
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
			lectures: function (callback) {
				json_requester.get({
					urls: {conference: "http://api.media.ccc.de/public/conferences/66"}
				},
				function (result) {
					if (result.conference.events) {
						var videoAPICallURLs = {
							speakers: speakers_url,
							schedule: schedule_url,
						};
										
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
								
											   
								handleResult(schedule, speakers, eventRecordingJSONs);
						
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
						
						var primaryName = item.names[0];
						var poi = {
							"id": mkID(item.maplink), // maplink contains a unique ID
							"type": "poi",							
							"label_en": primaryName,
							"label_de": primaryName,							
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
							item.websites.forEach(function (link) {
								if (link.length == 0) return;
								poi.links.push({
									"url": link,
									"title": primaryName,
									"type": "location-link"
								});
							});
						}
						
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
