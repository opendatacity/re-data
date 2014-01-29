# API

## Authentication

*not specified yet*

## Events

An event is one chronologically delimited total of sessions. Like a yearly conference.

### GET `/events`

```` javascript
[{
	"id": "rp14",
	"label": "re:publica 14",
	"title": "into the wild",
	"date": ["2014-05-06","2014-05-08"],
	"locations": [{
		"label": "Station Berlin",
		"coords": [52.49814,13.374538] // lat, lon
	}],
	"url": "http://14.re-publica.de/"
},{
	"id": "rp13",
	"label": "re:publica 13",
	"title": "IN/SIDE/OUT",
	"date": ["2013-05-06","2013-05-08"],
	"locations": [{
		"label": "Station Berlin",
		"coords": [52.49814,13.374538] // lat, lon
	}],
	"url": "http://13.re-publica.de/"
}]
````

### GET `/events/<event-id>`

```` javascript
{
	"id": "rp14",
	"label": "re:publica 14",
	"title": "into the wild",
	"date": ["2014-05-06","2014-05-08"],
	"locations": [{
		"label": "Station Berlin",
		"coords": [52.49814,13.374538] // lat, lon
	}],
	"url": "http://14.re-publica.de/"
}
````

## Sessions

### GET `/<event-id>/sessions`

```` javascript
[{
	"id": "1",
	"status": "upcoming", // upcoming | current | over | cancelled
	"title": "Eröffnung",
	"photo": "http://assets.re-publica.de/bla/bla.jpeg",
	"abstract": "...",
	"description": "...",
	"url": "http://14.re-publica.de/session/1"
	"begin": "2014-05-06T10:00:00.0Z",
	"end": "2014-05-06T11:00:00.0Z",
	"duration": 45,
	"day": {
		"id": "1",
		"label": "6. Mai"
	},
	"area": {
		"id": "1",
		"label": "Stage 1"
	},
	"track": {
		"id": 1,
		"label": "re:publica"
	},
	"format": {
		"id": "talk",
		"label": "Vortrag"
	},
	"level": {
		"id": "beginner",
		"label": "Anfängerinnen"
	},
	"lang": {
		"id": "de",
		"label": "Deutsch"
	},
	"speakers": [{
		"id": "1",
		"name": "Andreas Gebhard",
		"photo": "http://assets.re-publica.de/bla/fasel.jpeg"
	},{
		"id": "2",
		"name": "Markus Beckedahl",
		"photo": "http://assets.re-publica.de/bla/blub.jpeg"
	}],
	"devices": 232,
	"users": 23,
	"favorited": 100,
	"revision": 12, // incremental revision counter
	"last-modified": "2013-12-04T15:50:00.0Z"	
}]
````

### GET `/<event-id>/sessions/$session_id`

```` javascript
{
	"id": "1",
	"status": "upcoming", // upcoming | current | over | cancelled
	"title": "Eröffnung",
	"photo": "http://assets.re-publica.de/bla/bla.jpeg",
	"abstract": "...",
	"description": "...",
	"url": "http://14.re-publica.de/session/1"
	"begin": "2014-05-06T10:00:00.0Z",
	"end": "2014-05-06T11:00:00.0Z",
	"duration": 45,
	"day": {
		"id": "1",
		"label": "6. Mai"
	},
	"area": {
		"id": "1",
		"label": "Stage 1"
	},
	"track": {
		"id": 1,
		"label": "re:publica"
	},
	"format": {
		"id": "talk",
		"label": "Vortrag"
	},
	"level": {
		"id": "beginner",
		"label": "Anfängerinnen"
	},
	"lang": {
		"id": "de",
		"label": "Deutsch"
	},
	"speakers": [{
		"id": "1",
		"name": "Andreas Gebhard",
		"photo": "http://assets.re-publica.de/bla/fasel.jpeg"
	},{
		"id": "2",
		"name": "Markus Beckedahl",
		"photo": "http://assets.re-publica.de/bla/blub.jpeg"
	}],
	"favorited": 100,
	"devices": 232,
	"users": 23,
	"faved-by": [{
		"id": "1",
		"name": "yetzt",
		"friend": true,
		"photo": "http://assets.re-publica.de/bla/fnord.png"
	}],
	"revision": 12, // incremental revision counter
	"last-modified": "2013-12-04T15:50:00.0Z"	
}
````

## Speakers

Speakers are people performing sessions.

### GET `/<event-id>/speakers`

