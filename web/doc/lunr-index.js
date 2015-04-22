
var index = lunr(function () {
    this.field('body');
    this.ref('url');
});

var documentTitles = {};



documentTitles["api.html#basics"] = "Basics";
index.add({
    url: "api.html#basics",
    title: "Basics",
    body: "# Basics  "
});

documentTitles["api.html#requests-and-responses"] = "Requests and Responses";
index.add({
    url: "api.html#requests-and-responses",
    title: "Requests and Responses",
    body: "## Requests and Responses  The API is RESTful, so all you have to do is to call a specified URL and you will get a JSON result.  For example: If you call &lt;http://data.re-publica.de/api/events&gt; you should receive something like this:  ``` javascript { 	\&quot;ok\&quot;: true, 	\&quot;count\&quot;: 1, 	\&quot;data\&quot;: [{ 		\&quot;type\&quot;: \&quot;event\&quot;, 		\&quot;id\&quot;: \&quot;rp13\&quot;, 		\&quot;label\&quot;: \&quot;re:publica 13\&quot;, 		\&quot;title\&quot;: \&quot;IN/SIDE/OUT\&quot;, 		\&quot;date\&quot;: [ \&quot;2013-05-06\&quot;, \&quot;2013-05-08\&quot; ], 		\&quot;locations\&quot;: [{ 			\&quot;label\&quot;: \&quot;Station Berlin\&quot;, 			\&quot;coords\&quot;: [ 52.49814, 13.374538 ] 		}], 		\&quot;url\&quot;: \&quot;http://13.re-publica.de/\&quot; 	}] } ```  The response is always an object with the properties:  * ```ok``` is true or false and shows, whether the request was successful. If it was successful also the following properties will be set: * ```count``` shows the number of total results * ```data``` is an array with the results  "
});

documentTitles["api.html#single-objects-and-lists"] = "Single Objects and Lists";
index.add({
    url: "api.html#single-objects-and-lists",
    title: "Single Objects and Lists",
    body: "## Single Objects and Lists  If you are requesting for a single, existing object (e.g. by an object id) ```count``` will always be 1 and ```data``` will always be an array with a single object.  If you are requesting for a list of objects (e.g. all sessions) ```count``` will always be the total number of known objects (e.g. sessions) and ```data``` will always be an array with the results.  "
});

documentTitles["api.html#modification-time"] = "Modification Time";
index.add({
    url: "api.html#modification-time",
    title: "Modification Time",
    body: "## Modification Time  Every element has the field ```last_modified``` containing the Unix time (in seconds) of the last change.  You can use that to filter lists. E.g. ```http://data.re-publica.de/api/rp13/speakers?last_modified=1393611456``` returns only speaker entries, that have changed since Unix time ```1393611456```.  "
});

documentTitles["api.html#pagination"] = "Pagination";
index.add({
    url: "api.html#pagination",
    title: "Pagination",
    body: "## Pagination  When requesting for a list you can use the special GET parameters ```start``` and ```count``` for pagination.  E.g. &lt;http://data.re-publica.de/api/rp13/sessions&gt; will list all sessions: ``` javascript { 	\&quot;ok\&quot;: true, 	\&quot;count\&quot;: 347, 	\&quot;data\&quot;: [ 		// ... list of 347 session objects 	] } ``` The same request with pagination [...sessions?start=100&amp;count=20](http://data.re-publica.de/api/rp13/sessions?start=100&amp;count=20) will list only the requested 20 sessions - starting with the 100th: ``` javascript { 	\&quot;ok\&quot;: true, 	\&quot;count\&quot;: 347, // count will still show the number of all sessions 	\&quot;data\&quot;: [ 		// ... list of the requested 20 session objects 	] } ```   "
});

documentTitles["api.html#reference"] = "Reference";
index.add({
    url: "api.html#reference",
    title: "Reference",
    body: "# Reference  In the following reference examples only the content of the ```data``` property will be shown.  "
});

documentTitles["api.html#optional-and-required-properties"] = "Optional and Required Properties";
index.add({
    url: "api.html#optional-and-required-properties",
    title: "Optional and Required Properties",
    body: "## Optional and Required Properties  Several properties are marked as optional. If they are not marked as optional they should be considered required even if not marked as such.   If you want to specify an optional property as not present explicity (i.e. delete it if it has been there before) specify an explicit `null` value for the optional property.   "
});

documentTitles["api.html#events"] = "Events";
index.add({
    url: "api.html#events",
    title: "Events",
    body: "## Events  An event is one chronologically delimited total of sessions. Like a yearly conference.  "
});

