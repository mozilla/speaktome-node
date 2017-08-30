var speech = require('../index.js');

exports.testIntegration = function(test) {
  var fs = require('fs');
  fs.readFile('tests/test.opus', function (err, data) {
    speech.send(data).then(function(results) {
      test.ok(results.length == 1, 'Server should return a single result.');
      test.ok(results[0].text == 'TEST', 'Server result should match input');
      test.done();
    }).catch(console.error);
  });
};
