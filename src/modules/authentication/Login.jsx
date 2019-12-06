
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';

import {
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

import Auth from '../../utils/Auth';

import { updateUserProfile, fetchUserProfile, fetchTranslations } from './redux/actions';

import LoginForm from './components/LoginForm';
import ForceChangePasswordForm from './components/ForceChangePasswordForm';

//import airplane from './icons/Logo.svg';
import AeroLogo from './icons/Logo.png';

import windowPlane from './icons/Window-1.svg';
import windowSky from './icons/Window-2.svg';

import styles from './authentication.module.scss';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ChangeForgotPasswordForm from './components/ChangeForgotPasswordForm';
import ProfileEdit from '../../components/topbar/profile/View/ProfileEdit';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 'login',
      newPassword: '',
      confirmPassword: '',
      verificationCode:'',
      passwordMatches: true,
      errors: {
        emailEmpty: true,
        passwordEmpty: true,
        invalidCredentials: false,
        invalidPassword: false,
        emailInvalid: false
      },
      blurredFields: {
        email: false,
        password: false,
        newPassword: false,
        confirmPassword: false
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleForcedPasswordChange = this.handleForcedPasswordChange.bind(this);
    this.handleNewPasswordRequired = this.handleNewPasswordRequired.bind(this);
    this.checkPasswordMatch = this.checkPasswordMatch.bind(this);
    this.validateFormFields = this.validateFormFields.bind(this);
    this.handleInputBlurred = this.handleInputBlurred.bind(this);
    this.handleAuthError = this.handleAuthError.bind(this);
    this.handleForgotPassword = this.handleForgotPassword.bind(this);
    this.handleForgotPasswordForm = this.handleForgotPasswordForm.bind(this);
    this.handleChangeForgotPassword = this.handleChangeForgotPassword.bind(this);
    this.handleChangeForgotPasswordForm = this.handleChangeForgotPasswordForm.bind(this);
    this.handleProfileEdit = this.handleProfileEdit.bind(this);
  }

  validateFormFields(inputType, value) {
    let errors = {};
    let emailValid;
    switch (inputType) {
      case 'email':
        if (value === '') {
          errors = Object.assign(errors, { emailEmpty: true, emailInvalid: false });
        } else {
          emailValid = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(value);
          errors = Object.assign(errors, { emailEmpty: false, emailInvalid: !emailValid });
        }
        break;
      case 'password':
        errors = Object.assign(errors, { passwordEmpty: value === '' });
        break;
      default:
        break;
    }
    this.setState(prevState => ({
      errors: Object.assign({}, prevState.errors, errors)
    }));
  }

  handleInputChange(inputType, value) {
    this.setState({
      [inputType]: value
    }, () => this.validateFormFields(inputType, value));
  }

  handleInputBlurred(inputType) {
    this.setState(prevState => ({
      blurredFields: Object.assign({}, prevState.blurredFields, {
        [inputType]: true
      })
    }));
  }

  checkPasswordMatch() {
    const { newPassword, confirmPassword } = this.state;

    if (newPassword !== '' && confirmPassword !== '') {
      this.setState({
        passwordMatches: (newPassword === confirmPassword)
      });
    } else {
      this.setState({ passwordMatches: true });
    }
  }

  handleForcedPasswordChange(e) {
    const { newPassword, cognitoUser, passwordMatches } = this.state;
    const { history, actionFetchUserProfile, actionFetchTranslations } = this.props;
    e.preventDefault();

    this.checkPasswordMatch();
    if (!passwordMatches) {
      return;
    }
    cognitoUser.completeNewPasswordChallenge(newPassword, [], {
      onSuccess: (result) => {
        Auth.getInstance().setAuthToken(result.getAccessToken().getJwtToken());
        actionFetchUserProfile();
        actionFetchTranslations();
        this.handleProfileEdit();
      },
      onFailure: this.handleAuthError
    });
  }

  handleAuthError(error) {
    switch (error.code) {
      case 'NotAuthorizedException':
      case 'UserNotFoundException':
        this.setState(prevState => ({
          errors: Object.assign({}, prevState.errors, {
            invalidCredentials: true
          })
        }));
        this.setState(prevState => ({
          errors: Object.assign({}, prevState.errors, {
            emailInvalid: true
          })
        }));
        break;
      case 'InvalidPasswordException':
        this.setState(prevState => ({
          errors: Object.assign({}, prevState.errors, {
            invalidPassword: true
          })
        }));
        break;
      case 'InvalidParameterException':
          this.setState(prevState => ({
            errors: Object.assign({}, prevState.errors, {
              emailInvalid: true
            })
          }));
        break;
      default:
        break;
    }
  }

  // XXX: Check if necessary
  // handleNewPasswordRequired(userAttributes, requiredAttributes) {
  handleNewPasswordRequired(e) {
    this.setState({
      currentPage: 'forceChangePassword'
    });
  }

  handleForgotPassword() {
    this.setState({
      currentPage: 'forgot'
    });
  }

  handleChangeForgotPassword = () =>  {
    this.setState({
      currentPage: 'ChangeForgotpassword'
    });
  }

  handleProfileEdit() {
    this.setState({
      currentPage: 'profile'
    })
  }

  handleForgotPasswordForm(e) {
    e.preventDefault();
    const { email, errors } = this.state;
    if (errors.emailEmpty || errors.emailInvalid) {
      this.setState(prevState => ({
        blurredFields: Object.assign({}, prevState.blurredFields, {
          email: true,
        })
      }));
      return;
    }

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: Auth.getInstance().getUserPool()
    });

    cognitoUser.forgotPassword({
      onSuccess: () => {
          this.handleChangeForgotPassword();
      },
      onFailure: (err) => {
          this.handleAuthError(err);
      },

  });

}

  handleChangeForgotPasswordForm (e) {
    e.preventDefault();
    const {verificationCode, newPassword, email, errors} = this.state;
    const {history} = this.props;

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: Auth.getInstance().getUserPool()
    });
    cognitoUser.confirmPassword(verificationCode, newPassword,
        {onSuccess: () => {
            history.push('/')
        },
        onFailure: function() {
          errors.invalidPassword = true
        },
        }
      );
  }

  handleSignIn(e) {
    e && e.preventDefault();
    this.setState(prevState => ({
      errors: Object.assign({}, prevState.errors, {
        invalidCredentials: false
      })
    }));
    const { email, password, errors, newPassword, currentPage} = this.state;
    if (errors.emailEmpty || errors.emailInvalid || errors.passwordEmpty) {
      this.setState(prevState => ({
        blurredFields: Object.assign({}, prevState.blurredFields, {
          email: true,
          password: true
        })
      }));
      return;
    }

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: currentPage === 'profile' ? newPassword : password
    });

    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: Auth.getInstance().getUserPool()
    });

    this.setState({ cognitoUser });

    const {
      storeUserProfile,
      history,
      actionFetchUserProfile,
      actionFetchTranslations } = this.props;

    storeUserProfile(cognitoUser);
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        Auth.getInstance().setAuthToken(result.getAccessToken().getJwtToken());
        Auth.getInstance().setIDToken(result.getIdToken().getJwtToken());
        let token = result.getIdToken().getJwtToken().split('.')[1];
        token = Buffer.from(token, 'base64').toString();
        // cookie.save('backend_url', JSON.parse(token)['custom:backend_url'], { path: '/' })
        // axios.defaults.baseURL = JSON.parse(token)['custom:backend_url'];
        // axios.defaults.baseURL = 'https://backend.' + window.location.hostname + '/api';
        axios.defaults.baseURL = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && window.location.hostname.indexOf('app.') == -1
          ? process.env.REACT_APP_BACKEND_HOST
          : 'https://backend.' + window.location.hostname + '/api';
        actionFetchUserProfile();
        actionFetchTranslations();
        history.push('/');
      },
      onFailure:this.handleAuthError,
      newPasswordRequired: this.handleNewPasswordRequired
    });
  }
  
  render() {
    const { currentPage, passwordMatches, errors, blurredFields } = this.state;
    let formToRender;
    if (currentPage === 'login') {
      formToRender = (
        <LoginForm
          handleInputChange={this.handleInputChange}
          handleSignIn={this.handleSignIn}
          errors={errors}
          blurredFields={blurredFields}
          handleInputBlurred={this.handleInputBlurred}
          handleForgotPassword={this.handleForgotPassword}
        />
      );
    } else if (currentPage === 'forceChangePassword') {
      formToRender = (
        <ForceChangePasswordForm
          handleInputChange={this.handleInputChange}
          handleForcedPasswordChange={this.handleForcedPasswordChange}
          checkPasswordMatch={this.checkPasswordMatch}
          passwordMatches={passwordMatches}
          invalidPassword={errors.invalidPassword}
        />
      );
    } else if (currentPage === 'forgot') {
      formToRender = (
        <ForgotPasswordForm
          handleInputChange={this.handleInputChange}
          errors={errors}
          blurredFields={blurredFields}
          handleInputBlurred={this.handleInputBlurred}
          handleForgotPasswordForm={this.handleForgotPasswordForm}
        />
      );
    } else if (currentPage === 'ChangeForgotpassword') {
      formToRender = (
        <ChangeForgotPasswordForm
          handleInputChange={this.handleInputChange}
          handleChangeForgotPasswordForm={this.handleChangeForgotPasswordForm}
          invalidPassword={errors.invalidPassword}
        />
      );
    } 
    else if (currentPage === 'profile') {
      formToRender = (
        <ProfileEdit
            currentPage={currentPage}
            handleSignIn={this.handleSignIn}
        />
      );
    } 
    return (
      <div className={styles.authentication}>
        <div className={styles.logo_container}>
          <img src={AeroLogo} alt="logo" style={{maxWidth:"550px"}}/>
          {/* <div className={styles.brand}> aerosimple </div> */}
        </div>
        <div className={styles.form_container}>
          <img src={windowSky} className={styles.window_sky} alt="window_sky" />
          {formToRender}
          <img src={windowPlane} className={styles.window_plane} alt="window_plane" />
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  // Dispatch redux functions
  storeUserProfile: PropTypes.func.isRequired,
  actionFetchUserProfile: PropTypes.func.isRequired,
  actionFetchTranslations: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = dispatch => ({
  // Update profile
  storeUserProfile: (profile) => {
    dispatch(updateUserProfile(profile));
  },
  actionFetchUserProfile: () => {
    dispatch(fetchUserProfile());
  },
  actionFetchTranslations: () => {
    dispatch(fetchTranslations());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Login));
