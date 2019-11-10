const setPagesInfoActionType = 'PAGES/SET_PAGES_INFO'

const setPagesInfo = (pages) => ({
  type: setPagesInfoActionType,
  payload: pages,
})


const initialState = {
  pages: {},
}


const pagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case setPagesInfoActionType:
      return {
        ...state,
        pages: action.payload,
      }
    default:
      return state;
  }
}

export default {
  pagesReducer,
  setPagesInfo,
}

/**
 * example
 * const pagemap = {
 *  @pageid: {
 *    page_title: '',
 *    is_root_path: '',
 *    path: '',
 *  }
 * }
 */