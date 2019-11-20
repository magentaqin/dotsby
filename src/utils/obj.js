/* eslint-disable import/prefer-default-export */
export const shallowOmit = (obj, omitKey) => {
  const newObj = {}
  Object.keys(obj).forEach(key => {
    if (omitKey !== key) {
      newObj[key] = obj[key]
    }
  })
  return newObj;
}
