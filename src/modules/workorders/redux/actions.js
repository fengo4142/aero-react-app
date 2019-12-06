import {
  FETCH_WORKORDER_LIST,
  FETCH_WORKORDER,
  CREATE_WORKORDER,
  CLEAR_WORKORDER,
  FETCH_WORKORDER_SCHEMA,
  CREATE_MAINTENANCE,
  CREATE_OPERATIONS,
  UPDATE_SCHEMAS,
  SAVE_ASSIGNMENT,
  FETCH_NOTAMS,
  PRINT_PDF,
} from './types';

const BACKEND_API = 'BACKEND_API';

export const fetchWorkOrderList = (query) => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/work_orders/${query ? '?query=' : ''}${query || ''}`,
    ...FETCH_WORKORDER_LIST
  }
});

export const fetchWorkOrder = id => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/work_orders/${id}/`,
    ...FETCH_WORKORDER
  }
});

export const createWorkOrder = data => ({
  type: BACKEND_API,
  payload: {
    method: 'POST',
    data,
    url: '/work_orders/',
    ...CREATE_WORKORDER
  }
});

export const clearActionResult = () => ({
  type: CLEAR_WORKORDER
});

export const fetchWorkOrderSchema = () => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: '/work_orders/get_schema/',
    ...FETCH_WORKORDER_SCHEMA
  }
});

export const updateWorkOrderSchemas = data => ({
  type: BACKEND_API,
  payload: {
    method: 'POST',
    data,
    url: '/work_orders/update_schemas/',
    ...UPDATE_SCHEMAS
  }
});

export const sendMaintenanceReview = (id, data) => ({
  type: BACKEND_API,
  payload: {
    method: 'POST',
    data,
    url: `/work_orders/${id}/maintenance_review/`,
    ...CREATE_MAINTENANCE
  }
});

export const sendOperationsReview = (id, data) => ({
  type: BACKEND_API,
  payload: {
    method: 'POST',
    data,
    url: `/work_orders/${id}/operations_review/`,
    ...CREATE_OPERATIONS
  }
});

export const saveAssignment = (type, data) => ({
  type: BACKEND_API,
  payload: {
    method: 'POST',
    data: { type, ...data },
    url: '/work_orders/assignment/',
    ...SAVE_ASSIGNMENT
  }
});

export const fetchNotams = (icaoId) => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/work_orders/get_notams/`,
    ...FETCH_NOTAMS
  }
});

export const printPdf = (id) => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/work_orders_data/${id}/workorder_data_view`,
    ...PRINT_PDF
  }
})
