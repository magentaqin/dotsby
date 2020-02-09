/* eslint-disable prefer-destructuring */
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
import { getDocumentInfo, getPageInfo } from '@src/server/request';
import { setDocumentInfo } from '@src/store/reducerActions/document';
import { setSectionsInfo } from '@src/store/reducerActions/sections';
import { setPagesInfo } from '@src/store/reducerActions/pages';
import reducer from '@src/store/reducerActions';
import { docRegx, pageRegx } from '@src/utils/regx';


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

const dispatchDocInfo = (data, store) => {
  const { document_id, sections, ...rest } = data
  const sectionIds = []
  const sectionMap = {}

  // set sections info
  sections.forEach(section => {
    const { section_id, title, pages } = section;
    const pagesInfo = []
    pages.forEach(page => {
      pagesInfo.push(page)
    })
    sectionIds.push(section_id)
    sectionMap[section_id] = {
      section_id,
      title,
      pagesInfo,
    }
  })

  const documentInfo = {
    ...rest,
    id: document_id,
    sectionIds,
  }

  store.dispatch(setDocumentInfo(documentInfo))
  store.dispatch(setSectionsInfo(sectionMap))
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

const fetchDocumentInfo = async (store, document_id, version) => {
  console.log('FETCH DOC INFO')
  let docFetchErrStatus;
  const resp = await getDocumentInfo({ document_id, version }).catch(err => { docFetchErrStatus = err.status });
  if (!docFetchErrStatus) {
    dispatchDocInfo(resp.data.data, store);
  }
  return docFetchErrStatus;
}

const fetchPageInfo = async (store, document_id, page_id) => {
  console.log('FETCH PAGE INFO');
  let pageErrFetchStatus;
  const info = {}
  const resp = await getPageInfo({ document_id, page_id }).catch(err => { pageErrFetchStatus = err.status; })
  if (!pageErrFetchStatus) {
    const { page_id } = resp.data.data
    info[page_id] = resp.data.data
    store.dispatch(setPagesInfo(info))
  }
  return pageErrFetchStatus;
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

const handlePageNotFound = (res) => {
  const html = '<h1>Oops...Page Not Found.</h1>';
  res.status(404);
  res.send(html);
  res.end();
}

const handleIndexPage = (res) => {
  const html = '<h1>Welcome to Dotsby Api Docs Generator.</h1>'
  res.status(200);
  res.send(html);
  res.end();
}

export const bootstrap = () => {
  const app = new Express();


  fs.readFile(htmlFilePath, 'utf8', (_err, htmlData) => {
    // handle static resources.
    app.use(Express.static(buildFolderPath));

    app.get('/*', async(req, res) => {
      console.log('RECEIVEORIGINALURL', req.originalUrl)
      if (req.originalUrl === '/') {
        return handleIndexPage(res)
      }

      if (!docRegx.test(req.originalUrl)) {
        return handlePageNotFound(res);
      }
      // create store on every request.
      const store = createStore(reducer);
      try {
        let document_id;
        let page_id;
        const version = req.originalUrl.split('?')[1].split('=')[1];
        if (pageRegx.test(req.originalUrl)) {
          document_id = req.originalUrl.split('/')[1];
          page_id = req.originalUrl.split('?')[0].split('/page/')[1];
        } else {
          document_id = req.originalUrl.split('?')[0].slice(1);
        }

        // fetch document info and store it
        const docFetchErrStatus = await fetchDocumentInfo(store, document_id, version); // server store.
        if (docFetchErrStatus) {
          return docFetchErrStatus >= 500 ? handleServerError(res) : handlePageNotFound(res);
        }

        // fetch page info and store
        if (pageRegx.test(req.originalUrl)) {
          const pageFetchErrStatus = await fetchPageInfo(store, document_id, page_id);
          if (pageFetchErrStatus) {
            return pageFetchErrStatus >= 500 ? handleServerError(res) : handlePageNotFound(res);
          }
        }

        const App = getApp(req, context, store)
        const content = ReactDOMServer.renderToString(App);
        console.log('context.url', context.url)
        if (context.url && !pageRegx.test(req.originalUrl)) {
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
