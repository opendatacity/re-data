
var index = lunr(function () {
    this.field('body');
    this.ref('url');
});

var documentTitles = {};



documentTitles["api.html#api"] = "API";
index.add({
    url: "api.html#api",
    title: "API",
    body: "# API  "
});

documentTitles["api.html#authentication"] = "Authentication";
index.add({
    url: "api.html#authentication",
    title: "Authentication",
    body: "## Authentication  *not specified yet*  "
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
    body: "### GET `/events`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;rp14\&quot;, 	\&quot;label\&quot;: \&quot;re:publica 14\&quot;, 	\&quot;title\&quot;: \&quot;into the wild\&quot;, 	\&quot;date\&quot;: [\&quot;2014-05-06\&quot;,\&quot;2014-05-08\&quot;], 	\&quot;locations\&quot;: [{ 		\&quot;label\&quot;: \&quot;Station Berlin\&quot;, 		\&quot;coords\&quot;: [52.49814,13.374538] // lat, lon 	}], 	\&quot;url\&quot;: \&quot;http://14.re-publica.de/\&quot; },{ 	\&quot;id\&quot;: \&quot;rp13\&quot;, 	\&quot;label\&quot;: \&quot;re:publica 13\&quot;, 	\&quot;title\&quot;: \&quot;IN/SIDE/OUT\&quot;, 	\&quot;date\&quot;: [\&quot;2013-05-06\&quot;,\&quot;2013-05-08\&quot;], 	\&quot;locations\&quot;: [{ 		\&quot;label\&quot;: \&quot;Station Berlin\&quot;, 		\&quot;coords\&quot;: [52.49814,13.374538] // lat, lon 	}], 	\&quot;url\&quot;: \&quot;http://13.re-publica.de/\&quot; }] ````  "
});

documentTitles["api.html#get-eventsevent-id"] = "GET `/events/&lt;event-id&gt;`";
index.add({
    url: "api.html#get-eventsevent-id",
    title: "GET `/events/&lt;event-id&gt;`",
    body: "### GET `/events/&lt;event-id&gt;`  ```` javascript { 	\&quot;id\&quot;: \&quot;rp14\&quot;, 	\&quot;label\&quot;: \&quot;re:publica 14\&quot;, 	\&quot;title\&quot;: \&quot;into the wild\&quot;, 	\&quot;date\&quot;: [\&quot;2014-05-06\&quot;,\&quot;2014-05-08\&quot;], 	\&quot;locations\&quot;: [{ 		\&quot;label\&quot;: \&quot;Station Berlin\&quot;, 		\&quot;coords\&quot;: [52.49814,13.374538] // lat, lon 	}], 	\&quot;url\&quot;: \&quot;http://14.re-publica.de/\&quot; } ````  "
});

documentTitles["api.html#sessions"] = "Sessions";
index.add({
    url: "api.html#sessions",
    title: "Sessions",
    body: "## Sessions  "
});

