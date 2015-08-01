var all = 'https://skimdb.npmjs.com/registry/_design/scratch/_view/listAll'
var request = require('got')
var json = require('JSONStream')
var es = require('event-stream')
var moment = require('moment')
var print = require('./show-frequencies')

var year = 2015
var depFreqs = {}
var devDepFreqs = {}

request.stream(all, {
  query: {
    // limit: 3,
    // skip: 100
  }
})
  .pipe(json.parse('rows.*.value'))
  .pipe(es.mapSync(function (data) {
    var latest = data['dist-tags'] && data['dist-tags'].latest
    var versions = data.versions
    var package = (latest && versions) ? versions[latest] : null
    var time = data.time
    console.error(data.name)
    return {
      time: {
        created: time && time.created,
        modified: time && time.modified
      },
      name: data.name,
      dependencies: Object.keys((package && package.dependencies) || {}),
      devDependencies: Object.keys((package && package.devDependencies) || {})
    }
  }))
  .pipe(json.stringify())
  .pipe(process.stdout)