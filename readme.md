# re-data

This project is the ongoing effort of providing an simple JSON API interface for conferences and under heavy development.

Example data includes [re:publica](http://re-publica.de) or [30C3](http://events.ccc.de/congress/2013). Take a look at the `scrapers` directory.

## Documentation

Documentation on the API can be found [here](doc/api.md)

## Contributing 

The infrastructure is still very rough as this is a side project of several people. If you are interested in helping out, send pull requests or join [the mailing list](https://lists.netzguerilla.net/mailman/listinfo/redata).

## Examples

- Several apps for [Android and iOS for the re:publica 2014](http://14.re-publica.de/session/developed-republica-apps-2014)
- An app for [AltConf](https://itunes.apple.com/us/app/id881934035) based on one of the re-publica apps.
- [Congress – 31C3](https://itunes.apple.com/de/app/congress-31c3/id941205524) for the [31st Chaos Communication Congress](https://events.ccc.de/congress/2014)
- More…

## Set it up locally

 * you need a CouchDB instance (use for example a docker container to set on up easily)
   * `docker run -d -p 5984:5984 fedora/couchdb`
   * `curl -X PUT http://localhost:5984/_config/admins/user -d '"secret"'` (creates user `user` with password `secret`)
 * copy `config.js.dist` to `config.js` and fill in the credentials for the CouchDB instance (see curl step above)
 * copy `scraper/config/scrapers.js.example` to `scraper/config/scrapers.js` (default config is fine for a first run)
 * fetch dependencies via `npm` (needs to be executed in `scraper` subdirectory):
   * `npm install`
 * run the `resetDB` command inside the `scraper` subdirectory:
   * `NODE_PATH=node_modules node scraper.js resetDB` (`NODE_PATH` just specifies not globally install locations - was created by the `npm install` step)
 * run the `import` command inside the `scraper` subdirectory:
   * `NODE_PATH=node_modules node scraper.js import`
