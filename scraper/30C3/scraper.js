/* get node modules */
var fs = require('fs');
var path = require('path');

/* get npm modules */
var scrapyard = require('scrapyard');
var moment = require('moment');
var ent = require('ent');

var schedule_url = "http://events.ccc.de/congress/2013/Fahrplan/schedule.xml";
var speakers_json = "http://events.ccc.de/congress/2013/Fahrplan/speakers.json";

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

exports.scrape = function (callback) {
	console.log("scrape");
	
	var scraper = new scrapyard({
		cache: path.resolve(__dirname, '..', '.cache'), 
		debug: true,
		timeout: 300000,
		retries: 5,
		connections: 10
	});
	
	var data   = [];

	scraper.scrape({ url: schedule_url, 
				     type: 'xml', 
				     encoding: 'utf8' }, 
					 function(err, xml) {
						 
						 	require('../lib/json_requester').get({
								urls: {
									speakers: speakers_json
								}
							},
							function (result) {
					
									 
						 // In case of erro bail out
						 if (err) {
							 console.log("error" + err);
							 callback(null);
							 return;
							 
						 } else {
						 
							 var eventId = (xml.schedule.conference[0].acronym + "").toLowerCase();
							 var allDays = {};
							 var allRooms = {};
							 var allSpeakers = {};
							 var allTracks = {};
							 var allSpeakers = {};
							 
					 		
							result.speakers.schedule_speakers.speakers.forEach(function (speaker) {
								var speakerJSON = parseSpeaker(speaker);
								addEntry('speaker', speakerJSON);
								
								allSpeakers[speakerJSON.id] = speakerJSON;
							});
							 
							 
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
						 		return {
						 		    "id": mkID(dayXML.$.index),
						 		    "event": eventId,
						 		    "type": "day",
						 		    "label_en": date,
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
								
								return {
									"id": mkID("session-" + eventXML.$.id),
									"title": eventXML.subtitle != "" ? eventXML.title + " – " + eventXML.subtitle : eventXML.title.toString(),
									"url": urlBase + eventXML.slug.toString(),
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
									"links": links
								};
							};
							 
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
							 
							 callback(data);
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