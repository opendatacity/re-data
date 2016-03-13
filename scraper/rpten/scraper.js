var eventId = 'rpten';

var fs = require('fs');
var path = require('path');
var parseCSV = require('csv-parse');

// for debugging we can just pretend rpTEN was today
var originalStartDate = new Date(2015, 4, 5, 9, 0, 0, 0);
var fakeDate = new Date();
var sessionStartDateOffsetMilliSecs = fakeDate.getTime() - originalStartDate.getTime();
var removeTimesAndLocations = true;

// Livestream test
var streamURLs = {
	"rp14-location-2594": "http://delive.artestras.cshls.lldns.net/artestras/contrib/delive.m3u8",
	"rp14-location-2595": "https://devimages.apple.com.edgekey.net/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8"
};

var allTracks = {
	'Business & Innovation':  { id:'business-innovation', label_de:'Business & Innovation',  		label_en:'Business & Innovation', color:[196.0, 55.0, 8.0, 1.0] },    //
	'City Of The Future':     { id:'city-of-the-future',  label_de:'City Of The Future',     		label_en:'City Of The Future'   , color:[102.0, 102.0, 102.0, 1.0] }, //
	'Culture':                { id:'culture',             label_de:'Kultur',                 		label_en:'Culture'              , color:[195.0, 118.0, 2.0, 1.0] },   //
	'Fashiontech':            { id:'fashiontech',         label_de:'Fashiontech',            	  	label_en:'Fashiontech'          , color:[193.0, 117.0, 28.0, 1.0] },
	'GIG':            		  { id:'gig',         		  label_de:'Global Innovation Gathering', 	label_en:'Global Innovation Gathering' , color:[193.0, 117.0, 28.0, 1.0] },	
	'Media':                  { id:'media',               label_de:'Medien',                 		label_en:'Media'                , color:[11.0, 87.0, 127.0, 1.0] },  //
	'Media Convention':       { id:'media-Convention',    label_de:'Media Convention',       		label_en:'Media Convention'     , color:[0.0, 0.0, 0.0, 1.0] },	     //
	'Politics & Society':     { id:'politics-society',    label_de:'Politik & Gesellschaft', 		label_en:'Politics & Society'   , color:[112.0, 77.0, 133.0, 1.0] }, //
	're:cord Musicday':       { id:'re-cord-musicday',    label_de:'re:cord Musicday',       		label_en:'re:cord Musicday'     , color:[51.0, 204.0, 102.0, 1.0] }, //
	're:health':              { id:'re-health',           label_de:'re:health',              		label_en:'re:health'            , color:[102.0, 156.0, 44.0, 1.0] },	
	're:publica':             { id:'re-publica',          label_de:'re:publica',              		label_en:'re:publica'            , color:[99.0, 157.0, 36.0, 1.0] },  //
	're:think Mobility':      { id:'re-think-mobility',   label_de:'re:think Mobility',      		label_en:'re:think Mobility'    , color:[102.0, 156.0, 44.0, 1.0] },		
	'Science & Technology':   { id:'science-technology',  label_de:'Wissenschaft & Technik', 		label_en:'Science & Technology' , color:[164.0, 148.0, 1.0, 1.0] },  //
	'Research & Education':   { id:'research-education',  label_de:'Forschung & Bildung',    		label_en:'Research & Education' , color:[102.0, 102.0, 204.0, 1.0] },//
	'Other':                  { id:'other',               label_de:'Other',                  		label_en:'Other'                , color:[101.0, 156.0, 45.0, 1.0] }
};

var allFormats = {
	'Diskussion': { id:'discussion', label_de:'Diskussion', label_en:'Discussion' },
	'Vortrag':    { id:'talk',       label_de:'Vortrag',    label_en:'Talk'       },
	'Workshop':   { id:'workshop',   label_de:'Workshop',   label_en:'Workshop'   },
	'Aktion':     { id:'action',     label_de:'Aktion',     label_en:'Action'     }
};

var allLevels = {
	'Beginner':         { id:'beginner',     label_de:'Anfänger',         label_en:'Beginner'     },
	'Fortgeschrittene': { id:'intermediate', label_de:'Fortgeschrittene', label_en:'Intermediate' },
	'Experten':         { id:'advanced',     label_de:'Experten',         label_en:'Advanced'     }
};

