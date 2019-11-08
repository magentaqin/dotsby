import React from 'react';
import ReactDOM from 'react-dom';
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

ReactDOM.render(
  <App />,
  document.getElementById('root'),
)
