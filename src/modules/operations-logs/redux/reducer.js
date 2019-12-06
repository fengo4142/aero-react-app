import { actionForState } from '../../../utils/helpers';
import {
  SAVE_LOGFORM,
  FETCH_LOGFORM,
  FETCH_LOG_LIST,
  CREATE_LOG,
  CLEAR_LOG,
  FETCH_LOG
} from './types';

const INITIAL_STATE = {
  schema: {},
  loglist: {
    results: []
  },
  saveAction: {
    success: false,
    loading: false,
    message: ''
  }
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    /* ******************************** */
    /*          SAVE LOG FORM           */
    /* ******************************** */
    case SAVE_LOGFORM.pending:
      return {
        ...state,
        saveAction: actionForState(state.action, 'pending')
      };
    case SAVE_LOGFORM.success:
      return {
        ...state,
        saveAction: actionForState(state.action, 'success')
      };
    case SAVE_LOGFORM.error:
      return {
        ...state,
        saveAction: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*          SAVE LOG FORM           */
    /* ******************************** */
    case CREATE_LOG.pending:
      return {
        ...state,
        saveAction: actionForState(state.action, 'pending')
      };
    case CREATE_LOG.success:
      return {
        ...state,
        saveAction: actionForState(state.action, 'success')
      };
    case CREATE_LOG.error:
      return {
        ...state,
        saveAction: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*          FETCH LOG FORM           */
    /* ******************************** */
    case FETCH_LOGFORM.pending:
      return {
        ...state,
        actionFetch: actionForState(state.action, 'pending')
      };
    case FETCH_LOGFORM.success:
      return {
        ...state,
        schema: action.payload.schema,
        types: action.payload.types,
        subtypes: action.payload.subtypes,
        actionFetch: actionForState(state.action, 'success')
      };
    case FETCH_LOGFORM.error:
      return {
        ...state,
        actionFetch: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*          FETCH LOG LIST           */
    /* ******************************** */
    case FETCH_LOG_LIST.pending:
      return {
        ...state,
        actionFetch: actionForState(state.action, 'pending')
      };
    case FETCH_LOG_LIST.success:
      return {
        ...state,
        loglist: action.payload,
        actionFetch: actionForState(state.action, 'success')
      };
    case FETCH_LOG_LIST.error:
      return {
        ...state,
        actionFetch: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*          FETCH LOG               */
    /* ******************************** */
    case FETCH_LOG.pending:
      return {
        ...state,
        actionFetch: actionForState(state.action, 'pending')
      };
    case FETCH_LOG.success:
      return {
        ...state,
        log: action.payload,
        actionFetch: actionForState(state.action, 'success')
      };
    case FETCH_LOG.error:
      return {
        ...state,
        actionFetch: actionForState(state.action, 'error')
      };
    case CLEAR_LOG:
      return {
        ...state,
        log: undefined,
        saveAction: {
          success: false,
          loading: false,
          message: '' }
      };
    default:
      return state;
  }
}
