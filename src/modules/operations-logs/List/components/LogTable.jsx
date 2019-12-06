import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import moment from 'moment';
import styles from '../../../../styles/general.module.scss';
import { INSPECTIONS_HOME_ROUTE } from '../../../../constants/RouterConstants';
import Clickable from '../../../../components/clickable/Clickable';

const LogTable = ({ info, onSelect }) => {
  const getLinkForSource = (source) => {
    let result = '';
    if (source) {
      switch (source.type) {
        case 'inspection':
          result = `${INSPECTIONS_HOME_ROUTE}${source.id}`;
          break;
        default:
          break;
      }
    }
    return result;
  };
  return (
    <table className={`${styles.table} ${styles.evenWidth}`}>
      <thead>
        <tr>
          <th>
            <FormattedMessage id="operations.loglist.date" defaultMessage="Date" />
          </th>
          <th>
            <FormattedMessage id="operations.loglist.loggedby" defaultMessage="Logged By" />
          </th>
          <th>
            <FormattedMessage id="operations.loglist.category" defaultMessage="Type" />
          </th>
          <th>
            <FormattedMessage id="operations.loglist.subcategory" defaultMessage="Sub Type" />
          </th>
          <th>
            <FormattedMessage id="operations.loglist.desc" defaultMessage="Description" />
          </th>
          <th width="80">
            <FormattedMessage id="operations.loglist.source" defaultMessage="Source" />
          </th>
          <th width="90" />
        </tr>
      </thead>
      <tbody>
        {info.map(e => (
          <tr key={e.id}>
            <td className={styles.date}>{(moment(e.report_date)).format('MM/DD/YYYY hh:mm A')}</td>
            <td>
              {e.logged_by.fullname}
              <div className={styles.subtitle}>
                {e.logged_by.roles[0].name}
              </div>
            </td>
            <td>{e.type}</td>
            <td>{e.subtype}</td>
            <td>{e.description}</td>
            <td>
              {e.source
              && <Link style={{ opacity: 1 }} to={getLinkForSource(e.source)}>Source</Link>}
            </td>
            <td>
              <Clickable className={styles.link} onClick={() => onSelect(e.id)}>Details</Clickable>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

LogTable.propTypes = {
  info: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
export default LogTable;
