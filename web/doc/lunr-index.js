
var index = lunr(function () {
    this.field('body');
    this.ref('url');
});

var documentTitles = {};



documentTitles["api.html#basics"] = "Basics";
index.add({
    url: "api.html#basics",
    title: "Basics",
    body: "# Basics  "
});

documentTitles["api.html#requests-and-responses"] = "Requests and Responses";
index.add({
    url: "api.html#requests-and-responses",
    title: "Requests and Responses",
    body: "## Requests and Responses  The API is RESTful, so all you have to do is to call a specified URL and you will get a JSON result.  For example: If you call &lt;http://data.re-publica.de/api/events&gt; you should receive something like this:  ``` javascript { 	\&quot;ok\&quot;: true, 	\&quot;count\&quot;: 1, 	\&quot;data\&quot;: [{ 		\&quot;type\&quot;: \&quot;event\&quot;, 		\&quot;id\&quot;: \&quot;rp13\&quot;, 		\&quot;label\&quot;: \&quot;re:publica 13\&quot;, 		\&quot;title\&quot;: \&quot;IN/SIDE/OUT\&quot;, 		\&quot;date\&quot;: [ \&quot;2013-05-06\&quot;, \&quot;2013-05-08\&quot; ], 		\&quot;locations\&quot;: [{ 			\&quot;label\&quot;: \&quot;Station Berlin\&quot;, 			\&quot;coords\&quot;: [ 52.49814, 13.374538 ] 		}], 		\&quot;url\&quot;: \&quot;http://13.re-publica.de/\&quot; 	}] } ```  The response is always an object with the properties:  * ```ok``` is true or false and shows, whether the request was successful. If it was successful also the following properties will be set: * ```count``` shows the number of total results * ```data``` is an array with the results  "
});

documentTitles["api.html#single-objects-and-lists"] = "Single Objects and Lists";
index.add({
    url: "api.html#single-objects-and-lists",
    title: "Single Objects and Lists",
    body: "## Single Objects and Lists  If you are requesting for a single, existing object (e.g. by an object id) ```count``` will always be 1 and ```data``` will always be an array with a single object.  If you are requesting for a list of objects (e.g. all sessions) ```count``` will always be the total number of known objects (e.g. sessions) and ```data``` will always be an array with the results. But when using lists you also can use the special GET parameters ```start``` and ```count``` for pagination.  E.g. &lt;http://data.re-publica.de/api/rp13/sessions&gt; will list all sessions: ``` javascript { 	\&quot;ok\&quot;: true, 	\&quot;count\&quot;: 347, 	\&quot;data\&quot;: [ 		// ... list of 347 session objects 	] } ``` The same request with pagination [...sessions?start=100&amp;count=20](http://data.re-publica.de/api/rp13/sessions?start=100&amp;count=20) will list only the requested 20 sessions - starting with the 100th: ``` javascript { 	\&quot;ok\&quot;: true, 	\&quot;count\&quot;: 347, // count will still show the number of all sessions 	\&quot;data\&quot;: [ 		// ... list of the requested 20 session objects 	] } ```  "
});

documentTitles["api.html#reference"] = "Reference";
index.add({
    url: "api.html#reference",
    title: "Reference",
    body: "# Reference  In the following reference examples only the content of the ```data``` property will be shown.  "
});

documentTitles["api.html#events"] = "Events";
index.add({
    url: "api.html#events",
    title: "Events",
    body: "## Events  An event is one chronologically delimited total of sessions. Like a yearly conference.  "
});

