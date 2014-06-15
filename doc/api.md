# Basics

## Requests and Responses

The API is RESTful, so all you have to do is to call a specified URL and you will get a JSON result.

For example: If you call <http://data.re-publica.de/api/events> you should receive something like this:

``` javascript
{
	"ok": true,
	"count": 1,
	"data": [{
		"type": "event",
		"id": "rp13",
		"label": "re:publica 13",
		"title": "IN/SIDE/OUT",
		"date": [ "2013-05-06", "2013-05-08" ],
		"locations": [{
			"label": "Station Berlin",
			"coords": [ 52.49814, 13.374538 ]
		}],
		"url": "http://13.re-publica.de/"
	}]
}
```

The response is always an object with the properties:

* ```ok``` is true or false and shows, whether the request was successful. If it was successful also the following properties will be set:
* ```count``` shows the number of total results
* ```data``` is an array with the results

## Single Objects and Lists

If you are requesting for a single, existing object (e.g. by an object id) ```count``` will always be 1 and ```data``` will always be an array with a single object.

If you are requesting for a list of objects (e.g. all sessions) ```count``` will always be the total number of known objects (e.g. sessions) and ```data``` will always be an array with the results.

## Modification Time

Every element has the field ```last_modified``` containing the Unix time (in seconds) of the last change.

You can use that to filter lists. E.g. ```http://data.re-publica.de/api/rp13/speakers?last_modified=1393611456``` returns only speaker entries, that have changed since Unix time ```1393611456```.

## Pagination

When requesting for a list you can use the special GET parameters ```start``` and ```count``` for pagination.

E.g. <http://data.re-publica.de/api/rp13/sessions> will list all sessions:
``` javascript
{
	"ok": true,
	"count": 347,
	"data": [
		// ... list of 347 session objects
	]
}
```
The same request with pagination [...sessions?start=100&count=20](http://data.re-publica.de/api/rp13/sessions?start=100&count=20) will list only the requested 20 sessions - starting with the 100th:
``` javascript
{
	"ok": true,
	"count": 347, // count will still show the number of all sessions
	"data": [
		// ... list of the requested 20 session objects
	]
}
```

# Reference

In the following reference examples only the content of the ```data``` property will be shown.

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
	"url": "http://14.re-publica.de/",
	"last_modified": 1393611456.99
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
	"url": "http://13.re-publica.de/",
	"last_modified": 1393611456.99
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
	"begin": "2014-05-06T10:00:00.0Z", // local time (CEST)
	"end": "2014-05-06T11:00:00.0Z",
	"duration": 45, // in minutes
	"day": {
		"id": "rp14-day-1", "label_de": "6. Mai", "label_en": "6. May",
		"date": "2014-05-06"
	},
	"location": {
		"id": "rp14-location-stage-7", "label_de": "Stage 7", "label_en": "Stage 7"
	},
	"track": {
		"id": "media", "label_de": "Medien", "label_en": "Media"
	},
	"format": {
		"id": "talk", "label_de": "Vortrag", "label_en": "Talk"
	},
	"level": {
		"id": "beginner", "label_de": "Beginner", "label_en": "Beginner"
	},
	"lang": {
		"id": "de", "label_de": "Deutsch", "label_en": "German"
	},
	"speakers": [
		{ "id": "rp13-speaker-81", "name": "Sascha Lobo" }
		//...
	],
	"enclosures": [],
	"links": [
		{
			"thumbnail": "http://i.ytimg.com/vi/18xQRtdrJhQ/mqdefault.jpg",
			"title": "re:publica 2014: ...",
			"url": "http://youtube.com/watch?v=18xQRtdrJhQ",
			"service": "youtube",
			"type": "recording"
		}
	],
	"last_modified": 1393611456.99
}]
````

### GET `/<event-id>/sessions/<session-id>`

*single object, as above*

Sessions also have two special fields: enclosures and links:

### Enclosures

Enclosures list files including mime type. The idea is to make it easy to generate e.g. podcast feeds. Currently this feature is not implemented yet.

### Links

Links is a list of related webpages. Currently we provide only links to youtube/vimeo recordings. Later we also want to provide links to Etherpads, Slideshare, etc.

* Values of ```"type"```: ```"recording"```
* Values of ```"service"```: ```"youtube"```, ```"vimeo"```

## Speakers

