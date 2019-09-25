import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './App';
import { Provider } from 'react-redux'

// import { config } from '../src/config';
// import { ApolloProvider } from 'react-apollo'
// import { ApolloClient } from 'apollo-client'
// import { createHttpLink } from 'apollo-link-http'
// import { InMemoryCache } from 'apollo-cache-inmemory'
import store from './store';

// const httpLink = createHttpLink({
//   uri: `http://localhost:${config.port.graphqlServer}`
// })

// const client = new ApolloClient({
//   link: httpLink,
//   cache: new InMemoryCache()
// })

// ReactDOM.render(
//   <ApolloProvider client={client}>
//     <App />
//   </ApolloProvider>,
//   document.getElementById('root')
// );

const App = () => (
  <Provider store={store}>
    <Layout />
  </Provider>
)

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

