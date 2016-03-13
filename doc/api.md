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

## Optional and Required Properties

Several properties are marked as optional. If they are not marked as optional they should be considered required even if not marked as such. 

If you want to specify an optional property as not present explicity (i.e. delete it if it has been there before) specify an explicit `null` value for the optional property. 

## Formats

Most basic types are defined by JSON

- `string`: JSON String
- `number`: JSON Number
- `date`: JSON String representing an ISO 8601 Date (no time)
- `datetime`: JSON String representing an ISO 8601 Date and Time
- `boolean`: JSON Bool (true/false)


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
    "hashtag": "rp13",    
	"url": "http://13.re-publica.de/",
	"last_modified": 1393611456.99
}]
````

|field|format|required|description |
+-----+------+--------+-----------+
|`id`|`string`|`yes`|Identifier|
|`title`|`string`|`yes`|Title of the conference|
|`slogan`|`string`|`no`|Slogan of the conference, if present|
|`begin`|`date`|`yes`|Begin date of the conference|
|`end`|`date`|`yes`|Begin date of the conference|
|`locations`|`array` of `dictionaries`|`no`|Locations, might be empty if unknown|
|`hashtag`|`string`|`no`|Hashtag (without `#` sign!) to use with Twitter/Facebook/Instagram, etc.|
|`url`|`string`|`no`|Homepage URL of the conference|

### GET `/events/<event-id>`

*single object, as above*

## Sessions

### GET `/events/<event-id>/sessions`