var allLanguages = {
	'Englisch':         { id:'en',    label_de:'Englisch',         label_en:'English'         },
	'Deutsch':          { id:'de',    label_de:'Deutsch',          label_en:'German'          }
};

var allDays = {
	'02.05.2016': { 'id': eventId +'-day-1', 'label_de':'2. Mai', 
											 'label_en':'May 2', 
											 'date':'2016-05-02' },
	'03.05.2016': { 'id': eventId +'-day-2', 'label_de':'3. Mai', 
											 'label_en':'May 3', 
											 'date':'2016-05-03' },
	'04.05.2016': { 'id': eventId + '-day-3', 'label_de':'4. Mai', 
											  'label_en':'May 4', 
											  'date':'2016-05-04' },
};

var allMaps = {
	'map-level0': {
		'event': eventId,
		'id': eventId + "-map-" + "level0",
		'type': "map",
		'label_de': "Station Berlin",
		'label_en': "Station Berlin",
		'floor_label_de': "Station Berlin",
		'floor_label_en': "Station Berlin",		
		"is_outdoor": true,
		"is_indoor": true,		
		"floor": 0,
		"order_index": 0,
		"area": {"width": 7872.0, 
		         "height": 2814.0},
		"tiles": {
                    "base_url": "http://data.conference.bits.io/maps/rp15/station-berlin",
                    "large_image_url": "http://data.conference.bits.io/maps/rp15/station-berlin/mini.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
                    "size": {"width": 7872,
                             "height": 2814}
                },
	    "pois": []
	}
};


var allPOIs = {
	
};


var csvData = fs.readFileSync(__dirname + "/pois.csv");

// we now supply a order preference with the location
var locationOrderPreference = [
		eventId + '-location-5591', // stage 1
		eventId + '-location-5929', // stage 2
		eventId + '-location-5930', // stage 3
		eventId + '-location-5931', // stage 4
		eventId + '-location-5932', // stage 5
		eventId + '-location-5933', // stage 6
		eventId + '-location-5934', // stage 7
		eventId + '-location-5935', // stage 8
		eventId + '-location-5936', // stage 9
		eventId + '-location-5937', // stage 10
		eventId + '-location-5938', // stage 11
		eventId + '-location-5940', // stage J
		eventId + '-location-5939', // stage T
		eventId + '-location-6144', // Makerspace rp15     
		eventId + '-location-6145', // MIZ rp15
        eventId + '-location-6148', // re: rp15
		eventId + '-location-2708', // store
		eventId + '-location-2710', // GIG lounge
		eventId + '-location-2709', // GIG makerspace
		eventId + '-location-2711', // MIKZ
		eventId + '-location-2712', // new thinking
		eventId + '-location-2713', // republica
		eventId + '-location-2855', // re/connect
		eventId + '-location-2871', // backyard
		eventId + '-location-6147',  // newthinkging rp15
		eventId + "-location-6146", // fashiontec rp15
		eventId + '-location-6289' //  store rp15
	
];


