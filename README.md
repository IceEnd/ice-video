# ice-video

The web danmuku video player built from the ground up for an HTML5 world using React library.

[![npm](https://img.shields.io/badge/npm-v0.0.6-brightgreen.svg)](https://www.npmjs.com/package/ice-video)
![build](https://img.shields.io/badge/build-passing-green.svg)
[![MIT License](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/IceEnd/icePlayer/blob/master/LICENSE)

# ScreenShot
![ScreenShot](./screenShot.jpeg)

# Installation

Install ice-video via NPM

```shell
npm install --save ice-video react react-dom isomorphic-fetch
```

import stylesheet

```shell
import "node_modules/ice-video/dist/video.css";
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

# LICENSE

[MIT @ CNO](./LICENSE)
