const asyncActionType = type => ({
  pending: `${type}_PENDING`,
  success: `${type}_SUCCESS`,
  error: `${type}_ERROR`
});

export const UPDATE_DEFAULT_AIRPORT = asyncActionType('aerosimple/profile/UPDATE_AIRPORT');
