import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Permissions from 'react-redux-permissions';
import { injectIntl } from 'react-intl';

import { changeCurrentPage } from '../../general_redux/actions';

import OpsSettingsHeader from '../../components/opsSettingsHeader';
import Map from './Map';
import Forbidden from '../Forbidden';

class SettingsLayout extends Component {
  constructor(props) {
    super(props);
    const { intl: { formatMessage } } = this.props;
  }

  componentDidMount() {
    const { actionUpdateCurrentPage } = this.props;
    actionUpdateCurrentPage('home');
  }

  render() {
    const { match } = this.props;
    return (
      <Permissions allowed={['can_modify_airport_settings']} fallbackElement={<Forbidden />}>
        <OpsSettingsHeader />
        <Map />
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