exports.scrape = function (callback) {
	require('../lib/json_requester').get(
		{
			urls: {
				sessions: 'http://re-publica.de/event/3013/json/sessions', // rpTEN id: 6553
				speakers: 'http://re-publica.de/event/3013/json/speakers' // rpTEN id: 6553
			}
		},
		function (result) {
			var data = [];

			var sessionList  = result.sessions.items;
			var speakerList  = result.speakers.items;
			var ytPlaylist   = [];

			var ytVideoMap  = {};
			var locationMap = {};
			var speakerMap  = {};

			ytPlaylist.forEach(function (entry) {
				var permalink = permalinkFromYouTubeEntry(entry);
				ytVideoMap[permalink] = linkFromYouTubeEntry(entry);
			});

			speakerList.forEach(function (speaker) {
				var speakerName = speaker.label;
				// if (speaker.label == undefined && speaker.gn != undefined && speaker.fn != undefined) {
					speakerName = speaker.gn + " " + speaker.sn;
				// }
				
				// skip potential invalid speakers, those happen.
				if (speaker.uid == "" || (speakerName == null || speakerName.trim() == "")) return;

				var entry = {
					'id': eventId + '-speaker-'+speaker.uid,
					'name': speakerName,
					'photo': (speaker.image.src != undefined ? speaker.image.src : speaker.image),
					'url': speaker.uri,
					'biography': speaker.description_short,
					'organization': speaker.org,
					'organization_url': speaker.org_uri,
					'position': speaker.position,
					'sessions': [],
					'links': parseSpeakerLinks(speaker.link_uris, speaker.link_labels)
				}
				speakerMap[entry.id] = entry;
				addEntry('speaker', entry);
			});

			// first get rooms out of the sessions
			sessionList.forEach(function (session) {
				
				var locationName = session['room'];
				var locationId = session['room_id'];				

				if (locationName == null || locationId == null ||
					locationName == '' || locationId == '') {
					return;
				}
				
				var id = eventId + '-location-'+ locationId;
				// only uniq rooms 
				if (locationMap[id]) {
					return;
				}
				
				var orderPreference = locationOrderPreference.indexOf(id);
				// put unknown locations at the end
				if (orderPreference < 0) {
					orderPreference = locationOrderPreference.length + 1;
				}
				var entry = {
					'id': id,
					'label_de': locationName,
					'label_en': locationName,
					'order_index': orderPreference,
					'type': 'location',
					'event': eventId,
					'is_stage': locationName.match(/stage /i) ? true : false
				}
				locationMap[entry.id] = entry;

				addEntry('location', entry);
			});

			var fakeSessions = [
				// {
		//               "updated_date": "08.04.2015 - 10:56",
		//               "nid": "2666",
		//               "type": "session",
		//               "uri": "http://re-publica.de/session/welcome",
		//               "title": "Welcome!",
		//               "label": "Welcome!",
		//               "datetime": "05.05.2015 - 09:00 bis 10:00",
		//               "start": "09:00",
		//               "end": "10:00",
		//               "room_id": "5591",
		//               "room": "stage 1",
		//               "speaker_uids": [
		//                 "2460",
		//                 "2472",
		//                 "2419",
		//                 "2219",
		//                 "2520"
		//               ],
		//               "speaker_names": [
		//                 "Andreas Gebhard",
		//                 "Tanja Haeusler",
		//                 "Markus Beckedahl",
		//                 "Johnny Haeusler",
		//                 "Elmar Giglinger"
		//               ],
		//               "category_id": "31",
		//               "category": "re:publica",
		//               "format_id": "10",
		//               "format": "Vortrag",
		//               "level_id": "3",
		//               "level": "Beginner",
		//               "language_id": "5",
		//               "language": "Deutsch",
		//               "curator_ids": [],
		//               "curator_names": [],
		//               "description_short": "Opening ceremony for re:publica and MEDIA CONVENTION.",
		//               "description": "",
		//               "video": [
		//                 "http://www.youtube.com/watch?v=hfjNOk97qn8"
		//               ],
		//               "event_title": "re:publica 2015",
		//               "event_date": "",
		//               "event_description": "Finding Europe"
		//             }
		];

			Array.prototype.push.apply(sessionList, fakeSessions);


			sessionList.forEach(function (session) {
				if (session.nid == "") return; // skip invalid sessions

				var begin = parseDateTime(session.datetime, session.start);
				var end = parseDateTime(session.datetime, session.end);
				var duration = (end - begin) / 1000;
				if (duration < 0) return;
				
				var permalink = session.uri;
				var links = [];

				var ytLink = ytVideoMap[permalink];
				if (ytLink) {
					links.push(ytLink);
				}
				if (typeof(session["video"]) === typeof([])) {	
					
					session.video.forEach(function (videoURL) {
						
						if (videoURL.match(/^https?\:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9\-\_]+)/i)) {
							if (RegExp.$1) {
								// https://www.youtube.com/v/12BYSqVGCUk
								var result =  {
						 			"thumbnail": "https://img.youtube.com/vi/" + RegExp.$1 + "/hqdefault.jpg",
						 			"title": session.title,
						 			"url": "https://www.youtube.com/v/" + RegExp.$1,
						 			"service": "youtube",
						 			"type": "recording"
								};
								links.push(result);
							}
						 };
					});
				}

				console.log("session:", session.nid);

				var entry = {
					'id': eventId + '-session-' + session.nid,
					'title': session.title,
					'abstract': session.description_short,
					'description': session.description,
					'url': permalink,
					'begin': begin,
					'end': end,
					'duration': duration,
					'day': parseDay(session.datetime),
					'location': parseLocation(locationMap, session.room_id),
					'track': parseTrack(session.category),
					'format': parseFormat(session.format),
					'level': parseLevel(session.level),
					'lang': parseLanguage(session.language),
					'speakers': parseSpeakers(speakerMap, session.speaker_uids),
					'enclosures': [],
					'links': links
				}
				if (removeTimesAndLocations) {
					if (session.nid.toString()[2] != "2") {
						entry["begin"] = null;
						entry["end"] = null;					
						entry["location"] = null;
						entry["day"] = null;
					}
				}
				
				if (entry.location) {
					var liveStreamURL = streamURLs[entry.location.id];
					if (liveStreamURL) {
						entry.enclosures.push({
							"url": liveStreamURL,
							"mimetype": "application/x-mpegURL",
							"type": "livestream"
						});
					}
				}
				entry = entry;
				
				addEntry('session', entry);
			});
			
			alsoAdd('track', allTracks);
			alsoAdd('format', allFormats);
			alsoAdd('level', allLevels);
			alsoAdd('language', allLanguages);
			// if (!removeTimesAndLocations) {
				alsoAdd('day', allDays);				
			// }
			alsoAdd('map', allMaps);
			alsoAdd('poi', allPOIs);			
						

			function addEntry(type, obj) {
				obj["event"] = eventId;
				obj["type"] = type;
				data.push(obj);
			}

			function alsoAdd(type, list) {
				Object.keys(list).forEach(function (key) {
					var obj = clone(list[key]);
					obj["event"] = eventId;
					obj["type"] = type;
					data.push(obj);
				});
			}

			parsePOIsFromCSV(csvData, function (pois) {
				alsoAdd('poi', pois);  
			
				callback(data);
			});
		}
	);
}

