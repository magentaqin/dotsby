import { combineReducers } from 'redux'
import { documentReducer } from './document'
import { sectionsReducer } from './sections'
import { pagesReducer } from './pages'

const rootReducer = combineReducers({
  documentReducer,
  sectionsReducer,
  pagesReducer,
})

export default rootReducer;
