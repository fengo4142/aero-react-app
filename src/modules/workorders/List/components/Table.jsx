import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import { Link } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import { WORK_ORDERS_DETAIL, WORKORDERS_HOME_ROUTE} from '../../../../constants/RouterConstants';

import Status from './Status';

import styles from '../../../../styles/general.module.scss';

const Table = ({ info, translations }) => {
  const priorities = {
    0: 'workorders.list.table.priorities.low',
    1: 'workorders.list.table.priorities.medium',
    2: 'workorders.list.table.priorities.high'
  };
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <FormattedMessage id="workorders.list.table.work_order" defaultMessage="Work Order #" />
          </th>
          <th>
            <FormattedMessage id="workorders.list.table.category" defaultMessage="Category" />
          </th>
          <th>
            <FormattedMessage id="workorders.list.table.status" defaultMessage="Status" />
          </th>
          <th>
            <FormattedMessage id="workorders.list.table.reported" defaultMessage="Reported" />
          </th>
          <th>
            <FormattedMessage id="workorders.list.table.priority" defaultMessage="Priority" />
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {info.map(e => (
          <tr key={e.id}>
            <td>{e.id}</td>
            <td>{translations[e.category] || e.category}</td>
            <td><Status item={e.status} /></td>
            <td className={styles.date}>{(moment(e.report_date)).format('MM/DD/YYYY hh:mm A')}</td>
            <td>
              <FormattedMessage id={priorities[e.priority]} defaultMessage="Unknown Priority" />
            </td>
            <td>
              <Link to={`${WORKORDERS_HOME_ROUTE}${e.id}/${WORK_ORDERS_DETAIL}`}>
                <FormattedMessage id="workorders.list.table.action" defaultMessage="View" />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  info: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
export default Table;
