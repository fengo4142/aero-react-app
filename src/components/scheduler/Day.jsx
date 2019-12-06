import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Clickable from '../clickable/Clickable';
import styles from './scheduler.module.scss';

const Day = ({ day, onClick, active }) => (
  <Clickable className={`${styles.day} ${active ? styles.active : ''}`}
    onClick={() => onClick(day.id)}
  >
    <FormattedMessage id={day.code} title={day.code} />
  </Clickable>
);

Day.propTypes = {
  day: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool
};

Day.defaultProps = {
  active: false
};
export default Day;
