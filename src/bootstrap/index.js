import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import Express from 'express';
import { StaticRouter } from 'react-router';
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from 'node-fetch'
import React  from 'react';
import path from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { logError } from '../utils/log';
import { config } from '../config';
import Layout from '../App';

const basePort = config.port.ssrServer;
const graphqlServerPort = config.port.graphqlServer;
const htmlFilePath = path.resolve(__dirname, '..', '..', './build', './index.html');

const context = {};

const Html = ({ content, state }) => {
  return (
    <React.Fragment>
      <div id="root" dangerouslySetInnerHTML={{ __html: content }}></div>
      <script dangerouslySetInnerHTML={{
        __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
      }} />
    </React.Fragment>
  )
}

export const bootstrap = () => {
  const app = new Express();

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
    const client = new ApolloClient({
      ssrMode: true,
      // Connect SSR server to API server. Ensure it isn't firewalled.
      link: createHttpLink({
        uri: `http://localhost:${graphqlServerPort}`,
        fetch,
        credentials: 'same-origin',
        headers: {
          cookie: req.header('Cookie'),
        },
      }),
      cache: new InMemoryCache(),
    });

    // The client-side App will instead use <BrowserRouter>
    const App = (
      <ApolloProvider client={client}>
        <StaticRouter location={req.url} context={context}>
          <Layout />
        </StaticRouter>
      </ApolloProvider>
    );

    fs.readFile(htmlFilePath, 'utf8', (err, htmlData) => {
        // rendering
      getDataFromTree(App).then(() => {
        const content = ReactDOMServer.renderToString(App);
        const initialState = client.extract();

        const html = <Html content={content} state={initialState} />;

        // send response
        res.status(200);
        const responseData = htmlData.replace(
          '<div id="root"></div>',
          ReactDOMServer.renderToStaticMarkup(html)
        );
        res.send(responseData);
        res.end();
      }).catch(err => logError(err));
    })
  });


  app.listen(basePort, () => console.log( // eslint-disable-line no-console
    `app Server is now running on http://localhost:${basePort}`
  ));
}