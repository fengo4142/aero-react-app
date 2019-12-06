import { EDIT_USER, FETCH_USER_PROFILE, CLEAR_PROFILE } from './types';

const BACKEND_API = 'BACKEND_API';

export const editUser = (id, data) => ({
  type: BACKEND_API,
  payload: {
    method: 'patch',
    url: `/users/${id}/`,
    data,
    ...EDIT_USER
  }
});

export const fetchUserProfile = () => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: '/users/profile/'
    },
    FETCH_USER_PROFILE
  )
});

export const clearProfile = () => ({
  type: CLEAR_PROFILE
});