function toArray(obj) {
	return Object.keys(obj).map(function (key) { return obj[key] })
}

function parseDay(dateString) {
	if (dateString == '') return false;

	var dateMatcher = /^(\d\d)\.(\d\d)\.(\d\d\d\d)/;
	dateMatcher.exec(dateString);
	var day = RegExp.$1;
	var month = RegExp.$2;
	var year = RegExp.$3;

	var dayDict = allDays[day+'.'+month+'.'+year];
	if (dayDict == undefined) return false;
	return dayDict
}

function permalinkFromYouTubeEntry(entry) {
	var mediaGroup = entry["media$group"];
	if (mediaGroup == undefined) return false;

	var mediaDesc = mediaGroup["media$description"];
	if (mediaDesc == undefined) return false;

	var desc = mediaDesc["$t"];
	if (desc == undefined) return false;


	var permalinkMatcher = /(https?:\/\/14\.re-publica\.de\/session\/[a-z-0-9\-]+)/;
	permalinkMatcher.exec(desc);

	var permalink = RegExp.$1;
	// ensure all permalinks lead to https
	if (permalink.match(/^http:/)) {
		permalink = permalink.replace('http:', 'https:');
	}
	return permalink;
}

function linkFromYouTubeEntry(entry) {
	var mediaGroup = entry["media$group"];
	if (mediaGroup == undefined) return false;

	if (mediaGroup["media$thumbnail"] == undefined ||
		  mediaGroup["media$thumbnail"].length < 3) return false;

	var thumbnailURL = mediaGroup["media$thumbnail"][2]["url"];

	if (mediaGroup["media$content"] == undefined ||
		  mediaGroup["media$content"].length < 1) return false;
	var url = mediaGroup["media$content"][0]["url"];

	// we use the https://www.youtube.com/v/12BYSqVGCUk format
	// as this can be embedded nicely on iOS.
	// Just strip all the params away.
	url = url.replace(/\?.*$/, '');

	var result =  {
 		"thumbnail": thumbnailURL,
 		"title": entry["title"]["$t"],
 		"url": url,
 		"service": "youtube",
 		"type": "recording"
 };

	console.log(result);

 return result;
}

function parseDate(text) {
	if (text == '') return false;

	var dateMatcher = /(\d\d)\.(\d\d)\.(\d\d\d\d)/;
	dateMatcher.exec(text);
	var day = RegExp.$1;
	var month = RegExp.$2;
	var year = RegExp.$3;
	var date = new Date(year, month, day, 0, 0, 0, 0);
	var newMillis = date.getTime() + sessionStartDateOffsetMilliSecs;
	date.setTime(newMillis);
	
	return date;
}

