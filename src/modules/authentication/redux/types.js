
const asyncActionType = type => ({
  pending: `${type}_PENDING`,
  success: `${type}_SUCCESS`,
  error: `${type}_ERROR`
});


export const AUTH_PROFILE_UPDATE = 'AUTH_PROFILE_UPDATE';

export const FETCH_USER_PROFILE = asyncActionType('FETCH_USER_PROFILE');
export const FETCH_TRANSLATIONS = asyncActionType('FETCH_TRANSLATIONS');