documentTitles["api.html#get-events"] = "GET `/events`";
index.add({
    url: "api.html#get-events",
    title: "GET `/events`",
    body: "### GET `/events`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;rp14\&quot;, 	\&quot;title\&quot;: \&quot;re:publica 14\&quot;, 	\&quot;slogan\&quot;: \&quot;into the wild\&quot;, 	\&quot;begin\&quot;: \&quot;2014-05-06\&quot;, 	\&quot;end\&quot;: \&quot;2014-05-08\&quot;, 	\&quot;locations\&quot;: [{ 		\&quot;label\&quot;: \&quot;Station Berlin\&quot;, 		\&quot;coords\&quot;: [52.49814,13.374538] // lat, lon 	}], 	\&quot;url\&quot;: \&quot;http://14.re-publica.de/\&quot; },{ 	\&quot;id\&quot;: \&quot;rp13\&quot;, 	\&quot;title\&quot;: \&quot;re:publica 13\&quot;, 	\&quot;slogan\&quot;: \&quot;IN/SIDE/OUT\&quot;, 	\&quot;begin\&quot;: \&quot;2013-05-06\&quot;, 	\&quot;end\&quot;: \&quot;2013-05-08\&quot;, 	\&quot;locations\&quot;: [{ 		\&quot;label\&quot;: \&quot;Station Berlin\&quot;, 		\&quot;coords\&quot;: [52.49814,13.374538] // lat, lon 	}], 	\&quot;url\&quot;: \&quot;http://13.re-publica.de/\&quot; }] ````  "
});

documentTitles["api.html#get-eventsevent-id"] = "GET `/events/&lt;event-id&gt;`";
index.add({
    url: "api.html#get-eventsevent-id",
    title: "GET `/events/&lt;event-id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;`  *single object, as above*  "
});

documentTitles["api.html#sessions"] = "Sessions";
index.add({
    url: "api.html#sessions",
    title: "Sessions",
    body: "## Sessions  "
});

documentTitles["api.html#get-event-idsessions"] = "GET `/&lt;event-id&gt;/sessions`";
index.add({
    url: "api.html#get-event-idsessions",
    title: "GET `/&lt;event-id&gt;/sessions`",
    body: "### GET `/&lt;event-id&gt;/sessions`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;rp14-session-1\&quot;, 	\&quot;title\&quot;: \&quot;Eröffnung\&quot;, 	\&quot;abstract\&quot;: \&quot;...\&quot;, 	\&quot;description\&quot;: \&quot;...\&quot;, 	\&quot;url\&quot;: \&quot;http://14.re-publica.de/session/1\&quot; 	\&quot;begin\&quot;: \&quot;2014-05-06T10:00:00.0Z\&quot;, // local time (CEST) 	\&quot;end\&quot;: \&quot;2014-05-06T11:00:00.0Z\&quot;, 	\&quot;duration\&quot;: 45, // in minutes 	\&quot;day\&quot;: { 		\&quot;id\&quot;: \&quot;rp14-day-1\&quot;, \&quot;label_de\&quot;: \&quot;6. Mai\&quot;, \&quot;label_en\&quot;: \&quot;6. May\&quot;, 		\&quot;date\&quot;: \&quot;2014-05-06\&quot; 	}, 	\&quot;location\&quot;: { 		\&quot;id\&quot;: \&quot;rp14-location-stage-7\&quot;, \&quot;label_de\&quot;: \&quot;Stage 7\&quot;, \&quot;label_en\&quot;: \&quot;Stage 7\&quot; 	}, 	\&quot;track\&quot;: { 		\&quot;id\&quot;: \&quot;media\&quot;, \&quot;label_de\&quot;: \&quot;Medien\&quot;, \&quot;label_en\&quot;: \&quot;Media\&quot; 	}, 	\&quot;format\&quot;: { 		\&quot;id\&quot;: \&quot;talk\&quot;, \&quot;label_de\&quot;: \&quot;Vortrag\&quot;, \&quot;label_en\&quot;: \&quot;Talk\&quot; 	}, 	\&quot;level\&quot;: { 		\&quot;id\&quot;: \&quot;beginner\&quot;, \&quot;label_de\&quot;: \&quot;Beginner\&quot;, \&quot;label_en\&quot;: \&quot;Beginner\&quot; 	}, 	\&quot;lang\&quot;: { 		\&quot;id\&quot;: \&quot;de\&quot;, \&quot;label_de\&quot;: \&quot;Deutsch\&quot;, \&quot;label_en\&quot;: \&quot;German\&quot; 	}, 	\&quot;speakers\&quot;: [ 		{ \&quot;id\&quot;: \&quot;rp13-speaker-81\&quot;, \&quot;name\&quot;: \&quot;Sascha Lobo\&quot; } 		//... 	], 	\&quot;enclosures\&quot;: [], 	\&quot;links\&quot;: [ 		{ 			\&quot;thumbnail\&quot;: \&quot;http://i.ytimg.com/vi/18xQRtdrJhQ/mqdefault.jpg\&quot;, 			\&quot;title\&quot;: \&quot;re:publica 2014: ...\&quot;, 			\&quot;url\&quot;: \&quot;http://youtube.com/watch?v=18xQRtdrJhQ\&quot;, 			\&quot;service\&quot;: \&quot;youtube\&quot;, 			\&quot;type\&quot;: \&quot;recording\&quot; 		} 	], 	\&quot;last_modified\&quot;: \&quot;2013-12-04T15:50:00.0Z\&quot; }] ```` "
});

