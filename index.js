var fetch = require("node-fetch");
var mic = require("mic");
var opus = require("node-opus");
var ogg = require("ogg");

var STT_SERVER_URL = "https://speaktome-2.services.mozilla.com/";

function sendRecordingToServer(opusBuffer, options) {
  var config = {
    language: "en-US",
    productTag: null,
    storeSample: false,
    storeTranscription: false,
  };

  if (typeof options === "object") {
    if (options.language) {
      config.language = options.language;
    }
    if (options.productTag) {
      config.productTag = options.productTag;
    }
    if (typeof options.storeSample === "boolean") {
      config.storeSample = options.storeSample;
    }
    if (typeof options.storeTranscription === "boolean") {
      config.storeTranscription = options.storeTranscription;
    }
  }

  return new Promise(function(resolve, reject) {
    var headers = {
      "Accept-Language-STT": config.language,
      "Store-Sample": config.storeSample ? "1" : "0",
      "Store-Transcription": config.storeTranscription ? "1" : "0",
    };

    if (config.productTag) {
      headers["Product-Tag"] = config.productTag;
    }

    fetch(STT_SERVER_URL, {
      method: "POST",
      body: opusBuffer,
      headers: headers,
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        if (json.status === "ok") {
          resolve(json.data);
        } else {
          reject("Unexpected response from server: " + JSON.stringify(json));
        }
      })
      .catch(reject);
  });
}

exports.send = sendRecordingToServer;

// Listen, record, send to server.
// Promise that returns array of results
// from server.
function record(options) {
  return new Promise((res, rej) => {
    var micInstance = mic({
      rate: "16000",
      channels: "1",
      debug: true,
      exitOnSilence: 3,
    });

    var micInputStream = micInstance.getAudioStream();

    // Encode the file as Opus in an Ogg container, to send to server.
    var rate = 16000;
    var channels = 1;
    var opusEncodeStream = new opus.Encoder(rate, channels);
    var oggEncoder = new ogg.Encoder();

    micInputStream.pipe(opusEncodeStream).pipe(oggEncoder.stream());

    var bufs = [];

    oggEncoder.on("data", function(buffer) {
      bufs.push(buffer);
    });

    oggEncoder.on("end", function() {
      // Package up encoded recording into buffer to send
      // over the network to the API endpoint.
      var buffer = Buffer.concat(bufs);

      sendRecordingToServer(buffer, options)
        .then((results) => {
          res(results);
        })
        .catch((err) => {
          console.error("ERR", err);
          rej(err);
        });
    });

    micInputStream.on("silence", function() {
      // Stop recording at first silence after speaking.
      micInstance.stop();
    });

    micInputStream.on("error", function(err) {
      console.error("Error in Input Stream: " + err);
    });

    micInstance.start();
  });
}

exports.record = record;
