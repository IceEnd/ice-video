import 'babel-polyfill';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import IceVideo from '../src/index';

import '../src/assets/sass/video.scss';

const render = () => {
  const settings = {
    // width: 800,
    // height: 600,
    loop: true,
    autoPlay: false,
    preload: 'auto',
    poster: '',
    volume: 0.2,
    getBarrageUrl: '',
    postBarrageUrl: '',
    controls: true,
    scale: '16:9',
  };
  ReactDOM.render(
    <div>
      <IceVideo {...settings} >
        <source src="/video.mp4" />
      </IceVideo>
    </div>,
    document.querySelector('#root')
  );
};

render(IceVideo);

if (module.hot) {
  module.hot.accept('../src/IceVideo', () => {
    const newApp = require('../src/IceVideo').default;
    render(newApp);
  });
}
/*
*/
