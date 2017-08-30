var fetch = require('node-fetch');

var STT_SERVER_URL = 'https://speaktome.services.mozilla.com';

function sendRecordingToServer(opusBuffer) {
  return new Promise(function(resolve, reject) {
    fetch(STT_SERVER_URL, {
      method: "POST",
      body: opusBuffer
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if (json.status === "ok") {
        resolve(json.data);
      }
      else {
        reject('Unexpected response from server: ' + json);
      }
    })
    .catch(reject);
  });
}

exports.send = sendRecordingToServer;
