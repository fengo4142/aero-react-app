import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import Collapsible from '../../../components/collapsible/Collapsible';

import styles from './change_password.module.scss';


const ForceChangePasswordForm = ({
  handleInputChange,
  handleForcedPasswordChange,
  checkPasswordMatch,
  passwordMatches,
  invalidPassword
}) => (
  <form name="forceResetPasswordForm" className={styles.form} onSubmit={handleForcedPasswordChange} noValidate>
    <div className={styles.header}>
      <FormattedMessage id="authentication.force_reset_password.header" defaultMessage="Reset your password" />
    </div>
    <div>
      <FormattedMessage id="authentication.force_reset_password.info" defaultMessage="You need to set a new password to complete the sign up process" />
    </div>
    <label htmlFor="newPassword">
      <FormattedMessage id="authentication.force_reset_password.new_password" defaultMessage="New password" />
      <input
        type="password"
        name="newPassword"
        onChange={(e) => { handleInputChange('newPassword', e.target.value); }}
      />
    </label>
    <label htmlFor="confirmPassword">
      <FormattedMessage id="authentication.force_reset_password.confirm_password" defaultMessage="Confirm password" />
      <input
        type="password"
        name="confirmPassword"
        onChange={(e) => { handleInputChange('confirmPassword', e.target.value); }}
        onBlur={(e) => { checkPasswordMatch(e.target.value); }}
      />
    </label>
    {passwordMatches ? null : (
      <div className={styles.error}>
        <small>
          <FormattedMessage id="authentication.force_reset_password.password_mismatch" defaultMessage="Password and confirmation do not match" />
        </small>
      </div>)}
    {invalidPassword ? (
      <div className={`${styles.error} ${styles.invalidPassword}`}>
        <small>
          <FormattedMessage id="authentication.force_reset_password.invalid_password" defaultMessage="The password is invalid" />
        </small>
      </div>) : null}
    <Collapsible title="password_policy.title" styleClasses={styles.collapsible}>
      <span>
        <FormattedMessage id="password_policy.intro" defaultMessage="The password must contain all of the following characteristics" />
      </span>
      <ul>
        <li>
          <FormattedMessage id="password_policy.length" defaultMessage="At least 8 characters" />
        </li>
        <li>
          <FormattedMessage id="password_policy.uppercase" defaultMessage="At least one uppercase character" />
        </li>
        <li>
          <FormattedMessage id="password_policy.lowercase" defaultMessage="At least one lowercase character" />
        </li>
        <li>
          <FormattedMessage id="password_policy.special_char" defaultMessage="At least one special character" />
        </li>
        <li>
          <FormattedMessage id="password_policy.numbers" defaultMessage="At least one number" />
        </li>
      </ul>
    </Collapsible>
    <div className={styles.button_wrapper}>
      <button
        type="submit"
        className={styles.button}
      >
        <FormattedMessage id="authentication.force_reset_password.change_password" defaultMessage="Change password" />
      </button>
    </div>
  </form>
);


ForceChangePasswordForm.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleForcedPasswordChange: PropTypes.func.isRequired,
  checkPasswordMatch: PropTypes.func.isRequired,
  passwordMatches: PropTypes.bool.isRequired,
  invalidPassword: PropTypes.bool.isRequired
};

export default ForceChangePasswordForm;