documentTitles["api.html#get-events"] = "GET `/events`";
index.add({
    url: "api.html#get-events",
    title: "GET `/events`",
    body: "### GET `/events`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;rp14\&quot;, 	\&quot;title\&quot;: \&quot;re:publica 14\&quot;, 	\&quot;slogan\&quot;: \&quot;into the wild\&quot;, 	\&quot;begin\&quot;: \&quot;2014-05-06\&quot;, 	\&quot;end\&quot;: \&quot;2014-05-08\&quot;, 	\&quot;locations\&quot;: [{ 		\&quot;label\&quot;: \&quot;Station Berlin\&quot;, 		\&quot;coords\&quot;: [52.49814,13.374538] // lat, lon 	}], 	\&quot;url\&quot;: \&quot;http://14.re-publica.de/\&quot;, 	\&quot;last_modified\&quot;: 1393611456.99 },{ 	\&quot;id\&quot;: \&quot;rp13\&quot;, 	\&quot;title\&quot;: \&quot;re:publica 13\&quot;, 	\&quot;slogan\&quot;: \&quot;IN/SIDE/OUT\&quot;, 	\&quot;begin\&quot;: \&quot;2013-05-06\&quot;, 	\&quot;end\&quot;: \&quot;2013-05-08\&quot;, 	\&quot;locations\&quot;: [{ 		\&quot;label\&quot;: \&quot;Station Berlin\&quot;, 		\&quot;coords\&quot;: [52.49814,13.374538] // lat, lon 	}], 	\&quot;url\&quot;: \&quot;http://13.re-publica.de/\&quot;, 	\&quot;last_modified\&quot;: 1393611456.99 }] ````  "
});

documentTitles["api.html#get-eventsevent-id"] = "GET `/events/&lt;event-id&gt;`";
index.add({
    url: "api.html#get-eventsevent-id",
    title: "GET `/events/&lt;event-id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;`  *single object, as above*  "
});

documentTitles["api.html#sessions"] = "Sessions";
index.add({
    url: "api.html#sessions",
    title: "Sessions",
    body: "## Sessions  "
});

documentTitles["api.html#get-eventsevent-idsessions"] = "GET `/events/&lt;event-id&gt;/sessions`";
index.add({
    url: "api.html#get-eventsevent-idsessions",
    title: "GET `/events/&lt;event-id&gt;/sessions`",
    body: "### GET `/events/&lt;event-id&gt;/sessions`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;rp14-session-1\&quot;, 	\&quot;title\&quot;: \&quot;Eröffnung\&quot;, 	\&quot;subtitle\&quot;: \&quot;Die erste session\&quot;,	 	\&quot;abstract\&quot;: \&quot;...\&quot;, 	\&quot;description\&quot;: \&quot;...\&quot;, 	\&quot;url\&quot;: \&quot;http://14.re-publica.de/session/1\&quot; 	\&quot;begin\&quot;: \&quot;2014-05-06T10:00:00.0Z\&quot;, // local time (CEST) 	\&quot;end\&quot;: \&quot;2014-05-06T11:00:00.0Z\&quot;, 	\&quot;duration\&quot;: 45, // in minutes 	\&quot;day\&quot;: { 		\&quot;id\&quot;: \&quot;rp14-day-1\&quot;, \&quot;label_de\&quot;: \&quot;6. Mai\&quot;, \&quot;label_en\&quot;: \&quot;6. May\&quot;, 		\&quot;date\&quot;: \&quot;2014-05-06\&quot; 	}, 	\&quot;location\&quot;: { 		\&quot;id\&quot;: \&quot;rp14-location-stage-7\&quot;, \&quot;label_de\&quot;: \&quot;Stage 7\&quot;, \&quot;label_en\&quot;: \&quot;Stage 7\&quot; 	}, 	\&quot;track\&quot;: { 		\&quot;id\&quot;: \&quot;media\&quot;, \&quot;label_de\&quot;: \&quot;Medien\&quot;, \&quot;label_en\&quot;: \&quot;Media\&quot; 	}, 	\&quot;format\&quot;: { 		\&quot;id\&quot;: \&quot;talk\&quot;, \&quot;label_de\&quot;: \&quot;Vortrag\&quot;, \&quot;label_en\&quot;: \&quot;Talk\&quot; 	}, 	\&quot;level\&quot;: { 		\&quot;id\&quot;: \&quot;beginner\&quot;, \&quot;label_de\&quot;: \&quot;Beginner\&quot;, \&quot;label_en\&quot;: \&quot;Beginner\&quot; 	}, 	\&quot;lang\&quot;: { 		\&quot;id\&quot;: \&quot;de\&quot;, \&quot;label_de\&quot;: \&quot;Deutsch\&quot;, \&quot;label_en\&quot;: \&quot;German\&quot; 	}, 	\&quot;speakers\&quot;: [ 		{ \&quot;id\&quot;: \&quot;rp13-speaker-81\&quot;, \&quot;name\&quot;: \&quot;Sascha Lobo\&quot; } 		//... 	], 	\&quot;enclosures\&quot;: [ 		{ 			\&quot;url\&quot;: \&quot;http://example.com/files/live.m3u8\&quot;, 			\&quot;mimetype\&quot;: \&quot;application/x-mpegURL\&quot;, 			\&quot;type\&quot;: \&quot;livestream\&quot; 		},	 		{ 			\&quot;url\&quot;: \&quot;http://example.com/files/video.mp4\&quot;, 			\&quot;mimetype\&quot;: \&quot;video/mp4\&quot;, 			\&quot;type\&quot;: \&quot;recording\&quot; 			\&quot;thumbnail\&quot;: \&quot;http://example.com/files/video_thumb.jpg\&quot; 		}, 		{ 			\&quot;url\&quot;: \&quot;http://example.com/files/audio.mp3\&quot;, 			\&quot;mimetype\&quot;: \&quot;audio/mpeg\&quot;, 			\&quot;type\&quot;: \&quot;recording\&quot;, 			\&quot;thumbnail\&quot;: \&quot;http://example.com/files/audio_cover.jpg\&quot; 		}, 		{ 			\&quot;url\&quot;: \&quot;http://example.com/files/foo.pdf\&quot;, 			\&quot;mimetype\&quot;: \&quot;application/pdf\&quot;, 			\&quot;type\&quot;: \&quot;slides\&quot; 		} 	], 	\&quot;links\&quot;: [ 		{ 			\&quot;thumbnail\&quot;: \&quot;http://i.ytimg.com/vi/18xQRtdrJhQ/mqdefault.jpg\&quot;, 			\&quot;title\&quot;: \&quot;re:publica 2014: ...\&quot;, 			\&quot;url\&quot;: \&quot;http://youtube.com/watch?v=18xQRtdrJhQ\&quot;, 			\&quot;service\&quot;: \&quot;youtube\&quot;, 			\&quot;type\&quot;: \&quot;recording\&quot; 		} 	], 	\&quot;last_modified\&quot;: 1393611456.99 }] ````  "
});

