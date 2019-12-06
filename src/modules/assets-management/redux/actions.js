import * as types from './types';

const BACKEND_API = 'BACKEND_API';

export const addAsset = data => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: '/assets/',
    data,
    ...types.CREATE_ASSET
  }
});

export const editAsset = (id, data) => ({
  type: BACKEND_API,
  payload: {
    method: 'patch',
    url: `/assets/${id}/`,
    data,
    ...types.CREATE_ASSET
  }
});

export const deleteAsset = id => ({
  type: BACKEND_API,
  payload: {
    method: 'delete',
    url: `/assets/${id}/`,
    ...types.DELETE_ASSET
  }
});

export const fetchAssets = (query) => ({
  type: BACKEND_API,
  payload: {
    method: 'get',
    url: `/assets/${query ? '?query=' : ''}${query || ''}`,
    ...types.FETCH_ASSET
  }
});

export const fetchAssetsSchema = () => ({
  type: BACKEND_API,
  payload: {
    method: 'get',
    url: '/assets/get_schemas/',
    ...types.FETCH_ASSET_SCHEMA
  }
});

export const updateAssetsSchema = data => ({
  type: BACKEND_API,
  payload: {
    method: 'POST',
    data,
    url: '/assets/update_schemas/',
    ...types.UPDATE_ASSET_SCHEMA
  }
});

export const addAssetType = surfaceData => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: '/asset_types/',
    data: surfaceData,
    ...types.CREATE_TYPE
  }
});

export const fetchAssetTypes = () => ({
  type: BACKEND_API,
  payload: {
    method: 'get',
    url: '/asset_types/',
    ...types.LOAD_TYPE
  }
});

export const saveSelfInspectionTypes = data => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: '/airports/update_self_inspection_types/',
    data,
    ...types.UPDATE_SELF_INSPECTION
  }
});

export const clear = () => ({
  type: types.CLEAR_ASSET_ACTION
});
