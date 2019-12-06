import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Permissions from 'react-redux-permissions';

import Forbidden from '../Forbidden';
import InspectionList from './List';
import InspectionBuilder from './Builder';
import complete from './Complete';
import SubmissionDetail from './Detail/SubmissionDetail';


const InspectionLayout = ({ match }) => (
  <Permissions allowed={['view_inspection']} fallbackElement={<Forbidden />}>
    <Switch>
      <Route exact path={`${match.url}/start`} component={complete.StartInspection} />
      <Route exact path={`${match.url}/new`} component={InspectionBuilder} />
      <Route exact path={`${match.url}/:id`} component={SubmissionDetail} />
      <Route exact path={`${match.url}/:id/edit`} component={InspectionBuilder} />
      <Route exact path={`${match.url}/:id/complete`} component={complete.CompleteInspection} />
      <Route exact path={`${match.url}/:id/:aid/edit-inspection`} component={complete.EditInspection} />
      <Route exact path={`${match.url}`} component={InspectionList} />

    </Switch>
  </Permissions>
);

InspectionLayout.propTypes = {
  match: PropTypes.shape({}).isRequired
};

export default InspectionLayout;
