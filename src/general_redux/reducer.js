import { SHOW_CONFIRM_MODAL, HIDE_MODAL, CHANGE_CURRENT_PAGE } from './types';

const INITIAL_STATE = {
  currentModule: 'Home'
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_CONFIRM_MODAL:
      return {
        ...state,
        modalProps: {
          ...action.payload
        },
        modalType: 'SHOW_CONFIRM_MODAL'
      };
    case HIDE_MODAL:
      return {
        ...state,
        modalType: undefined
      };
    case CHANGE_CURRENT_PAGE:
      return {
        ...state,
        currentModule: action.payload
      };
    default:
      return state;
  }
}
