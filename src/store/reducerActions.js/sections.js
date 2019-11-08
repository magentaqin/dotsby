
const setSectionsInfoActionType = 'SECTIONS/SET_SECTIONS_INFO';

const setSectionsInfo = (sections) => ({
  type: setSectionsInfoActionType,
  payload: sections,
})

const initialState = {
  sections: {},
}


const sectionsReducer = (state = initialState, action) => {
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

export default {
  setSectionsInfo,
  sectionsReducer,
}


/**
 * const sectionPageMap = {
 *   '@section_id': {
 *      section_title: '',
 *      pagesInfo: [
 *        {
 *          page_title: '',
 *          page_id: @pageId,
 *        }
 *    ]
 *   }
 * }
 */