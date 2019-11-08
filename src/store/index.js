import { createStore, applyMiddleware, compose } from 'redux'
import { rootReducer } from './reducerActions.js';


const store = createStore(
  rootReducer,
)

export default store;
