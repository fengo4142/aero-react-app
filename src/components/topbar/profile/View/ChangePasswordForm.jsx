import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '../../../button';
import styles from './ProfileEdit.module.scss';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';
import Auth from '../../../../utils/Auth';
import SectionHeader from '../../../../components/sectionHeader';
import Shortcuts from '../../shortcuts/shortcuts';
import { updateUserProfile } from '../../../../../src/modules/authentication/redux/actions';
import Collapsible from '../../../collapsible/Collapsible'
import UserIcon from '../../../../icons/inspection-icons/icon-1.svg';
import { Link } from 'react-router-dom';
class ChangePasswordForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      email: '',
      newPassword: '',
      confirmPassword: '',
      oldPassword:'',
      passwordMatches: true,
      errors: {
        oldPassword: true,
        newPassword: true,
        confirmPassword:true
      },
      invalidOldPassword:false,
      invalidNewPassword:false,
    };

    this.handleResetPassword = this.handleResetPassword.bind(this);
  }
  
  handleChange = (event) =>  {
      const { name, value } = event.target;
      this.setState({ [name]: value }, () => this.setState(prevState => ({
        errors: Object.assign({}, prevState.errors, {
          [name]: true
        })
      })));
  }


  checkPasswordMatch = () =>  {
      const { newPassword, confirmPassword } = this.state;

      if (newPassword !==  confirmPassword) {
        this.setState({
          passwordMatches: (newPassword === confirmPassword)
        });
      } else {
        this.setState({ passwordMatches: true });
      }
  }

  checkEmptyFields = (e) => {
    const { errors, oldPassword, newPassword, confirmPassword } = this.state;
    if(oldPassword === '') {
      this.setState(prevState => ({
        errors: Object.assign({}, prevState.errors, {
          oldPassword: false
        })
      }));
      return;
    }
    else if(newPassword === '') {
      this.setState(prevState => ({
        errors: Object.assign({}, prevState.errors, {
          newPassword: false
        })
      }));
      return;

    } else if(confirmPassword === '') {
      this.setState(prevState => ({
        errors: Object.assign({}, prevState.errors, {
          confirmPassword: false
        })
      }));
      return;
    }

  }
  handleErrors = () => {
    this.setState({invalidOldPassword:true});
  }

  handleResetPassword (e) {
    e.preventDefault(); 
    const {oldPassword, newPassword, confirmPassword, passwordMatches, invalidNewPassword, invalidOldPassword, errors} = this.state;
    const { profile, history} = this.props;

    this.checkPasswordMatch();
    if (!passwordMatches) {
      return;
    }

    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      this.checkEmptyFields ();
      return;
    }

    const authDetails = new AuthenticationDetails({
      Username: profile.user.email,
      Password: oldPassword
    });

    const cognitoUser = new CognitoUser({
      Username: profile.user.email,
      Pool: Auth.getInstance().getUserPool()
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        Auth.getInstance().setAuthToken(result.getAccessToken().getJwtToken());
        Auth.getInstance().setIDToken(result.getIdToken().getJwtToken());
        let token = result.getIdToken().getJwtToken().split('.')[1];
        token = Buffer.from(token, 'base64').toString();
        axios.defaults.baseURL = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && window.location.hostname.indexOf('app.') == -1
          ? process.env.REACT_APP_BACKEND_HOST
          : 'https://backend.' + window.location.hostname + '/api';
        cognitoUser.changePassword(oldPassword, newPassword, function(err, result) {
          if (err) {
            this.setState({invalidNewPassword:true});
            return;
          }
          history.push('/')
        });
      },
      onFailure:this.handleErrors,
    });
  }

  links = [
    { url: '/', name: 'Aerobot' },
    { url: '/todo', name: 'To Do' },
    { url: '/settings/organization', name: 'Settings', permissions: ['can_modify_airport_settings'] }
  ]


  render(){

     const {errors, invalidOldPassword, invalidNewPassword} = this.state;

      return(
      <div>
      <Shortcuts links={this.links} />
      <form  name="ChangePasswordForm" className={styles.form} onSubmit={this.handleResetPassword}>
        <div className={styles.form}>
        <div className={styles.column}>
          <label htmlFor="oldPassword">
          <FormattedMessage id="authentication.force_reset_password.old_password" defaultMessage="old password" />
          <input
            type="password"
            name="oldPassword"
            onChange={this.handleChange}
            onBlur={this.checkEmptyFields}
          />
          </label>
          {errors.oldPassword ? null : (
          <div className={styles.error}>
            <small>
              <FormattedMessage id="authentication.login.error.password_empty" defaultMessage="This field cannot be empty" />
            </small>
          </div>)}
          {invalidOldPassword ? (
            <div className={`${styles.error} ${styles.invalidPassword}`}>
              <small>
                <FormattedMessage id="authentication.login.error.invalid_password" defaultMessage="The password is invalid" />
              </small>
            </div>) : null}
          <label htmlFor="newPassword">
          <FormattedMessage id="authentication.force_reset_password.new_password" defaultMessage="New password" />
          <input
            type="password"
            name="newPassword"
            value={this.state.newPassword}
            onChange={this.handleChange}
            onBlur={this.checkEmptyFields}     
          />
        </label>
        {errors.newPassword ? null : (
          <div className={styles.error}>
            <small>
              <FormattedMessage id="authentication.login.error.password_empty" defaultMessage="This field cannot be empty" />
            </small>
          </div>)}
        {invalidNewPassword ? (
            <div className={`${styles.error} ${styles.invalidPassword}`}>
              <small>
                <FormattedMessage id="authentication.force_reset_password.invalid_password" defaultMessage="The password is invalid" />
              </small>
            </div>) : null}
        <label htmlFor="confirmPassword">
          <FormattedMessage id="authentication.force_reset_password.confirm_password" defaultMessage="Confirm password" />
          <input
            type="password"
            name="confirmPassword"
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            onBlur={this.checkPasswordMatch}
          />
        </label>
        {errors.confirmPassword ? null : (
          <div className={styles.error}>
            <small>
              <FormattedMessage id="authentication.login.error.password_empty" defaultMessage="This field cannot be empty" />
            </small>
          </div>)}
        {this.state.passwordMatches ? null : (
          <div className={styles.error}>
            <small>
              <FormattedMessage id="authentication.force_reset_password.password_mismatch" defaultMessage="Password and confirmation do not match" />
            </small>
          </div>)}
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
        </Collapsible><br/><br/>
        
        <Button  type="submit" translationID="authentication.force_reset_password.header" defaultText="Reset Password" />
      </div>
      </div>
      </form>
      </div>
      );
    }
}

ChangePasswordForm.propTypes = {
 
}; 

const mapStateToProps = state => ({
  profile: state.auth.profile,
});

export default connect(
  mapStateToProps,
)(ChangePasswordForm);