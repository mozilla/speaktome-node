var fetch = require('node-fetch');
var mic = require('mic');

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
        reject('Unexpected response from server: ' + JSON.stringify(json));
      }
    })
    .catch(reject);
  });
}

exports.send = sendRecordingToServer;

// Listen, record, send to server.
// Promise that returns array of results
// from server.
function record() {
  return new Promise((res, rej) => {
    var micInstance = mic({
      'rate': '16000',
      'channels': '1',
      'debug': true,
      'exitOnSilence': 6
    });

    var micInputStream = micInstance.getAudioStream();

    // For testing below
    var fs = require('fs');

    // Test stream recording as file
    //var outputFileStream = fs.WriteStream('stream.raw');
    //micInputStream.pipe(outputFileStream);

    // Test command for opus encoding
    // opusenc --raw --raw-rate 16000 --raw-chan 1 stream.raw stream.opus

    //
    // node-opus
    var rate = 16000;
    var max_packet_size = rate / 100;
    var channels = 1;
    var opus = require('node-opus');
    var opusEncodeStream = new opus.Encoder(rate, channels, max_packet_size);
    var ogg = require('ogg');
    var oggEncoder = new ogg.Encoder();

    // Test writing out to file
    //var outputFileStream = fs.WriteStream('stream.opus');
    //oggEncoder.pipe(outputFileStream);

    micInputStream.pipe(opusEncodeStream).pipe(oggEncoder.stream());

    var bufs = [];

    oggEncoder.on('data', function(buffer) {
      bufs.push(buffer);
    });

    oggEncoder.on('end', function() {
      var buffer = Buffer.concat(bufs);

      // For testing fidelity of encoded recording.
      fs.writeFile('buffer.opus', buffer, 'binary', console.error);

      sendRecordingToServer(buffer).then(results => {
        console.log('RES', results);
        res(results);
      }).catch(err => {
        console.error('ERR', err);
        rej(err);
      });
    });

    micInputStream.on('silence', function() {
      console.log("Got SIGNAL silence");

      // Stop recording	
      micInstance.stop();
    });
     
    /*
    micInputStream.on('error', function(err) {
      console.log("Error in Input Stream: " + err);
    });
     
    micInputStream.on('startComplete', function() {
      console.log("Got SIGNAL startComplete");
    });
        
    micInputStream.on('stopComplete', function() {
      console.log("Got SIGNAL stopComplete");
    });
        
    micInputStream.on('pauseComplete', function() {
      console.log("Got SIGNAL pauseComplete");
    });
     
    micInputStream.on('resumeComplete', function() {
      console.log("Got SIGNAL resumeComplete");
    });

    micInputStream.on('processExitComplete', function() {
      console.log("Got SIGNAL processExitComplete");
    });
    */
     
    micInstance.start();
  });
}

exports.record = record;

// Old.
function recordNoStream() {
  return new Promise((res, rej) => {
    var micInstance = mic({
      'rate': '16000',
      'channels': '1',
      'debug': true,
      'exitOnSilence': 6
    });

    var micInputStream = micInstance.getAudioStream();

    // For testing below
    var fs = require('fs');

    // Test stream recording as file
    //var outputFileStream = fs.WriteStream('stream.raw');
    //micInputStream.pipe(outputFileStream);
    // Test command for encoding in playbackable way
    // opusenc --raw --raw-rate 16000 --raw-chan 1 stream.raw stream.opus

    var buffers = [];

    micInputStream.on('data', function(data) {
      console.log("Recieved Input Stream: " + data.length);
      buffers.push(data);
    });
     
    micInputStream.on('silence', function() {
      console.log("Got SIGNAL silence");
      //console.log('STOPPED ON SILENCE, chunks:', buffers)

      // Stop recording	
      micInstance.stop();

      // Join data into a single buffer
      var buffer = Buffer.concat(buffers);

      /*
      // node-opus
      var opus = require('node-opus');
      var rate = 16000;
      var encoder = new opus.OpusEncoder(rate);
      var frame_size = rate / 100;
      var encoded = encoder.encode(buffer, frame_size);
      */

      /*
      // opusscript
      var samplingRate = 48000;
      var frameDuration = 20;
      var channels = 2;
      var frameSize = samplingRate * frameDuration / 1000;
      var opusscript = require("opusscript");
      var encoder = new opusscript(samplingRate, channels, opusscript.Application.AUDIO);
      var encoded = encoder.encode(buffer, frameSize);
      encoder.delete();
      */

      /*
      // cjopus
      var OpusEncoder = require('cjopus');
      var encoder = new OpusEncoder.OpusEncoder(48000, 2);
      var encoded = encoder.encode(buffer);
      */

      /*
      // libopus.js
      var Encoder = require('libopus.js').Encoder;
      var enc = new Encoder();
      var ab = toArrayBuffer(buffer);
      var arr = new Int16Array(ab);
      var encoded = enc.encode(arr);
      */

      //console.log('encoded', encoded);

      /*
      var readChunk = require('read-chunk'); // npm install read-chunk 
      var isOpus = require('is-opus');
      console.log('IS OPUS?', isOpus(readChunk(encoded)));
      */

      // Test file
      //var fs = require('fs');
      //fs.writeFile('buffer.opus', encoded, 'binary', console.error);

      //sendRecordingToServer(encoded);
    });
     
    /*
    micInputStream.on('error', function(err) {
      console.log("Error in Input Stream: " + err);
    });
     
    micInputStream.on('startComplete', function() {
      console.log("Got SIGNAL startComplete");
    });
        
    micInputStream.on('stopComplete', function() {
      console.log("Got SIGNAL stopComplete");
    });
        
    micInputStream.on('pauseComplete', function() {
      console.log("Got SIGNAL pauseComplete");
    });
     
    micInputStream.on('resumeComplete', function() {
      console.log("Got SIGNAL resumeComplete");
    });

    micInputStream.on('processExitComplete', function() {
      console.log("Got SIGNAL processExitComplete");
    });
    */
     
    micInstance.start();
  });
}

function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}
