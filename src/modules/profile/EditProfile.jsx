import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Permissions from 'react-redux-permissions';

import Forbidden from '../Forbidden';
import Create from './Create';


const EditProfile = ({ match }) => (
  <Permissions fallbackElement={<Forbidden />}>
    <Switch>
      <Route exact path={`${match.url}/edit`} component={Create} />
    </Switch>
  </Permissions>
);

WorkOrdersLayout.propTypes = {
  match: PropTypes.shape({}).isRequired
};

export default EditProfile;
