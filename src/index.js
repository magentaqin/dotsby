import React from 'react';
import ReactDOM, { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import Layout from './App';
import store from './store';

const history = createBrowserHistory();

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <Layout />
    </Router>
  </Provider>
)

if (process.env.NODE_ENV === 'development') {
  ReactDOM.render(
    <App />,
    document.getElementById('root'),
  )
}

if (process.env.NODE_ENV === 'production') {
  hydrate(
    <App />,
    document.getElementById('root'),
  )
}
