import { CREATE_MAP, LOAD_MAP, CREATE_TYPE, LOAD_TYPE } from './types';

const INITIAL_STATE = {
  surfaces: [],
  types: []
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_MAP.success:
      return {
        ...state,
        action: {
          ...state.action,
          success: true,
          loading: false,
          message: 'success'
        }
      };
    case CREATE_MAP.error:
      return {
        ...state,
        action: {
          ...state.action,
          success: false,
          loading: false,
          message: 'failed'
        }
      };
    case LOAD_MAP.success:
      return {
        ...state,
        surfaces: action.payload.results
      };
    case LOAD_MAP.error:
      return state;
    case CREATE_TYPE.success:
      return {
        ...state,
        action: {
          ...state.action,
          success: true,
          loading: false,
          message: 'success'
        }
      };
    case CREATE_TYPE.error:
      return {
        ...state,
        action: {
          ...state.action,
          success: false,
          loading: false,
          message: 'failed'
        }
      };
    case LOAD_TYPE.success:
      return {
        ...state,
        types: action.payload.results.map(
          o => ({ key: o.id, name: o.name, color: o.color })
        )
      };
    case LOAD_TYPE.error:
      return state;
    default:
      return state;
  }
}
