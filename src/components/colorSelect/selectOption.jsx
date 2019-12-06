import React from 'react';
import PropTypes from 'prop-types';
import styles from './colorSelect.module.scss';


const SelectOption = ({ text, color, icon, onClick }) => (
  <div
    role="button"
    tabIndex="0"
    className={styles.option}
    onClick={onClick}
    onKeyPress={onClick}
  >
    {color && <span style={{ backgroundColor: color }} />}
    {icon && <span className={styles.image} style={{ backgroundImage: `url(${icon})` }} />}
    {text}
  </div>
);

SelectOption.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
  icon: PropTypes.string
};

SelectOption.defaultProps = {
  color: '',
  icon: undefined
};

export default SelectOption;
