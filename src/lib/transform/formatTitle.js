/* eslint-disable import/prefer-default-export */
const replacer = (subtitles) => (match) => {
  const left = match.slice(0, 4);
  const right = match.slice(-5);
  const text = match.slice(4, -5);
  const id = text.toLowerCase().split(' ').join('-');
  const hashLink = `<a href="#${id}" class="hash-link">#</a>`;

  subtitles.push(text);

  return `${left + text}<a class="anchor" id="${id}"></a>${hashLink}${right}`;
}

export const formatTitle = (htmlContent, subtitles) => {
  const regx = /<h[2-6]>.*?<\/h[2-6]>/g;
  return htmlContent.replace(regx, replacer(subtitles));
}