documentTitles["api.html#get-event-idsessions"] = "GET `/&lt;event-id&gt;/sessions`";
index.add({
    url: "api.html#get-event-idsessions",
    title: "GET `/&lt;event-id&gt;/sessions`",
    body: "### GET `/&lt;event-id&gt;/sessions`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;1\&quot;, 	\&quot;status\&quot;: \&quot;upcoming\&quot;, // upcoming | current | over 	\&quot;title\&quot;: \&quot;Eröffnung\&quot;, 	\&quot;photo\&quot;: \&quot;http://assets.re-publica.de/bla/bla.jpeg\&quot;, 	\&quot;abstract\&quot;: \&quot;...\&quot;, 	\&quot;description\&quot;: \&quot;...\&quot;, 	\&quot;url\&quot;: \&quot;http://14.re-publica.de/session/1\&quot; 	\&quot;begin\&quot;: \&quot;2014-05-06T10:00:00.0Z\&quot;, 	\&quot;end\&quot;: \&quot;2014-05-06T11:00:00.0Z\&quot;, 	\&quot;duration\&quot;: 45, 	\&quot;day\&quot;: { 		\&quot;id\&quot;: \&quot;1\&quot;, 		\&quot;label\&quot;: \&quot;6. Mai\&quot; 	}, 	\&quot;area\&quot;: { 		\&quot;id\&quot;: \&quot;1\&quot;, 		\&quot;label\&quot;: \&quot;Stage 1\&quot; 	}, 	\&quot;track\&quot;: { 		\&quot;id\&quot;: 1, 		\&quot;label\&quot;: \&quot;re:publica\&quot; 	}, 	\&quot;format\&quot;: { 		\&quot;id\&quot;: \&quot;talk\&quot;, 		\&quot;label\&quot;: \&quot;Vortrag\&quot; 	}, 	\&quot;level\&quot;: { 		\&quot;id\&quot;: \&quot;beginner\&quot;, 		\&quot;label\&quot;: \&quot;Anfängerinnen\&quot; 	}, 	\&quot;lang\&quot;: { 		\&quot;id\&quot;: \&quot;de\&quot;, 		\&quot;label\&quot;: \&quot;Deutsch\&quot; 	}, 	\&quot;speakers\&quot;: [{ 		\&quot;id\&quot;: \&quot;1\&quot;, 		\&quot;name\&quot;: \&quot;Andreas Gebhard\&quot;, 		\&quot;photo\&quot;: \&quot;http://assets.re-publica.de/bla/fasel.jpeg\&quot; 	},{ 		\&quot;id\&quot;: \&quot;2\&quot;, 		\&quot;name\&quot;: \&quot;Markus Beckedahl\&quot;, 		\&quot;photo\&quot;: \&quot;http://assets.re-publica.de/bla/blub.jpeg\&quot; 	}], 	\&quot;devices\&quot;: 232, 	\&quot;users\&quot;: 23, 	\&quot;favorited\&quot;: 100, 	\&quot;revision\&quot;: 12, // incremental revision counter 	\&quot;last-modified\&quot;: \&quot;2013-12-04T15:50:00.0Z\&quot;	 }] ````  "
});

documentTitles["api.html#get-event-idsessionssession-id"] = "GET `/&lt;event-id&gt;/sessions/$session_id`";
index.add({
    url: "api.html#get-event-idsessionssession-id",
    title: "GET `/&lt;event-id&gt;/sessions/$session_id`",
    body: "### GET `/&lt;event-id&gt;/sessions/$session_id`  ```` javascript { 	\&quot;id\&quot;: \&quot;1\&quot;, 	\&quot;title\&quot;: \&quot;Eröffnung\&quot;, 	\&quot;photo\&quot;: \&quot;http://assets.re-publica.de/bla/bla.jpeg\&quot;, 	\&quot;abstract\&quot;: \&quot;...\&quot;, 	\&quot;description\&quot;: \&quot;...\&quot;, 	\&quot;url\&quot;: \&quot;http://14.re-publica.de/session/1\&quot; 	\&quot;begin\&quot;: \&quot;2014-05-06T10:00:00.0Z\&quot;, 	\&quot;end\&quot;: \&quot;2014-05-06T11:00:00.0Z\&quot;, 	\&quot;duration\&quot;: 45, 	\&quot;day\&quot;: { 		\&quot;id\&quot;: \&quot;1\&quot;, 		\&quot;label\&quot;: \&quot;6. Mai\&quot; 	}, 	\&quot;area\&quot;: { 		\&quot;id\&quot;: \&quot;1\&quot;, 		\&quot;label\&quot;: \&quot;Stage 1\&quot; 	}, 	\&quot;track\&quot;: { 		\&quot;id\&quot;: 1, 		\&quot;label\&quot;: \&quot;re:publica\&quot; 	}, 	\&quot;format\&quot;: { 		\&quot;id\&quot;: \&quot;talk\&quot;, 		\&quot;label\&quot;: \&quot;Vortrag\&quot; 	}, 	\&quot;level\&quot;: { 		\&quot;id\&quot;: \&quot;beginner\&quot;, 		\&quot;label\&quot;: \&quot;Anfängerinnen\&quot; 	}, 	\&quot;lang\&quot;: { 		\&quot;id\&quot;: \&quot;de\&quot;, 		\&quot;label\&quot;: \&quot;Deutsch\&quot; 	}, 	\&quot;speakers\&quot;: [{ 		\&quot;id\&quot;: \&quot;1\&quot;, 		\&quot;name\&quot;: \&quot;Andreas Gebhard\&quot;, 		\&quot;photo\&quot;: \&quot;http://assets.re-publica.de/bla/fasel.jpeg\&quot; 	},{ 		\&quot;id\&quot;: \&quot;2\&quot;, 		\&quot;name\&quot;: \&quot;Markus Beckedahl\&quot;, 		\&quot;photo\&quot;: \&quot;http://assets.re-publica.de/bla/blub.jpeg\&quot; 	}], 	\&quot;favorited\&quot;: 100, 	\&quot;devices\&quot;: 232, 	\&quot;users\&quot;: 23, 	\&quot;faved-by\&quot;: [{ 		\&quot;id\&quot;: \&quot;1\&quot;, 		\&quot;name\&quot;: \&quot;yetzt\&quot;, 		\&quot;friend\&quot;: true, 		\&quot;photo\&quot;: \&quot;http://assets.re-publica.de/bla/fnord.png\&quot; 	}], 	\&quot;revision\&quot;: 12, // incremental revision counter 	\&quot;last-modified\&quot;: \&quot;2013-12-04T15:50:00.0Z\&quot;	 } ````  "
});

