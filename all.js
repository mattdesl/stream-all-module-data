var all = 'https://skimdb.npmjs.com/registry/_design/scratch/_view/listAll'
var request = require('got')
var json = require('JSONStream')
var es = require('event-stream')
var moment = require('moment')
var print = require('./show-frequencies')
var fs = require('fs')

var year = 2015
var depFreqs = {}
var devDepFreqs = {}

// request.stream(all, {
//   query: {
//   }
// })

var total = 0

fs.createReadStream('extracted.json', 'utf8')
  .pipe(json.parse('*'))
  .pipe(es.mapSync(function (data) {
    total++
    var name = data.name
    if (!data.time || !data.time.created || !data.time.modified) {
      // console.log("Skip", name)
      return data
    }
    
    var created = moment(data.time.created).year()
    var modified = moment(data.time.modified).year()
    if (name === 'standard') console.log(name)
    if (created >= year) {
      var deps = data.dependencies || {}
      var devDeps = data.devDependencies || {}
      add(depFreqs, deps)
      add(devDepFreqs, devDeps)
      console.log(name)
    }
    // var latest = data['dist-tags'] && data['dist-tags'].latest
    // var versions = data.versions
    
    // if (versions && latest && created >= year) {
    
    // } else {
    //   console.log("Skip", created, name)
    // }
    return data
  }))
  .on('end', function () {
    var count = 100
    
    console.log('Modules that were created or updated since ' + year)
    
    console.log('# dependencies\n')
    print(depFreqs, count)
    
    console.log('# devDependencies\n')
    print(devDepFreqs, count)
    console.log(total)
  })
  
function add (freqs, data) {
  Object.keys(data).forEach(function (key) {
    if (!(key in freqs)) {
      freqs[key] = 1
    } else {
      freqs[key]++
    }
  })
}