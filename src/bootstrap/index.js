import Express from 'express';
import { StaticRouter } from 'react-router';
import { Provider as ReduxProvider } from 'react-redux'
import React  from 'react';
import path from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { logError } from '../utils/log';
import { config } from '../config';
import Layout, { query } from '../App';
import store from '../store';
import { setFiles } from '../store/actions'

import { httpRequest } from '../App/request';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

const basePort = config.port.ssrServer;
const graphqlServerPort = config.port.graphqlServer;
const htmlFilePath = path.resolve(__dirname, '..', '..', './build', './index.html');

const context = {};
const sheet = new ServerStyleSheet();

const Html = ({ content, state }) => {
  return (
    <React.Fragment>
      <div id="root" dangerouslySetInnerHTML={{ __html: content }}></div>
      <script dangerouslySetInnerHTML={{
        __html: `window.__REDUX_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
      }} />
    </React.Fragment>
  )
}

export const bootstrap = () => {
  const app = new Express();


  fs.readFile(htmlFilePath, 'utf8', (err, htmlData) => {

    // handle static resources.
    app.use('/static', Express.static(
      path.resolve(__dirname, '..', '..', 'build', 'static'),
    ));
    app.use('/images', Express.static(
      path.resolve(__dirname, '..', '..', 'build', 'images'),
    ));
    app.use('/dotsby.ico', Express.static(
      path.resolve(__dirname, '..', '..', 'build', 'dotsby.ico'),
    ));
    app.use('/manifest.json', Express.static(
      path.resolve(__dirname, '..', '..', 'build', 'manifest.json'),
    ));

    app.use('*', (req, res) => {

    // The client-side App will instead use <BrowserRouter>
    try {

      httpRequest.post('/', { query }).then(resp => {
        console.log(resp.data.data)
        store.dispatch(setFiles(resp.data.data.allFile.files))

        const App = (
          <StaticRouter location={req.url} context={context}>
            <ReduxProvider store={store}>
              <StyleSheetManager sheet={sheet.instance}>
                <Layout />
              </StyleSheetManager>
            </ReduxProvider>
          </StaticRouter>
        );
          // rendering
        const content = ReactDOMServer.renderToString(App);
        const initialState = store.getState();

        const html = <Html content={content} state={initialState} />;

        // send response
        res.status(200);
        const styleTags = sheet.getStyleTags();
        const responseData = htmlData.replace(
          '<div id="root"></div>',
          ReactDOMServer.renderToStaticMarkup(html)
        ).replace(
          '</head>',
          `${styleTags}</head>`
        )
        res.send(responseData);
        res.end();
      })

    } catch(error) {
      console.error(error)
    } finally {
      sheet.seal();
    }
  })

  });


  app.listen(basePort, () => console.log( // eslint-disable-line no-console
    `app Server is now running on http://localhost:${basePort}`
  ));
}