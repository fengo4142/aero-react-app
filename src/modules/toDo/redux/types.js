const asyncActionType = type => ({
  pending: `${type}_PENDING`,
  success: `${type}_SUCCESS`,
  error: `${type}_ERROR`
});

export const FETCH_TASKS = asyncActionType('aerosimple/settings/FETCH_TASKS');
export const COMPLETE_TASK = asyncActionType('aerosimple/settings/COMPLETE_TASK');
export const ADD_TASK = asyncActionType('aerosimple/settings/ADD_TASK');
export const UPDATE_TASK = asyncActionType('aerosimple/settings/UPDATE_TASK');
export const UPDATE_TASK_OCCURRENCE = asyncActionType('aerosimple/settings/UPDATE_TASK_OCCURRENCE');
export const FETCH_RULES = asyncActionType('aerosimple/settings/FETCH_RULES');
export const CLEAR_TODOS_ACTION = 'aerosimple/todo/CLEAR_TODOS_ACTION';