Speakers are people performing sessions.

### GET `/<event-id>/speakers`

```` javascript
[{
	"id": "rp13-speaker-1",
	"event": "rp13",
	"type": "speaker",
	"name": "Johnny Haeusler",
	"photo": "http://13.re-publica.de/sites/13.re-publica.de/files/pictures/picture-48.png",
	"url": "http://13.re-publica.de/users/johnny",
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
	],
  "links": [
  	{
  		"url": "http://www.spreeblick.com",
  		"title": "Spreeblick",
  		"service": "web",
  		"type": "speaker-link"
  	},
  	{
  		"url": "https://twitter.com/spreeblick",
  		"title": "Twitter @spreeblick",
  		"service": "twitter",
  		"type": "speaker-link",
  		"username": "spreeblick"
  	}
  ],	
	"last_modified": 1393611456.99
} //...
]
````

#### Speaker links

Speaker `links` (optionally) contain links to web presences of the speaker. `url`, `service` and `title` are always present. Service can currently be: `web`, `twitter`, `facebook`, `github`, `app.net`. The default is `web`, which can be any valid http(s) URL. Optionally `username` contains the username on the social network.

* Values of ```"type"```: ```"speaker-link"```
* Values of ```"service"```: ```"twitter"```, ```"facebook"```, ```"app.net"```, ```"web"```, ```"github"```, `web` is default.


### GET `/<event-id>/speakers/<id>`

*single object, as above*

## Tracks

Tracks are topic-based collections of sessions

### GET `/<event-id>/tracks`

```` javascript
[
	{
		"id": "research-education",
		"label_de": "Forschung & Bildung",
		"label_en": "Research & Education",
		"color": [244.0, 79.0, 244.0, 1.0],
		"last_modified": 1393611456.99
	},{
		"id": "politics-society",
		"label_de": "Politik & Gesellschaft",
		"label_en": "Politics & Society",
		"color": [246.0, 105.0, 106.0, 1.0],
		"last_modified": 1393611456.99
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
		"label_de": "Stage 1",
		"label_en": "Stage 1",
		"is_stage": true, // is this a stage
		"floor": 0, 
		"order_index": 0, // order stage objects by this, when listed
		"last_modified": 1393611456.99
	}, //...
]
````

- `is_stage`: (Required) This location is a stage, as opposed to a meeting aread/workshop space, etc.
- `floor`: (Optional) Floor in the building, 0 is ground. May be negative to indicate basement levels.
- `order_index`: (Optional) Unique index per event, it defines the natural order of the locations (e.g. as used on promotional materials). 0 has the highest priority. 

### GET `/<event-id>/locations/<location-id>`

*single object as above*

## Days

Days group several session by a slice of time, usually one day.

__Note:__ The `date` property is a calendar date (aka symbolic date) not a point in time. Therefore it is interpreted in the timezone of the conference.

### GET `/<event-id>/days`

```` javascript
[
	{
		"id": "1",
		"event": "rp13",
		"type": "day",
		"label_de": "6. Mai",
		"label_en": "6. May",
		"date": "2014-05-06",
		"last_modified": 1393611456.99
	},{
		"id": "2",
		"event": "rp13",
		"type": "day",
		"label_de": "7. Mai",
		"label_en": "7. May",
		"date": "2014-05-07",
		"last_modified": 1393611456.99
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
		"label_en": "Talk",
		"last_modified": 1393611456.99
	},{
		"id": "discussion",
		"label_de": "Diskussion",
		"label_en": "Discussion",
		"last_modified": 1393611456.99
	},{
		"id": "workshop",
		"label_de": "Workshop",
		"label_en": "Workshop",
		"last_modified": 1393611456.99
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
		"label_en": "Beginner",
		"last_modified": 1393611456.99
	},{
		"id": "intermediate",
		"label_de": "Fortgeschrittene",
		"label_en": "Intermediate",
		"last_modified": 1393611456.99
	},{
		"id": "advanced",
		"label_de": "Expertinnen",
		"label_en": "Experts",
		"last_modified": 1393611456.99
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
		"label_en": "German",
		"last_modified": 1393611456.99
	},{
		"id": "en",
		"label_de": "Englisch",
		"label_en": "English",
		"last_modified": 1393611456.99
	} //...
]
````

### GET `/<event-id>/languages/<language-id>`

*single object as above*

