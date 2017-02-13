import 'babel-polyfill';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import IcePlayer from '../src/index';

const render = () => {
  const settings = {
    // width: 800,
    // height: 600,
    loop: true,
    autoPlay: false,
    preload: 'auto',
    poster: '',
    volume: 0.5,
    getBarrageUrl: '',
    postBarrageUrl: '',
    controls: true,
    scale: '16:9',
  };
  ReactDOM.render(
    <div>
      <IcePlayer {...settings} >
        <source src="/video.mp4" type="video/mp4" />
      </IcePlayer>
    </div>,
    document.querySelector('#root')
  );
};

render(IcePlayer);

if (module.hot) {
  module.hot.accept('../src/IcePlayer', () => {
    const newApp = require('../src/IcePlayer').default;
    render(newApp);
  });
}
//  https://media.w3.org/2010/05/sintel/trailer_hd.mp4 http://static.hdslb.com/miniloader.swf https://video-react.github.io/assets/poster.png
