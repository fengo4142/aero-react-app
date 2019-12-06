import { add } from 'react-redux-permissions';
import axiosInstance from './axios';

const BACKEND_API = 'BACKEND_API';


const apiMiddleware = ({ dispatch }) => next => (action) => {
  if (action.type !== BACKEND_API) {
    return next(action);
  }

  const { method, url, params, data } = action.payload;

  dispatch({
    type: action.payload.pending,
    payload: action.payload.extra
  });

  axiosInstance({ method, url, data, params }).then(
    (response) => {
      if (action.payload.success === 'FETCH_USER_PROFILE_SUCCESS') {
        response.data.roles.forEach((r) => {
          r.permissions.forEach((p) => {
            dispatch(add(p.codename));
          });
        });
      }
      dispatch({
        type: action.payload.success,
        payload: response.data
      });
    },

    error => dispatch({
      type: action.payload.error,
      payload: error
    })
  );
  return {};
};

export default apiMiddleware;
