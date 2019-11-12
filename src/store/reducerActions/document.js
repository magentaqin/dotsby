
const setDocumentInfoActionType = 'DOCUMENT/SET_DOCUMENT_INFO';

export const setDocumentInfo = (documentInfo) => ({
  type: setDocumentInfoActionType,
  payload: documentInfo,
})

let initialState = {
  document: {
    id: 0,
    document_token: '',
    version: 0,
    doc_title: '',
    is_private: false,
    sectionIds: [],
  },
}


if (process.env.NODE_ENV === 'production') {
  // render on server
  if (global.window && global.window.__REDUX_STATE__) {
    initialState = JSON.parse(JSON.stringify(global.window.__REDUX_STATE__)).documentReducer;
  }

  // render on browser
  if (window && window.__REDUX_STATE__) {
    initialState = JSON.parse(JSON.stringify(window.__REDUX_STATE__)).documentReducer;
  }
}


export const documentReducer = (state = initialState, action) => {
  switch (action.type) {
    case setDocumentInfoActionType:
      return {
        ...state,
        document: action.payload,
      }
    default:
      return state;
  }
}
