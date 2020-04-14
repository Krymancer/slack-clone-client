import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';

import { ApolloClient } from 'apollo-client';
import { HttpLink, createHttpLink } from 'apollo-link-http';
import { ApolloLink, Observable } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';

import * as serviceWorker from './serviceWorker';
import Routes from './routes';

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {}
  }
});

const request = async (operation) => {
  operation.setContext({
    headers: {
      'x-token': localStorage.getItem('token'),
      'x-refresh-token': localStorage.getItem('refreshToken'),
    }
  });
};

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle;
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer));

    return () => {
      if (handle) handle.unsubscribe();
    };
  })
);

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const refreshHeaders = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const token = response.headers.get('x-token');
    const refreshToken = response.headers.get('x-refresh-tokne');

    if (token) {
      localStorage.setItem('token', token);
    }

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);

    }

    return response;
  });
});

const link = ApolloLink.from([
  requestLink,
  httpLink,
]);

const client = new ApolloClient({
  link: link,
  cache: cache,
});


// const client = new ApolloClient({
//   uri: 'http://localhost:4000/graphql',
//   request: (operation) => {
//     operation.setContext({
//       headers: {
//         'x-token': localStorage.getItem('token'),
//         'x-refresh-token': localStorage.getItem('refreshToken'),
//       }
//     })
//   },
// });

const App = (
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  </React.StrictMode>
);


ReactDOM.render(
  App,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
