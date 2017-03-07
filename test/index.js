import 'babel-polyfill';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';
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
    volume: 0.2,
    getBarrageUrl: '',
    postBarrageUrl: '',
    controls: true,
    scale: '16:9',
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
        <IceVideo {...settings} >
          <source src="/video.mp4" />
        </IceVideo>
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