documentTitles["api.html#enclosures"] = "Enclosures";
index.add({
    url: "api.html#enclosures",
    title: "Enclosures",
    body: "#### Enclosures  "
});

documentTitles["api.html#links"] = "Links";
index.add({
    url: "api.html#links",
    title: "Links",
    body: "#### Links    "
});

documentTitles["api.html#get-event-idsessionssession-id"] = "GET `/&lt;event-id&gt;/sessions/&lt;session-id&gt;`";
index.add({
    url: "api.html#get-event-idsessionssession-id",
    title: "GET `/&lt;event-id&gt;/sessions/&lt;session-id&gt;`",
    body: "### GET `/&lt;event-id&gt;/sessions/&lt;session-id&gt;`  *single object, as above*  "
});

documentTitles["api.html#speakers"] = "Speakers";
index.add({
    url: "api.html#speakers",
    title: "Speakers",
    body: "## Speakers  Speakers are people performing sessions.  "
});

documentTitles["api.html#get-event-idspeakers"] = "GET `/&lt;event-id&gt;/speakers`";
index.add({
    url: "api.html#get-event-idspeakers",
    title: "GET `/&lt;event-id&gt;/speakers`",
    body: "### GET `/&lt;event-id&gt;/speakers`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;rp13-session-1\&quot;, 		\&quot;event\&quot;: \&quot;rp13\&quot;, 		\&quot;type\&quot;: \&quot;speaker\&quot;, 		\&quot;name\&quot;: \&quot;Johnny Haeusler\&quot;, 		\&quot;photo\&quot;: \&quot;http://13.re-publica.de/sites/13.re-publica.de/files/pictures/picture-48.png\&quot;, 		\&quot;organization\&quot;: \&quot;Spreeblick\&quot;, 		\&quot;position\&quot;: \&quot;\&quot;, 		\&quot;biography\&quot;: \&quot;Born in Berlin in 1964, Johnny Haeusler founded the award-winning weblog Spreeblick in 2002. He is also a radio DJ and a member of post-punkrock band Plan B, which is touring again since 2012.....\&quot;, 		\&quot;sessions\&quot;: [ 			{ 				\&quot;id\&quot;: \&quot;rp13-session-5117\&quot;, 				\&quot;title\&quot;: \&quot;Comic Misunderstanding – A conversation with Graham Linehan (IT Crowd)\&quot; 			}, 			{ 				\&quot;id\&quot;: \&quot;rp13-session-5866\&quot;, 				\&quot;title\&quot;: \&quot;YouTube macht die Stars von heute\&quot; 			} //... 		] 	} //... ] ````  "
});

documentTitles["api.html#get-event-idspeakersid"] = "GET `/&lt;event-id&gt;/speakers/&lt;id&gt;`";
index.add({
    url: "api.html#get-event-idspeakersid",
    title: "GET `/&lt;event-id&gt;/speakers/&lt;id&gt;`",
    body: "### GET `/&lt;event-id&gt;/speakers/&lt;id&gt;`  *single object, as above*  "
});

documentTitles["api.html#tracks"] = "Tracks";
index.add({
    url: "api.html#tracks",
    title: "Tracks",
    body: "## Tracks  Tracks are topic-based collections of sessions  "
});

documentTitles["api.html#get-event-idtracks"] = "GET `/&lt;event-id&gt;/tracks`";
index.add({
    url: "api.html#get-event-idtracks",
    title: "GET `/&lt;event-id&gt;/tracks`",
    body: "### GET `/&lt;event-id&gt;/tracks`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;research-education\&quot;, 		\&quot;label_de\&quot;: \&quot;Forschung &amp; Bildung\&quot;, 		\&quot;label_en\&quot;: \&quot;Research &amp; Education\&quot; 	},{ 		\&quot;id\&quot;: \&quot;politics-society\&quot;, 		\&quot;label_de\&quot;: \&quot;Politik &amp; Gesellschaft\&quot;, 		\&quot;label_en\&quot;: \&quot;Politics &amp; Society\&quot; 	} //... ] ````  "
});

