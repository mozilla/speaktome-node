var speech = require('../index.js');

var options = {
  language: 'en-US',
  productTag: 'speaktome-node',
  storeSample: false,
  storeTranscription: false,
};

/*

Reads a known-good opus file into a buffer and sends to the cloud
API.

Tests the network request code and response handling.

*/
exports.testSendFileToServer = function(test) {
  var fs = require('fs');
  fs.readFile('tests/test.opus', function (err, data) {
    speech.send(data, options).then(function(results) {
      test.ok(results.length == 1, 'Server should return a single result.');
      test.ok(results[0].text.toLowerCase() == 'test', 'Server result should match input');
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
  speech.record(options).then(function(results) {
    test.ok(results.length >= 1, 'Server should return a result.');
    var match = results.some(function(result) {
      return result.text.toLowerCase() === text.toLowerCase();
    });
    test.ok(match, 'Server result should match input');
    test.done();
  }).catch(err => {
    console.error(err);
    test.ok(err == 1, 'Server request should not throw error');
    test.done();
  });
  const { exec } = require('child_process');
  exec('say "' + text + '"', (err, stdout, stderr) => {
    if (err) {
      console.error('say...', err);
    }
  });
};
