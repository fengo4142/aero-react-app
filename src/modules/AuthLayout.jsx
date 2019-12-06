import React from 'react';
import {
  Route,
  // Redirect,
  withRouter
} from 'react-router-dom';

import { LOGIN_ROUTE } from '../constants/RouterConstants';

import Login from './authentication/Login';


const AuthLayout = () => (
    <>
      <Route path={LOGIN_ROUTE} component={Login} />
      {/* <Redirect to={LOGIN_ROUTE} /> */}
    </>
);

export default withRouter(AuthLayout);
