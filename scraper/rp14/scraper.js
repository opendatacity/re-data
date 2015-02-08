var eventId = 'rp14';

var fs = require('fs');
var path = require('path');

var allTracks = {
	'Business & Innovation':  { id:'business-innovation', label_de:'Business & Innovation',  label_en:'Business & Innovation', color:[194.0, 56.0, 24.0, 1.0] },
	'Science & Technology':   { id:'science-technology',  label_de:'Wissenschaft & Technik', label_en:'Science & Technology' , color:[168.0, 146.0, 24.0, 1.0] },
	'Politics & Society':     { id:'politics-society',    label_de:'Politik & Gesellschaft', label_en:'Politics & Society'   , color:[111.0, 79.0, 132.0, 1.0] },
	'Research & Education':   { id:'research-education',  label_de:'Forschung & Bildung',    label_en:'Research & Education' , color:[0.0, 0.0, 0.0, 1.0] },
	'Culture':                { id:'culture',             label_de:'Kultur',                 label_en:'Culture'              , color:[193.0, 117.0, 28.0, 1.0] },
	'Media':                  { id:'media',               label_de:'Medien',                 label_en:'Media'                , color:[78.0, 144.0, 178.0, 1.0] },
	're:publica':             { id:'republica',           label_de:'re:publica',             label_en:'re:publica'           , color:[102.0, 156.0, 44.0, 1.0] },
	're:campaign':            { id:'recampaign',          label_de:'re:campaign',            label_en:'re:campaign'          , color:[0.0, 0.0, 0.0, 1.0] },
	'Other':                  { id:'other',               label_de:'Other',                  label_en:'Other'                , color:[101.0, 156.0, 45.0, 1.0] }
}

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

var allLanguages = {
	'Englisch': { id:'en', label_de:'Englisch', label_en:'English' },
	'Deutsch':  { id:'de', label_de:'Deutsch',  label_en:'German'  }
};

var allDays = {
	'06.05.2014': { 'id':'rp14-day-1', 'label_de':'6. Mai', 'label_en':'6. May', 'date':'2014-05-06' },
	'07.05.2014': { 'id':'rp14-day-2', 'label_de':'7. Mai', 'label_en':'7. May', 'date':'2014-05-07' },
	'08.05.2014': { 'id':'rp14-day-3', 'label_de':'8. Mai', 'label_en':'8. May', 'date':'2014-05-08' },
};

// we now supply a order preference with the location
var locationOrderPreference = [
		'rp14-location-2594', // stage 1
		'rp14-location-2595', // stage 2
		'rp14-location-2596', // stage 3
		'rp14-location-2597', // stage 4
		'rp14-location-2598', // stage 5
		'rp14-location-2599', // stage 6
		'rp14-location-2600', // stage A
		'rp14-location-2601', // stage B
		'rp14-location-2602', // stage C
		'rp14-location-2603', // stage D
		'rp14-location-2604', // stage E
		'rp14-location-2693', // stage J
		'rp14-location-2692', // stage T
		'rp14-location-2708', // store
		'rp14-location-2710', // GIG lounge
		'rp14-location-2709', // GIG makerspace
		'rp14-location-2711', // MIKZ
		'rp14-location-2712', // new thinking
		'rp14-location-2713', // republica
		'rp14-location-2855', // re/connect
		'rp14-location-2871', // backyard
];

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
		"area": {"width": 1000.0, 
		         "height": 516.0},
		"tiles": {
                    "base_url": "http://data.conference.bits.io/maps/rp14/floor0",
                    "large_image_url": "http://data.conference.bits.io/maps/rp14/floor0/mini.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
                    "size": {"width": 7941,
                             "height": 4096}
                },
	    "pois": []
	}
};

var eventURLPrefix = "https://14.re-publica.de";

// the youtube playlist to which all videos are added
var youtubePlaylistId = "PLAR_6-tD7IZV--8ydJQRCZNEWOp9vf6PY";


exports.scrape = function (callback) {
	require('../lib/json_requester').get(
		{
			urls: {
				sessions: 'http://re-publica.de/event/1/sessions/json',
				speakers: 'http://re-publica.de/event/1/speakers/json',
				rooms:    'http://re-publica.de/event/1/rooms.json',
				youtubePlaylist1: 'https://gdata.youtube.com/feeds/api/playlists/' + youtubePlaylistId + '?v=2&alt=json&max-results=50',
				youtubePlaylist2: 'https://gdata.youtube.com/feeds/api/playlists/' + youtubePlaylistId + '?v=2&alt=json&max-results=50&start-index=51',
				youtubePlaylist3: 'https://gdata.youtube.com/feeds/api/playlists/' + youtubePlaylistId + '?v=2&alt=json&max-results=50&start-index=101',
			  youtubePlaylist4: 'https://gdata.youtube.com/feeds/api/playlists/' + youtubePlaylistId + '?v=2&alt=json&max-results=50&start-index=151'
				// note that Google is very open and will disable the YouTube v2 API (with unauthenticated use)
				// at 15 Apr 2015, but until then this will work
			}
		},
		function (result) {
			var data = [];

			var sessionList  = result.sessions.items;
			var speakerList  = result.speakers.items;
			var locationList = toArray(result.rooms.rooms      );
			var ytPlaylist   = result.youtubePlaylist1.feed.entry;
		  ytPlaylist = ytPlaylist.concat(result.youtubePlaylist2.feed.entry);
		  ytPlaylist = ytPlaylist.concat(result.youtubePlaylist3.feed.entry);
		  ytPlaylist = ytPlaylist.concat(result.youtubePlaylist4.feed.entry);

			var ytVideoMap  = {};
			var locationMap = {};
			var speakerMap  = {};

			ytPlaylist.forEach(function (entry) {
				var permalink = permalinkFromYouTubeEntry(entry);
				ytVideoMap[permalink] = linkFromYouTubeEntry(entry);
			});

			speakerList.forEach(function (speaker) {
				// skip potential invalid speakers, those happen.
				if (speaker.uid == "" || speaker.label.trim() == "") return;

				var entry = {
					'id': 'rp14-speaker-'+speaker.uid,
					'name': speaker.label,
					'photo': speaker.image,
					'url': eventURLPrefix + '/' + speaker.uri,
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


			locationList.forEach(function (location) {
				location = location.room;
				var id = 'rp14-location-'+location.nid;
				var orderPreference = locationOrderPreference.indexOf(id);
				// put unknown locations at the end
				if (orderPreference < 0) {
					orderPreference = locationOrderPreference.length + 1;
				}
				var entry = {
					'id': id,
					'label_de': location.title,
					'label_en': location.title,
					'order_index': orderPreference,
					'type': 'location',
					'event': 'rp14',
					'is_stage': location.title.match(/stage /i) ? true : false
				}
				locationMap[entry.id] = entry;
				addEntry('location', entry);
			});

			sessionList.forEach(function (session) {
				if (session.nid == "") return; // skip invalid sessions

				var begin = parseDateTime(session.datetime, session.start);
				var end = parseDateTime(session.datetime, session.end);
				var duration = (end - begin) / 1000;
				var permalink = eventURLPrefix + session.uri;
				var links = [];

				var ytLink = ytVideoMap[permalink];
				if (ytLink) {
					links.push(ytLink);
				}


				var entry = {
					'id': 'rp14-session-' + session.nid,
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

				addEntry('session', entry);
			});

			alsoAdd('track', allTracks);
			alsoAdd('format', allFormats);
			alsoAdd('level', allLevels);
			alsoAdd('language', allLanguages);
			alsoAdd('day', allDays);
			alsoAdd('map', allMaps);

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
				});
			}

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