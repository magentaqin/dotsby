import { combineReducers } from 'redux'

const initialState = {
  files: []
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