
import React from 'react';

import {
  Route,
  Redirect
} from 'react-router-dom';

import Auth from '../../utils/Auth';

import { LOGIN_ROUTE } from '../../constants/RouterConstants';


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.getInstance().isAuthenticated() === true
      ? <Component {...props} />
      : <Redirect to={LOGIN_ROUTE} />
  )}
  />
);


export default PrivateRoute;
