const setPagesInfoActionType = 'PAGES/SET_PAGES_INFO'

export const setPagesInfo = (pages) => ({
  type: setPagesInfoActionType,
  payload: pages,
})


const initialState = {
  pages: {},
}

export const pagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case setPagesInfoActionType:
      return {
        ...state,
        pages: {
          ...action.payload,
        }
      }
    default:
      return state;
  }
}

