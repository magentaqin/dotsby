
const setSectionsInfoActionType = 'SECTIONS/SET_SECTIONS_INFO';

export const setSectionsInfo = (sections) => ({
  type: setSectionsInfoActionType,
  payload: sections,
})

let initialState = {
  sections: {},
}

if (process.env.NODE_ENV === 'production') {
  // render on server
  if (global.window && global.window.__REDUX_STATE__) {
    initialState = JSON.parse(JSON.stringify(global.window.__REDUX_STATE__)).sectionsReducer;
  }


  // render on browser
  if (window && window.__REDUX_STATE__) {
    initialState = JSON.parse(JSON.stringify(window.__REDUX_STATE__)).sectionsReducer;
  }
}

export const sectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case setSectionsInfoActionType:
      return {
        ...state,
        sections: action.payload,
      }
    default:
      return state;
  }
}
