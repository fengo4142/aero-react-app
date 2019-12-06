import {
  FETCH_USER_PROFILE,
  AUTH_PROFILE_UPDATE,
  FETCH_TRANSLATIONS
} from './types';

const INITIAL_STATE = {
  profile: {
    id: '',
    fullname: '',
    airport: {
      location: {}
    },
    user: {
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      logo: ''
    },
    roles: [
      {},
      {}
    ]
  },
  translations: {}
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USER_PROFILE.success:
      localStorage.setItem('airportId', action.payload.airport.code)
      return {
        ...state,
        profile: action.payload
      };
    case FETCH_USER_PROFILE.error:
      return state;
    case AUTH_PROFILE_UPDATE:
      return state;
    case FETCH_TRANSLATIONS.success:
      return {
        ...state,
        translations: action.payload
      };
    case FETCH_TRANSLATIONS.error:
      return {
        ...state,
        translations: {}
      };
    default:
      return state;
  }
}