documentTitles["api.html#get-event-idtrackstrack-id"] = "GET `/&lt;event-id&gt;/tracks/&lt;track-id&gt;`";
index.add({
    url: "api.html#get-event-idtrackstrack-id",
    title: "GET `/&lt;event-id&gt;/tracks/&lt;track-id&gt;`",
    body: "### GET `/&lt;event-id&gt;/tracks/&lt;track-id&gt;`  *single object, as above*  "
});

documentTitles["api.html#locations"] = "Locations";
index.add({
    url: "api.html#locations",
    title: "Locations",
    body: "## Locations  Locations are specified spaces on the compound and may be stages.  "
});

documentTitles["api.html#get-event-idlocations"] = "GET `/&lt;event-id&gt;/locations`";
index.add({
    url: "api.html#get-event-idlocations",
    title: "GET `/&lt;event-id&gt;/locations`",
    body: "### GET `/&lt;event-id&gt;/locations`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;stage1\&quot;, // location_id 		\&quot;label_de\&quot;: \&quot;Stage 1\&quot;, 		\&quot;label_en\&quot;: \&quot;Stage 1\&quot;, 		\&quot;is_stage\&quot;: true, // is this a stage 		\&quot;floor\&quot;: 0 // floor in the building, 0 is ground 	}, //... ] ````  "
});

documentTitles["api.html#get-event-idlocationslocation-id"] = "GET `/&lt;event-id&gt;/locations/&lt;location-id&gt;`";
index.add({
    url: "api.html#get-event-idlocationslocation-id",
    title: "GET `/&lt;event-id&gt;/locations/&lt;location-id&gt;`",
    body: "### GET `/&lt;event-id&gt;/locations/&lt;location-id&gt;`  *single object as above*  "
});

documentTitles["api.html#days"] = "Days";
index.add({
    url: "api.html#days",
    title: "Days",
    body: "## Days  Days enframe several session by a slice of time, usually one day.  "
});

documentTitles["api.html#get-event-iddays"] = "GET `/&lt;event-id&gt;/days`";
index.add({
    url: "api.html#get-event-iddays",
    title: "GET `/&lt;event-id&gt;/days`",
    body: "### GET `/&lt;event-id&gt;/days`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;1\&quot;, 		\&quot;event\&quot;: \&quot;rp13\&quot;, 		\&quot;type\&quot;: \&quot;day\&quot;, 		\&quot;label_de\&quot;: \&quot;6. Mai\&quot;, 		\&quot;label_en\&quot;: \&quot;6. May\&quot;, 		\&quot;date\&quot;: \&quot;2014-05-06\&quot; 	},{ 		\&quot;id\&quot;: \&quot;2\&quot;, 		\&quot;event\&quot;: \&quot;rp13\&quot;, 		\&quot;type\&quot;: \&quot;day\&quot;, 		\&quot;label_de\&quot;: \&quot;7. Mai\&quot;, 		\&quot;label_en\&quot;: \&quot;7. May\&quot;, 		\&quot;date\&quot;: \&quot;2014-05-07\&quot; 	} //... ] ````  "
});

documentTitles["api.html#get-event-iddaysday-id"] = "GET `/&lt;event-id&gt;/days/&lt;day-id&gt;`";
index.add({
    url: "api.html#get-event-iddaysday-id",
    title: "GET `/&lt;event-id&gt;/days/&lt;day-id&gt;`",
    body: "### GET `/&lt;event-id&gt;/days/&lt;day-id&gt;`  *single object as above*  "
});

documentTitles["api.html#formats"] = "Formats";
index.add({
    url: "api.html#formats",
    title: "Formats",
    body: "## Formats  Formats indicate the practical execution of a session, like talk, discussion, workshop etc.  "
});

