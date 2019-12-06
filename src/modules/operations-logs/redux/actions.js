import {
  SAVE_LOGFORM,
  FETCH_LOG_LIST,
  FETCH_LOGFORM,
  CLEAR_LOG,
  CREATE_LOG,
  UPDATE_TYPES,
  FETCH_LOG
} from './types';

const BACKEND_API = 'BACKEND_API';

export const updateLogFormSchema = data => ({
  type: BACKEND_API,
  payload: {
    method: 'POST',
    data,
    url: '/operations_logs/update_schema/',
    ...SAVE_LOGFORM
  }
});


export const fetchLogs = (page, start, end, query) => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/operations_logs/?
${page ? 'page=' : ''}${page || ''}
${start ? '&s=' : ''}${start || ''}
${end ? '&f=' : ''}${end || ''}
${query ? '&query=' : ''}${query || ''}`,
    ...FETCH_LOG_LIST
  }
});

export const createLog = data => ({
  type: BACKEND_API,
  payload: {
    method: 'POST',
    data,
    url: '/operations_logs/',
    ...CREATE_LOG
  }
});

export const updateLog = (id, data) => ({
  type: BACKEND_API,
  payload: {
    method: 'PATCH',
    data,
    url: `/operations_logs/${id}/`,
    ...CREATE_LOG
  }
});

export const fetchLog = id => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/operations_logs/${id}/`,
    ...FETCH_LOG
  }
});

export const fetchLogFormSchema = () => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: '/operations_logs/get_schema/',
    ...FETCH_LOGFORM
  }
});


export const clear = () => ({
  type: CLEAR_LOG
});

export const updateTypes = (a, b) => ({
  type: BACKEND_API,
  payload: {
    method: 'POST',
    data: { types: a, subtypes: b },
    url: '/operations_logs/update_types/',
    ...UPDATE_TYPES
  }
});
