import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Permissions from 'react-redux-permissions';
import { injectIntl } from 'react-intl';

import { changeCurrentPage } from '../general_redux/actions';
import Shortcuts from '../components/topbar/shortcuts/shortcuts';
import InspectionLayout from './inspections/InspectionLayout';
import WorkOrdersLayout from './workorders/WorkOrdersLayout';
import AssetsLayout from './assets-management/AssetsLayout';
// import Settings from './opsSettings/Settings';
import SettingsLayout from './opsSettings/SettingsLayout';
import Forbidden from './Forbidden';
import OperationsLogBuilder from './operations-logs/Builder/OperationLogBuilder';
import OperationsLogList from './operations-logs/List/OperationLogList';
import OperationsLogCreate from './operations-logs/Create/OperationLogCreate';

class OperationsLayout extends Component {
  componentDidMount() {
    const { actionUpdateCurrentPage } = this.props;
    const { intl: { formatMessage } } = this.props;
    actionUpdateCurrentPage('operations');

    this.links = [
      { url: '/ops/inspections/', name: formatMessage({ id: 'shortcuts.inspections' }), permissions: ['view_inspection'] },
      { url: '/ops/workorders/', name: formatMessage({ id: 'shortcuts.workorders' }), permissions: ['view_workorder'] },
      { url: '/ops/assets/', name: formatMessage({ id: 'shortcuts.assets' }) },
      { url: '/ops/logs', name: formatMessage({ id: 'shortcuts.opslog' }), permissions: [] },
      { url: '/ops/settings', name: formatMessage({ id: 'shortcuts.settings' }), permissions: ['view_inspection'] },
    ];
  }

  render() {
    const { match, user } = this.props;
    return (
      //<Permissions allowed={['view_workorder']} fallbackElement={<Forbidden />}>
      <Permissions fallbackElement={<Forbidden />}>
        {user.language && <Shortcuts links={this.links} />}      
          <Switch>
            <Route path={`${match.url}/inspections`} component={InspectionLayout} />
            <Route path={`${match.url}/workorders`} component={WorkOrdersLayout} />
            <Route path={`${match.url}/assets`} component={AssetsLayout} />
            <Route path={`${match.url}/settings`} component={SettingsLayout} />
            <Route exact path={`${match.url}/logs`} component={OperationsLogList} />
            <Route exact path={`${match.url}/logs/settings`} component={OperationsLogBuilder} />
            <Route exact path={`${match.url}/logs/new`} component={OperationsLogCreate} />
            <Route exact path={`${match.url}/logs/:id`} component={OperationsLogCreate} />
          </Switch>
      </Permissions>
    );
  }
}

WorkOrdersLayout.propTypes = {
  match: PropTypes.shape({}).isRequired,
  actionUpdateCurrentPage: PropTypes.func
};

const mapStateToProps = state => ({
  currentModule: state.general.currentModule,
  user: state.auth.profile
});

const mapDispatchToProps = dispatch => ({
  actionUpdateCurrentPage: (page) => {
    dispatch(changeCurrentPage(page));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(OperationsLayout));
