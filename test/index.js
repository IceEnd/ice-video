import 'babel-polyfill';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import IcePlayer from '../src/IcePlayer';

const render = () => {
  const settings = {
    src: path.resolve('vedio.mp4'),
    width: 800,
    height: 600,
    loop: true,
    autoPlay: false,
    volume: 0.5,
    getBarrageUrl: '',
    postBarrageUrl: '',
    controls: true,
    sacle: '4:3',
  };
  ReactDOM.render(
    <div>
      <IcePlayer {...settings} />
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