documentTitles["api.html#speakers"] = "Speakers";
index.add({
    url: "api.html#speakers",
    title: "Speakers",
    body: "## Speakers  Speakers are people performing sessions.  "
});

documentTitles["api.html#get-event-idspeakers"] = "GET `/&lt;event-id&gt;/speakers`";
index.add({
    url: "api.html#get-event-idspeakers",
    title: "GET `/&lt;event-id&gt;/speakers`",
    body: "### GET `/&lt;event-id&gt;/speakers`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;144\&quot;, 	\&quot;attendee\&quot;: $attendee_id, 	\&quot;name\&quot;: \&quot;Sebastian Vollnals\&quot;, 	\&quot;nickname\&quot;: \&quot;yetzt\&quot;, 	\&quot;photo\&quot;: \&quot;http://assets.re-publica.de/pictures/picture-144.jpg\&quot;, 	\&quot;organization\&quot;: \&quot;OpenDataCity\&quot;, 	\&quot;tagline\&quot;: \&quot;whatever\&quot;, 	\&quot;description\&quot;: \&quot;poly &amp; queer hacker, feminist sidekick. wandering about in berlin and wearing pink hair.\&quot;, 	\&quot;links\&quot;: [{ 		\&quot;service\&quot;: \&quot;twitter\&quot;, 		\&quot;label\&quot;: \&quot;yetzt\&quot;, 		\&quot;url\&quot;: \&quot;https://twitter.com/yetzt\&quot; 	},{ 		\&quot;service\&quot;: \&quot;blog\&quot;, 		\&quot;label\&quot;: \&quot;blog\&quot;, 		\&quot;url\&quot;: \&quot;http://yetzt.wordpress.com/\&quot; 	},{ 		\&quot;service\&quot;: \&quot;github\&quot;, 		\&quot;label\&quot;: \&quot;yetzt\&quot;, 		\&quot;url\&quot;: \&quot;http://github.com/yetzt\&quot; 	},{ 		\&quot;service\&quot;: \&quot;adn\&quot;, 		\&quot;label\&quot;: \&quot;yetzt\&quot;, 		\&quot;url\&quot;: \&quot;https://app.net/yetzt\&quot; 	}], 	\&quot;sessions\&quot;: [$session_id, $session_id, $session_id] }] ````  "
});

