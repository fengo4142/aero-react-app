import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Permissions from 'react-redux-permissions';
import Forbidden from './Forbidden';

import ProfileView from '../components/topbar/profile/View/ProfileView';
import ProfileEdit from '../components/topbar/profile/View/ProfileEdit';
import ChangePasswordForm from '../components/topbar/profile/View/ChangePasswordForm'
class ProfileLayout extends Component {
  render() {
    const { match } = this.props;
    return (
      // <Permissions allowed={['view_workorder']} fallbackElement={<Forbidden />}>
        <Switch>
          <Route exact path={`${match.url}`} component={ProfileView} />
          <Route exact path={`${match.url}/edit`} component={ProfileEdit} />
          <Route exact path={`${match.url}/changePassword`} component={ChangePasswordForm}/>
        </Switch>
      // </Permissions>
    );
  }
}


const mapStateToProps = state => ({
  currentModule: state.general.currentModule
});

export default connect(
  mapStateToProps
)(ProfileLayout);
