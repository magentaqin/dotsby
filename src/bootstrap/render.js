import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../index.jsx';

const buildFilePath = path.resolve(__dirname, '../../build/index.html');

const render = (req, res) => {
  const html = ReactDOMServer.renderToString(<App />);
  console.log(html);

  fs.readFile(buildFilePath, 'utf8', function(err, data) {
    if (err) {
      console.error('read build file error:', err);
      return res.status(404).end();
    }
    const document = data.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
    res.send(document);
  })
}

export default render;