/* eslint-disable react/prop-types */
/* eslint-disable import/first */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */

import Express from 'express';
import { StaticRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux'
import React from 'react';
import path from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

import { logError } from '@src/utils/log';
import config from '@src/config';
import Layout from '@src/App';
import { getDocumentInfo } from '@src/server/request';
import { setDocumentInfo } from '@src/store/reducerActions/document';
import { setSectionsInfo } from '@src/store/reducerActions/sections';

import store from '@src/store';


const port = config.port.ssrServer;
const htmlFilePath = path.resolve(__dirname, '..', '..', './build', './index.html');

const context = {};
const sheet = new ServerStyleSheet();

const Html = ({ content, state }) => (
  <React.Fragment>
    <div id="root" dangerouslySetInnerHTML={{ __html: content }}></div>
    <script dangerouslySetInnerHTML={{
      __html: `window.__REDUX_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
    }} />
  </React.Fragment>
)

export const bootstrap = () => {
  const app = new Express();


  fs.readFile(htmlFilePath, 'utf8', (_err, htmlData) => {
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
      console.log('RECEIVEORIGINALURL', req.originalUrl)
      try {
        getDocumentInfo({ document_id: 123123 }).then(resp => {
          console.log('----sent request--')
          const { data } = resp.data;
          const { document_id, sections, ...rest } = data
          const sectionIds = []
          const sectionMap = {}

          /**
           * set sections info
           */
          sections.forEach(section => {
            const { section_id, section_title, pages } = section;
            const pagesInfo = []
            pages.forEach(page => {
              pagesInfo.push(page)
            })
            sectionIds.push(section_id)
            sectionMap[section_id] = {
              section_id,
              section_title,
              pagesInfo,
            }
          })

          /**
             * set document info
             */
          const documentInfo = {
            ...rest,
            id: document_id,
            sectionIds,
          }

          store.dispatch(setDocumentInfo(documentInfo))
          store.dispatch(setSectionsInfo(sectionMap))

          const App = (
            <StaticRouter location={req.originalUrl} context={context}>
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

          if (req.originalUrl === '/' && context.url) {
            console.log('**REDIRECT**', context.url)
            return res.redirect(301, context.url)
          }

          const html = <Html content={content} state={initialState} />;

          // send response
          res.status(200);
          const styleTags = sheet.getStyleTags();
          const responseData = htmlData.replace(
            '<div id="root"></div>',
            ReactDOMServer.renderToStaticMarkup(html),
          ).replace(
            '</head>',
            `${styleTags}</head>`,
          )
          res.send(responseData);
          res.end();
        }).catch(err => {
          console.error(err)
        })
      } catch (error) {
        console.error(error)
      } finally {
        sheet.seal();
      }
    })
  });


  app.listen(port, () => console.log( // eslint-disable-line no-console
    `app Server is now running on http://localhost:${port}`,
  ));
}
