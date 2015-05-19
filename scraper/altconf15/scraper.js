var eventId = 'altconf15';

var fs = require('fs');
var path = require('path');

var allDays = {
  "2015-06-08": {
    "id": "alt-day-1",
    "event": eventId,
    "type": "day",
    "label_en": "8th June",
   "date": "2015-06-08"
    // "date": "2015-06-02"
  },
  "2015-06-09": {
    "id": "alt-day-2",
    "event": eventId,
    "type": "day",
    "label_en": "9th June",
   "date": "2015-06-09"
    // "date": "2015-06-03"
  },
  "2015-06-10": {
    "id": "alt-day-3",
    "event": eventId,
    "type": "day",
    "label_en": "10th June",
  "date": "2015-06-10"
    // "date": "2015-06-04"
  },
  "2015-06-11": {
    "id": "alt-day-4",
    "event": eventId,
    "type": "day",
    "label_en": "11th June",
 "date": "2015-06-11"
    // "date": "2015-06-05"
  },
  "2015-06-12": {
    "id": "alt-day-5",
    "event": eventId,
    "type": "day",
    "label_en": "12th June",
   "date": "2015-06-12"
    // "date": "2015-06-06"

  }
};

var allRooms = {
  // "alt-location-lab-1": {
  //   "id": "alt-location-lab-1",
  //   "label_en": "Jillian's A",
  //   "label_de": "Jillian's A",
  //   "is_stage": false,
  //   "floor": 0,
  //   "order_index": 1,
  //   "event": "alt",
  //   "type": "location"
  // },
  // "alt-location-lab-2": {
  //   "id": "alt-location-lab-2",
  //   "label_en": "Jillian's B",
  //   "label_de": "Jillian's B",
  //   "is_stage": false,
  //   "floor": 0,
  //   "order_index": 2,
  //   "event": "alt",
  //   "type": "location"
  // },
  // "alt-location-mainstage": {
  //   "id": "alt-location-mainstage",
  //   "label_en": "Creativity Museum",
  //   "label_de": "Creativity Museum",
  //   "is_stage": true,
  //   "floor": 0,
  //   "order_index": 0,
  //   "event": "alt",
  //   "type": "location",
  // }
};

var allLanguages = {
	'en': { id:'en', label_en:'English' },
};

var allFormats = {
	'discussion': { id:'discussion', label_en:'Discussion' },
	'talk':    { id:'talk',       label_en:'Talk'       },
	'workshop':   { id:'workshop',   label_en:'Workshop'   },
	'action':     { id:'action',     label_en:'Action'     }
}

var allLevels = {
	'beginner':         { id:'beginner',     label_en:'Beginner'     },
	'intermediate':     { id:'intermediate', label_en:'Intermediate' },
	'advanced':         { id:'advanced',     label_en:'Advanced'     }
};

var allTracks = {
  // 'development': { "color": [207,94,28,1],
  //                  "id": "development",
  //                  "label_en": "Development" },
  // 'general': { "color": [160,160,160,1],
  //              "id": "general",
  //              "label_en": "General" },
  // 'streaming': { "color": [43,81,160,1],
  //                "id": "streaming",
  //                "label_en": "Streaming" },
  // 'design': { "color": [43,81,160,1],
  //                "id": "design",
  //                "label_en": "Design" },
  // 'community': { "color": [43,81,160,1],
  //                "id": "community",
  // 				  "label_en": "Community" }	
};

var allTrackColors = {
	'default': [43,81,160,1]
};

var trackMap = {
  'development':   [ 
  				],
  'streaming': [ 
  	 			],
  'design': [ 
  			],
  'community': [ 
				]			
};

function parseSpeaker(dict) {
	var speaker = dict;
	
	if (speaker['name'].match(/TBA/)) {
		return null;
	}
	
	return speaker;
}

