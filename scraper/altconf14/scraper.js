var eventId = 'alt';

var fs = require('fs');
var path = require('path');

var allDays = {
  "2014-06-02": {
    "id": "alt-day-1",
    "event": "alt",
    "type": "day",
    "label_en": "2nd June",
   "date": "2014-06-03"
    // "date": "2014-06-02"
  },
  "2014-06-03": {
    "id": "alt-day-2",
    "event": "alt",
    "type": "day",
    "label_en": "3rd June",
   "date": "2014-06-04"
    // "date": "2014-06-03"
  },
  "2014-06-04": {
    "id": "alt-day-3",
    "event": "alt",
    "type": "day",
    "label_en": "4th June",
  "date": "2014-06-05"
    // "date": "2014-06-04"
  },
  "2014-06-05": {
    "id": "alt-day-4",
    "event": "alt",
    "type": "day",
    "label_en": "5th June",
 "date": "2014-06-06"
    // "date": "2014-06-05"
  },
  "2014-06-06": {
    "id": "alt-day-5",
    "event": "alt",
    "type": "day",
    "label_en": "6th June",
   "date": "2014-06-07"
    // "date": "2014-06-06"

  }
};

var allRooms = {
  "alt-location-lab-1": {
    "id": "alt-location-lab-1",
    "label_en": "Jillian's A",
    "is_stage": false,
    "floor": 0,
    "order_index": 1,
    "event": "alt",
    "type": "location"
  },
  "alt-location-lab-2": {
    "id": "alt-location-lab-2",
    "label_en": "Jillian's B",
    "is_stage": false,
    "floor": 0,
    "order_index": 2,
    "event": "alt",
    "type": "location"
  },
  "alt-location-mainstage": {
    "id": "alt-location-mainstage",
    "label_en": "Creativity Museum",
    "is_stage": true,
    "floor": 0,
    "order_index": 0,
    "event": "alt",
    "type": "location",
  }
};

var allLanguages = {
	'en': { id:'en', label_en:'English' },
};

var allFormats = {
	'Diskussion': { id:'discussion', label_en:'Discussion' },
	'Vortrag':    { id:'talk',       label_en:'Talk'       },
	'Workshop':   { id:'workshop',   label_en:'Workshop'   },
	'Aktion':     { id:'action',     label_en:'Action'     }
}

var allLevels = {
	'Beginner':         { id:'beginner',     label_en:'Beginner'     },
	'Fortgeschrittene': { id:'intermediate', label_en:'Intermediate' },
	'Experten':         { id:'advanced',     label_en:'Advanced'     }
};

var allTracks = {
  'development': { "color": [207,94,28,1],
                   "id": "development",
                   "label_en": "Development" },
  'general': { "color": [160,160,160,1],
               "id": "general",
               "label_en": "General" },
  'streaming': { "color": [43,81,160,1],
                 "id": "general",
                 "label_en": "Streaming" }
};

var trackMap = {
  'general': [ 'alt-session-1',
               'alt-lab-17',
               'alt-session-3',
               'alt-session-16',
               'alt-session-29',
               'alt-session-42',
               'alt-session-53' ],
  'streaming': [ 'alt-lab-18',
                 'alt-session-2' ]
};

exports.scrape = function (callback) {
	require('../lib/json_requester').get(
		{
			urls: {
				sessions: 'https://raw.githubusercontent.com/robelkin/altconf-data/master/sessions.json',
				speakers: 'https://raw.githubusercontent.com/robelkin/altconf-data/master/speakers.json'
			}
		},
		function (result) {
			var data = [];

			var sessionList  = result.sessions;

			sessionList.forEach(function (session) {
				var day = parseDay(session.begin);

				session.day = day;
				session.level = allLevels['Fortgeschrittene'];
				session.lang = allLanguages["en"];
				if (session.location.id == "alt-location-mainstage") {
					session.format = allFormats["Vortrag"];
				} else {
					session.format = allFormats["Workshop"];
				}
				session.enclosures = [];
				if (session.links == undefined) {
			 	   session.links = [];
			  }

        var track = allTracks['development'];
        if (trackMap['general'].indexOf(session.id) >= 0) {
          track = allTracks['general'];
        } else if (trackMap['streaming'].indexOf(session.id) >= 0) {
          track = allTracks['streaming'];
        }

        session.track = { 'id': track.id,
                          'label_en': track.label_en };

				if (session.speakers == undefined) {
					session.speakers = [];
				}
				addEntry('session', session);
			});

			var speakerList  = result.speakers;
			speakerList.forEach(function(speaker) {


				var speakerDict = {
				  "id": speaker.id,
				  "event": eventId,
				  "type": "speaker",
				  "name": speaker.name,
				  "photo": speaker.photo == undefined ?  "" : speaker.photo,
				  "url": speaker.url,
				  "organization": speaker.organization == undefined ? "" : speaker.organization,
				  "position": speaker.position == undefined ? "" : speaker.position,
				  "biography": speaker.biography,
				  "sessions": speaker.sessions,
          "links": speaker.links == undefined ? [] : speaker.links
				};

				addEntry('speaker', speakerDict);
			});

			alsoAdd('location', allRooms);
			alsoAdd('track', allTracks);
			alsoAdd('format', allFormats);
			alsoAdd('level', allLevels);
			alsoAdd('language', allLanguages);
			alsoAdd('day', allDays);
			// console.log(allDays);

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

      console.log("Updated dataset with " + data.length + " entries");
			callback(data);
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