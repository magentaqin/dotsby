/* eslint-disable prefer-rest-params */
const debounce = function(func, wait) {
  let timer;
  return function() {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  }
}

export default debounce;
