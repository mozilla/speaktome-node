var speech = require('../index.js');

/*
exports.testSendFileToServer = function(test) {
  var fs = require('fs');
  fs.readFile('tests/test.opus', function (err, data) {
    speech.send(data).then(function(results) {
      test.ok(results.length == 1, 'Server should return a single result.');
      test.ok(results[0].text == 'TEST', 'Server result should match input');
      test.done();
    }).catch(console.error);
  });
};
*/

exports.testSendRecordingToServer = function(test) {
  speech.record().then(function(results) {
    test.ok(results.length >= 1, 'Server should return a result.');
    var match = results.some(function(result) {
      return result.text === 'TEST';
    });
    test.ok(match, 'Server result should match input');
    test.done();
  }).catch(err => {
    console.error(err);
    test.done();
  });
  const { exec } = require('child_process');
  exec('say "test"', (err, stdout, stderr) => {
    if (err) {
      console.log('say...', err);
    }
  });
};
