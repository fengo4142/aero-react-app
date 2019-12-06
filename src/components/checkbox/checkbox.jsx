import React from 'react';
import PropTypes from 'prop-types';

import styles from './checkbox.module.scss';

const Checkbox = ({ id, label, onChange, checked }) => (
  <div className={styles.checkbox}>
    <input type="checkbox" id={id} onChange={onChange} defaultChecked={checked} />
    <label htmlFor={id}>{label}</label>
  </div>
);

Checkbox.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool
};

Checkbox.defaultProps = {
  checked: false
};

export default Checkbox;
