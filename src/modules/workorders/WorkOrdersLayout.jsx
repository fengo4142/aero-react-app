import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Permissions from 'react-redux-permissions';

import Forbidden from '../Forbidden';
import List from './List';
import Create from './Create';
import Detail from './Detail';
import Builder from './Builder';


const WorkOrdersLayout = ({ match }) => (
  <Permissions allowed={['view_workorder']} fallbackElement={<Forbidden />}>
    <Switch>
      <Route exact path={`${match.url}`} component={List} />
      <Route exact path={`${match.url}/start`} component={Create} />
      <Route exact path={`${match.url}/settings`} component={Builder} />
      <Route exact path={`${match.url}/:id/detail`} component={Detail} />
    </Switch>
  </Permissions>
);

WorkOrdersLayout.propTypes = {
  match: PropTypes.shape({}).isRequired
};

export default WorkOrdersLayout;
