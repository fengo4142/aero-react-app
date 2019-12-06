import React from 'react';
import PropTypes from 'prop-types';
import styles from './selectInput.module.scss';


const SelectOption = ({ text, onClick }) => (
  <div role="button" tabIndex="0"
    className={styles.option} onClick={onClick} onKeyPress={onClick}
  >
    {text}
  </div>
);

SelectOption.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default SelectOption;
