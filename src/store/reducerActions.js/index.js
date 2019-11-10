import { combineReducers } from 'redux'
import { documentReducer } from './document'
import sections from './sections'
import pages from './pages'

// let initialState = {
//   files: [],
// }

// if (process.env.NODE_ENV === 'production') {
//   if (window.__REDUX_STATE__) {
//     const reduxState = window.__REDUX_STATE__;
//     initialState = JSON.parse(JSON.stringify(reduxState)).fileReducer;
//   }
// } else if (global.window && global.window.__REDUX_STATE__) {
//   initialState = JSON.parse(global.window.__REDUX_STATE__).fileReducer;
// }

// export const fileReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'SET_FILES':
//       return {
//         ...state,
//         files: action.payload,
//       }
//     default:
//       return state;
//   }
// }

// export const rootReducer = combineReducers({
//   fileReducer,
// })

const rootReducer = combineReducers({
  documentReducer,
  sectionsReducer: sections.sectionsReducer,
  pagesReducer: pages.pagesReducer,
})

export default rootReducer;
