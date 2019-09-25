import { combineReducers } from 'redux'

let initialState = {
  files: []
}

if (global.window) {
  initialState = JSON.parse(global.window.__REDUX_STATE__.fileReducer)
}

export const fileReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_FILES':
      return {
        ...state,
        files: action.payload
      }
    default:
      return state;
  }
}

export const rootReducer = combineReducers({
  fileReducer,
})