documentTitles["api.html#get-eventsevent-idsessionssession-id"] = "GET `/events/&lt;event-id&gt;/sessions/&lt;session-id&gt;`";
index.add({
    url: "api.html#get-eventsevent-idsessionssession-id",
    title: "GET `/events/&lt;event-id&gt;/sessions/&lt;session-id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;/sessions/&lt;session-id&gt;`  *single object, as above*  Sessions also have two special fields: enclosures and links:  Optional fields:  - `subtitle`  "
});

documentTitles["api.html#enclosures"] = "Enclosures";
index.add({
    url: "api.html#enclosures",
    title: "Enclosures",
    body: "### Enclosures  Enclosures list URLs of files including mime type.   - **url:** Required, the URL of the enclosure - **mimetype:** Required, the MIME type of the enclosure.  - **type:**  Required; indicates the kind of enclosure present. Is one of `slides`, `recording`, `livestream`. - **thumbnail:**  Optional; URL of a thumbnail imaged that can be used as a cover or video thumbnail for the enclosure. E.g. a video thumbnail for video enclosures, a cover for audio content or an image of the first slide for the slides.   "
});

documentTitles["api.html#links"] = "Links";
index.add({
    url: "api.html#links",
    title: "Links",
    body: "### Links  Links is a list of related webpages. Currently we provide only links to youtube/vimeo recordings. Later we also want to provide links to Etherpads, Slideshare, etc.  * Values of ```\&quot;type\&quot;```: ```\&quot;recording\&quot;``` * Values of ```\&quot;service\&quot;```: ```\&quot;youtube\&quot;```, ```\&quot;vimeo\&quot;```  "
});

documentTitles["api.html#speakers"] = "Speakers";
index.add({
    url: "api.html#speakers",
    title: "Speakers",
    body: "## Speakers  Speakers are people performing sessions.  "
});