documentTitles["api.html#get-event-idformats"] = "GET `/&lt;event-id&gt;/formats`";
index.add({
    url: "api.html#get-event-idformats",
    title: "GET `/&lt;event-id&gt;/formats`",
    body: "### GET `/&lt;event-id&gt;/formats`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;talk\&quot;, 		\&quot;label_de\&quot;: \&quot;Vortrag\&quot;, 		\&quot;label_en\&quot;: \&quot;Talk\&quot; 	},{ 		\&quot;id\&quot;: \&quot;discussion\&quot;, 		\&quot;label_de\&quot;: \&quot;Diskussion\&quot;, 		\&quot;label_en\&quot;: \&quot;Discussion\&quot; 	},{ 		\&quot;id\&quot;: \&quot;workshop\&quot;, 		\&quot;label_de\&quot;: \&quot;Workshop\&quot;, 		\&quot;label_en\&quot;: \&quot;Workshop\&quot; 	} //... ] ````  "
});

documentTitles["api.html#get-event-idformatsformat-id"] = "GET `/&lt;event-id&gt;/formats/&lt;format-id&gt;`";
index.add({
    url: "api.html#get-event-idformatsformat-id",
    title: "GET `/&lt;event-id&gt;/formats/&lt;format-id&gt;`",
    body: "### GET `/&lt;event-id&gt;/formats/&lt;format-id&gt;`  *single object as above*  "
});

documentTitles["api.html#levels"] = "Levels";
index.add({
    url: "api.html#levels",
    title: "Levels",
    body: "## Levels  Levels indivate the amount of preexisting knowledge expected from the respective audience  "
});

documentTitles["api.html#get-event-idlevels"] = "GET `/&lt;event-id&gt;/levels`";
index.add({
    url: "api.html#get-event-idlevels",
    title: "GET `/&lt;event-id&gt;/levels`",
    body: "### GET `/&lt;event-id&gt;/levels`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;beginner\&quot;, 		\&quot;label_de\&quot;: \&quot;Anfängerinnen\&quot;, 		\&quot;label_en\&quot;: \&quot;Beginner\&quot; 	},{ 		\&quot;id\&quot;: \&quot;intermediate\&quot;, 		\&quot;label_de\&quot;: \&quot;Fortgeschrittene\&quot;, 		\&quot;label_en\&quot;: \&quot;Intermediate\&quot; 	},{ 		\&quot;id\&quot;: \&quot;advanced\&quot;, 		\&quot;label_de\&quot;: \&quot;Expertinnen\&quot;, 		\&quot;label_en\&quot;: \&quot;Experts\&quot; 	} //... ] ````  "
});

documentTitles["api.html#get-event-idlevelslevel-id"] = "GET `/&lt;event-id&gt;/levels/&lt;level-id&gt;`";
index.add({
    url: "api.html#get-event-idlevelslevel-id",
    title: "GET `/&lt;event-id&gt;/levels/&lt;level-id&gt;`",
    body: "### GET `/&lt;event-id&gt;/levels/&lt;level-id&gt;`  *single object as above*  "
});

documentTitles["api.html#languages"] = "Languages";
index.add({
    url: "api.html#languages",
    title: "Languages",
    body: "## Languages  "
});

documentTitles["api.html#get-event-idlanguages"] = "GET `/&lt;event-id&gt;/languages`";
index.add({
    url: "api.html#get-event-idlanguages",
    title: "GET `/&lt;event-id&gt;/languages`",
    body: "### GET `/&lt;event-id&gt;/languages`  ```` javascript [ 	{ 		\&quot;id\&quot;: \&quot;de\&quot;, 		\&quot;label_de\&quot;: \&quot;Deutsch\&quot;, 		\&quot;label_en\&quot;: \&quot;German\&quot; 	},{ 		\&quot;id\&quot;: \&quot;en\&quot;, 		\&quot;label_de\&quot;: \&quot;Englisch\&quot;, 		\&quot;label_en\&quot;: \&quot;English\&quot; 	} //... ] ````  "
});

documentTitles["api.html#get-event-idlanguageslanguage-id"] = "GET `/&lt;event-id&gt;/languages/&lt;language-id&gt;`";
index.add({
    url: "api.html#get-event-idlanguageslanguage-id",
    title: "GET `/&lt;event-id&gt;/languages/&lt;language-id&gt;`",
    body: "### GET `/&lt;event-id&gt;/languages/&lt;language-id&gt;`  *single object as above*  "
});


