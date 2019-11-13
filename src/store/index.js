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


let initialState;
if (window.__REDUX_STATE__) {
  initialState = JSON.parse(JSON.stringify(window.__REDUX_STATE__))
}

const store = createStore(
  rootReducer,
  initialState,
  reduxDevTools,
)

export default store;
