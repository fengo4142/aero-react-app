import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import Permissions from 'react-redux-permissions';
import { ASSET_HOME_ROUTE } from '../../constants/RouterConstants';
import { connect } from 'react-redux';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** ****************************************************************************
 *  Components import
 * ****************** */
import Forbidden from '../Forbidden';
import List from './List';
import Builder from './Builder';
import Settings from './Settings';

import SectionHeader from '../../components/sectionHeader';
import IconButton from '../../components/iconButton';
import Separator from '../../components/separator';
import { fetchAssets } from './redux/actions';

/** ****************************************************************************
 *  Assets import
 * ***************** */
import styles from './List/assetList.module.scss';
import asset from '../../icons/assets.svg';
import settings from '../../icons/settings.svg';
// import search from '../../icons/search.svg';
import Search from '../../components/search/Search';

class AssetsLayout extends Component {
  constructor(){
    super();
    this.state = {
      searchQuery: ''
    };
  }
  

  handleSearch = (query) => {
    const { actionFetch } = this.props;
    this.setState({ searchQuery: query });
    actionFetch(query);
  }

  render() {
    const { match, history } = this.props;

    return (
      <Permissions allowed={['can_modify_airport_settings']} fallbackElement={<Forbidden />}>
        {/* *********** Asset Header *********** */}
        <SectionHeader icon={asset} translationID="assets.title" defaultTitle="Asset Management">
          <div className={styles.detailHeader}>
            <Search onSubmit={query => this.handleSearch(query)} />
            <IconButton icon={settings} onClick={() => { history.push(`${ASSET_HOME_ROUTE}settings`); }} />
            <Separator />
          </div>
        </SectionHeader>
        <Switch>
          <Route exact path={`${match.url}`} render={(props) => <List {...props} state={this.state.searchQuery} />} />
          <Route exact path={`${match.url}/map`} render={(props) => <Builder {...props} state={this.state.searchQuery} />} />
          <Route exact path={`${match.url}/settings`} render={(props) => <Settings {...props} state={this.state.searchQuery} />} />
        </Switch>
        <ToastContainer autoClose={2000} draggablePercent={60} />
      </Permissions>
    );
  }
}

AssetsLayout.propTypes = {
  match: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  assetList: PropTypes.arrayOf(PropTypes.shape({}))
};

const mapStateToProps = state => ({
  searchQuery: state.searchQuery
});

const mapDispatchToProps = dispatch => ({
  // fetch assets
  actionFetch: (query) => {
    dispatch(fetchAssets(query));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetsLayout);
