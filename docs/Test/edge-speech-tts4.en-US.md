---
nav: Test
group: Test4
title: EdgeSpeechTTS4
apiHeader:
  pkg: '@lobehub/tts'
---
## Introduction

`EdgeSpeechTTS` is a class for text-to-speech conversion based on the Edge Speech Service.

This class supports converting text into speech and provides a range of methods to retrieve speech options and create speech synthesis requests.

```ts
constructor(options: EdgeSpeechAPI): EdgeSpeechTTS
```

## Parameters

- `options`: An optional object.
  - `serviceUrl`: A string specifying the URL of the Edge Speech Service. If provided, requests will be sent to this URL.
  - `locale`: A string specifying the speech locale to use. If provided, it will be used to filter the list of available voices.

## Example

```js
// index.js
import { EdgeSpeechTTS } from '@lobehub/tts';
import { Buffer } from 'buffer';
import fs from 'fs';
import path from 'path';

// Instantiate EdgeSpeechTTS
const tts = new EdgeSpeechTTS({ locale: 'zh-CN' });

// Create speech synthesis request payload
const payload = {
  input: 'This is a speech demonstration',
  options: {
    voice: 'zh-CN-XiaoxiaoNeural',
  },
};

const speechFile = path.resolve('./speech.mp3');

// Call create method to synthesize speech
const response = await tts.create(payload);
const mp3Buffer = Buffer.from(await response.arrayBuffer());

fs.writeFileSync(speechFile, mp3Buffer);
```

Run with Bun:

```shell
$ bun index.js
```

Run in Node.js:

Since the Node.js environment lacks a native `WebSocket` implementation, we need to polyfill it by importing the `ws` package.

```js
// Import at the top of the file
import WebSocket from 'ws';

global.WebSocket = WebSocket;
```

## Static Properties

- `localeOptions`: Retrieves all supported speech locale options.
- `voiceList`: Contains a list of all available voices.
- `voiceName`: An object containing all voice names.
- `createRequest`: A static method for creating speech synthesis requests.

## Methods

### `voiceOptions`

Retrieves the voice options available for the current instance, based on the `locale` specified during instantiation. Returns an object containing the current available voice options.

### `createAudio(payload: EdgeSpeechPayload): Promise<AudioBuffer>`

Creates speech audio from the given request payload.

#### Parameters

- `payload`: An `EdgeSpeechPayload` object containing the necessary information for speech synthesis.

#### Return Value

A `Promise` that resolves to an `AudioBuffer` object containing the synthesized audio data.

