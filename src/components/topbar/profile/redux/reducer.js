import { EDIT_USER, FETCH_USER_PROFILE, CLEAR_PROFILE} from './types';

import { actionForState } from '../../../../utils/helpers';

const INITIAL_STATE = {
  error: {},
  apiStatusUser: {
    loading: false,
    success: undefined
  },
  profile: {
    id: '',
    fullname: '',
    airport: {
      location: {}
    },
    user: {
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      logo: ''
    },
    roles: [
      {},
      {}
    ]
  },
  action: {
    loading: false,
    success: undefined
  }
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    /* ******************************** */
    /*           UPDATE USER            */
    /* ******************************** */
    case EDIT_USER.pending:
      return {
        ...state,
        action: {
          success: undefined,
          loading: true,
          type: 'update'
        },
        apiStatusUser: actionForState(state.action, 'pending')
      };
    case EDIT_USER.success:
      return {
        ...state,
        action: {
          ...state.action,
          success: true,
          loading: false,
          message: 'success'
        },
        user: action.payload,
        apiStatusUser: actionForState(state.action, 'success')
      };
    case EDIT_USER.error:
      return {
        ...state,
        action: {
          ...state.action,
          success: false,
          loading: false,
          message: 'failed'
        },
        error: action.payload.response.data,
        apiStatusUser: actionForState(state.action, 'error')
      };
    case FETCH_USER_PROFILE.success:
      return {
        ...state,
        profile: action.payload
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        error: {},
        apiStatusUser: {},
        profile: {},
        action: {}
      };
    case FETCH_USER_PROFILE.error:
      return state;
    default:
      return state;
  }
}
