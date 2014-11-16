/* get node modules */
var fs = require('fs');
var path = require('path');

/* get npm modules */
var scrapyard = require('scrapyard');
var moment = require('moment');
var ent = require('ent');
var json_requester = require('../lib/json_requester');

var baseURL = "http://events.ccc.de/congress/2013/Fahrplan/"
var schedule_url = baseURL + "schedule.xml";
var speakers_json = baseURL + "speakers.json";
var eventId = "30c3";

var allFormats = {
	'Diskussion': { id:'discussion', label_en:'Discussion' },
	'lecture':    { id:'lecture',    label_en:'Talk'       },
	'workshop':   { id:'workshop',   label_en:'Workshop'   },
	'Aktion':     { id:'action',     label_en:'Action'     },
	'other':      { id:'other',      label_en:'Other'      },
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
	'level0': {
		'event': eventId,
		'id': eventId + "-" + "level0",
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
                    "base_url": "http://bitfever.de/~toto/test/31c3/0floor",
                    "large_image_url": "http://bitfever.de/~toto/test/31c3/0floor/large.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
                    "size": {"width": 6506,
                             "height": 5007}
                },
	    "pois": []
	},
	'level1': {
		'event': eventId,
		'id': eventId + "-" + "level1",
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
                    "base_url": "http://bitfever.de/~toto/test/31c3/1floor",
                    "large_image_url": "http://bitfever.de/~toto/test/31c3/1floor/large.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
                    "size": {"width": 6506,
                             "height": 5007}
                },
	    "pois": []
	},
	'level2': {
		'event': eventId,
		'id': eventId + "-" + "level2",
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
                    "base_url": "http://bitfever.de/~toto/test/31c3/2floor",
                    "large_image_url": "http://bitfever.de/~toto/test/31c3/2floor/large.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
                    "size": {"width": 6506,
                             "height": 5007}
                },
	    "pois": []
	},
	'level3': {
		'event': eventId,
		'id': eventId + "-" + "level3",
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
                    "base_url": "http://bitfever.de/~toto/test/31c3/3floor",
                    "large_image_url": "http://bitfever.de/~toto/test/31c3/3floor/large.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
                    "size": {"width": 6506,
                             "height": 5007}
                },
	    "pois": []
	},
	'level4': {
		'event': eventId,
		'id': eventId + "-" + "level4",
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
                    "base_url": "http://bitfever.de/~toto/test/31c3/4floor",
                    "large_image_url": "http://bitfever.de/~toto/test/31c3/4floor/large.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
                    "size": {"width": 6506,
                             "height": 5007}
                },
	    "pois": []
	}				
};

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
		"location": "30c3-saal-1",
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
		"location": "30c3-saal-2",
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
		"location": "30c3-saal-d",
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
		"location": "30c3-saal-e",
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
		"location": "30c3-saal-f",
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
		"location": "30c3-saal-d",
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
		"location": "30c3-saal-g",
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
					   "x": 2267.0, "y": 2231.0}],
		"category": "session-location",		
		"location": "30c3-saal-3",
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
					   "x": 4799.0, "y": 2751.0}],	
		"category": "session-location",		
		"location": "30c3-saal-6",
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
		// "location": "30c3-saal-13",
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
					   "x": 4216.0, "y": 3557.0}],	
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
		"location": "30c3-villa-straylight",
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
		"location": "30c3-wordlounge",
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
		// "location": "30c3-wordlounge",
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
		// "location": "30c3-wordlounge",
		"label_de": "Essen",
		"label_en": "Food",	
		"hidden": false,
		"priority": 500,
		"beacons": []
	}	
};

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
var date = dayXML.$.date;

var parseDate = new Date(date);
var dateLabelDe = date;
var dateLabelEn = date;
// console.log("date: " + parseDate + "day: " +  parseDate.getDate());

	var monthDay = parseDate.getDate();
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
	
	return {
	    "id": mkID(dayXML.$.index),
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
	var imageHost = "http://cccv.pentabarf.org";
	if (speakerJSON.image) {
		result['photo'] = imageHost + speakerJSON.image;
	}
	return result;
};

function parseRoom(roomXML, index) {
	var roomName = roomXML.$.name;
    return {
      "id": mkID(roomName),
      "label_en": roomName.toString(),
      "is_stage": roomName.toString().match(/Saal /i) ? true : false,
      "floor": 0,
      "order_index": index,
      "event": eventId,
      "type": "location"
    };
};

function parseDate(dateString) {
	return new Date(dateString);
}

function parseEnd(dateString, durationString) {
	var date = new Date(dateString);
	var time = date.getTime() / 1000;
	var match = durationString.toString().match(/(\d\d):(\d\d)/);
	var hours = new Number(match[1]);
	var minutes = new Number(match[2]);
	var seconds = time + (minutes * 60.0) + (hours * 60.0 * 60.0);
	return new Date(seconds * 1000); 
}

function parseTrackFromEvent(eventXML) {
	var trackName = eventXML.track;
	return {
		"id": mkID(trackName),
		"color": [207,94,28,1],
		"label_en": trackName.toString()
	};
};