documentTitles["api.html#get-eventsevent-idspeakers"] = "GET `/events/&lt;event-id&gt;/speakers`";
index.add({
    url: "api.html#get-eventsevent-idspeakers",
    title: "GET `/events/&lt;event-id&gt;/speakers`",
    body: "### GET `/events/&lt;event-id&gt;/speakers`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;rp13-speaker-1\&quot;, 	\&quot;event\&quot;: \&quot;rp13\&quot;, 	\&quot;type\&quot;: \&quot;speaker\&quot;, 	\&quot;name\&quot;: \&quot;Johnny Haeusler\&quot;, 	\&quot;photo\&quot;: \&quot;http://13.re-publica.de/sites/13.re-publica.de/files/pictures/picture-48.png\&quot;, 	\&quot;url\&quot;: \&quot;http://13.re-publica.de/users/johnny\&quot;, 	\&quot;organization\&quot;: \&quot;Spreeblick\&quot;, 	\&quot;position\&quot;: \&quot;\&quot;, 	\&quot;biography\&quot;: \&quot;Born in Berlin in 1964, Johnny Haeusler founded the award-winning weblog Spreeblick in 2002. He is also a radio DJ and a member of post-punkrock band Plan B, which is touring again since 2012.....\&quot;, 	\&quot;sessions\&quot;: [ 		{ 			\&quot;id\&quot;: \&quot;rp13-session-5117\&quot;, 			\&quot;title\&quot;: \&quot;Comic Misunderstanding – A conversation with Graham Linehan (IT Crowd)\&quot; 		}, 		{ 			\&quot;id\&quot;: \&quot;rp13-session-5866\&quot;, 			\&quot;title\&quot;: \&quot;YouTube macht die Stars von heute\&quot; 		} //... 	],   \&quot;links\&quot;: [   	{   		\&quot;url\&quot;: \&quot;http://www.spreeblick.com\&quot;,   		\&quot;title\&quot;: \&quot;Spreeblick\&quot;,   		\&quot;service\&quot;: \&quot;web\&quot;,   		\&quot;type\&quot;: \&quot;speaker-link\&quot;   	},   	{   		\&quot;url\&quot;: \&quot;https://twitter.com/spreeblick\&quot;,   		\&quot;title\&quot;: \&quot;Twitter @spreeblick\&quot;,   		\&quot;service\&quot;: \&quot;twitter\&quot;,   		\&quot;type\&quot;: \&quot;speaker-link\&quot;,   		\&quot;username\&quot;: \&quot;spreeblick\&quot;   	}   ],	 	\&quot;last_modified\&quot;: 1393611456.99 } //... ] ````  "
});

documentTitles["api.html#speaker-links"] = "Speaker links";
index.add({
    url: "api.html#speaker-links",
    title: "Speaker links",
    body: "#### Speaker links  Speaker `links` (optionally) contain links to web presences of the speaker. `url`, `service` and `title` are always present. Service can currently be: `web`, `twitter`, `facebook`, `github`, `app.net`. The default is `web`, which can be any valid http(s) URL. Optionally `username` contains the username on the social network.  * Values of ```\&quot;type\&quot;```: ```\&quot;speaker-link\&quot;``` * Values of ```\&quot;service\&quot;```: ```\&quot;twitter\&quot;```, ```\&quot;facebook\&quot;```, ```\&quot;app.net\&quot;```, ```\&quot;web\&quot;```, ```\&quot;github\&quot;```, `web` is default.   "
});

documentTitles["api.html#get-eventsevent-idspeakersid"] = "GET `/events/&lt;event-id&gt;/speakers/&lt;id&gt;`";
index.add({
    url: "api.html#get-eventsevent-idspeakersid",
    title: "GET `/events/&lt;event-id&gt;/speakers/&lt;id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;/speakers/&lt;id&gt;`  *single object, as above*  "
});

documentTitles["api.html#tracks"] = "Tracks";
index.add({
    url: "api.html#tracks",
    title: "Tracks",
    body: "## Tracks  Tracks are topic-based collections of sessions  "
});

documentTitles["api.html#get-eventsevent-idtracks"] = "GET `/events/&lt;event-id&gt;/tracks`";
index.add({
    url: "api.html#get-eventsevent-idtracks",
    title: "GET `/events/&lt;event-id&gt;/tracks`",
    body: "### GET `/events/&lt;event-id&gt;/tracks`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;research-education\&quot;, 		\&quot;label_de\&quot;: \&quot;Forschung &amp; Bildung\&quot;, 		\&quot;label_en\&quot;: \&quot;Research &amp; Education\&quot;, 		\&quot;color\&quot;: [244.0, 79.0, 244.0, 1.0], 		\&quot;last_modified\&quot;: 1393611456.99 	},{ 		\&quot;id\&quot;: \&quot;politics-society\&quot;, 		\&quot;label_de\&quot;: \&quot;Politik &amp; Gesellschaft\&quot;, 		\&quot;label_en\&quot;: \&quot;Politics &amp; Society\&quot;, 		\&quot;color\&quot;: [246.0, 105.0, 106.0, 1.0], 		\&quot;last_modified\&quot;: 1393611456.99 	} //... ] ````  "
});

documentTitles["api.html#get-eventsevent-idtrackstrack-id"] = "GET `/events/&lt;event-id&gt;/tracks/&lt;track-id&gt;`";
index.add({
    url: "api.html#get-eventsevent-idtrackstrack-id",
    title: "GET `/events/&lt;event-id&gt;/tracks/&lt;track-id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;/tracks/&lt;track-id&gt;`  *single object, as above*  "
});

documentTitles["api.html#locations"] = "Locations";
index.add({
    url: "api.html#locations",
    title: "Locations",
    body: "## Locations  Locations are specified spaces on the compound and may be stages.  "
});

