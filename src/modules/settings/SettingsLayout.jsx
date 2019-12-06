import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Permissions from 'react-redux-permissions';
import { injectIntl } from 'react-intl';

import { changeCurrentPage } from '../../general_redux/actions';

import SettingsHeader from '../../components/settingsHeader';
import Forbidden from '../Forbidden';
import Organization from './Organization';
import Roles from './Roles';
import Users from './Users';
import Language from './Language';
import Shortcuts from '../../components/topbar/shortcuts/shortcuts';

class SettingsLayout extends Component {
  constructor(props) {
    super(props);
    const { intl: { formatMessage } } = this.props;
    this.links = [
      { url: '/', name: formatMessage({ id: 'shortcuts.aerobot' }) },
      { url: '/todo', name: formatMessage({ id: 'shortcuts.todo' }) },
      { url: '/messenger', name: formatMessage({ id: 'shortcuts.chat' }) },
      { url: '/settings/organization', name: formatMessage({ id: 'shortcuts.settings' }), permissions: ['can_modify_airport_settings'] }
    ];
  }

  componentDidMount() {
    const { actionUpdateCurrentPage } = this.props;
    actionUpdateCurrentPage('home');
  }

  render() {
    const { match } = this.props;
    return (
      <Permissions allowed={['can_modify_airport_settings']} fallbackElement={<Forbidden />}>
        <Shortcuts links={this.links} />
        <SettingsHeader />
        <Route path={`${match.url}/organization`} component={Organization} />
        <Route path={`${match.url}/roles`} component={Roles} />
        <Route path={`${match.url}/users`} component={Users} />
        <Route path={`${match.url}/language`} component={Language} />
      </Permissions>
    );
  }
}


const mapStateToProps = state => ({
  currentModule: state.general.currentModule
});

const mapDispatchToProps = dispatch => ({
  actionUpdateCurrentPage: (page) => {
    dispatch(changeCurrentPage(page));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SettingsLayout));
