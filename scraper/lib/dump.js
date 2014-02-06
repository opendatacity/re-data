var fs = require('fs');
var path = require('path');
var log = require(path.resolve(__dirname, '../../api/lib/log.js'));

var dumpFolder = '../web/data/';

var typeMatching = {
	'day': 'days',
	'session': 'sessions',
	'speaker': 'speakers',
	'location': 'locations'
};

exports.dump = function (data) {
	var events = {};
	data.forEach(function (entry) {
		if (events[entry.event] === undefined) events[entry.event] = {};
		var event = events[entry.event];

		var key = typeMatching[entry.type];
		if (key === undefined) console.error('Unknown type "'+entry.type+'"')

		if (event[key] === undefined) event[key] = [];
		var list = event[key];

		list.push(entry);
	})

	Object.keys(events).forEach(function (event_key) {
		var event = events[event_key];

		if (!fs.existsSync(dumpFolder+event_key)) fs.mkdirSync(dumpFolder+event_key);

		exportJSON(event_key, 'data',     event         );

		exportJSON(event_key, 'sessions', event.sessions);
		exportJSON(event_key, 'speakers', event.speakers);

		exportTSV(event_key, 'sessions', event.sessions.map(function (entry) {
			return {
				id:            entry.id,
				event:         entry.event,
				type:          entry.type,
				status:        entry.status,
				title:         entry.title,
				photo:         entry.photo,
				begin:         entry.begin,
				end:           entry.end,
				duration:      entry.duration,
				day:           entry.day,
				area:          entry.area,
				track:         entry.track.slug,
				format:        entry.format.slug,
				level:         entry.level.slug,
				lang:          entry.lang.slug,
				speakers:      entry.speakers.join(', '),
				last_modified: entry.last_modified
			}
		}));

		exportTSV(event_key, 'speakers', event.speakers.map(function (entry) {
			return {
				id:           entry.id,
				event:        entry.event,
				type:         entry.type,
				name:         entry.name,
				nickname:     entry.nickname,
				photo:        entry.photo,
				organization: entry.organization,
				position:     entry.position,
				biography:    entry.biography,
				sessions:     entry.sessions.join(', ')
			}
		}));
	});
}

function exportJSON(event_key, suffix, data) {
	var filename = dumpFolder+event_key+'/'+suffix+'.json';
	log.info('Dumping JSON "'+filename+'"');

	fs.writeFileSync(filename, JSON.stringify(data, null, '\t'), 'utf8');
}

function exportTSV(event_key, suffix, data) {
	
	var header = Object.keys(data[0]);
	var tsv = [header.join('\t')];

	data.forEach(function (entry) {
		var row = header.map(function (key) { return (''+entry[key]).replace(/\n/g, '\\n').replace(/\t/g, '\\t') });
		tsv.push(row.join('\t'));
	})

	tsv = tsv.join('\n');

	var filename = dumpFolder+event_key+'/'+suffix+'.tsv';
	log.info('Dumping TSV "'+filename+'"');

	fs.writeFileSync(filename, tsv, 'utf8');
}