documentTitles["api.html#get-eventsevent-idlocations"] = "GET `/events/&lt;event-id&gt;/locations`";
index.add({
    url: "api.html#get-eventsevent-idlocations",
    title: "GET `/events/&lt;event-id&gt;/locations`",
    body: "### GET `/events/&lt;event-id&gt;/locations`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;stage1\&quot;, // location_id 		\&quot;label_de\&quot;: \&quot;Stage 1\&quot;, 		\&quot;label_en\&quot;: \&quot;Stage 1\&quot;, 		\&quot;is_stage\&quot;: true, // is this a stage 		\&quot;order_index\&quot;: 0, // order stage objects by this, when listed 		\&quot;point_of_interest\&quot;: { 			\&quot;id\&quot;: \&quot;poi-23\&quot;, 			\&quot;label_de\&quot;: \&quot;Stage 1\&quot;, 			\&quot;label_en\&quot;: \&quot;Stage 1\&quot; 		} 		\&quot;last_modified\&quot;: 1393611456.99 	}, //... ] ````  - `is_stage`: (Required) This location is a stage, as opposed to a meeting aread/workshop space, etc. - `order_index`: (Optional) Unique index per event, it defines the natural order of the locations (e.g. as used on promotional materials). 0 has the highest priority.  - `point_of_interest`: (Optional) Relationship to a point of interest, if any. `id` and at least one `label_` properties are required if present  "
});

documentTitles["api.html#get-eventsevent-idlocationslocation-id"] = "GET `/events/&lt;event-id&gt;/locations/&lt;location-id&gt;`";
index.add({
    url: "api.html#get-eventsevent-idlocationslocation-id",
    title: "GET `/events/&lt;event-id&gt;/locations/&lt;location-id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;/locations/&lt;location-id&gt;`  *single object as above*  "
});

documentTitles["api.html#maps"] = "Maps";
index.add({
    url: "api.html#maps",
    title: "Maps",
    body: "## Maps  Maps represent maps of the conference venue. A map refrences on more points of interest (POIs). See below for POIs.  "
});

documentTitles["api.html#get-eventsevent-idmaps"] = "GET `/events/&lt;event-id&gt;/maps`";
index.add({
    url: "api.html#get-eventsevent-idmaps",
    title: "GET `/events/&lt;event-id&gt;/maps`",
    body: "### GET `/events/&lt;event-id&gt;/maps`   ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;map-foor-1\&quot;, 		\&quot;event\&quot;: \&quot;rp13\&quot;,	 		\&quot;type\&quot;: \&quot;map\&quot;,			 		\&quot;label_de\&quot;: \&quot;Station Berlin\&quot;, 		\&quot;label_en\&quot;: \&quot;Station Berlin\&quot;, 		\&quot;floor_label_de\&quot;: \&quot;1. Etage\&quot;, 		\&quot;floor_label_en\&quot;: \&quot;1st floor\&quot;, 		\&quot;is_outdoor\&quot;: true, 		\&quot;is_indoor\&quot;: true,		 		\&quot;floor\&quot;: 0, 		\&quot;order_index\&quot;: 23, 		\&quot;area\&quot;: {\&quot;width\&quot;: 100.0,  		         \&quot;height\&quot;: 200.0}, 		\&quot;tiles\&quot;: {                     \&quot;base_url\&quot;: \&quot;http://bitfever.de/~toto/test/31c3/0floor\&quot;,                     \&quot;large_image_url\&quot;: \&quot;http://bitfever.de/~toto/test/31c3/0floor/large.png\&quot;,                     \&quot;tile_size\&quot;: 512,                     \&quot;tile_file_extension\&quot;: \&quot;png\&quot;,                     \&quot;size\&quot;: {\&quot;width\&quot;: 6506,                              \&quot;height\&quot;: 5007}                 },       \&quot;pois\&quot;: [           \&quot;poi-5\&quot;,           \&quot;poi-23\&quot;,           \&quot;poi-42\&quot;       ] 	}, //... ] ````  - `id`: (Required) The identifier. Should be opaque to the user, is guranteed to be used only for exactly one map object of this event. - `event`: (Required) Identifier of the event - `type`: (Required) always `map` for maps - `label_en`, etc.:  (Required in at least 1 language) Label specifying the name of the map localized to the suffix language. The suffix is the 2 char ISO code of the language. E.g. \&quot;Berlin Congress Center\&quot; - `floor_label_en`: (Optional): Name of the floor, if there are multiple floors showing the same map area. E.g. \&quot;1st floor\&quot; - `is_outdoor`: (Required) `true` if any significant part of the map is outdoor (e.g. a courtyard, but not a small balcony) - `is_indoor`: (Required) `true` if  any significant part of the map is an indoor area (e.g. floor of an office building. **Note:** `is_indoor` and `is_outdoor` can both be true, if the map contains e.g. a gound floor plus the courtyard - `floor`: (Optional) Floor in the building, 0 is ground. May be negative to indicate basement levels.  - `order_index`: (Optional) Hint to using applications that *can* be used when ordering many maps relative to each other in e.g. a list or a pager.  - `area`: (Required) Specifies the area covered by this map:     - `width`, `height` (Required) *logical* size of the area the map covers in *meters*. - `tiles`: (Required) Specifies the information for the tiled map. A dictionary with the following keys: 	- **General** Image tiles should be present in a structure compatible with the [OpenSeadragon project](http://openseadragon.github.io). For example generated using the [dzt](https://github.com/dblock/dzt) tool. 	- `base_url`: (Required) Base URL where the tile images can be found. Tiles themselves should be in a subdirectory called `tiles` structured as specified above. 	- `large_image_url`: A large version of the map image. This can be used e.g. if no tiled image support is implemented. It tis recomended that the image size does not exceed 2080x2048 pixels on this image. 	- `tile_size`: (Required) Size of the tiles in pixels. Tiles have to be square. 	- `tile_file_extension`: (Required) File extension for the tile images to the URL can be constructed by a viewer. E.g. `png`  	- `size`: (Required): A dictionary specifiying `width` and `height` of the original image (not to be confused with the large image) in pixels. - `pois`: (Required) List of the `id`s of all `pois` on this map. Can be empty.	 Specifies the base URL for image tiles.   "
});

