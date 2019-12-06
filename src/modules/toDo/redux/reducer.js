import {
  FETCH_TASKS,
  COMPLETE_TASK,
  ADD_TASK,
  FETCH_RULES,
  CLEAR_TODOS_ACTION,
  UPDATE_TASK,
  UPDATE_TASK_OCCURRENCE
} from './types';

import { actionForState } from '../../../utils/helpers';

const INITIAL_STATE = {
  tasks: [],
  rules: [],
  error: {},
  action: {
    loading: false,
    success: undefined
  }
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    /* ******************************** */
    /*              TASKS               */
    /* ******************************** */
    case FETCH_TASKS.pending:
      return {
        ...state,
        action: actionForState(state.action, 'pending')
      };
    case FETCH_TASKS.success:
      return {
        ...state,
        tasks: action.payload,
        action: actionForState(state.action, 'success')
      };
    case FETCH_TASKS.error:
      return {
        ...state,
        action: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*          COMPLETE TASK           */
    /* ******************************** */
    case COMPLETE_TASK.pending:
      return {
        ...state,
        action: actionForState(state.action, 'pending')
      };
    case COMPLETE_TASK.success: {
      const index = state.tasks.findIndex(i => (
        (i.event.id === action.payload.event.id) && (i.end === action.payload.end)
      ));
      state.tasks.splice(index, 1);
      return {
        ...state,
        tasks: [...state.tasks],
        updated_task: action.payload,
        action: actionForState(state.action, 'success')
      };
    }
    case COMPLETE_TASK.error:
      return {
        ...state,
        action: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*           CREATE TASK            */
    /* ******************************** */
    case ADD_TASK.pending:
      return {
        ...state,
        action: actionForState(state.action, 'pending')
      };
    case ADD_TASK.success:
      return {
        ...state,
        action: actionForState(state.action, 'success')
      };
    case ADD_TASK.error:
      return {
        ...state,
        action: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*           UPDATE TASK            */
    /* ******************************** */
    case UPDATE_TASK.pending:
      return {
        ...state,
        action: actionForState(state.action, 'pending')
      };
    case UPDATE_TASK.success:
      return {
        ...state,
        action: actionForState(state.action, 'success')
      };
    case UPDATE_TASK.error:
      return {
        ...state,
        action: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*       UPDATE TASK OCURRENCE      */
    /* ******************************** */
    case UPDATE_TASK_OCCURRENCE.pending:
      return {
        ...state,
        action: actionForState(state.action, 'pending')
      };
    case UPDATE_TASK_OCCURRENCE.success:
      return {
        ...state,
        action: actionForState(state.action, 'success')
      };
    case UPDATE_TASK_OCCURRENCE.error:
      return {
        ...state,
        action: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*              RULES               */
    /* ******************************** */
    case FETCH_RULES.pending:
      return {
        ...state,
        action: actionForState(state.action, 'pending')
      };
    case FETCH_RULES.success:
      return {
        ...state,
        rules: action.payload.results,
        action: actionForState(state.action, 'success')
      };
    case FETCH_RULES.error:
      return {
        ...state,
        action: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*              CLEAR               */
    /* ******************************** */
    case CLEAR_TODOS_ACTION:
      return {
        ...state,
        action: {
          loading: false,
          success: undefined
        },
        updated_task: undefined
      };
    default:
      return state;
  }
}
