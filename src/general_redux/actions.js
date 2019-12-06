import { SHOW_CONFIRM_MODAL, HIDE_MODAL, CHANGE_CURRENT_PAGE } from './types';

export const showConfirmModal = (content, onAccept, onCancel, acceptLabel='todo.newTask.accept', cancelLabel='todo.newTask.cancel') => ({
  type: SHOW_CONFIRM_MODAL,
  payload: { content, onAccept, onCancel, acceptLabel, cancelLabel }
});

export const showSuccessModal = (body, onAccept) => ({
  type: SHOW_CONFIRM_MODAL,
  payload: { body, onAccept }
});

export const hideModal = () => ({
  type: HIDE_MODAL,
  payload: { }
});

export const changeCurrentPage = page => ({
  type: CHANGE_CURRENT_PAGE,
  payload: page
});
