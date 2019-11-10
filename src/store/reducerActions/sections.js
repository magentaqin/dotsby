
const setSectionsInfoActionType = 'SECTIONS/SET_SECTIONS_INFO';

export const setSectionsInfo = (sections) => ({
  type: setSectionsInfoActionType,
  payload: sections,
})

const initialState = {
  sections: {},
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