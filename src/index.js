require('babel-polyfill');
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
//import store from 'store/store.js';
import {createStore, compose, applyMiddleware} from 'redux';
//import rootReducer from '../reducers/root_reducer.js';
import rootReducer from '../reducers/data_reducer.js';
import thunkMiddleware from 'redux-thunk';
import { useRouterHistory } from 'react-router'
import { createHistory } from 'history'

// 去掉路由中的/号
const history = useRouterHistory(createHistory)({
  basename: '/'
});
/*var createStoreWithMiddleware = compose(
  applyMiddleware(thunkMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

var store = createStoreWithMiddleware(rootReducer);*/
//改善后的写法，
var store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f // redux工具
  )
)
var router = require('./router')(history);

ReactDOM.render(
  <Provider store={store}>
    {router}
  </Provider>,
  document.getElementById('root')
);
