var eventId = 'alt';

var fs = require('fs');
var path = require('path');


var allLanguages = {
	'Englisch': { id:'en', label_de:'Englisch', label_en:'English' },
};

var allFormats = {
	'Diskussion': { id:'discussion', label_de:'Diskussion', label_en:'Discussion' },
	'Vortrag':    { id:'talk',       label_de:'Vortrag',    label_en:'Talk'       },
	'Workshop':   { id:'workshop',   label_de:'Workshop',   label_en:'Workshop'   },
	'Aktion':     { id:'action',     label_de:'Aktion',     label_en:'Action'     }
}

var allLevels = {
	'Beginner':         { id:'beginner',     label_de:'Anfänger',         label_en:'Beginner'     },
	'Fortgeschrittene': { id:'intermediate', label_de:'Fortgeschrittene', label_en:'Intermediate' },
	'Experten':         { id:'advanced',     label_de:'Experten',         label_en:'Advanced'     }
};


exports.scrape = function (callback) {
	require('../lib/json_requester').get(
		{
			urls: {
				sessions: 'http://altconftest.apiary-mock.com/api/alt/sessions',
				speakers: 'http://altconftest.apiary-mock.com/api/alt/speakers',
				rooms:    'http://altconftest.apiary-mock.com/api/alt/locations',
				days:    'http://altconftest.apiary-mock.com/api/alt/days',
				tracks:    'http://altconftest.apiary-mock.com/api/alt/tracks'
			}
		},
		function (result) {
			var data = [];

			
			var sessionList  = result.sessions.data;
			sessionList.forEach(function (session) {
				session.level = allLevels['Fortgeschrittene'];
				
				addEntry('session', session);
				
			});
			
			var speakerList  = result.speakers.data;
			var locationList = result.rooms.data;
			var trackList = result.tracks.data;
			var daysList = result.days.data;

			alsoAdd('speaker', speakerList);
			alsoAdd('location', locationList);
			alsoAdd('track', trackList);
			alsoAdd('format', allFormats);
			alsoAdd('level', allLevels);
			alsoAdd('language', allLanguages);
			alsoAdd('day', daysList);

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

			console.log(data);

			callback(data);
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

function parseDate(text) {
	if (text == '') return false;

	var dateMatcher = /(\d\d)\.(\d\d)\.(\d\d\d\d)/;
	dateMatcher.exec(text);
	var day = RegExp.$1;
	var month = RegExp.$2;
	var year = RegExp.$3;
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

function parseLocation(locationMap, roomid) {
	if (roomid == '') return false;

	var id = "rp14-location-"+roomid;
	var location = locationMap[id];

	if (location == undefined) {
		console.log("unknown location " + roomid);
		return false;
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
	return false;
}

function parseFormat(text) {
	var format = allFormats[text];
	if (format) return format;
	console.error('Unknown Format "'+text+'"');
	return false;
}

function parseLevel(text) {
	var level = allLevels[text];
	if (level) return level;
	console.error('Unknown Level "'+text+'"');
	return false;
}

function parseLanguage(text) {
	var language = allLanguages[text];
	if (language) return language;
	console.error('Unknown Language "'+text+'"');
	return false;
}

function parseSpeakers(speakerMap, speakeruids) {
	var speakers = [];
	for (var i = speakeruids.length - 1; i >= 0; i--){
		var speakerId = speakeruids[i];
		var speaker = speakerMap['rp14-speaker-'+speakerId];
		if (speaker != undefined) {
			speakers.push({'id': speaker.id,
											'name': speaker.name});
		} else {
				console.log("unknown speaker " + speakerId);
		}
	}

	return speakers;
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