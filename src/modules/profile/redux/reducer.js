import {
  FETCH_WORKORDER_LIST,
  FETCH_WORKORDER_SCHEMA,
  CREATE_WORKORDER,
  FETCH_WORKORDER,
  CLEAR_WORKORDER,
  CREATE_MAINTENANCE,
  CREATE_OPERATIONS,
  UPDATE_SCHEMAS,
  SAVE_ASSIGNMENT
} from './types';

const INITIAL_STATE = {
  workorders: [],
  detail: {},
  schemas: {},
  action: {},
  createAction: {
    success: undefined,
    loading: undefined,
    message: undefined
  },
  errors: [],
  detailAction: {},
  maintenanceAction: {},
  assignmentAction: {},
  operationsAction: {},
  updateSchemaAction: {}
};

const actionForState = (action, state) => ({
  ...action,
  success: state === 'success',
  loading: state === 'pending',
  message: state
});

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_WORKORDER_LIST.pending:
      return {
        ...state,
        action: {
          ...state.action,
          success: true,
          loading: false,
          message: 'pending'
        }
      };
    case FETCH_WORKORDER_LIST.success:
      return {
        ...state,
        workorders: action.payload.results,
        action: {
          ...state.action,
          success: true,
          loading: false,
          message: 'success'
        }
      };
    case FETCH_WORKORDER_LIST.error:
      return {
        ...state,
        action: {
          ...state.action,
          success: false,
          loading: false,
          message: 'failed'
        }
      };
    /* ******************************** */
    /*         WORKORDER SCHEMA         */
    /* ******************************** */
    case FETCH_WORKORDER_SCHEMA.pending:
      return {
        ...state,
        action: actionForState(state.action, 'pending')
      };
    case FETCH_WORKORDER_SCHEMA.success:
      return {
        ...state,
        schemas: action.payload,
        action: actionForState(state.action, 'success')
      };
    case FETCH_WORKORDER_SCHEMA.error:
      return {
        ...state,
        action: actionForState(state.action, 'failed')
      };
    case UPDATE_SCHEMAS.pending:
      return {
        ...state,
        updateSchemaAction: actionForState(state.action, 'pending')
      };
    case UPDATE_SCHEMAS.success:
      return {
        ...state,
        schema: action.payload,
        updateSchemaAction: actionForState(state.action, 'success')
      };
    case UPDATE_SCHEMAS.error:
      return {
        ...state,
        updateSchemaAction: actionForState(state.action, 'failed')
      };
    /* ******************************** */
    /*         CREATE WORKORDER         */
    /* ******************************** */
    case CREATE_WORKORDER.pending:
      return {
        ...state,
        createAction: actionForState(state.action, 'pending')
      };
    case CREATE_WORKORDER.success:
      return {
        ...state,
        createdWorkorder: action.payload,
        createAction: actionForState(state.action, 'success')
      };
    case CREATE_WORKORDER.error: {
      return {
        ...state,
        errors: action.payload.response.data.errors,
        createAction: actionForState(state.action, 'failed')
      };
    }

    /* ******************************** */
    /*         WORKORDER DETAIL         */
    /* ******************************** */
    case FETCH_WORKORDER.pending:
      return {
        ...state,
        action: actionForState(state.action, 'pending')
      };
    case FETCH_WORKORDER.success:
      return {
        ...state,
        detail: action.payload,
        action: actionForState(state.action, 'success')
      };
    case FETCH_WORKORDER.error:
      return {
        ...state,
        action: actionForState(state.action, 'failed')
      };
    /* ******************************** */
    /*        CREATE MAINTENANCE        */
    /* ******************************** */
    case CREATE_MAINTENANCE.pending:
      return {
        ...state,
        maintenanceAction: actionForState(state.action, 'pending')
      };
    case CREATE_MAINTENANCE.success:
      return {
        ...state,
        maintenanceAction: actionForState(state.action, 'success')
      };
    case CREATE_MAINTENANCE.error:
      return {
        ...state,
        maintenanceAction: actionForState(state.action, 'failed')
      };
    case SAVE_ASSIGNMENT.pending:
      return {
        ...state,
        assignmentAction: actionForState(state.action, 'pending')
      };
    case SAVE_ASSIGNMENT.success:
      return {
        ...state,
        assignmentAction: actionForState(state.action, 'success')
      };
    case SAVE_ASSIGNMENT.error:
      return {
        ...state,
        assignmentAction: actionForState(state.action, 'failed')
      };

    /* ******************************** */
    /*        CREATE OPERATIONS        */
    /* ******************************** */
    case CREATE_OPERATIONS.pending:
      return {
        ...state,
        operationsAction: actionForState(state.action, 'pending')
      };
    case CREATE_OPERATIONS.success:
      return {
        ...state,
        operationsAction: actionForState(state.action, 'success')
      };
    case CREATE_OPERATIONS.error:
      return {
        ...state,
        operationsAction: actionForState(state.action, 'failed')
      };
    case CLEAR_WORKORDER:
      return {
        ...state,
        createAction: {},
        action: {},
        operationsAction: {},
        maintenanceAction: {},
        assignmentAction: {},
        detail: {},
        updateSchemaAction: {}
      };
    default:
      return state;
  }
}
