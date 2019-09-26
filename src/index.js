import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './App';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom"
import store from './store';

const App = () => (
  <Provider store={store}>
    <Router>
      <Layout />
    </Router>
  </Provider>
)

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

