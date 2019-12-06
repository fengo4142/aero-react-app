import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import styles from '../../../inspections.module.scss';
import { INSPECTIONS_HOME_ROUTE } from '../../../../../constants/RouterConstants';

const Table = ({ data }) => {
  
  const hideSection = (value) => {
    const element = document.getElementById(value);
    if (window.getComputedStyle(element, null).display === 'none') {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
  };
  return (
    <table className={styles.table} cellSpacing="0">
      <thead>
        <tr>
          <th><FormattedMessage id="inspections.list.table.type" defaultMessage="Type of Inspection" /></th>
          <th><FormattedMessage id="inspections.list.table.issues" defaultMessage="Issues found" /></th>
          <th><FormattedMessage id="inspections.list.table.inspected_by" defaultMessage="Inspected By" /></th>
          <th><FormattedMessage id="inspections.list.table.date" defaultMessage="Date" /></th>
          <th colSpan="2"><FormattedMessage id="inspections.list.table.weather" defaultMessage="Weather Conditions" /></th>
        </tr>
      </thead>
      {
        Object.keys(data).map(k => (
          <React.Fragment key={k}>
            <thead className={styles.sectionHeader}>
              <tr onClick={() => hideSection(`table-${k}`)}
                onKeyPress={() => hideSection(`table-${k}`)}
              >
                {/* <th colSpan="6">
                  <div className={styles.label}>
                    {data[k].label}
                  </div>
                </th> */}
              </tr>
            </thead>
            {data[k].entries && (
            <tbody id={`table-${k}`}>
              {data[k].entries.map(e => (
                <tr key={e.id}>
                  <td>{e.inspection}</td>
                  <td>{e.issues}</td>
                  <td>{e.inspected_by.fullname}</td>
                  <td>{(new Date(e.inspection_date)).toLocaleDateString()}</td>
                  <td>{e.weather_conditions.title}</td>
                  <td>
                    <Link to={`${INSPECTIONS_HOME_ROUTE}${e.id}`}>View</Link>
                  </td>
                </tr>
              ))}
              {!data[k].entries.length && (
                <tr><td colSpan={5}><FormattedMessage id="inspections.list.table.no_results" defaultMessage="There are no inspections on the selected range" /></td></tr>
              )}
            </tbody>
            )}
          </React.Fragment>
        ))
      }
    </table>
  );
};

Table.propTypes = {
  data: PropTypes.shape({}).isRequired
};
export default Table;
