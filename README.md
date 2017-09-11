# Speak To Me - Mozilla Speech Recognition API

<!--
[![Version](http://img.shields.io/npm/v/mozillaspeechapi.svg?style=flat-square)](https://npmjs.org/package/mozillaspeechapi)
[![License](http://img.shields.io/npm/l/mozillaspeechapi.svg?style=flat-square)](https://npmjs.org/package/mozillaspeechapi)
-->

Node.js module for SpeakToMe, Mozilla&#39;s Speech-to-text REST API.

Supports recording of audio on local system, encoding and sending the recording to Mozilla's service for processing, and retrieval of results.

## Installation

Support for recording from system or USB mics is through the [`mic` package](https://www.npmjs.com/package/mic), which depends on installation OS-specific recording utilities:

Windows and Mac OS X require SOX and Linux requires ALSA tools.

* Windows: Download and install [SOX from the website](http://sox.sourceforge.net/)

* Linux: ```sudo apt-get install alsa-base alsa-utils```

* Mac OS X: ```brew install sox```

Install via npm:

```bash

npm install speaktome-node
```

## Usage

```js
var speech = require('speaktome-node');

speech.record().then(results => {

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

