import {
  EDIT_AIRPORT_INFO,
  FETCH_AIRPORT_INFO,
  CLEAR_AIRPORT_ACTION,
  FETCH_ROLES,
  FETCH_PRIVILEGES,
  CREATE_ROLE,
  EDIT_ROLE,
  CLEAR_SETTINGS_ACTION,
  FETCH_USERS,
  EDIT_USER } from './types';

const BACKEND_API = 'BACKEND_API';


export const fetchAirport = id => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: `/airports/${id}/`
    },
    FETCH_AIRPORT_INFO
  )
});

export const editAirport = (id, airportData) => ({
  type: BACKEND_API,
  payload: {
    method: 'patch',
    url: `/airports/${id}/`,
    data: airportData,
    ...EDIT_AIRPORT_INFO
  }
});


export const clearAirportAction = () => ({
  type: CLEAR_AIRPORT_ACTION
});

export const clear = () => ({
  type: CLEAR_SETTINGS_ACTION
});


export const fetchRoles = () => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: '/roles/'
    },
    FETCH_ROLES
  )
});

export const createRole = data => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: '/roles/',
    data,
    ...CREATE_ROLE
  }
});

export const editRole = (id, data) => ({
  type: BACKEND_API,
  payload: {
    method: 'patch',
    url: `/roles/${id}/`,
    data,
    ...EDIT_ROLE
  }
});

export const fetchPrivileges = () => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: '/roles/get_privileges/'
    },
    FETCH_PRIVILEGES
  )
});


export const fetchUsers = () => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: '/users/'
    },
    FETCH_USERS
  )
});


export const editUser = (id, data) => ({
  type: BACKEND_API,
  payload: {
    method: 'patch',
    url: `/users/${id}/`,
    data,
    ...EDIT_USER
  }
});

export const createUser = data => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: '/users/',
    data,
    ...EDIT_USER
  }
});

export const updateLanguage = data => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: '/users/update_language/',
    data,
    ...EDIT_USER
  }
});
