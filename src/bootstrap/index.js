import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import Express from 'express';
import { StaticRouter } from 'react-router';
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from 'node-fetch'
import React  from 'react';
import ReactDOMServer from 'react-dom/server';
import { logError } from '../utils/log';
import { config } from '../config';
import Layout from '../index';

const bootstrap = () => {
  const basePort = config.port.ssrServer;
  const graphqlServerPort = config.port.graphqlServer;

  function Html({ content, state }) {
    return (
      <html>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
          <script dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
          }} />
        </body>
      </html>
    );
  }
  const app = new Express();

  app.use((req, res) => {

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

    const context = {};

    // The client-side App will instead use <BrowserRouter>
    const App = (
      <ApolloProvider client={client}>
        <StaticRouter location={req.url} context={context}>
          <Layout />
        </StaticRouter>
      </ApolloProvider>
    );

    // rendering
    getDataFromTree(App).then(() => {
      const content = ReactDOMServer.renderToString(App);
      const initialState = client.extract();

      const html = <Html content={content} state={initialState} />;

      res.status(200);
      res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`);
      res.end();
    }).catch(err => logError(err));
  });

  app.listen(basePort, () => console.log( // eslint-disable-line no-console
    `app Server is now running on http://localhost:${basePort}`
  ));
}

export {
  bootstrap
}