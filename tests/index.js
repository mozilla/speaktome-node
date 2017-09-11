var speech = require('../index.js');

/*

Reads a known-good opus file into a buffer and sends to the cloud
API.

Tests the network request code and response handling.

*/
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

/*

Activates system microphone, uses system TTS API to test
the recording flow and check against cloud API response to
ensure fidelity of recording/encoding process.

*/
exports.testSendRecordingToServer = function(test) {
  var text = 'test';
  speech.record().then(function(results) {
    test.ok(results.length >= 1, 'Server should return a result.');
    var match = results.some(function(result) {
      return result.text === text.toUpperCase();
    });
    test.ok(match, 'Server result should match input');
    test.done();
  }).catch(err => {
    console.error(err);
    test.done();
  });
  const { exec } = require('child_process');
  exec('say "' + text + '"', (err, stdout, stderr) => {
    if (err) {
      console.error('say...', err);
    }
  });
};
