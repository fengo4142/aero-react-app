import {
  CREATE_INSPECTION,
  FETCH_INSPECTION,
  CLEAR_INSPECTION,
  CREATE_INSPECTION_ANSWER,
  FETCH_INSPECTION_LIST,
  FETCH_INSPECTION_ANSWER_LIST,
  FETCH_INSPECTION_ANSWER,
  CLEAR_INSPECTION_ANSWER,
  CLEAR_ACTION_RESULT,
  FETCH_INSPECTION_FOR_EDIT,
  DISCARD_INSPECTION_DRAFT,
  SEARCH_USER,
  CREATE_REMARK,
  CREATE_EMPTY_ANSWER,
  FETCH_SAFETY_SELF_INSPECTION,
  EXPORT_INSPECTION,
  FETCH_TEMPLATES,
  FETCH_TEMPLATE,
  EXPORT_INSPECTION_DATA,
  FETCH_SUMMARY,
  CREATE_DRAFT_INSPECTION_ANSWER,
  FETCH_DRAFT_INSPECTION
} from './types';

const BACKEND_API = 'BACKEND_API';

export const addInspection = inspData => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: '/edit_inspections/',
    data: inspData,
    ...CREATE_INSPECTION
  }
});

export const editInspection = inspData => ({
  type: BACKEND_API,
  payload: {
    method: 'patch',
    url: `/edit_inspections/${inspData.id}/`,
    data: inspData,
    ...CREATE_INSPECTION
  }
});

export const fetchTemplates = () => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: '/inspection_templates/'
    },
    FETCH_TEMPLATES
  )
});

export const fetchTemplate = id => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: `/inspection_templates/${id}/`
    },
    FETCH_TEMPLATE
  )
});

export const updateTemplateVersion = id => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'POST',
      url: `/inspection_templates/${id}/update_version/`
    },
    FETCH_TEMPLATE
  )
});

export const updateInspectionVersion = id => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'POST',
      url: `/edit_inspections/${id}/update_template/`
    },
    FETCH_INSPECTION_FOR_EDIT
  )
});

export const fetchInspection = id => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/inspections/${id}/`,
    ...FETCH_INSPECTION
  }
});

export const fetchSafetySelfInspection = () => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: '/inspections/safety_self_inspection/',
    ...FETCH_SAFETY_SELF_INSPECTION
  }
});

export const fetchInspectionForEdit = id => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/edit_inspections/${id}/`,
    ...FETCH_INSPECTION_FOR_EDIT
  }
});

export const exportInspection = id => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/inspection_template/${id}/inspection/`,
    ...EXPORT_INSPECTION
  }
});

export const exportInspectionData = id => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/inspection_template_data/${id}/inspection_data`,
    ...EXPORT_INSPECTION_DATA
  }
});

export const discardInspectionDraft = id => ({
  type: BACKEND_API,
  payload: {
    method: 'POST',
    url: `/edit_inspections/${id}/discard_draft/`,
    ...DISCARD_INSPECTION_DRAFT
  }
});

export const clearInspection = () => ({
  type: CLEAR_INSPECTION
});

export const fetchInspectionList = (query) => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/inspections/${query ? '?query=' : ''}${query || ''}`,
    ...FETCH_INSPECTION_LIST
  }
});

export const fetchsummary = (query) => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/inspections/summary`,
    ...FETCH_SUMMARY
  }
});

export const fetchInspectionListForEdit = () => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: '/edit_inspections/',
    ...FETCH_INSPECTION_LIST
  }
});

export const fetchDraftInspection = id => ({
  type: BACKEND_API,
  payload: {
    method: 'POST',
    url: `/inspections/${id}/start_inspection/`,
    ...FETCH_DRAFT_INSPECTION
  }
});

export const fetchInspectionAnswers = (day, day2, query) => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/inspection_answers/?s=${day}&f=${day2}
    ${day ? '&s=' : ''}${day || ''}
    ${day2 ? '&f=' : ''}${day2 || ''}
    ${query ? '&query=' : ''}${query || ''}`,
    ...FETCH_INSPECTION_ANSWER_LIST
  }
});

export const completeInspection = (id, answers) => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: `/inspections/${id}/complete_inspection/`,
    data: answers,
    ...CREATE_INSPECTION_ANSWER
  }
});

export const draftInspection = (id, answers) => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: `/inspections/${id}/save_draft_inspection/`,
    data: answers,
    ...CREATE_DRAFT_INSPECTION_ANSWER
  }
});

export const createRemark = data => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: '/remarks/',
    data,
    ...CREATE_REMARK
  }
});

export const editRemark = (id, data) => ({
  type: BACKEND_API,
  payload: {
    method: 'put',
    url: `/remarks/${id}/`,
    data,
    ...CREATE_REMARK
  }
});

export const searchUser = (query, perm) => ({
  type: BACKEND_API,
  payload: {
    method: 'GET',
    url: `/users/?q=${query}&r=${perm}`,
    ...SEARCH_USER
  }
});


export const fetchInspectionAnswer = id => ({
  type: BACKEND_API,
  payload: {
    method: 'get',
    url: `/inspection_answers/${id}/`,
    ...FETCH_INSPECTION_ANSWER
  }
});

export const clearInspectionAnswer = () => ({
  type: CLEAR_INSPECTION_ANSWER
});

export const clearActionResult = () => ({
  type: CLEAR_ACTION_RESULT
});
