# ice-video

The web danmuku video player built from the ground up for an HTML5 world using React library.

[![npm](https://img.shields.io/badge/npm-v0.1.6-brightgreen.svg)](https://www.npmjs.com/package/ice-video)
![build](https://img.shields.io/badge/build-passing-green.svg)
[![MIT License](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/IceEnd/icePlayer/blob/master/LICENSE)

[website](http://ice-video.coolecho.net)

# ScreenShot
![ScreenShot](./screenShot.jpeg)

# Installation

Install ice-video via NPM

```shell
npm install --save ice-video react react-dom isomorphic-fetch
```

import stylesheet

```javascript
import "http://ice-video.coolecho.net/static/video.min.css";
```

or import scss

```javascript
import "node_modules/ice-video/src/assets/sass/video.scss"
```


Import the components where you need, example:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import IceVideo from 'ice-video';

const Player = () => {
  const settings = {
    loop: true,
    autoPlay: false,
    preload: 'auto',
    poster: '',
    volume: 0.5,
    getDanmukuUrl: 'http://127.0.0.1:3001/danmuku',
    sendDanmukuUrl: 'http://127.0.0.1:3001/senddanmu',
    controls: true,
    scale: '16:9',
    src: './video.mp4',
  };
  return (
    <IceVideo {...settings} />
  );
}

export default Player;

```

# Config

## Options

|field|type|default|note|
|-----|----|-------|----|
|autoPlay|boolean|false|whether to automatically play|
|preload|string|'auto'||
|poster|string|''||
|loop|boolean|false|loop for video|
|volume|number|0.8|palyer's volume|
|controls|boolean|true|control player|
|scale|string|'16:9'|scale of player|
|duration|number|6000|danmuku display duration，unit ```ms```|
|opacity|number|1|the transparency of danmuku|

## Danmuku

Server danmuku format conventions

|field|type|note|
|-----|----|----|
|content|string|the content of a danmuku|
|date|Date|the time when send a danmuku|
|fontColor|string|color of danmuku|
|fontSize|string|fontSize of danmuku: ```'middle'``` , ```'small'``` , ```'large'``` |
|model|string|model of danmuku:  ```'roll'``` , ```'top'``` , ```'buttom'``` |
|timepoint|number|video playback position|

for example:

```javascript
{
  content: "233",
  date: "2017-06-03T05:40:26.616Z",
  fontColor: "white",
  fontSize: "middle",
  model: "roll",
  timePoint: 3.014076
}
```

# LICENSE

[MIT @ Alchemy](./LICENSE)
