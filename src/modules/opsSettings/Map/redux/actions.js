import { CREATE_MAP, LOAD_MAP, CREATE_TYPE, LOAD_TYPE } from './types';

const BACKEND_API = 'BACKEND_API';

export const addSurface = surfaceData => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: '/surface_shapes/',
    data: surfaceData,
    ...CREATE_MAP
  }
});

export const fetchSurfaces = () => ({
  type: BACKEND_API,
  payload: {
    method: 'get',
    url: `/surface_shapes/`,
    ...LOAD_MAP
  }
});

export const addSurfaceType = surfaceData => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: '/surface_types/',
    data: surfaceData,
    ...CREATE_TYPE
  }
});

export const fetchSurfaceTypes = () => ({
  type: BACKEND_API,
  payload: {
    method: 'get',
    url: '/surface_types/',
    ...LOAD_TYPE
  }
});
