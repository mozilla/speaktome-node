# Mozilla Speech API

<!--
[![Version](http://img.shields.io/npm/v/mozillaspeechapi.svg?style=flat-square)](https://npmjs.org/package/mozillaspeechapi)
[![License](http://img.shields.io/npm/l/mozillaspeechapi.svg?style=flat-square)](https://npmjs.org/package/mozillaspeechapi)
-->

JavaScript module for Mozilla&#39;s Speech-to-text REST API.

## Installation

Install via npm:

```bash
npm install mozillaspeechapi
```

## Usage

```js
var speech = require('mozillaspeechapi');

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