function parseEvent(eventXML, dayXML, roomXML) {
	var urlBase = "http://events.ccc.de/2013/";
	
	var links = [];
	
	eventXML.links.forEach(function (link) {
		if (link.link[0]) {
			links.push({
				"title": link.link[0]._.toString(),
				"url": link.link[0].$.href.toString(),
				"type": "other"
			});
		}
	});
	
	var session = {
		"id": mkID("session-" + eventXML.$.id),
		"title": eventXML.title.toString(),

		"url": baseURL + "events/" +  eventXML.$.id + ".html",
		"abstract": eventXML.abstract.toString(),
		"description": eventXML.description.toString(),
		"begin": parseDate(eventXML.date),
		"end": parseEnd(eventXML.date, eventXML.duration),
		"track": allTracks[mkID(eventXML.track)],
		"day": allDays[dayXML.$.date],
		"location": allRooms[mkID(roomXML.$.name)],
		"format": allFormats[eventXML.type.toString()],
		"level": allLevels['advanced'],
		"lang": allLanguages[eventXML.language.toString() ? eventXML.language.toString() : 'en'],
		"speakers": [], // fill me later
		"enclosures": [], // fill me later
		"links": links
	};
	
	if (eventXML.subtitle.toString() != "") {
		session["subtitle"] = eventXML.subtitle.toString();
	}
	
	return session;
};

function handleResult(xml, speakers, eventRecordings) {
	// preprocess recording map for easy association
	var recordingMap = null;
	if (eventRecordings) {
		recordingMap = {};
		eventRecordings.forEach(function (recJSON) {
			recordingMap[recJSON.link] = recJSON;
		});
	}
	
	// Parse speakers JSON
	speakers.forEach(function (speaker) {
		var speakerJSON = parseSpeaker(speaker);
		addEntry('speaker', speakerJSON);
		
		allSpeakers[speakerJSON.id] = speakerJSON;
	});
 
    xml.schedule.day.forEach(function(day) {
    	 var dayJSON = parseDay(day);
    	 allDays[dayJSON.date] = dayJSON;
    	 
    	 var roomIndex = 0;
    	 day.room.forEach(function (room) {
    		 var roomJSON = parseRoom(room, roomIndex);
    		 allRooms[roomJSON.id] = roomJSON;
    		 roomIndex++;
    		 
    		 if (room.event) {
    		 room.event.forEach(function (event) {
    			 var trackJSON = parseTrackFromEvent(event);
    			 allTracks[trackJSON.id] = trackJSON;
    			 
    			 // console.log("track " + JSON.stringify(trackJSON));
    			 var eventJSON = parseEvent(event, day, room);

				 if (recordingMap && recordingMap[eventJSON.url]) {
					 console.log("Recording for " + eventJSON.title);
					 
					eventJSON.enclosures.push({
						"mimetype": "video/mp4",
						"type": "recording",
						"url": recordingMap[eventJSON.url].recording.recording_url,
						"thumbnail": recordingMap[eventJSON.url].thumb
					});
				 }
    			 // console.log("event " + JSON.stringify(eventJSON));
    			 // if (!eventJSON.lang)
    				 // console.log(event);
    				 
    			 event.persons.forEach(function (person) {
    				 if (person.person) {
    					 person.person.forEach(function (person) {
    						var personID = mkID(person.$.id);
    						var speaker = allSpeakers[personID];
    						
    						speaker.sessions.push({
    							"id": eventJSON.id,
    							"title": eventJSON.title
    						});
    						
    						// speaker.events.push()
    						var person = {"id": personID, 
    									  "name": speaker.name};
    						eventJSON.speakers.push(person);								 	
    					 });
    				 }
    			 });
    				 
    			 addEntry('session', eventJSON);
    		 });
    		 }
    	 });
    
 });
 
 alsoAdd('day', allDays);
 alsoAdd('location', allRooms);
 alsoAdd('map', allMaps);
 alsoAdd('poi', allPOIs);  
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
	

	scraper.scrape({ url: schedule_url, 
		type: 'xml', 
		encoding: 'utf8' }, 
		function(err, xml) {
			json_requester.get({
				urls: {
					speakers: speakers_json,
					conferences_videos: 'http://api.media.ccc.de/public/conferences'
				}
			},
			function (result) {	 
				// In case of erro bail out
				if (!err) {
					// set global eventID
					eventId = (xml.schedule.conference[0].acronym + "").toLowerCase();
					// 				    handleResult(xml,
					// 				 	 		     result.speakers.schedule_speakers.speakers,
					// 			 []);
					// callback(data);
					// return;
								
								
					result.conferences_videos.conferences.forEach(function (conference) {
						if (conference.acronym == eventId) {
							json_requester.get({urls: {eventsForVideoJSON: conference.url}},
								function (videoEventsResult) {
									var videoAPICallURLs = {};
									videoEventsResult.eventsForVideoJSON.events.forEach(function (event) {
										videoAPICallURLs[event.guid] = event.url;
									})
									
									json_requester.get({urls: videoAPICallURLs},
													   function (eventResults) {
														   console.log("result!");
														   var eventRecordingJSONs = toArray(eventResults);
														   eventRecordingJSONs = eventRecordingJSONs.map(function (er) {

															   
															   var rercording = er.recordings.filter(function (rec, index, all) {
																   return rec.mime_type == "video/mp4";
															   });
															   
															   return {"link": er.link,
														   			   "thumb": er.thumb_url,
																   	   "recording": rercording.length > 0 ? rercording[0] : null};
														   });

					   									   handleResult(xml, 
					   									 			    result.speakers.schedule_speakers.speakers, 
																		eventRecordingJSONs);									
														   callback(data);
													   });
								});

						} 
					});
					

						        	 
				} else {
					console.log("error" + err);
					callback(null);
				}
			});
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