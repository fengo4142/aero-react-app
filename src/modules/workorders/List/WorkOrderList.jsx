import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Permissions from 'react-redux-permissions';

import { fetchWorkOrderList } from '../redux/actions';
import SectionHeader from '../../../components/sectionHeader';
import IconButton from '../../../components/iconButton';
import Button from '../../../components/button';
import Separator from '../../../components/separator';
import Panel from '../../../components/panel';

import Table from './components/Table';
import Map from './components/Map';
/** ******************************************************************
 *  Assets import
 * ************* */

import settings from '../../../icons/settings.svg';
// import search from '../../../icons/search.svg';
import Search from '../../../components/search/Search';
import styles from './workOrderList.module.scss';
import workOrder from '../../../icons/WorkOrder.svg';
import { WORKORDERS_HOME_ROUTE } from '../../../constants/RouterConstants';

class WorkOrderList extends Component {
  state = { workorderdatapriority:0}

  componentDidMount() {
    const { actionList } = this.props;
    actionList();
  }

  goToStart = () => {
    const { history } = this.props;
    history.push(`${WORKORDERS_HOME_ROUTE}start`);
  }


  render() {
    const { workorders, user, history, actionList, translations } = this.props;
    const translationMap = (translations && translations[user.language])
      ? translations[user.language] : {};
      const {workorderdatapriority}= this.state;
    return (
      <div className={styles.list}>
        <SectionHeader icon={workOrder} translationID="workorders.title" defaultTitle="Work Orders">
          <div className={styles.detailHeader}>
            <Search onSubmit={query => actionList(query)} />
            <Permissions allowed={['add_workorderschema']}>
              <IconButton icon={settings} onClick={() => { history.push(`${WORKORDERS_HOME_ROUTE}settings`); }} />
              <Separator />
            </Permissions>
            <Permissions allowed={['add_workorder']}>
              <Button translationID="workorders.newWorkOrder"
                defaultText="New Work order" onClick={this.goToStart}
              />
              <Separator />
            </Permissions>
          </div>
        </SectionHeader>
        <div className={`container ${styles.container}`}>
          <div className={styles.info}>
            <Panel title="workorders.list.summary" defaultTitle="Work Order Summary">
              <div className={styles.stats}>
                <span className={styles.statsMaintenance}>
                  {workorders.filter(e => e.status === 1).length}
                </span>
                <FormattedMessage id="workorders.list.maintenance_review" defaultMessage="Maintenance Review" />
                <a href="javascript:" onClick= {() => this.setState({workorderdatapriority:1})}>
                  <FormattedMessage id="workorders.list.view_all" defaultMessage="View All" />
                </a>  
              </div>
              <div className={styles.stats}>
                <span className={styles.statsOperations}>
                  {workorders.filter(e => e.status === 2).length}
                </span>
                <FormattedMessage id="workorders.list.operations_review" defaultMessage="Operations Review" />
                <a href="javascript:" onClick= {() => this.setState({workorderdatapriority:2})}>
                  <FormattedMessage id="workorders.list.view_all" defaultMessage="View All" />
                </a>
              </div>
            </Panel>
            <Panel title="workorders.list.open" defaultTitle="Open Work Orders"> 
            {this.state.workorderdatapriority !== 0 ? <Map workorders ={workorders.filter(e => e.status === workorderdatapriority) } /> 
              :<Map workorders={workorders} defaultLocation={user.airport.location.coordinates} />}
            </Panel>
          </div>
          {this.state.workorderdatapriority !== 0 ? <Table info ={ workorders.filter(e => e.status === workorderdatapriority)} translations={translations} /> 
              : <Table info={workorders} translations={translationMap} /> }
        </div>
      </div>
    );
  }
}


WorkOrderList.propTypes = {
  history: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  workorders: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  action: PropTypes.shape({}).isRequired,
  actionList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  workorders: state.workorders.workorders,
  action: state.workorders.action,
  user: state.auth.profile,
  translations: state.auth.translations
});

const mapDispatchToProps = dispatch => ({
  // Fetch inspection
  actionList: (query) => {
    dispatch(fetchWorkOrderList(query));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkOrderList);
