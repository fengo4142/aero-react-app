/* global document, navigator */
import axios from 'axios';
// eslint-disable-next-line
import Auth from '../utils/Auth';

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${Auth.getInstance().getAuthToken()}`,
    'Accept-Language': navigator.language.split(/[-_]/)[0]
  },
  baseURL: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && window.location.hostname.indexOf('app.') == -1
    ? process.env.REACT_APP_BACKEND_HOST
    : 'https://backend.' + window.location.hostname + '/api',
  withCredentials: true
});

export const setHeaders = (token) => {
  Object.assign(axiosInstance.defaults, { headers: { authorization: `Bearer ${token}` } });
};

export default axiosInstance;
