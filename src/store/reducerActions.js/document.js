
const setDocumentInfoActionType = 'DOCUMENT/SET_DOCUMENT_INFO';

const setDocumentInfo = (documentInfo) => ({
  type: setDocumentInfoActionType,
  payload: documentInfo,
})

const initialState = {
  document: {
    id: 0,
    document_token: '',
    version: 0,
    doc_title: '',
    is_private: false,
    sectionIds: [],
  },
}

const documentReducer = (state = initialState, action) => {
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

export default {
  setDocumentInfo,
  documentReducer,
}
