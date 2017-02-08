import 'babel-polyfill';
import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { AppContainer } from 'react-hot-loader';
import IcePlayer from './component/IcePlayer';
import reducers from './reducer/reducers';

const App = (props) => {
  const loggerMiddleware = logger();
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware, loggerMiddleware];
  const store = createStore(
    reducers,
    applyMiddleware(...middleware),
  );
  return (
    <AppContainer>
      <Provider store={store}>
        <IcePlayer {...props} />
      </Provider>
    </AppContainer>
  );
};

App.displayName = 'IcePlayerApp';
App.propTypes = {
  children: PropTypes.any,
  loading: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  loop: PropTypes.bool,
  autoPlay: PropTypes.bool,
  preload: PropTypes.oneOf(['auto', 'metadata', 'none']),
  getBarrageUrl: PropTypes.string.isRequired,
  postBarrageUrl: PropTypes.string.isRequired,
  controls: PropTypes.bool,
  scale: PropTypes.string,
};

export default App;
