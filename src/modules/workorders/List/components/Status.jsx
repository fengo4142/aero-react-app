import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styles from '../workOrderList.module.scss';

const Status = ({ item }) => {
  const options = {
    1: {
      style: styles.maintenance,
      name: 'maintenance'
    },
    2: {
      style: styles.operations,
      name: 'operations'
    },
    3: {
      style: styles.completed,
      name: 'completed'
    }
  };
  return (
    <div className={options[item].style}>
      <FormattedMessage id={`workorders.list.table.status.${options[item].name}`} defaultMessage="Unknown status" />
    </div>
  );
};

Status.propTypes = {
  item: PropTypes.number.isRequired
};
export default Status;
