/* global document, navigator */
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './config/store';
import axios from 'axios';
import cookie from 'react-cookies';

import './styles/index.scss';

import * as serviceWorker from './serviceWorker';
import ApolloClinet from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloLink } from "apollo-link";
import Routes from './config/routes';
import Auth from './utils/Auth';

import { fetchUserProfile, fetchTranslations } from './modules/authentication/redux/actions';

// axios.defaults.baseURL = 'https://backend.' + window.location.hostname + '/api';
axios.defaults.baseURL = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && window.location.hostname.indexOf('app.') == -1
  ? process.env.REACT_APP_BACKEND_HOST
  : 'https://backend.' + window.location.hostname + '/api';

const chatUrl = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
  ? process.env.REACT_APP_GRQPHQL_HOST
  : 'https://graphql.chat.' + window.location.hostname + '/graphql';

store.dispatch(fetchUserProfile());
store.dispatch(fetchTranslations());

const httpLink = createHttpLink({
  uri: chatUrl
});

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = Auth.getInstance().getAuthToken();
  operation.setContext({
      headers: {
          Authorization: token ? `${token}` : ''
          // 'X-Api-Key': process.env.REACT_APP_GRQPHQL_API_KEY
      }
  });
  return forward(operation);
});

// use with apollo-client
const link = middlewareLink.concat(httpLink);

const client = new ApolloClinet({
  link: link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Routes />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
