import { UPDATE_DEFAULT_AIRPORT } from './types';

const BACKEND_API = 'BACKEND_API';

export const updateDefaultAirport = (id, data) => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: `/airports/${id}/default_airport/`,
    data,
    ...UPDATE_DEFAULT_AIRPORT
  }
});

