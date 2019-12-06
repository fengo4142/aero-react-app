/* global localStorage */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

/** ******************************************************************
 *  Redux import
 * ************* */
import { fetchLogs, clear } from '../redux/actions';
import { LOGS_HOME_ROUTE } from '../../../constants/RouterConstants';

/** ******************************************************************
 *  Components import
 * ************* */
import SectionHeader from '../../../components/sectionHeader';
import IconButton from '../../../components/iconButton';
import Separator from '../../../components/separator';
import Button from '../../../components/button';
import Table from './components/LogTable';

/** ******************************************************************
 *  Assets import
 * ************* */

import styles from '../../workorders/List/workOrderList.module.scss';
import settings from '../../../icons/settings.svg';
import preset from '../../../icons/Preset.svg';
import Paginator from '../../../components/paginator/paginator';
import Filter from './components/Filter';
import Modal from '../../../components/modal';
import OperationLogDetails from '../Details/OperationLogDetails';
import Search from '../../../components/search/Search';
import { getDatesFromRange } from '../../../utils/helpers';


const OperationLogList = ({ actionFetch, loglist, history, actionClear }) => {
  const [range, setRange] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState();


  // gets items from localstorage and sets up the dates.
  useEffect(() => {
    const storedRange = localStorage.getItem('log_range');
    let s; let f;
    if (storedRange) {
      [s, f] = getDatesFromRange(storedRange);
    } else {
      s = localStorage.getItem('log_start_date');
      f = localStorage.getItem('log_end_date');
    }
    if (s && f) {
      setRange({ s, f });
    } else {
      setRange({
        s: moment().format('YYYY-MM-DD'),
        f: moment().format('YYYY-MM-DD')
      });
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) actionFetch(1, range.s, range.f);
  }, [range]);

  const handleRowSelect = (e) => {
    setModal(true);
    setSelected(e);
  };

  const handleDateChange = (s, f, r) => {
    localStorage.setItem('log_start_date', s);
    localStorage.setItem('log_end_date', f);
    if (r) {
      localStorage.setItem('log_range', r);
    } else {
      localStorage.removeItem('log_range');
    }
    setRange({ s, f });
  };


  return (
    <div>
      <SectionHeader icon={preset} translationID="operations.loglist.title" defaultTitle="Operations log">
        <div className={styles.detailHeader}>
          <Search onSubmit={query => actionFetch(1, undefined, undefined, query)} />
          <IconButton icon={settings} onClick={() => { history.push(`${LOGS_HOME_ROUTE}settings`); }} />
          <Separator />
          <Button translationID="operations.loglist.new"
            defaultText="New Log" onClick={() => (history.push(`${LOGS_HOME_ROUTE}new`))}
          />
          <Separator />
        </div>
      </SectionHeader>
      {range.s && (
      <Filter dates={[moment(range.s), moment(range.f)]}
        onDateChange={handleDateChange}
      />
      )}
      <div className="container">
        <Table info={loglist.results} onSelect={handleRowSelect} />
        {initialized && (
        <Paginator key={range.s} max={Math.max(1, Math.ceil(loglist.count / 10))}
          onChange={e => actionFetch(e, range.s, range.f)}
        />
        )}
      </div>
      <Modal showIn={modal} onClose={() => { setModal(false); actionClear(); }}>
        <OperationLogDetails logID={selected} onClose={() => { setModal(false); actionClear(); }} />
      </Modal>
    </div>
  );
};

OperationLogList.propTypes = {
  actionFetch: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  loglist: state.opslogs.loglist
});

const mapDispatchToProps = dispatch => ({
  // Fetch Log list
  actionFetch: (page, start, end, query) => {
    dispatch(fetchLogs(page, start, end, query));
  },
  // Fetch Log list
  actionClear: () => {
    dispatch(clear());
  }
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(OperationLogList);