documentTitles["api.html#get-event-idspeakersid"] = "GET `/&lt;event-id&gt;/speakers/&lt;id&gt;`";
index.add({
    url: "api.html#get-event-idspeakersid",
    title: "GET `/&lt;event-id&gt;/speakers/&lt;id&gt;`",
    body: "### GET `/&lt;event-id&gt;/speakers/&lt;id&gt;`  *single object, as above*  "
});

documentTitles["api.html#tracks"] = "Tracks";
index.add({
    url: "api.html#tracks",
    title: "Tracks",
    body: "## Tracks  Tracks are topic-based collections of sessions  "
});

documentTitles["api.html#get-event-idtracks"] = "GET `/&lt;event-id&gt;/tracks`";
index.add({
    url: "api.html#get-event-idtracks",
    title: "GET `/&lt;event-id&gt;/tracks`",
    body: "### GET `/&lt;event-id&gt;/tracks`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;business-innovation\&quot;, 	\&quot;label\&quot;: \&quot;Business &amp; innovation\&quot;, 	\&quot;sessions\&quot;: [$session_id,$session_id,$session_id] },{ 	\&quot;id\&quot;: \&quot;science-technology\&quot;, 	\&quot;label\&quot;: \&quot;Science &amp; Technology\&quot;, 	\&quot;sessions\&quot;: [$session_id,$session_id,$session_id]	 }] ````  "
});

documentTitles["api.html#get-trackstrack-id"] = "GET `/tracks/&lt;track-id&gt;`";
index.add({
    url: "api.html#get-trackstrack-id",
    title: "GET `/tracks/&lt;track-id&gt;`",
    body: "### GET `/tracks/&lt;track-id&gt;`  *single object, as above*  "
});

documentTitles["api.html#areas"] = "Areas";
index.add({
    url: "api.html#areas",
    title: "Areas",
    body: "## Areas  Areas are specified spaces on the compound and may be stages. Areas are used for wifi-cell-based location services.  **The `friends` value requires an authenticated api call**   "
});

documentTitles["api.html#get-event-idareas"] = "GET `/&lt;event-id&gt;/areas`";
index.add({
    url: "api.html#get-event-idareas",
    title: "GET `/&lt;event-id&gt;/areas`",
    body: "### GET `/&lt;event-id&gt;/areas`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;stage1\&quot;, // area_id 	\&quot;label\&quot;: \&quot;Stage 1\&quot;, 	\&quot;stage\&quot;: true, // is this a stage 	\&quot;current\&quot;: $session_id, // id of current session or null 	\&quot;upcoming\&quot;: [$session_id, $session_id,$session_id], 	\&quot;level\&quot;: 0, // floor in the building, 0 is ground 	\&quot;shape\&quot;: \&quot;$geojson\&quot;, 	\&quot;devices\&quot;: 100, // number of connected devices in this area 	\&quot;users\&quot;: 80, // number of users in this area 	\&quot;friends\&quot;: [$user_id, $user_id, $user_id] // friends in this area },{ 	\&quot;id\&quot;: \&quot;affenfelsen\&quot;, 	\&quot;label\&quot;: \&quot;Affenfelsen\&quot;, 	\&quot;stage\&quot;: false, 	\&quot;level\&quot;: 0, // floor in the building, 0 is ground 	\&quot;shape\&quot;: \&quot;$geojson\&quot;, 	\&quot;devices\&quot;: 500, // number of connected devices in this area 	\&quot;users\&quot;: 40, // number of users in this area 	\&quot;friends\&quot;: [$user_id, $user_id,$user_id] // friends in this area }] ````  "
});

documentTitles["api.html#get-event-idareaarea-id"] = "GET `/&lt;event-id&gt;/area/&lt;area-id&gt;`";
index.add({
    url: "api.html#get-event-idareaarea-id",
    title: "GET `/&lt;event-id&gt;/area/&lt;area-id&gt;`",
    body: "### GET `/&lt;event-id&gt;/area/&lt;area-id&gt;`  *single object as above*  "
});