function parseDateTime(date, time) {
	if ((date == '') && (time == '')) return null;

	var dateMatcher = /^(\d+)\.(\d+)\.(\d\d\d\d) /;
	dateMatcher.exec(date);


	var day = RegExp.$1;
	var month = RegExp.$2;
	var year = RegExp.$3;

	var timeMatcher = /(\d+)\:(\d+)/
	timeMatcher.exec(time);
	var hour = RegExp.$1;
	var minute = RegExp.$2;

	// we parse the date stirng to ensure timezone compatibility if run on a computer
	// which is not in CEST as the conference.
	var dateString = year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + "00+02:00";

	var date = new Date(dateString);
	var newMillis = date.getTime() + sessionStartDateOffsetMilliSecs;
	date.setTime(newMillis);
	return date;

	console.error('Unknown date "'+date+'" and time "'+time+'"');
	return null;
}

function parseLocation(locationMap, roomid) {
	if (roomid == '') return null;

	var id = eventId + "-location-"+roomid;
	var location = locationMap[id];

	if (location == undefined) {
		console.error("unknown location " + roomid);
		return null;
	}

	return {
					'id': location.id,
					'label_en': location.label_en,
					'label_de': location.label_de
	};
}


function parseTrack(text) {
	var track = allTracks[text];
	if (track) return track;
	console.error('Unknown Track "'+text+'"');
	return allTracks["re:publica"];
}

function parseFormat(text) {
	var format = allFormats[text];
	if (format) return format;
	console.error('Unknown Format "'+text+'"');
	return allLevels["Vortrag"];
}

function parseLevel(text) {
	var level = allLevels[text];
	if (level) return level;
	console.error('Unknown Level "'+text+'"');
	return allLevels["Beginner"];
}

function parseLanguage(text) {
	var language = allLanguages[text];
	if (language) return language;
	console.error('Unknown Language "'+text+'"');
	return allLanguages["Deutsch"];
}

function parseSpeakers(speakerMap, speakeruids) {
	var speakers = [];
	
	if (speakeruids == null) return [];
	
	if (typeof(speakeruids) == typeof("")) {
		speakeruids = speakeruids.split(",").map(function (item) {
			return item.trim();
		});
	}
	
	speakeruids.forEach(function (speakerId) {
		var speaker = speakerMap[eventId + '-speaker-'+speakerId];
		if (speaker != undefined) {
			speakers.push({'id': speaker.id, 'name': speaker.name});
		} else {
			console.error("unknown speaker " + speakerId);
		}
	})

	return speakers;
}

function parseSpeakerLinks(linkUrls, linkLabels) {
	if (typeof(linkUrls) === typeof("")) {
		linkUrls = linkUrls.split(",").map(function (item) {
			return item.trim();
		});
	}
	if (typeof(linkLabels) === typeof("")) {
		linkLabels = linkLabels.split(",").map(function (item) {
			return item.trim();
		});
	}	
	// google+ URLs are so ugly, what parsing them is non trivial, so we ignore them for now
	var linkTypes = { 'github': /^https?\:\/\/github\.com\/(\w+)$/i,
					  'twitter': /^https?\:\/\/twitter\.com\/(\w+)$/i,
					  'facebook': /^https?\:\/\/facebook\.com\/(\w+)$/i,
					  'app.net': /^https?\:\/\/(alpha\.)?app.net\.com\/(\w+)$/i };

	var links = [];

	for (var i = 0; i < linkUrls.length; i++) {
		var linkURL = linkUrls[i];
		var label = linkLabels[i];
		var username = false;
		var service = 'web';

		for (var serviceID in linkTypes) {
			if (linkURL.match(linkTypes[serviceID])) {
				service = serviceID;
				username = RegExp.$1;
			}
		}

		var linkItem = { 'url': linkURL,
										 'title': label,
										 'service': service,
										 'type': 'speaker-link' };
		if (username) linkItem['username'] = username;

		links.push(linkItem);
	}

	return links;
}

function removeNulls(obj){
  var isArray = obj instanceof Array;
  for (var k in obj){
    if (obj[k]===null) isArray ? obj.splice(k,1) : delete obj[k];
    else if (typeof obj[k]=="object") removeNulls(obj[k]);
  }
}

function clone(obj) {
	var newObj = {};
	Object.keys(obj).forEach(function (key) {
		newObj[key] = obj[key];
	})
	return newObj;
}

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
					"beacons": [],
					"location": null,
				};
				
				if (row[7] && row[7].length > 0 && row[8] && row[9]) {
					poi["location"] = {
					            "id": row[7], 
					            "label_de": row[8], 
					            "label_en": row[9]
					};
				}
				
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