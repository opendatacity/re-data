# API

## Events

An event is one chronologically delimited total of sessions. Like a yearly conference.

### GET `/events`

```` javascript
[{
	"id": "rp14",
	"title": "re:publica 14",
	"slogan": "into the wild",
	"begin": "2014-05-06",
	"end": "2014-05-08",
	"locations": [{
		"label": "Station Berlin",
		"coords": [52.49814,13.374538] // lat, lon
	}],
	"url": "http://14.re-publica.de/"
},{
	"id": "rp13",
	"title": "re:publica 13",
	"slogan": "IN/SIDE/OUT",
	"begin": "2013-05-06",
	"end": "2013-05-08",
	"locations": [{
		"label": "Station Berlin",
		"coords": [52.49814,13.374538] // lat, lon
	}],
	"url": "http://13.re-publica.de/"
}]
````

### GET `/events/<event-id>`

*single object, as above*

## Sessions

### GET `/<event-id>/sessions`

```` javascript
[{
	"id": "rp14-session-1",
	"title": "Eröffnung",
	"abstract": "...",
	"description": "...",
	"url": "http://14.re-publica.de/session/1"
	"begin": "2014-05-06T10:00:00.0Z",
	"end": "2014-05-06T11:00:00.0Z",
	"duration": 45,
	"day": {
		"id": "rp14-day-1",
		"label_de": "6. Mai"
		"label_en": "6. May"
		"date": "2014-05-06"
	},
	"location": {
		"id": "rp14-location-stage-7",
		"label_de": "Stage 7",
		"label_en": "Stage 7"
	},
	"track": {
		"id": "media",
		"label_de": "Media",
		"label_en": "Media"
	},
	"format": {
		"id": "talk",
		"label_de": "Vortrag",
		"label_en": "Talk"
	},
	"level": {
		"id": "beginner",
		"label_de": "Beginner",
		"label_en": "Beginner"
	},
	"lang": {
		"id": "de",
		"label_de": "Deutsch",
		"label_en": "German"
	},
	"speakers": [
		{
        	"id": "rp13-speaker-81",
        	"name": "Sascha Lobo"
        } //...
	],
	"last_modified": "2013-12-04T15:50:00.0Z"
}]
````

### GET `/<event-id>/sessions/<session-id>`

*single object, as above*

## Speakers

Speakers are people performing sessions.

### GET `/<event-id>/speakers`

```` javascript
[
	{
    	"id": "rp13-session-1",
    	"event": "rp13",
    	"type": "speaker",
    	"name": "Johnny Haeusler",
    	"photo": "http://13.re-publica.de/sites/13.re-publica.de/files/pictures/picture-48.png",
    	"organization": "Spreeblick",
    	"position": "",
    	"biography": "Born in Berlin in 1964, Johnny Haeusler founded the award-winning weblog Spreeblick in 2002. He is also a radio DJ and a member of post-punkrock band Plan B, which is touring again since 2012.....",
    	"sessions": [
    		{
            	"id": "rp13-session-5117",
            	"title": "Comic Misunderstanding – A conversation with Graham Linehan (IT Crowd)"
            },
            {
            	"id": "rp13-session-5866",
            	"title": "YouTube macht die Stars von heute"
            } //...
    	]
    } //...
]
````

### GET `/<event-id>/speakers/<id>`

*single object, as above*

## Tracks

Tracks are topic-based collections of sessions

### GET `/<event-id>/tracks`

```` javascript
[
	{
		"id": "research-education",
		"label_de": "Research & Education",
		"label_en": "Research & Education",
    	"sessions": [
    		{
        		"id": "rp13-session-1714",
        		"title": "Street fighting data science"
        	} //...
         ]
	},{
    	"id": "politics-society",
    	"label_de": "Politics & Society",
    	"label_en": "Politics & Society",
    	"sessions": [
			{
				"id": "rp13-session-1781",
				"title": "Algorithmen-Ethik"
			} //...
    	]
    } //...
]
````

### GET `/<event-id>/tracks/<track-id>`

*single object, as above*

## Locations

Locations are specified spaces on the compound and may be stages.

### GET `/<event-id>/locations`

```` javascript
[
	{
		"id": "stage1", // location_id
		"label": "Stage 1",
		"is_stage": true, // is this a stage
		"floor": 0 // floor in the building, 0 is ground
	},{
		"id": "affenfelsen",
		"label": "Affenfelsen",
		"is_stage": false,
		"floor": 0 // floor in the building, 0 is ground
	} //...
]
````

### GET `/<event-id>/locations/<location-id>`

*single object as above*

## Days

Days enframe several session by a slice of time, usually one day.

### GET `/<event-id>/days`

```` javascript
[
	{
		"id": "1",
		"event": "rp13",
		"type": "day",
		"label_de": "6. Mai",
		"label_en": "6. May",
		"date": "2014-05-06"
	},{
		"id": "2",
		"event": "rp13",
		"type": "day",
		"label_de": "7. Mai",
		"label_en": "7. May",
		"date": "2014-05-07"
	} //...
]
````

### GET `/<event-id>/days/<day-id>`

*single object as above*

## Formats

Formats indicate the practical execution of a session, like talk, discussion, workshop etc.

### GET `/<event-id>/formats`

```` javascript
[
	{
		"id": "talk",
		"label_de": "Vortrag",
		"label_en": "Talk"
	},{
		"id": "discussion",
		"label_de": "Diskussion",
		"label_en": "Discussion"
	},{
		"id": "workshop",
		"label_de": "Workshop",
		"label_en": "Workshop"
	} //...
]
````

### GET `/<event-id>/formats/<format-id>`

*single object as above*

## Levels

Levels indivate the amount of preexisting knowledge expected from the respective audience

### GET `/<event-id>/levels`

```` javascript
[
	{
		"id": "beginner",
		"label_de": "Anfängerinnen",
		"label_en": "Beginner"
	},{
		"id": "intermediate",
		"label_de": "Fortgeschrittene",
		"label_en": "Intermediate"
	},{
		"id": "advanced",
		"label_de": "Expertinnen",
		"label_en": "Experts"
	} //...
]
````

### GET `/<event-id>/levels/<level-id>`

*single object as above*

## Languages

### GET `/<event-id>/languages`

```` javascript
[
	{
		"id": "de",
		"label_de": "Deutsch",
		"label_en": "German"
	},{
		"id": "en",
		"label_de": "Englisch",
		"label_en": "English"
	} //...
]
````

### GET `/<event-id>/languages/<language-id>`

*single object as above*

