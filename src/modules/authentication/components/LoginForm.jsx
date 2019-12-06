import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import styles from './login.module.scss';


const LoginForm = ({
  handleInputChange,
  handleSignIn,
  errors,
  handleInputBlurred,
  blurredFields,
  handleForgotPassword
}) => (
  <form name="loginForm" className={styles.login_form} onSubmit={handleSignIn} noValidate>
    <div className={styles.welcome}>
      <FormattedMessage id="authentication.login.welcome" defaultMessage="Welcome" />
    </div>
    <div className={styles.column_wrapper}>
      <div className={styles.form_column}>
        <label htmlFor="email">
          <FormattedMessage id="authentication.login.email" defaultMessage="Enter your email" />
          <input
            placeholder="Email"
            type="email"
            name="email"
            noValidate
            required
            onChange={(e) => { handleInputChange('email', e.target.value); }}
            onBlur={() => { handleInputBlurred('email'); }}
          />
          { blurredFields.email && errors.emailEmpty ? (
            <small className={styles.error}>
              <FormattedMessage id="authentication.login.error.email_empty" defaultMessage="This field cannot be empty" />
            </small>) : null
          }
          {/* { blurredFields.email && errors.emailInvalid ? (
            <small className={styles.error}>
              <FormattedMessage id="authentication.login.error.email_invalid" defaultMessage="Enter a valid email address" />
            </small>) : null
          } */}
          { !blurredFields.email || (!errors.emailEmpty && !errors.emailInvalid) ? (
            <small className={styles.empty_error} />) : null }
        </label>
        <label htmlFor="loginPassword">
          <FormattedMessage id="authentication.login.password" defaultMessage="Please enter your password" />
          <input
            placeholder="Password"
            type="password"
            name="loginPassword"
            noValidate
            required
            onChange={(e) => { handleInputChange('password', e.target.value); }}
            onBlur={() => { handleInputBlurred('password'); }}
          />
          { blurredFields.password && errors.passwordEmpty ? (
            <small className={styles.error}>
              <FormattedMessage id="authentication.login.error.password_empty" defaultMessage="This field cannot be empty" />
            </small>) : <small className={styles.empty_error} />
          }
        </label>
        <div>
        <a href="Javascript:" onClick={() => handleForgotPassword()} className={styles.forgot_password}>
        <FormattedMessage id="authentication.login.forgot_password" defaultMessage="forgot password" />
        </a>
        </div>
      </div>
      {/* <div className={styles.divider_container}>
        <div className={styles.column_divider}>
          <div />
          <div />
        </div>
        <span>Or</span>
        <div className={styles.column_divider}>
          <div />
          <div />
        </div>
      </div>
      <div className={styles.form_column}>
        <div>SOCIAL LOGIN</div>
      </div> */}
    </div>
    {errors.invalidCredentials ? (
      <div className={`${styles.error} ${styles.invalid_credentials}`}>
        <FormattedMessage id="authentication.login.error.invalid_credentials" defaultMessage="Invalid Credentials" />
      </div>) : null}
    <div className={styles.button_wrapper}>
      <button
        type="submit"
        className={styles.button}
      >
        <FormattedMessage id="authentication.login.login" defaultMessage="Login" />
      </button>
    </div>
  </form>
);


LoginForm.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleSignIn: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    emailValid: PropTypes.bool
  }).isRequired,
  blurredFields: PropTypes.shape({
    emailValid: PropTypes.bool
  }).isRequired,
  handleInputBlurred: PropTypes.func.isRequired
};

export default LoginForm;
