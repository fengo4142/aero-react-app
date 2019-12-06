const asyncActionType = type => ({
  pending: `${type}/PENDING`,
  success: `${type}/SUCCESS`,
  error: `${type}/ERROR`
});

export const FETCH_WORKORDER = asyncActionType('aerosimple/workorders/FETCH');
export const FETCH_WORKORDER_LIST = asyncActionType('aerosimple/workorders/LIST');
export const CREATE_WORKORDER = asyncActionType('aerosimple/workorders/CREATE');
export const FETCH_WORKORDER_SCHEMA = asyncActionType('aerosimple/workorders/FETCH_SCHEMA');
export const CREATE_MAINTENANCE = asyncActionType('aerosimple/workorders/CREATE_MAINTENANCE');
export const CREATE_OPERATIONS = asyncActionType('aerosimple/workorders/CREATE_OPERATIONS');
export const CLEAR_WORKORDER = 'aerosimple/workorders/CLEAR';
export const UPDATE_SCHEMAS = asyncActionType('aerosimple/workorders/UPDATE_SCHEMAS');
export const SAVE_ASSIGNMENT = asyncActionType('aerosimple/workorders/SAVE_ASSIGNMENT');