function parseSession(dict) {
	var session = dict;
	
	if (session['title'] == "") {
		return null;
	};
	
	if (!session['format']) {
		session['format'] = allFormats['talk'];
	}
	if (!session['level']) {
		session['level'] = allLevels['intermediate'];
	}	
	if (!session['lang']) {
		session['lang'] = allLanguages['en'];
	}
	if (session['begin'] != null && session['end'] != null) {

		var beginDate = new Date(session['begin']);
		var endDate = new Date(session['end']);	
		var month = beginDate.getMonth() + 1;	
		var day = beginDate.getDate();	
		var key = beginDate.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
		session['day'] = allDays[key];
		session['duration'] = (endDate.getTime() - beginDate.getTime()) / 1000.0;
		
		if (session['location']) {
			allRooms[session['location']['id']] = session['location'];
		}
	}
	
	if (session['track']) {
		if (session['track']['id'] != '') {
			allTracks[session['track']['id']] = session['track'];
		}
	}
	
	if (!session['day']) {
		session['begin'] = null;
		session['end'] = null;		
	} 
	
	var speakers = session['speakers'];
	if (speakers) {
		speakers = speakers.filter(function (speaker) {
			return !(speaker['name'].match(/TBA/));
		});
		session['speakers'] = speakers;
	}
	
	
	return session;
};

function mkID(string) {
	return eventId + "-" + string.toString().replace(/[^A-Za-z0-9]+/g, '-').toLowerCase();
}

exports.scrape = function (callback) {
	require('../lib/json_requester').get(
		{
			urls: {
				sessions: 'http://altconf.com/schedule/sessions.json',
				speakers: 'http://altconf.com/schedule/speakers.json'
			}
		},
		function (result) {
			var data = [];
			var sessionList  = result.sessions.data;
			var speakerList  = result.speakers.data;			

			// Speakers
			// -----------
			speakerList.forEach(function (speakerDict) {
				var speaker = parseSpeaker(speakerDict);
				
				if (speaker != null) {
					addEntry('speaker', speaker);
				}
			});
			
			// Sessions
			// -----------
			sessionList.forEach(function (sessionDict) {
				var session = parseSession(sessionDict);
				
				if (session != null) {
					addEntry('session', session);
				}				
			});

			// Additional Data
			// -----------
			var index = 0;
			for (var key in allRooms) {
				var value = allRooms[key];
				value['order_index'] = index;
				index++;				
			}

			for (var key in allTracks) {
				var value = allTracks[key];
				var color = allTrackColors[key];
				if (!color) {
					color = allTrackColors['default'];
				}
				value['color'] = color;
			}
			
			alsoAdd('track', allTracks);
			alsoAdd('format', allFormats);
			alsoAdd('level', allLevels);
			alsoAdd('language', allLanguages);
			alsoAdd('day', allDays);
			alsoAdd('location', allRooms);
			
			// Done
			console.log("Updated dataset with " + data.length + " entries");
			callback(data);
			// -----------------------------
			
			function addEntry(type, obj) {
				obj.event = eventId;
				obj.type = type;
				data.push(obj);
			}

			function alsoAdd(type, list) {
				Object.keys(list).forEach(function (key) {
					var obj = clone(list[key]);
					obj.event = eventId;
					obj.type = type;
					data.push(obj);
				})
			}
			
		}
	);
}



function toArray(obj) {
	return Object.keys(obj).map(function (key) { return obj[key] })
}

function parseDay(dateString) {
	if (dateString == '') return false;

	var date = new Date(dateString);
	var day = date.getUTCDate();
	var month = date.getUTCMonth() + 1;
	var year = date.getUTCFullYear();

	var key = year + '-' + (month < 10 ? '0'+month : month) + '-' + (day < 10 ? '0'+day : day);
	var dayDict = allDays[key];

	if (dayDict == undefined) return false;
	return dayDict;
}

function parseDate(text) {
	if (text == '') return false;

	var date = new Date(dateString);
	var day = date.day;
	var month = date.month + 1;
	var year = date.year;
	return new Date(year, month, day, 0, 0, 0, 0);
}

function parseDateTime(date, time) {
	if ((date == '') && (time == '')) return false;

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

	return new Date(dateString);

	console.log('Unknown date "'+date+'" and time "'+time+'"');
	return false
}

function parseSpeakerLinks(linkUrls, linkLabels) {

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


function clone(obj) {
	var newObj = {};
	Object.keys(obj).forEach(function (key) {
		newObj[key] = obj[key];
	})
	return newObj;
}