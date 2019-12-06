import React from 'react';
import PropTypes from 'prop-types';
import styles from './spinner.module.scss';

const Spinner = ({ active, size, className }) => (
  <div className={`
    ${className}
    ${styles.spinner}
    ${active ? styles.active : ''}
  `}
    style={{ width: size, height: size }}
  />
);

Spinner.propTypes = {
  active: PropTypes.bool,
  size: PropTypes.string,
  className: PropTypes.string
};

Spinner.defaultProps = {
  active: false,
  size: '20px',
  className: ''
};
export default Spinner;
