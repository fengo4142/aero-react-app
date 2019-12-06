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

import { actionForState } from '../../../utils/helpers';

const INITIAL_STATE = {
  airport: {},
  roles: [],
  error: {},
  action: {
    loading: false,
    success: undefined
  },
  apiStatusUser: {
    loading: false,
    success: undefined
  },
  actionPrivileges: {
    loading: false,
    success: undefined
  },
  actionCreateRole: {
    loading: false,
    success: undefined
  },
  privileges: []
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    /* ******************************** */
    /*          AIRPORT INFO            */
    /* ******************************** */
    case FETCH_AIRPORT_INFO.success:
      return {
        ...state,
        airport: action.payload
      };
    case FETCH_AIRPORT_INFO.error:
      return state;

    case EDIT_AIRPORT_INFO.pending:
      return {
        ...state,
        action: {
          success: undefined,
          loading: true,
          type: 'update'
        }
      };
    case EDIT_AIRPORT_INFO.success:
      return {
        ...state,
        action: {
          ...state.action,
          success: true,
          loading: false,
          message: 'success'
        }
      };
    case EDIT_AIRPORT_INFO.error:
      return {
        ...state,
        action: {
          ...state.action,
          success: false,
          loading: false,
          message: 'failed'
        }
      };
    case CLEAR_AIRPORT_ACTION:
      return {
        ...state,
        action: {
          ...state.action,
          loading: false,
          success: undefined,
          message: ''
        }
      };
    case CLEAR_SETTINGS_ACTION:
      return {
        ...state,
        error: {},
        actionCreateRole: {
          success: undefined,
          loading: false,
          message: ''
        },
        apiStatusUser: {
          success: undefined,
          loading: false,
          message: ''
        },
        actionPrivileges: {
          success: undefined,
          loading: false,
          message: ''
        },
        actionEditRole: {
          success: undefined,
          loading: false,
          message: ''
        }
      };
    /* ******************************** */
    /*              ROLES               */
    /* ******************************** */
    case FETCH_ROLES.pending:
      return {
        ...state,
        action: actionForState(state.action, 'pending')
      };
    case FETCH_ROLES.success:
      return {
        ...state,
        roles: action.payload.results,
        action: actionForState(state.action, 'success')
      };
    case FETCH_ROLES.error:
      return {
        ...state,
        action: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*           PRIVILEGES             */
    /* ******************************** */
    case FETCH_PRIVILEGES.pending:
      return {
        ...state,
        actionPrivileges: actionForState(state.action, 'pending')
      };
    case FETCH_PRIVILEGES.success:
      return {
        ...state,
        privileges: action.payload,
        actionPrivileges: actionForState(state.action, 'success')
      };
    case FETCH_PRIVILEGES.error:
      return {
        ...state,
        actionPrivileges: actionForState(state.action, 'error')
      };

    /* ******************************** */
    /*           CREATE ROLE            */
    /* ******************************** */
    case CREATE_ROLE.pending:
      return {
        ...state,
        actionCreateRole: actionForState(state.action, 'pending')
      };
    case CREATE_ROLE.success:
      return {
        ...state,
        role: action.payload,
        actionCreateRole: actionForState(state.action, 'success')
      };
    case CREATE_ROLE.error:
      return {
        ...state,
        actionCreateRole: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*            EDIT ROLE             */
    /* ******************************** */
    case EDIT_ROLE.pending:
      return {
        ...state,
        actionEditRole: actionForState(state.action, 'pending')
      };
    case EDIT_ROLE.success:
      return {
        ...state,
        role: action.payload,
        actionEditRole: actionForState(state.action, 'success')
      };
    case EDIT_ROLE.error:
      return {
        ...state,
        actionEditRole: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*           FETCH USERS            */
    /* ******************************** */
    case FETCH_USERS.pending:
      return {
        ...state,
        actionFetchUsers: actionForState(state.action, 'pending')
      };
    case FETCH_USERS.success:
      return {
        ...state,
        users: action.payload.results,
        actionFetchUsers: actionForState(state.action, 'success')
      };
    case FETCH_USERS.error:
      return {
        ...state,
        actionFetchUsers: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*           UPDATE USER            */
    /* ******************************** */
    case EDIT_USER.pending:
      return {
        ...state,
        apiStatusUser: actionForState(state.action, 'pending')
      };
    case EDIT_USER.success:
      return {
        ...state,
        user: action.payload,
        apiStatusUser: actionForState(state.action, 'success')
      };
    case EDIT_USER.error:
      return {
        ...state,
        error: action.payload.response.data,
        apiStatusUser: actionForState(state.action, 'error')
      };
    default:
      return state;
  }
}
