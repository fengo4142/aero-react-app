/* global localStorage */
import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'; 


import { IntlProvider, addLocaleData } from 'react-intl';
import localeEN from 'react-intl/locale-data/en';
import localeES from 'react-intl/locale-data/es';
import localeFR from 'react-intl/locale-data/fr';

import moment from 'moment/min/moment-with-locales';
import messagesFR from '../translations/fr.json';
import messagesEN from '../translations/en.json';
import messagesES from '../translations/es.json';

import PrivateRoute from '../components/privateRoute';

import MainLayout from '../modules/MainLayout';
import AuthLayout from '../modules/AuthLayout';


const messages = {
  es: messagesES,
  en: messagesEN,
  fr: messagesFR
};

addLocaleData([...localeEN, ...localeES, ...localeFR]);

const Routes = () => {
  const language = localStorage.getItem('lang') || 'en';
  moment.locale(language);
  return (
    <IntlProvider locale={language} messages={messages[language]}>
      <Router>
        <div className="app-container">
          <Switch>
            <Route path="/auth" component={AuthLayout} />
            <PrivateRoute path="/" component={MainLayout} />
          </Switch>
        </div>
      </Router>
    </IntlProvider>
  );
};


export default Routes;
