const asyncActionType = type => ({
  pending: `${type}/PENDING`,
  success: `${type}/SUCCESS`,
  error: `${type}/ERROR`
});

const LOAD_TYPE = asyncActionType('aerosimple/assets/LOAD_TYPE');
const CREATE_TYPE = asyncActionType('aerosimple/assets/CREATE_TYPE');
const CREATE_ASSET = asyncActionType('aerosimple/assets/CREATE_ASSET');
const DELETE_ASSET = asyncActionType('aerosimple/assets/DELETE_ASSET');
const FETCH_ASSET = asyncActionType('aerosimple/assets/FETCH_ASSET');
const FETCH_ASSET_SCHEMA = asyncActionType('aerosimple/assets/FETCH_ASSET_SCHEMA');
const UPDATE_ASSET_SCHEMA = asyncActionType('aerosimple/assets/UPDATE_ASSET_SCHEMA');
const UPDATE_SELF_INSPECTION = asyncActionType('aerosimple/assets/UPDATE_SELF_INSPECTION');
const CLEAR_ASSET_ACTION = 'aerosimple/assets/CLEAR';

export {
  LOAD_TYPE,
  CREATE_TYPE,
  CREATE_ASSET,
  CLEAR_ASSET_ACTION,
  FETCH_ASSET,
  DELETE_ASSET,
  FETCH_ASSET_SCHEMA,
  UPDATE_ASSET_SCHEMA,
  UPDATE_SELF_INSPECTION
};
