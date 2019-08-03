import express from 'express';
import React  from 'react';
import ReactDOMServer from 'react-dom/server';
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'
import App from '../index';
import config from '../config';

const app = express();

const httpLink = createHttpLink({
  uri: `http://localhost:4000/graphql`,
  fetch
})

const client = new ApolloClient({
  ssrMode: true,
  link: httpLink,
  cache: new InMemoryCache()
})

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

const EnhancedApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)

const render = (req, res) => {
  getDataFromTree(EnhancedApp).then(() => {
    const content = ReactDOMServer.renderToString(<EnhancedApp />);
    const initialState = client.extract();

    const html = <Html content={content} state={initialState} />;

    res.status(200);
    res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`);
    res.end();
  });
}

app.get('*', render);

app.listen(config.config.port.app,  () => console.log(
  `Example app listening on port ${config.config.port.app}!`
));