```` javascript
[{
	"id": "rp14-session-1",
	"title": "Eröffnung",
	"subtitle": "Die erste session",	
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
	"enclosures": [
		{
			"url": "http://example.com/files/live.m3u8",
			"mimetype": "application/x-mpegURL",
			"type": "livestream"
		},	
		{
			"url": "http://example.com/files/video.mp4",
			"mimetype": "video/mp4",
			"type": "recording"
			"thumbnail": "http://example.com/files/video_thumb.jpg"
		},
		{
			"url": "http://example.com/files/audio.mp3",
			"mimetype": "audio/mpeg",
			"type": "recording",
			"thumbnail": "http://example.com/files/audio_cover.jpg"
		},
		{
			"url": "http://example.com/files/foo.pdf",
			"mimetype": "application/pdf",
			"type": "slides"
		}
	],
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

### GET `/events/<event-id>/sessions/<session-id>`

*single object, as above*

Sessions also have two special fields: enclosures and links:

Optional fields:

- `subtitle`

### Enclosures

Enclosures list URLs of files including mime type. 

- **url:** Required, the URL of the enclosure
- **mimetype:** Required, the MIME type of the enclosure. 
- **type:**  Required; indicates the kind of enclosure present. Is one of `slides`, `recording`, `livestream`.
- **thumbnail:**  Optional; URL of a thumbnail imaged that can be used as a cover or video thumbnail for the enclosure. E.g. a video thumbnail for video enclosures, a cover for audio content or an image of the first slide for the slides. 

### Links

Links is a list of related webpages. Currently we provide only links to youtube/vimeo recordings. Later we also want to provide links to Etherpads, Slideshare, etc.

* Values of ```"type"```: ```"recording"```
* Values of ```"service"```: ```"youtube"```, ```"vimeo"```

## Speakers

Speakers are people performing sessions.

### GET `/events/<event-id>/speakers`

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


### GET `/events/<event-id>/speakers/<id>`

*single object, as above*

## Tracks

Tracks are topic-based collections of sessions

### GET `/events/<event-id>/tracks`

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

### GET `/events/<event-id>/tracks/<track-id>`

*single object, as above*

## Locations

Locations are specified spaces on the compound and may be stages.

### GET `/events/<event-id>/locations`

```` javascript
[
	{
		"id": "stage1", // location_id
		"label_de": "Stage 1",
		"label_en": "Stage 1",
        "shortlabel_de": "ST1",
        "shortlabel_en": "ST1",
		"is_stage": true, // is this a stage
		"order_index": 0, // order stage objects by this, when listed
		"point_of_interest": {
			"id": "poi-23",
			"label_de": "Stage 1",
			"label_en": "Stage 1"
		}
		"last_modified": 1393611456.99
	}, //...
]
````

- `is_stage`: (Required) This location is a stage, as opposed to a meeting aread/workshop space, etc.
- `order_index`: (Optional) Unique index per event, it defines the natural order of the locations (e.g. as used on promotional materials). 0 has the highest priority. 
- `point_of_interest`: (Optional) Relationship to a point of interest, if any. `id` and at least one `label_` properties are required if present
- `shortlabel_LANG` (Optional) A _very_ short label (not longer then 3 characters!) for use on small screens (e.g. watch complications, Mini LED displays, etc.) 

### GET `/events/<event-id>/locations/<location-id>`

*single object as above*

## Maps

Maps represent maps of the conference venue. A map refrences on more points of interest (POIs). See below for POIs.

### GET `/events/<event-id>/maps`


```` javascript
[
	{
		"id": "map-foor-1",
		"event": "rp13",	
		"type": "map",			
		"label_de": "Station Berlin",
		"label_en": "Station Berlin",
		"floor_label_de": "1. Etage",
		"floor_label_en": "1st floor",
		"is_outdoor": true,
		"is_indoor": true,		
		"floor": 0,
		"order_index": 23,
		"area": {"width": 100.0, 
		         "height": 200.0},
		"tiles": {
                    "base_url": "http://bitfever.de/~toto/test/31c3/0floor",
                    "large_image_url": "http://bitfever.de/~toto/test/31c3/0floor/large.png",
                    "tile_size": 512,
                    "tile_file_extension": "png",
                    "size": {"width": 6506,
                             "height": 5007}
                },
      "pois": [
          "poi-5",
          "poi-23",
          "poi-42"
      ]
	}, //...
]
````

- `id`: (Required) The identifier. Should be opaque to the user, is guranteed to be used only for exactly one map object of this event.
- `event`: (Required) Identifier of the event
- `type`: (Required) always `map` for maps
- `label_en`, etc.:  (Required in at least 1 language) Label specifying the name of the map localized to the suffix language. The suffix is the 2 char ISO code of the language. E.g. "Berlin Congress Center"
- `floor_label_en`: (Optional): Name of the floor, if there are multiple floors showing the same map area. E.g. "1st floor"
- `is_outdoor`: (Required) `true` if any significant part of the map is outdoor (e.g. a courtyard, but not a small balcony)
- `is_indoor`: (Required) `true` if  any significant part of the map is an indoor area (e.g. floor of an office building. **Note:** `is_indoor` and `is_outdoor` can both be true, if the map contains e.g. a gound floor plus the courtyard
- `floor`: (Optional) Floor in the building, 0 is ground. May be negative to indicate basement levels. 
- `order_index`: (Optional) Hint to using applications that *can* be used when ordering many maps relative to each other in e.g. a list or a pager. 
- `area`: (Required) Specifies the area covered by this map:
    - `width`, `height` (Required) *logical* size of the area the map covers in *meters*.
- `tiles`: (Required) Specifies the information for the tiled map. A dictionary with the following keys:
	- **General** Image tiles should be present in a structure compatible with the [OpenSeadragon project](http://openseadragon.github.io). For example generated using the [dzt](https://github.com/dblock/dzt) tool.
	- `base_url`: (Required) Base URL where the tile images can be found. Tiles themselves should be in a subdirectory called `tiles` structured as specified above.
	- `large_image_url`: A large version of the map image. This can be used e.g. if no tiled image support is implemented. It tis recomended that the image size does not exceed 2080x2048 pixels on this image.
	- `tile_size`: (Required) Size of the tiles in pixels. Tiles have to be square.
	- `tile_file_extension`: (Required) File extension for the tile images to the URL can be constructed by a viewer. E.g. `png` 
	- `size`: (Required): A dictionary specifiying `width` and `height` of the original image (not to be confused with the large image) in pixels.
- `pois`: (Required) List of the `id`s of all `pois` on this map. Can be empty.	
Specifies the base URL for image tiles. 

### GET `/events/<event-id>/maps/<map-id>`

Same as above, but returning only one map.

## Points of Interest

Represents a single point of interest on a map. Each POI belongs to a map object. 

### GET `/events/<event-id>/pois`

```` javascript
[
	{
		"id": "poi-1-map-1",
		"event": "rp13",	
		"type": "poi",			
		"positions": [{"map": "level4",
					   "x": 3520.0, "y": 2107.0}],
		"geo_position": {"lat": 53.20200, 
						 "long": 32.2342},
		"category": "session-location",
		"location": {
			"id": "location-1", 
			"label_de": "Sendezentrum", 
			"label_en": "Broadcast Center"
		},
		"label_de": "Sendezentrum",
		"label_en": "Broadcast Center",		
		"description_de": "Das Sendezentrum ist ein Projekt des Kombinats für Angewandte Radiotheorie. Konkret besteht das Kernteam aus Tim Pritlove (Metaebene), Claudia Krell und Ralf Stockmann (beide Wikigeeks).",
		"description_en": "The broadcast center…",				
		"links": [
			{
            	"title": "Das Sendezentrum",
				"url": "http://das-sendezentrum.de",
				"type": "other"
			}
		]
		"hidden": false,
		"priority": 100,
		"beacons": [{"uuid": "55C1DAB7-9430-450C-B94C-DE174D202B8B",
					 "major": 23,
					 "minor": 42}]
	}, //...
]
````

- `id`: (Required) Identifier of the POI. Uniq per event.
- `event`: (Required) Identifier of the event this POI belongs to
- `type`: (Required) Always `poi`
- `positions`: (Required) Identifier of the maps this POI belongs to and where it is on these maps. An array of dicts with the keys:
	- `map`: (Required) Identifier of the map. **Note:** A map identifier may only occur once in the `positions` property (aka a POI may only be placed on a map once)
	- `x` and `y` (Required) Position of this POI on the map. These are pixel coordinates in the coordinate system of the `map`. 
	  The coorinates are pixels on the original size of the map (`tiles.size.width` and `tiles.size.height` properties). 
	  The origin of the coordinate system is located on the *bottom left*. 
- `geo_position`: (Optional) Location of this POI in the WGS84 coordinate system. Single map with the following keys:
	 - `lat`: (Required) Geographical latitude in WGS84 coordinates in degrees (float)
	 - `long`: (Required) Geographical longitude in WGS84 coordinates in degrees (float)

- `category`: (Required) Category of the POI.  Pick one:
		- `session-location` - A typical session location (Auditorium, lecutre hall, etc.)
		- `workshop-location` - A workshop area 
		- `service` - Cash desk, info point, etc.
		- `safety`
		- `community` - Gathering spots, etc.
		- `food`
		- `entertainment`
		- `organisation`
		- `restroom`
		- `elevator`
		- `escalator`
		- `shopping`
		- `other`

- `location`: (Optional) Object with identifiying the `location` this POI belongs to if it represents a location sessions take place at. 
	- `id` (Required) Identifier of the location
	- `label_de`, `label_en` (Required in at leat one language) Label
- `label_en`, `label_de`, etc: (Required in at least on language) Label of the POI in the language specified by the suffix
- `description_en`, `description_de`, etc: (Optional) more exhaustive description of the point of interest
- `links`: (Required, but can be empty) A list of link objects related to this POI. E.g. the website of the porject, a link to the menu, etc. 
	- `url` (Required) URL 
	- `title` (Optional) Title of the link
	- `type` (Required): Link type, see Session or Speaker above
- `hidden`: (Optional) If not present should be assumed `false`, if `true` identifies a POI that should not be shown in UI (e.g. only for beacon positioning), might be ignored by the client if deemed appropriate.
- `priority`: (Optional) If not present should be assumed `0`. Can be used to identify the relative priority of this POI to others. Use full e.g. if clustering is needed or filtering needs to be performed for performance reasons on the client.
- `beacons`: (Optional) An array of maps, each representing a Bluetooth 4.0 LE beacon (aka [iBeacon](https://en.wikipedia.org/wiki/IBeacon)) marking this POI. 
			 A beacon has `uuid`, `major` and `minor` ID, where UUID might be the same for the whole conference or even beyond, so only the three properties in combination identifiy a uniq beacon. All three are required.  
			 Note: Only beacons whose presence identififies this POI should be here, not merely beacons who are close by. 





### GET `/events/<event-id>/pois/<poi-id>`

## Days

Days group several session by a slice of time, usually one day.

__Note:__ The `date` property is a calendar date (aka symbolic date) not a point in time. Therefore it is interpreted in the timezone of the conference.

### GET `/events/<event-id>/days`

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

### GET `/events/<event-id>/days/<day-id>`

*single object as above*

## Formats

Formats indicate the practical execution of a session, like talk, discussion, workshop etc.

### GET `/events/<event-id>/formats`

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

### GET `/events/<event-id>/formats/<format-id>`

*single object as above*

## Levels

Levels indivate the amount of preexisting knowledge expected from the respective audience

### GET `/events/<event-id>/levels`

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

### GET `/events/<event-id>/levels/<level-id>`

*single object as above*

## Languages

### GET `/events/<event-id>/languages`

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

### GET `/events/<event-id>/languages/<language-id>`

*single object as above*