documentTitles["api.html#get-eventsevent-idmapsmap-id"] = "GET `/events/&lt;event-id&gt;/maps/&lt;map-id&gt;`";
index.add({
    url: "api.html#get-eventsevent-idmapsmap-id",
    title: "GET `/events/&lt;event-id&gt;/maps/&lt;map-id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;/maps/&lt;map-id&gt;`  Same as above, but returning only one map.  "
});

documentTitles["api.html#points-of-interest"] = "Points of Interest";
index.add({
    url: "api.html#points-of-interest",
    title: "Points of Interest",
    body: "## Points of Interest  Represents a single point of interest on a map. Each POI belongs to a map object.   "
});

documentTitles["api.html#get-eventsevent-idpois"] = "GET `/events/&lt;event-id&gt;/pois`";
index.add({
    url: "api.html#get-eventsevent-idpois",
    title: "GET `/events/&lt;event-id&gt;/pois`",
    body: "### GET `/events/&lt;event-id&gt;/pois`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;poi-1-map-1\&quot;, 		\&quot;event\&quot;: \&quot;rp13\&quot;,	 		\&quot;type\&quot;: \&quot;poi\&quot;,			 		\&quot;positions\&quot;: [{\&quot;map\&quot;: \&quot;level4\&quot;, 					   \&quot;x\&quot;: 3520.0, \&quot;y\&quot;: 2107.0}], 		\&quot;category\&quot;: \&quot;session-location\&quot;, 		\&quot;location\&quot;: { 			\&quot;id\&quot;: \&quot;location-1\&quot;,  			\&quot;label_de\&quot;: \&quot;Sendezentrum\&quot;,  			\&quot;label_en\&quot;: \&quot;Broadcast Center\&quot; 		}, 		\&quot;label_de\&quot;: \&quot;Sendezentrum\&quot;, 		\&quot;label_en\&quot;: \&quot;Broadcast Center\&quot;,		 		\&quot;description_de\&quot;: \&quot;Das Sendezentrum ist ein Projekt des Kombinats für Angewandte Radiotheorie. Konkret besteht das Kernteam aus Tim Pritlove (Metaebene), Claudia Krell und Ralf Stockmann (beide Wikigeeks).\&quot;, 		\&quot;description_en\&quot;: \&quot;The broadcast center…\&quot;,				 		\&quot;links\&quot;: [ 			{             	\&quot;title\&quot;: \&quot;Das Sendezentrum\&quot;, 				\&quot;url\&quot;: \&quot;http://das-sendezentrum.de\&quot;, 				\&quot;type\&quot;: \&quot;other\&quot; 			} 		] 		\&quot;hidden\&quot;: false, 		\&quot;priority\&quot;: 100, 		\&quot;beacons\&quot;: [{\&quot;uuid\&quot;: \&quot;55C1DAB7-9430-450C-B94C-DE174D202B8B\&quot;, 					 \&quot;major\&quot;: 23, 					 \&quot;minor\&quot;: 42}] 	}, //... ] ````  - `id`: (Required) Identifier of the POI. Uniq per event. - `event`: (Required) Identifier of the event this POI belongs to - `type`: (Required) Always `poi` - `positions`: (Required) Identifier of the maps this POI belongs to and where it is on these maps. An array of dicts with the keys: 	- `map`: (Required) Identifier of the map. **Note:** A map identifier may only occur once in the `positions` property (aka a POI may only be placed on a map once) 	- `x` and `y` (Required) Position of this POI on the map. These are pixel coordinates in the coordinate system of the `map`.  	  The coorinates are pixels on the original size of the map (`tiles.size.width` and `tiles.size.height` properties).  	  The origin of the coordinate system is located on the *bottom left*.  - `category`: (Required) Category of the POI.  Pick one: 		- `session-location` - A typical session location (Auditorium, lecutre hall, etc.) 		- `workshop-location` - A workshop area  		- `service` - Cash desk, info point, etc. 		- `safety` 		- `community` - Gathering spots, etc. 		- `food` 		- `entertainment` 		- `organisation` 		- `restroom` 		- `elevator` 		- `escalator` 		- `shopping` 		- `other`  - `location`: (Optional) Object with identifiying the `location` this POI belongs to if it represents a location sessions take place at.  	- `id` (Required) Identifier of the location 	- `label_de`, `label_en` (Required in at leat one language) Label - `label_en`, `label_de`, etc: (Required in at least on language) Label of the POI in the language specified by the suffix - `description_en`, `description_de`, etc: (Optional) more exhaustive description of the point of interest - `links`: (Required, but can be empty) A list of link objects related to this POI. E.g. the website of the porject, a link to the menu, etc.  	- `url` (Required) URL  	- `title` (Optional) Title of the link 	- `type` (Required): Link type, see Session or Speaker above - `hidden`: (Optional) If not present should be assumed `false`, if `true` identifies a POI that should not be shown in UI (e.g. only for beacon positioning), might be ignored by the client if deemed appropriate. - `priority`: (Optional) If not present should be assumed `0`. Can be used to identify the relative priority of this POI to others. Use full e.g. if clustering is needed or filtering needs to be performed for performance reasons on the client. - `beacons`: (Optional) An array of maps, each representing a Bluetooth 4.0 LE beacon (aka [iBeacon](https://en.wikipedia.org/wiki/IBeacon)) marking this POI.  			 A beacon has `uuid`, `major` and `minor` ID, where UUID might be the same for the whole conference or even beyond, so only the three properties in combination identifiy a uniq beacon. All three are required.   			 Note: Only beacons whose presence identififies this POI should be here, not merely beacons who are close by.       "
});

