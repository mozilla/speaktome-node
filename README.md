# Speak To Me - Mozilla Speech Recognition API

<!--
[![Version](http://img.shields.io/npm/v/mozillaspeechapi.svg?style=flat-square)](https://npmjs.org/package/mozillaspeechapi)
[![License](http://img.shields.io/npm/l/mozillaspeechapi.svg?style=flat-square)](https://npmjs.org/package/mozillaspeechapi)
-->

JavaScript module for Mozilla&#39;s Speech-to-text REST API.

## Installation

Install via npm:

```bash
npm install speaktome-node
```

## Usage

```js
var speech = require('speaktome-node');

speech.send(data).then(results => {

  // Results is an array of objects containing
  // `text` and `confidence` properties:
  //
  // [
  //   { confidence: "0.8090", text: "TEST" }
  // ]
  console.log(results);

}).catch(console.error);
```

## Development Notes

Install opus-tools for command line utilities to test Opus encoding/decoding/playback

```bash
brew intall opus-tools
```

Command for encoding raw sound files recorded from system microphone to Opus

```bash
opusenc --raw --raw-rate 16000 --raw-chan 1 recording.raw recording.opus
```

