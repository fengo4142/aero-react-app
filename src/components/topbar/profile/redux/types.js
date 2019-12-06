const asyncActionType = type => ({
  pending: `${type}_PENDING`,
  success: `${type}_SUCCESS`,
  error: `${type}_ERROR`
});

export const EDIT_USER = asyncActionType('aerosimple/profile/EDIT_USER');
export const FETCH_USER_PROFILE = asyncActionType('FETCH_USER_PROFILE');
export const CLEAR_PROFILE = 'aerosimple/profile/CLEAR';