documentTitles["api.html#get-eventsevent-idpoispoi-id"] = "GET `/events/&lt;event-id&gt;/pois/&lt;poi-id&gt;`";
index.add({
    url: "api.html#get-eventsevent-idpoispoi-id",
    title: "GET `/events/&lt;event-id&gt;/pois/&lt;poi-id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;/pois/&lt;poi-id&gt;`  "
});

documentTitles["api.html#days"] = "Days";
index.add({
    url: "api.html#days",
    title: "Days",
    body: "## Days  Days group several session by a slice of time, usually one day.  __Note:__ The `date` property is a calendar date (aka symbolic date) not a point in time. Therefore it is interpreted in the timezone of the conference.  "
});

documentTitles["api.html#get-eventsevent-iddays"] = "GET `/events/&lt;event-id&gt;/days`";
index.add({
    url: "api.html#get-eventsevent-iddays",
    title: "GET `/events/&lt;event-id&gt;/days`",
    body: "### GET `/events/&lt;event-id&gt;/days`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;1\&quot;, 		\&quot;event\&quot;: \&quot;rp13\&quot;, 		\&quot;type\&quot;: \&quot;day\&quot;, 		\&quot;label_de\&quot;: \&quot;6. Mai\&quot;, 		\&quot;label_en\&quot;: \&quot;6. May\&quot;, 		\&quot;date\&quot;: \&quot;2014-05-06\&quot;, 		\&quot;last_modified\&quot;: 1393611456.99 	},{ 		\&quot;id\&quot;: \&quot;2\&quot;, 		\&quot;event\&quot;: \&quot;rp13\&quot;, 		\&quot;type\&quot;: \&quot;day\&quot;, 		\&quot;label_de\&quot;: \&quot;7. Mai\&quot;, 		\&quot;label_en\&quot;: \&quot;7. May\&quot;, 		\&quot;date\&quot;: \&quot;2014-05-07\&quot;, 		\&quot;last_modified\&quot;: 1393611456.99 	} //... ] ````  "
});

documentTitles["api.html#get-eventsevent-iddaysday-id"] = "GET `/events/&lt;event-id&gt;/days/&lt;day-id&gt;`";
index.add({
    url: "api.html#get-eventsevent-iddaysday-id",
    title: "GET `/events/&lt;event-id&gt;/days/&lt;day-id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;/days/&lt;day-id&gt;`  *single object as above*  "
});

documentTitles["api.html#formats"] = "Formats";
index.add({
    url: "api.html#formats",
    title: "Formats",
    body: "## Formats  Formats indicate the practical execution of a session, like talk, discussion, workshop etc.  "
});

