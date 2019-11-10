
const setDocumentInfoActionType = 'DOCUMENT/SET_DOCUMENT_INFO';

export const setDocumentInfo = (documentInfo) => ({
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