```` javascript
[{
	"id": "144",
	"attendee": $attendee_id,
	"name": "Sebastian Vollnals",
	"nickname": "yetzt",
	"photo": "http://assets.re-publica.de/pictures/picture-144.jpg",
	"organization": "OpenDataCity",
	"tagline": "whatever",
	"description": "poly & queer hacker, feminist sidekick. wandering about in berlin and wearing pink hair.",
	"links": [{
		"service": "twitter",
		"label": "yetzt",
		"url": "https://twitter.com/yetzt"
	},{
		"service": "blog",
		"label": "blog",
		"url": "http://yetzt.wordpress.com/"
	},{
		"service": "github",
		"label": "yetzt",
		"url": "http://github.com/yetzt"
	},{
		"service": "adn",
		"label": "yetzt",
		"url": "https://app.net/yetzt"
	}],
	"sessions": [$session_id, $session_id, $session_id]
}]
````

### GET `/<event-id>/speakers/<id>`

*single object, as above*

## Tracks

Tracks are topic-based collections of sessions

### GET `/<event-id>/tracks`

```` javascript
[{
	"id": "business-innovation",
	"label": "Business & innovation",
	"sessions": [$session_id,$session_id,$session_id]
},{
	"id": "science-technology",
	"label": "Science & Technology",
	"sessions": [$session_id,$session_id,$session_id]	
}]
````

### GET `/tracks/<track-id>`

*single object, as above*

## Areas

Areas are specified spaces on the compound and may be stages. Areas are used for wifi-cell-based location services.

**The `friends` value requires an authenticated api call** 

### GET `/<event-id>/areas`

```` javascript
[{
	"id": "stage1", // area_id
	"label": "Stage 1",
	"stage": true, // is this a stage
	"current": $session_id, // id of current session or null
	"upcoming": [$session_id, $session_id,$session_id],
	"level": 0, // floor in the building, 0 is ground
	"shape": "$geojson",
	"devices": 100, // number of connected devices in this area
	"users": 80, // number of users in this area
	"friends": [$user_id, $user_id, $user_id] // friends in this area
},{
	"id": "affenfelsen",
	"label": "Affenfelsen",
	"stage": false,
	"level": 0, // floor in the building, 0 is ground
	"shape": "$geojson",
	"devices": 500, // number of connected devices in this area
	"users": 40, // number of users in this area
	"friends": [$user_id, $user_id,$user_id] // friends in this area
}]
````

### GET `/<event-id>/area/<area-id>`

*single object as above*

## Days

Days enframe several session by a slice of time, usually one day.

### GET `/<event-id>/days`

```` javascript
[{
	"id": "1",
	"label": "6. Mai",
	"date": "2014-05-06"
},{
	"id": "2",
	"label": "7. Mai",
	"date": "2014-05-07"
},{
	"id": "3",
	"label": "8. Mai",
	"date": "2014-05-08"
}]
````

### GET `/days/1`

*single object as above*

## Formats

Formats indicate the practical execution of a session, like talk, discussion, workshop etc.

### GET `/<event-id>/formats`

```` javascript
[{
	"id": "talk",
	"label": "Vortrag"
},{
	"id": "discussion",
	"label": "Diskussion",
},{
	"id": "workshop",
	"label": "Workshop",
},{
	"id": "action",
	"label": "Aktion",
}]
````

### GET `/<event-id>/formats/<id>`

*single object as above*

## Levels

Levels indivate the amount of preexisting knowledge expected from the respective audience

### GET `/<event-id>/levels`

```` javascript
[{
	"id": "beginner",
	"label": "Beginnerinnen"
},{
	"id": "intermediate",
	"label": "Fortgeschrittene"	
},{
	"id": "advanced",
	"label": "Expertinnen"	
}]
````

### GET `/<event-id>/levels/<id>`

*single object as above*

## Languages

### GET `/<event-id>/languages`

```` javascript
[{
	"id": "de",
	"label": "Deutsch"
},{
	"lid": "en",
	"label": "English"	
}]
````

### GET `/<event-id>/languages/<language-id>`

*single object as above*

## Attendees

Attendees are humans participating in an event.

### GET `/<event-id>/attendees`

```` javascript
[{
	"id": 1,
	"speaker": "<speaker-id>" // or false
	"name": "Sebastian Vollnals",
	"nickname": "yetzt",
	"photo": "http://assets.re-publica.de/pictures/picture-144.jpg",
	"organization": "OpenDataCity",
	"description": "poly & queer hacker, feminist sidekick. wandering about in berlin and wearing pink hair.",
	"links": [{
		"service": "twitter",
		"label": "yetzt",
		"url": "https://twitter.com/yetzt"
	},{
		"service": "blog",
		"label": "blog",
		"url": "http://yetzt.wordpress.com/"
	},{
		"service": "github",
		"label": "yetzt",
		"url": "http://github.com/yetzt"
	},{
		"service": "adn",
		"label": "yetzt",
		"url": "https://app.net/yetzt"
	}],
	"sessions": [$session_id,$session_id,$session_id],
	"area": {
		"id": "<area-id>",
		"label": "Affenfelsen"
	}
}]
````