documentTitles["api.html#get-eventsevent-idformats"] = "GET `/events/&lt;event-id&gt;/formats`";
index.add({
    url: "api.html#get-eventsevent-idformats",
    title: "GET `/events/&lt;event-id&gt;/formats`",
    body: "### GET `/events/&lt;event-id&gt;/formats`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;talk\&quot;, 		\&quot;label_de\&quot;: \&quot;Vortrag\&quot;, 		\&quot;label_en\&quot;: \&quot;Talk\&quot;, 		\&quot;last_modified\&quot;: 1393611456.99 	},{ 		\&quot;id\&quot;: \&quot;discussion\&quot;, 		\&quot;label_de\&quot;: \&quot;Diskussion\&quot;, 		\&quot;label_en\&quot;: \&quot;Discussion\&quot;, 		\&quot;last_modified\&quot;: 1393611456.99 	},{ 		\&quot;id\&quot;: \&quot;workshop\&quot;, 		\&quot;label_de\&quot;: \&quot;Workshop\&quot;, 		\&quot;label_en\&quot;: \&quot;Workshop\&quot;, 		\&quot;last_modified\&quot;: 1393611456.99 	} //... ] ````  "
});

documentTitles["api.html#get-eventsevent-idformatsformat-id"] = "GET `/events/&lt;event-id&gt;/formats/&lt;format-id&gt;`";
index.add({
    url: "api.html#get-eventsevent-idformatsformat-id",
    title: "GET `/events/&lt;event-id&gt;/formats/&lt;format-id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;/formats/&lt;format-id&gt;`  *single object as above*  "
});

documentTitles["api.html#levels"] = "Levels";
index.add({
    url: "api.html#levels",
    title: "Levels",
    body: "## Levels  Levels indivate the amount of preexisting knowledge expected from the respective audience  "
});

documentTitles["api.html#get-eventsevent-idlevels"] = "GET `/events/&lt;event-id&gt;/levels`";
index.add({
    url: "api.html#get-eventsevent-idlevels",
    title: "GET `/events/&lt;event-id&gt;/levels`",
    body: "### GET `/events/&lt;event-id&gt;/levels`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;beginner\&quot;, 		\&quot;label_de\&quot;: \&quot;Anfängerinnen\&quot;, 		\&quot;label_en\&quot;: \&quot;Beginner\&quot;, 		\&quot;last_modified\&quot;: 1393611456.99 	},{ 		\&quot;id\&quot;: \&quot;intermediate\&quot;, 		\&quot;label_de\&quot;: \&quot;Fortgeschrittene\&quot;, 		\&quot;label_en\&quot;: \&quot;Intermediate\&quot;, 		\&quot;last_modified\&quot;: 1393611456.99 	},{ 		\&quot;id\&quot;: \&quot;advanced\&quot;, 		\&quot;label_de\&quot;: \&quot;Expertinnen\&quot;, 		\&quot;label_en\&quot;: \&quot;Experts\&quot;, 		\&quot;last_modified\&quot;: 1393611456.99 	} //... ] ````  "
});

documentTitles["api.html#get-eventsevent-idlevelslevel-id"] = "GET `/events/&lt;event-id&gt;/levels/&lt;level-id&gt;`";
index.add({
    url: "api.html#get-eventsevent-idlevelslevel-id",
    title: "GET `/events/&lt;event-id&gt;/levels/&lt;level-id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;/levels/&lt;level-id&gt;`  *single object as above*  "
});

documentTitles["api.html#languages"] = "Languages";
index.add({
    url: "api.html#languages",
    title: "Languages",
    body: "## Languages  "
});

documentTitles["api.html#get-eventsevent-idlanguages"] = "GET `/events/&lt;event-id&gt;/languages`";
index.add({
    url: "api.html#get-eventsevent-idlanguages",
    title: "GET `/events/&lt;event-id&gt;/languages`",
    body: "### GET `/events/&lt;event-id&gt;/languages`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;de\&quot;, 		\&quot;label_de\&quot;: \&quot;Deutsch\&quot;, 		\&quot;label_en\&quot;: \&quot;German\&quot;, 		\&quot;last_modified\&quot;: 1393611456.99 	},{ 		\&quot;id\&quot;: \&quot;en\&quot;, 		\&quot;label_de\&quot;: \&quot;Englisch\&quot;, 		\&quot;label_en\&quot;: \&quot;English\&quot;, 		\&quot;last_modified\&quot;: 1393611456.99 	} //... ] ````  "
});

documentTitles["api.html#get-eventsevent-idlanguageslanguage-id"] = "GET `/events/&lt;event-id&gt;/languages/&lt;language-id&gt;`";
index.add({
    url: "api.html#get-eventsevent-idlanguageslanguage-id",
    title: "GET `/events/&lt;event-id&gt;/languages/&lt;language-id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;/languages/&lt;language-id&gt;`  *single object as above*  "
});