documentTitles["api.html#days"] = "Days";
index.add({
    url: "api.html#days",
    title: "Days",
    body: "## Days  Days enframe several session by a slice of time, usually one day.  "
});

documentTitles["api.html#get-event-iddays"] = "GET `/&lt;event-id&gt;/days`";
index.add({
    url: "api.html#get-event-iddays",
    title: "GET `/&lt;event-id&gt;/days`",
    body: "### GET `/&lt;event-id&gt;/days`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;1\&quot;, 	\&quot;label\&quot;: \&quot;6. Mai\&quot;, 	\&quot;date\&quot;: \&quot;2014-05-06\&quot; },{ 	\&quot;id\&quot;: \&quot;2\&quot;, 	\&quot;label\&quot;: \&quot;7. Mai\&quot;, 	\&quot;date\&quot;: \&quot;2014-05-07\&quot; },{ 	\&quot;id\&quot;: \&quot;3\&quot;, 	\&quot;label\&quot;: \&quot;8. Mai\&quot;, 	\&quot;date\&quot;: \&quot;2014-05-08\&quot; }] ````  "
});

documentTitles["api.html#get-days1"] = "GET `/days/1`";
index.add({
    url: "api.html#get-days1",
    title: "GET `/days/1`",
    body: "### GET `/days/1`  *single object as above*  "
});

documentTitles["api.html#formats"] = "Formats";
index.add({
    url: "api.html#formats",
    title: "Formats",
    body: "## Formats  Formats indicate the practical execution of a session, like talk, discussion, workshop etc.  "
});

documentTitles["api.html#get-event-idformats"] = "GET `/&lt;event-id&gt;/formats`";
index.add({
    url: "api.html#get-event-idformats",
    title: "GET `/&lt;event-id&gt;/formats`",
    body: "### GET `/&lt;event-id&gt;/formats`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;talk\&quot;, 	\&quot;label\&quot;: \&quot;Vortrag\&quot; },{ 	\&quot;id\&quot;: \&quot;discussion\&quot;, 	\&quot;label\&quot;: \&quot;Diskussion\&quot;, },{ 	\&quot;id\&quot;: \&quot;workshop\&quot;, 	\&quot;label\&quot;: \&quot;Workshop\&quot;, },{ 	\&quot;id\&quot;: \&quot;action\&quot;, 	\&quot;label\&quot;: \&quot;Aktion\&quot;, }] ````  "
});

documentTitles["api.html#get-event-idformatsid"] = "GET `/&lt;event-id&gt;/formats/&lt;id&gt;`";
index.add({
    url: "api.html#get-event-idformatsid",
    title: "GET `/&lt;event-id&gt;/formats/&lt;id&gt;`",
    body: "### GET `/&lt;event-id&gt;/formats/&lt;id&gt;`  *single object as above*  "
});

documentTitles["api.html#levels"] = "Levels";
index.add({
    url: "api.html#levels",
    title: "Levels",
    body: "## Levels  Levels indivate the amount of preexisting knowledge expected from the respective audience  "
});

documentTitles["api.html#get-event-idlevels"] = "GET `/&lt;event-id&gt;/levels`";
index.add({
    url: "api.html#get-event-idlevels",
    title: "GET `/&lt;event-id&gt;/levels`",
    body: "### GET `/&lt;event-id&gt;/levels`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;beginner\&quot;, 	\&quot;label\&quot;: \&quot;Beginnerinnen\&quot; },{ 	\&quot;id\&quot;: \&quot;intermediate\&quot;, 	\&quot;label\&quot;: \&quot;Fortgeschrittene\&quot;	 },{ 	\&quot;id\&quot;: \&quot;advanced\&quot;, 	\&quot;label\&quot;: \&quot;Expertinnen\&quot;	 }] ````  "
});

