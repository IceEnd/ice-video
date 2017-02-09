import 'babel-polyfill';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import IcePlayer from '../src/IcePlayer';

const render = () => {
  const settings = {
    // width: 800,
    // height: 600,
    loop: true,
    autoPlay: false,
    preload: 'auto',
    volume: 0.5,
    getBarrageUrl: '',
    postBarrageUrl: '',
    controls: true,
    scale: '16:9',
  };
  ReactDOM.render(
    <div>
      <IcePlayer {...settings} >
        <source src={path.resolve('vedio.mp4')} type="video/mp4" />
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
