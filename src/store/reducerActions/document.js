
const setDocumentInfoActionType = 'DOCUMENT/SET_DOCUMENT_INFO';

export const setDocumentInfo = (documentInfo) => ({
  type: setDocumentInfoActionType,
  payload: documentInfo,
})

const initialState = {
  document: {
    id: '',
    version: '',
    title: '',
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
