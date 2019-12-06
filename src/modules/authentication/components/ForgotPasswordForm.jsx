import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styles from './change_password.module.scss';


const ForgotPasswordForm = ({
  handleInputChange,
  blurredFields,
  errors,
  handleInputBlurred,
  handleForgotPasswordForm,
}) => (

  <form name="ForgotPasswordForm" className={styles.form} onSubmit={handleForgotPasswordForm} noValidate>
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
          { errors.emailInvalid ? (
            <small className={styles.error}>
              <FormattedMessage id="authentication.login.error.email_invalid" defaultMessage="Enter a valid email address" />
            </small>) : null
          }
          { !blurredFields.email || (!errors.emailEmpty && !errors.emailInvalid) ? (
            <small className={styles.empty_error} />) : null }
        </label>
    </div>
    <div className={styles.button_wrapper}>
        <button
          type="submit"
          className={styles.button}
        >
          <FormattedMessage id="authentication.force_reset_password.header" defaultMessage="Reset your password" />
        </button>
    </div>
  </form>
);


ForgotPasswordForm.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    emailValid: PropTypes.bool
  }).isRequired,
  blurredFields: PropTypes.shape({
    emailValid: PropTypes.bool
  }).isRequired,
  handleInputBlurred: PropTypes.func.isRequired,
  handleForgotPasswordForm: PropTypes.func.isRequired,
};

export default ForgotPasswordForm;