documentTitles["api.html#get-event-idlevelsid"] = "GET `/&lt;event-id&gt;/levels/&lt;id&gt;`";
index.add({
    url: "api.html#get-event-idlevelsid",
    title: "GET `/&lt;event-id&gt;/levels/&lt;id&gt;`",
    body: "### GET `/&lt;event-id&gt;/levels/&lt;id&gt;`  *single object as above*  "
});

documentTitles["api.html#languages"] = "Languages";
index.add({
    url: "api.html#languages",
    title: "Languages",
    body: "## Languages  "
});

documentTitles["api.html#get-event-idlanguages"] = "GET `/&lt;event-id&gt;/languages`";
index.add({
    url: "api.html#get-event-idlanguages",
    title: "GET `/&lt;event-id&gt;/languages`",
    body: "### GET `/&lt;event-id&gt;/languages`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;de\&quot;, 	\&quot;label\&quot;: \&quot;Deutsch\&quot; },{ 	\&quot;lid\&quot;: \&quot;en\&quot;, 	\&quot;label\&quot;: \&quot;English\&quot;	 }] ````  "
});

documentTitles["api.html#get-event-idlanguageslanguage-id"] = "GET `/&lt;event-id&gt;/languages/&lt;language-id&gt;`";
index.add({
    url: "api.html#get-event-idlanguageslanguage-id",
    title: "GET `/&lt;event-id&gt;/languages/&lt;language-id&gt;`",
    body: "### GET `/&lt;event-id&gt;/languages/&lt;language-id&gt;`  *single object as above*  "
});

documentTitles["api.html#attendees"] = "Attendees";
index.add({
    url: "api.html#attendees",
    title: "Attendees",
    body: "## Attendees  Attendees are humans participating in an event.  "
});

documentTitles["api.html#get-event-idattendees"] = "GET `/&lt;event-id&gt;/attendees`";
index.add({
    url: "api.html#get-event-idattendees",
    title: "GET `/&lt;event-id&gt;/attendees`",
    body: "### GET `/&lt;event-id&gt;/attendees`  ```` javascript [{ 	\&quot;id\&quot;: 1, 	\&quot;speaker\&quot;: \&quot;&lt;speaker-id&gt;\&quot; // or false 	\&quot;name\&quot;: \&quot;Sebastian Vollnals\&quot;, 	\&quot;nickname\&quot;: \&quot;yetzt\&quot;, 	\&quot;photo\&quot;: \&quot;http://assets.re-publica.de/pictures/picture-144.jpg\&quot;, 	\&quot;organization\&quot;: \&quot;OpenDataCity\&quot;, 	\&quot;description\&quot;: \&quot;poly &amp; queer hacker, feminist sidekick. wandering about in berlin and wearing pink hair.\&quot;, 	\&quot;links\&quot;: [{ 		\&quot;service\&quot;: \&quot;twitter\&quot;, 		\&quot;label\&quot;: \&quot;yetzt\&quot;, 		\&quot;url\&quot;: \&quot;https://twitter.com/yetzt\&quot; 	},{ 		\&quot;service\&quot;: \&quot;blog\&quot;, 		\&quot;label\&quot;: \&quot;blog\&quot;, 		\&quot;url\&quot;: \&quot;http://yetzt.wordpress.com/\&quot; 	},{ 		\&quot;service\&quot;: \&quot;github\&quot;, 		\&quot;label\&quot;: \&quot;yetzt\&quot;, 		\&quot;url\&quot;: \&quot;http://github.com/yetzt\&quot; 	},{ 		\&quot;service\&quot;: \&quot;adn\&quot;, 		\&quot;label\&quot;: \&quot;yetzt\&quot;, 		\&quot;url\&quot;: \&quot;https://app.net/yetzt\&quot; 	}], 	\&quot;sessions\&quot;: [$session_id,$session_id,$session_id], 	\&quot;area\&quot;: { 		\&quot;id\&quot;: \&quot;&lt;area-id&gt;\&quot;, 		\&quot;label\&quot;: \&quot;Affenfelsen\&quot; 	} }] ```` "
});


