var json = require('JSONStream')
var fs = require('fs')
var es = require('event-stream')
var padLeft = require('pad-left')

var freqs = {}

// search some modules specifically
var modules = [
  'budo', 'garnish', 'standard', 
  'snazzy', 'semistandard', 'eslint',
  'grunt', 'gulp', 'tape', 'tap'
]

var allFreqs = {}
var count = 0

fs.createReadStream('alldata.json')
  .pipe(json.parse('rows.*.value.devDependencies'))
  .pipe(es.mapSync(function (data) {
    if (data) {
      Object.keys(data).forEach(function (key) {
        if (modules.indexOf(key) >= 0) {
          if (!(key in freqs)) {
            freqs[key] = 1
          } else {
            freqs[key]++
          }
        }
        
        if (!(key in allFreqs)) {
          allFreqs[key] = 1
        } else {
          allFreqs[key]++
        }
      })
    }
    return data
  }))
  .on('end', function (ev) {
    var values = Object.keys(allFreqs)
        .map(function (k) {
            return { value: k, frequency: allFreqs[k] }
        })  
        .sort(function (a, b) {
            return b.frequency - a.frequency
        })
    
    values = values.slice(0, 100)
      
    var longest = values.reduce(function (prev, a) {
      return Math.max(prev, a.value.length)
    }, 0)
    
    
    console.log('\n--------')
    console.log('SPECIFIC MODULES')
    console.log('--------\n')
    
    modules.forEach(function (key) {
      var padding = longest - key.length
      console.log(key, padLeft(freqs[key] || 0, padding + 1))
    })
    
    console.log('\n--------')
    console.log('TOP 100')
    console.log('--------\n')
    
    values.forEach(function (x) {
      var key = x.value
      var count = x.frequency
      var padding = longest - key.length
      console.log(key, padLeft(count || 0, padding + 1))
    })
})