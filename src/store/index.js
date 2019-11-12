import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from './reducerActions';

let reduxDevTools;
if (process.env.NODE_ENV === 'production') {
  if (global.window && global.window.__REDUX_DEVTOOLS_EXTENSION__) {
    reduxDevTools = global.window.__REDUX_DEVTOOLS_EXTENSION__()
  }
  if (window && window.__REDUX_DEVTOOLS_EXTENSION__) {
    reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__()
  }
}

if (process.env.NODE_ENV === 'development') {
  reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
}

const store = createStore(
  rootReducer,
  reduxDevTools,
)

export default store;
