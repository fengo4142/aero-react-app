/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';

import styles from './button.module.scss';

const Button = ({ onClick, translationID, defaultText, type, action, disabled }) => (
  <button type={type} className={`${styles.button} ${styles[action]}`} onClick={onClick} disabled={disabled} style={disabled ? {pointerEvents: "none", opacity: "0.4"} : {}} >
    <FormattedMessage id={translationID} defaultMessage={defaultText} />
  </button>
);

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  translationID: PropTypes.string.isRequired,
  defaultText: PropTypes.string.isRequired,
  action: PropTypes.string
};

Button.defaultProps = {
  onClick: () => {},
  type: 'button',
  action: 'primary'
};
export default withRouter(Button);
