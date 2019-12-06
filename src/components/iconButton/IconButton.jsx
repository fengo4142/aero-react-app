import React from 'react';
import PropTypes from 'prop-types';

import styles from './iconButton.module.scss';

const IconButton = ({ icon, onClick }) => (
  <button type="button" className={styles.iconButton}
    onClick={onClick}
  >
    <img src={icon} alt="" />
  </button>
);

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

IconButton.defaultProps = {
  onClick: undefined
};
export default IconButton;
