const asyncActionType = type => ({
  pending: `${type}/PENDING`,
  success: `${type}/SUCCESS`,
  error: `${type}/ERROR`
});

export const SAVE_LOGFORM = asyncActionType('aerosimple/opslog/SAVE');
export const FETCH_LOGFORM = asyncActionType('aerosimple/opslog/SCHEMA');
export const FETCH_LOG_LIST = asyncActionType('aerosimple/opslog/FETCH');
export const CREATE_LOG = asyncActionType('aerosimple/opslog/CREATE');
export const CLEAR_LOG = asyncActionType('aerosimple/opslog/CLEAR');
export const UPDATE_TYPES = asyncActionType('aerosimple/opslog/UPDATE_TYPES');
export const FETCH_LOG = asyncActionType('aerosimple/opslog/FETCH_LOG');
