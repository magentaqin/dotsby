/* eslint-disable import/prefer-default-export */
const replacer = (match) => {
  let left = match.slice(0, 4);
  const right = match.slice(-5);
  let text = match.slice(4, -5);
  const id = text.toLowerCase().split(' ').join('-');
  left = left.replace('>', ` id="${id}">`)
  text = `<a href="#${id}">${text}</a>`
  return left + text + right;
}

export const formatTitle = (htmlContent) => {
  const regx = /<h[2-6]>.*?<\/h[2-6]>/g;
  return htmlContent.replace(regx, replacer);
}
