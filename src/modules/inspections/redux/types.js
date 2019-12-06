const asyncActionType = type => ({
  pending: `${type}/PENDING`,
  success: `${type}/SUCCESS`,
  error: `${type}/ERROR`
});

export const CREATE_INSPECTION = asyncActionType('aerosimple/inspection/CREATE');
export const FETCH_INSPECTION = asyncActionType('aerosimple/inspection/FETCH');
export const CLEAR_INSPECTION = 'aerosimple/inspection/CLEAR';
export const FETCH_INSPECTION_LIST = asyncActionType('aerosimple/inspection/FETCH_LIST');
export const CREATE_INSPECTION_ANSWER = asyncActionType('aerosimple/inspection/ANSWER_CREATE');
export const FETCH_INSPECTION_ANSWER_LIST = asyncActionType('aerosimple/inspection/FETCH_ANSWER_LIST');
export const FETCH_INSPECTION_ANSWER = asyncActionType('aerosimple/inspection/ANSWER_FETCH');
export const CLEAR_INSPECTION_ANSWER = 'aerosimple/inspection/ANSWER_CLEAR';
export const CLEAR_ACTION_RESULT = 'aerosimple/inspection/ACTION_CLEAR';
export const FETCH_INSPECTION_FOR_EDIT = asyncActionType('aerosimple/inspection/FETCH_FOR_EDIT');
export const DISCARD_INSPECTION_DRAFT = asyncActionType('aerosimple/inspection/DISCARD_INSPECTION_DRAFT');
export const SEARCH_USER = asyncActionType('aerosimple/inspection/SEARCH_USER');
export const CREATE_REMARK = asyncActionType('aerosimple/inspection/CREATE_REMARK');
export const CREATE_EMPTY_ANSWER = asyncActionType('aerosimple/inspection/CREATE_EMPTY_ANSWER');
export const FETCH_SAFETY_SELF_INSPECTION = asyncActionType('aerosimple/inspection/FETCH_SAFETY_SELF_INSPECTION');
export const FETCH_TEMPLATES = asyncActionType('aerosimple/inspection/FETCH_TEMPLATES');
export const FETCH_TEMPLATE = asyncActionType('aerosimple/inspection/FETCH_TEMPLATE');
export const EXPORT_INSPECTION = asyncActionType('aerosimple/inspection/EXPORT_INSPECTION');
export const EXPORT_INSPECTION_DATA = asyncActionType('aerosimple/inspection/EXPORT_INSPECTION_DATA');
export const FETCH_SUMMARY = asyncActionType('aerosimple/inspection/FETCH_SUMMARY');
export const CREATE_DRAFT_INSPECTION_ANSWER = asyncActionType('aerosimple/inspection/DRAFT_ANSWER_CREATE');
export const FETCH_DRAFT_INSPECTION = asyncActionType('aerosimple/inspection/FETCH_DRAFT_INSPECTION')