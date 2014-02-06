
var index = lunr(function () {
    this.field('body');
    this.ref('url');
});

var documentTitles = {};



documentTitles["api.html#api"] = "API";
index.add({
    url: "api.html#api",
    title: "API",
    body: "# API  "
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
    body: "### GET `/events`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;rp14\&quot;, 	\&quot;label\&quot;: \&quot;re:publica 14\&quot;, 	\&quot;title\&quot;: \&quot;into the wild\&quot;, 	\&quot;begin\&quot;: \&quot;2014-05-06\&quot;, 	\&quot;end\&quot;: \&quot;2014-05-08\&quot;, 	\&quot;locations\&quot;: [{ 		\&quot;label\&quot;: \&quot;Station Berlin\&quot;, 		\&quot;coords\&quot;: [52.49814,13.374538] // lat, lon 	}], 	\&quot;url\&quot;: \&quot;http://14.re-publica.de/\&quot; },{ 	\&quot;id\&quot;: \&quot;rp13\&quot;, 	\&quot;label\&quot;: \&quot;re:publica 13\&quot;, 	\&quot;title\&quot;: \&quot;IN/SIDE/OUT\&quot;, 	\&quot;begin\&quot;: \&quot;2013-05-06\&quot;, 	\&quot;end\&quot;: \&quot;2013-05-08\&quot;, 	\&quot;locations\&quot;: [{ 		\&quot;label\&quot;: \&quot;Station Berlin\&quot;, 		\&quot;coords\&quot;: [52.49814,13.374538] // lat, lon 	}], 	\&quot;url\&quot;: \&quot;http://13.re-publica.de/\&quot; }] ````  "
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
    body: "### GET `/&lt;event-id&gt;/sessions`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;1\&quot;, 	\&quot;status\&quot;: \&quot;upcoming\&quot;, // upcoming | current | over | cancelled 	\&quot;title\&quot;: \&quot;Eröffnung\&quot;, 	\&quot;photo\&quot;: \&quot;http://assets.re-publica.de/bla/bla.jpeg\&quot;, 	\&quot;abstract\&quot;: \&quot;...\&quot;, 	\&quot;description\&quot;: \&quot;...\&quot;, 	\&quot;url\&quot;: \&quot;http://14.re-publica.de/session/1\&quot; 	\&quot;begin\&quot;: \&quot;2014-05-06T10:00:00.0Z\&quot;, 	\&quot;end\&quot;: \&quot;2014-05-06T11:00:00.0Z\&quot;, 	\&quot;duration\&quot;: 45, 	\&quot;day\&quot;: { 		\&quot;id\&quot;: \&quot;1\&quot;, 		\&quot;label\&quot;: \&quot;6. Mai\&quot; 	}, 	\&quot;area\&quot;: { 		\&quot;id\&quot;: \&quot;1\&quot;, 		\&quot;label\&quot;: \&quot;Stage 1\&quot; 	}, 	\&quot;track\&quot;: { 		\&quot;id\&quot;: 1, 		\&quot;label\&quot;: \&quot;re:publica\&quot; 	}, 	\&quot;format\&quot;: { 		\&quot;id\&quot;: \&quot;talk\&quot;, 		\&quot;label\&quot;: \&quot;Vortrag\&quot; 	}, 	\&quot;level\&quot;: { 		\&quot;id\&quot;: \&quot;beginner\&quot;, 		\&quot;label\&quot;: \&quot;Anfängerinnen\&quot; 	}, 	\&quot;lang\&quot;: { 		\&quot;id\&quot;: \&quot;de\&quot;, 		\&quot;label\&quot;: \&quot;Deutsch\&quot; 	}, 	\&quot;speakers\&quot;: [{ 		\&quot;id\&quot;: \&quot;1\&quot;, 		\&quot;name\&quot;: \&quot;Andreas Gebhard\&quot;, 		\&quot;photo\&quot;: \&quot;http://assets.re-publica.de/bla/fasel.jpeg\&quot; 	},{ 		\&quot;id\&quot;: \&quot;2\&quot;, 		\&quot;name\&quot;: \&quot;Markus Beckedahl\&quot;, 		\&quot;photo\&quot;: \&quot;http://assets.re-publica.de/bla/blub.jpeg\&quot; 	}], 	\&quot;revision\&quot;: 12, // incremental revision counter 	\&quot;last-modified\&quot;: \&quot;2013-12-04T15:50:00.0Z\&quot;	 }] ````  "
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
    body: "### GET `/&lt;event-id&gt;/speakers`  ```` javascript [ 	{     	\&quot;id\&quot;: \&quot;1\&quot;,     	\&quot;event\&quot;: \&quot;rp13\&quot;,     	\&quot;type\&quot;: \&quot;speaker\&quot;,     	\&quot;name\&quot;: \&quot;Johnny Haeusler\&quot;,     	\&quot;nickname\&quot;: \&quot;johnny-haeusler\&quot;,     	\&quot;photo\&quot;: \&quot;http://13.re-publica.de/sites/13.re-publica.de/files/pictures/picture-48.png\&quot;,     	\&quot;organization\&quot;: \&quot;Spreeblick\&quot;,     	\&quot;position\&quot;: \&quot;\&quot;,     	\&quot;biography\&quot;: \&quot;Born in Berlin in 1964, Johnny Haeusler founded the award-winning weblog Spreeblick in 2002. He is also a radio DJ and a member of post-punkrock band Plan B, which is touring again since 2012.....\&quot;,     	\&quot;sessions\&quot;: [     		\&quot;rp13-session-5115\&quot;,     		\&quot;rp13-session-5117\&quot;,     		\&quot;rp13-session-5866\&quot;,     		\&quot;rp13-session-3983\&quot;,     		\&quot;rp13-session-6481\&quot;     	]     },  	... ] ````  "
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
    body: "### GET `/&lt;event-id&gt;/tracks`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;business-innovation\&quot;, 	\&quot;label\&quot;: \&quot;Business &amp; innovation\&quot;, 	\&quot;sessions\&quot;: [$session_id,$session_id,$session_id] },{ 	\&quot;id\&quot;: \&quot;science-technology\&quot;, 	\&quot;label\&quot;: \&quot;Science &amp; Technology\&quot;, 	\&quot;sessions\&quot;: [$session_id,$session_id,$session_id]	 }] ````  "
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
    body: "### GET `/&lt;event-id&gt;/locations`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;stage1\&quot;, // location_id 	\&quot;label\&quot;: \&quot;Stage 1\&quot;, 	\&quot;stage\&quot;: true, // is this a stage 	\&quot;floor\&quot;: 0 // floor in the building, 0 is ground },{ 	\&quot;id\&quot;: \&quot;affenfelsen\&quot;, 	\&quot;label\&quot;: \&quot;Affenfelsen\&quot;, 	\&quot;stage\&quot;: false, 	\&quot;floor\&quot;: 0 // floor in the building, 0 is ground }] ````  "
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
    body: "### GET `/&lt;event-id&gt;/days`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;1\&quot;, 	\&quot;label\&quot;: \&quot;6. Mai\&quot;, 	\&quot;date\&quot;: \&quot;2014-05-06\&quot; },{ 	\&quot;id\&quot;: \&quot;2\&quot;, 	\&quot;label\&quot;: \&quot;7. Mai\&quot;, 	\&quot;date\&quot;: \&quot;2014-05-07\&quot; },{ 	\&quot;id\&quot;: \&quot;3\&quot;, 	\&quot;label\&quot;: \&quot;8. Mai\&quot;, 	\&quot;date\&quot;: \&quot;2014-05-08\&quot; }] ````  "
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
    body: "### GET `/&lt;event-id&gt;/formats`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;talk\&quot;, 	\&quot;label\&quot;: \&quot;Vortrag\&quot; },{ 	\&quot;id\&quot;: \&quot;discussion\&quot;, 	\&quot;label\&quot;: \&quot;Diskussion\&quot;, },{ 	\&quot;id\&quot;: \&quot;workshop\&quot;, 	\&quot;label\&quot;: \&quot;Workshop\&quot;, },{ 	\&quot;id\&quot;: \&quot;action\&quot;, 	\&quot;label\&quot;: \&quot;Aktion\&quot;, }] ````  "
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
    body: "### GET `/&lt;event-id&gt;/levels`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;beginner\&quot;, 	\&quot;label\&quot;: \&quot;Beginnerinnen\&quot; },{ 	\&quot;id\&quot;: \&quot;intermediate\&quot;, 	\&quot;label\&quot;: \&quot;Fortgeschrittene\&quot;	 },{ 	\&quot;id\&quot;: \&quot;advanced\&quot;, 	\&quot;label\&quot;: \&quot;Expertinnen\&quot;	 }] ````  "
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
    body: "### GET `/&lt;event-id&gt;/languages`  ```` javascript [{ 	\&quot;id\&quot;: \&quot;de\&quot;, 	\&quot;label\&quot;: \&quot;Deutsch\&quot; },{ 	\&quot;lid\&quot;: \&quot;en\&quot;, 	\&quot;label\&quot;: \&quot;English\&quot;	 }] ````  "
});

documentTitles["api.html#get-event-idlanguageslanguage-id"] = "GET `/&lt;event-id&gt;/languages/&lt;language-id&gt;`";
index.add({
    url: "api.html#get-event-idlanguageslanguage-id",
    title: "GET `/&lt;event-id&gt;/languages/&lt;language-id&gt;`",
    body: "### GET `/&lt;event-id&gt;/languages/&lt;language-id&gt;`  *single object as above*  "
});


