import jwt_decode from 'jwt-decode'; // eslint-disable-line camelcase

import { CognitoUserPool } from 'amazon-cognito-identity-js';

// eslint-disable-next-line
import { setHeaders } from '../config/axios';


const REFRESH_INTERVAL = 3000 * 1000; // Miliseconds
let instance = null;

export default class Auth {
  constructor() {
    if (!instance) {
      this.getAuthToken = this.getAuthToken.bind(this);
      this.setAuthToken = this.setAuthToken.bind(this);

      this.refreshUserToken = this.refreshUserToken.bind(this);
      this.refresherAction = this.refresherAction.bind(this);

      this.isAuthenticated = this.isAuthenticated.bind(this);
      this.isTokenExpired = this.isTokenExpired.bind(this);
      this.decodeToken = this.decodeToken.bind(this);

      this.logout = this.logout.bind(this);

      this.storage = window.localStorage;
      this.refresher = null;

      this.userPool = new CognitoUserPool({
        UserPoolId: `${process.env.REACT_APP_USER_POOL_ID}`,
        ClientId: `${process.env.REACT_APP_COGNITO_CLIENT_ID}`
      });
      instance = this;
    }
    return instance;
  }

  static getInstance() {
    if (instance === null) {
      instance = new Auth();
    }
    if (this.refresher === null) {
      this.refresher = setInterval(this.refresherAction, REFRESH_INTERVAL);
    }
    return instance;
  }

  getUserPool() {
    return this.userPool;
  }

  /*
   Returns JWT for the backend authentication.
   @returns {String} JWT.
  */
  getAuthToken() {
    return this.storage.getItem('token');
  }

  /*
   Returns ID token
   @returns {String} IDToken.
  */
  getIDToken() {
    return this.storage.getItem('idtoken');
  }

  /*
   Stores the JWT in the browser.
   @returns {String} token.
  */
  setAuthToken(newToken) {
    setHeaders(newToken);
    this.storage.setItem('token', newToken);
    if (this.refresher === null) {
      this.refresher = setInterval(this.refresherAction, REFRESH_INTERVAL);
    }
    return newToken;
  }

  /*
   Stores the IDToken in the browser.
   @returns {String} token.
  */
  setIDToken(newToken) {
    this.storage.setItem('idtoken', newToken);
    return newToken;
  }

  refreshUserToken() {
    const cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser !== null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          this.cleanStorage();
          clearInterval(this.refresher);
          return;
        }
        cognitoUser.refreshSession(session.getRefreshToken(), (error, newSession) => {
          if (error) {
            this.cleanStorage();
            clearInterval(this.refresher);
            return;
          }
          this.setAuthToken(newSession.getAccessToken().getJwtToken());
          this.setIDToken(newSession.getIdToken().getJwtToken());
        });
      });
    } else {
      this.cleanStorage();
    }
  }

  /* Indicates if a user is logged in.
   @returns {Boolean} Returns True if a user's token has not expired, and False otherwise.
  */
  isAuthenticated() {
    const res = !this.isTokenExpired();
    if (!res) {
      this.cleanStorage();
    }
    return res;
  }

  /*
   Returns True if the stored token has expired
   @returns {Boolean}
  */
  isTokenExpired() {
    const decoded = this.decodeToken();
    if (!decoded || typeof decoded.exp === 'undefined') {
      return true;
    }
    const d = new Date(0);
    d.setUTCSeconds(decoded.exp);
    if (d === null) {
      return true;
    }
    return ((new Date().valueOf()) > d.valueOf());
  }

  /*
   Decodes stored JWT.
   Does not validate signature.
   @returns {Object} Token decodificado.
  */
  decodeToken() {
    const token = this.getAuthToken();
    let decoded;
    try {
      decoded = jwt_decode(token);
    } catch (err) {
      decoded = null;
    }
    return decoded;
  }

  /*
   Clears user information.
  */
  logout() {
    this.cleanStorage();
    clearInterval(this.refresher);
  }

  /*
  Clears token from storage
  */
  cleanStorage() {
    this.storage.removeItem('token');
    const cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser !== null) {
      cognitoUser.signOut();
    }
  }

  refresherAction() {
    if (this.isAuthenticated()) {
      this.refreshUserToken();
    }
  }


  startRefresher() {
    if (this.refresher === null) {
      const decoded = this.decodeToken();
      if (decoded !== null) {
        const date = new Date(0); // The 0 here is the key, which sets the date to the epoch
        date.setUTCSeconds(decoded.exp);

        const now = new Date();
        const secondsUntilExpiration = Math.floor((date - now) / 1000);
        if (secondsUntilExpiration < 600) {
          this.refresherAction();
        } else if (secondsUntilExpiration < REFRESH_INTERVAL / 1000) {
          this.refresher = setInterval(this.refresherAction, (secondsUntilExpiration - 120) * 1000);
        } else {
          this.refresher = setInterval(this.refresherAction, REFRESH_INTERVAL);
        }
      } else {
        this.refresher = setInterval(this.refresherAction, REFRESH_INTERVAL);
      }
    }
  }
}

Auth.getInstance().startRefresher();
