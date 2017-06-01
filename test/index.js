import 'babel-polyfill';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import IceVideo from '../src/index';

import '../src/assets/sass/video.scss';
import './example.scss';

const render = () => {
  const settings = {
    // width: 800,
    // height: 600,
    loop: true,
    autoPlay: false,
    preload: 'auto',
    poster: '',
    volume: 0.5,
    getDanmukuUrl: 'http://127.0.0.1:3001/danmuku',
    sendDanmukuUrl: 'http://127.0.0.1:3001/senddanmu',
    controls: true,
    scale: '16:9',
    src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    // src: './video1.mp4',
  };
  ReactDOM.render(
    <div>
      <section className="jumbotron-header text-center mb-3 jumbotron">
        <div className="container">
          <h1 className="title">Ice-Video</h1>
          <p className="lead">The web danmuku video player built from the ground up for an HTML5 world using React library.</p>
        </div>
      </section>
      <div className="palyer-container">
        <IceVideo {...settings} />
      </div>
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
