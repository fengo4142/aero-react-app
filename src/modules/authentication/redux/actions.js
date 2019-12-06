import {
  FETCH_USER_PROFILE,
  AUTH_PROFILE_UPDATE,
  FETCH_TRANSLATIONS
} from './types';


const BACKEND_API = 'BACKEND_API';

export const updateUserProfile = profile => ({
  type: AUTH_PROFILE_UPDATE,
  payload: profile
});


export const fetchUserProfile = () => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: '/users/profile/'
    },
    FETCH_USER_PROFILE
  )
});

export const fetchTranslations = () => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: '/airports/translations/'
    },
    FETCH_TRANSLATIONS
  )
});
