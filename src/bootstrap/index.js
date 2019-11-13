/* eslint-disable react/prop-types */
/* eslint-disable import/first */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */

import Express from 'express';
import { StaticRouter } from 'react-router-dom';
import { createStore } from 'redux'
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
import reducer from '@src/store/reducerActions';


const port = config.port.ssrServer;
const buildFolderPath = path.resolve(__dirname, '..', '..', './build');
const htmlFilePath = path.resolve(buildFolderPath, './index.html');

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

const dispatchToStore = (data, reduxStore) => {
  const { document_id, sections, ...rest } = data
  const sectionIds = []
  const sectionMap = {}
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

  const documentInfo = {
    ...rest,
    id: document_id,
    sectionIds,
  }

  reduxStore.dispatch(setDocumentInfo(documentInfo))
  reduxStore.dispatch(setSectionsInfo(sectionMap))
}


const getApp = (req, context, store) => {
  return (
    <StaticRouter location={req.originalUrl} context={context}>
      <ReduxProvider store={store}>
        <StyleSheetManager sheet={sheet.instance}>
          <Layout />
        </StyleSheetManager>
      </ReduxProvider>
    </StaticRouter>
  )
}

const fetchDocumentInfo = async (store) => {
  let hasError = false;
  console.log('--FETCH REQUEST--')
  const resp = await getDocumentInfo({ document_id: 123123 }).catch(err => console.log(err));
  if (!resp || !resp.data || !resp.data.data) {
    hasError = true
  } else {
    dispatchToStore(resp.data.data, store);
  }
  return hasError;
}

const handleSuccess = (store, content, htmlData, res) => {
  const initialState = store.getState();
  const html = <Html content={content} state={initialState} />;
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
}

const handleServerError = (res) => {
  const html = '<h1>Server Error. Try Again.</h1>';
  res.status(500);
  res.send(html);
  res.end();
}


export const bootstrap = () => {
  const app = new Express();


  fs.readFile(htmlFilePath, 'utf8', (_err, htmlData) => {
    // handle static resources.
    app.use('/static', Express.static(path.resolve(buildFolderPath, 'static')));
    app.use('/images', Express.static(path.resolve(buildFolderPath, 'images')));
    app.use('/dotsby.ico', Express.static(path.resolve(buildFolderPath, 'dotsby.ico')));
    app.use('/manifest.json', Express.static(path.resolve(buildFolderPath, 'manifest.json')));

    app.use('*', async(req, res) => {
      console.log('RECEIVEORIGINALURL', req.originalUrl)
      const store = createStore(reducer);
      try {
        const hasError = await fetchDocumentInfo(store); // server store.
        if (hasError) {
          handleServerError(res)
          return;
        }

        const App = getApp(req, context, store)
        const content = ReactDOMServer.renderToString(App);

        if (req.originalUrl === '/' && context.url) {
          console.log('**REDIRECT**', context.url)
          return res.redirect(301, context.url)
        }

        // put the server store in response to init the client store.
        handleSuccess(store, content, htmlData, res)
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
