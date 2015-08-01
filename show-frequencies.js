var padLeft = require('pad-left')

module.exports = function (dict, count) {
  var values = Object.keys(dict)
      .map(function (k) {
          return { value: k, frequency: dict[k] }
      })  
      .sort(function (a, b) {
          return b.frequency - a.frequency
      })
  
  if (typeof count === 'number') {
    values = values.slice(0, count)
  }
  
  var longest = values.reduce(function (prev, a) {
    return Math.max(prev, a.value.length)
  }, 0)
  
  values.forEach(function (x) {
    var key = x.value
    var count = x.frequency
    var padding = longest - key.length
    console.log(key, padLeft(count || 0, padding + 1))
  })
}