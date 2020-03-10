const shallowOmit = (obj, omitKey) => {
  const newObj = {}
  Object.keys(obj).forEach(key => {
    if (omitKey !== key) {
      newObj[key] = obj[key]
    }
  })
  return newObj;
}

module.exports = {
  shallowOmit,
}