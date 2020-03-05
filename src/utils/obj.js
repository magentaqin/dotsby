export const shallowOmit = (obj, omitKey) => {
  const newObj = {}
  Object.keys(obj).forEach(key => {
    if (omitKey !== key) {
      newObj[key] = obj[key]
    }
  })
  return newObj;
}

export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
}