const asyncActionType = type => ({
  pending: `${type}_PENDING`,
  success: `${type}_SUCCESS`,
  error: `${type}_ERROR`
});


export const EDIT_AIRPORT_INFO = asyncActionType('aerosimple/settings/EDIT_AIRPORT_INFO');
export const FETCH_AIRPORT_INFO = asyncActionType('aerosimple/settings/FETCH_AIRPORT_INFO');
export const FETCH_ROLES = asyncActionType('aerosimple/settings/FETCH_ROLES');
export const FETCH_PRIVILEGES = asyncActionType('aerosimple/settings/FETCH_PRIVILEGES');
export const CREATE_ROLE = asyncActionType('aerosimple/settings/CREATE_ROLE');
export const EDIT_ROLE = asyncActionType('aerosimple/settings/EDIT_ROLE');
export const FETCH_USERS = asyncActionType('aerosimple/settings/FETCH_USERS');
export const EDIT_USER = asyncActionType('aerosimple/settings/EDIT_USER');
export const CLEAR_AIRPORT_ACTION = 'aerosimple/airport/CLEAR';
export const CLEAR_SETTINGS_ACTION = 'aerosimple/settings/CLEAR';
