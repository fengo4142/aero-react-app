import React from 'react';
import PropTypes from 'prop-types';

import styles from './checkbox.module.scss';

const ControlledCheckbox = ({ id, onChange, checked }) => (
  <div className={styles.checkbox}>
    <input type="checkbox" id={id} readOnly
      onClick={(e) => { e.preventDefault(); onChange(); }} checked={checked || false}
    />
  </div>
);

ControlledCheckbox.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool
};

ControlledCheckbox.defaultProps = {
  checked: false
};

export default ControlledCheckbox;
