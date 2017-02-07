import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import IcePlayer from '../src/index';

const render = () => {
  ReactDOM.render(
    <div>
      <IcePlayer />
    </div>,
    document.querySelector('#root')
  );
};

render(IcePlayer);

if (module.hot) {
  module.hot.accept('./container/Root', () => {
    const newApp = require('../src/index').default;
    render(newApp);
  });
}
