import express from 'express';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from '../index';

const PORT = 8080;
const app = express();

const html = (body: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Dotsby</title>
</head>
<body>
  <div id="root">${body}</div>
</html>
`;

const render = (req: any, res: any) => {
  const appHtml = ReactDOMServer.renderToString(React.createElement(App));
  res.send(html(appHtml));
}

app.get('*', render);

app.listen(PORT,  () => console.log('Example app listening on port 8080!'));
