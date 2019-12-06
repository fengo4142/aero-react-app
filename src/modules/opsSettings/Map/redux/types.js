const asyncActionType = type => ({
  pending: `${type}/PENDING`,
  success: `${type}/SUCCESS`,
  error: `${type}/ERROR`
});

const LOAD_MAP = asyncActionType('aerosimple/map/LOAD');
const CREATE_MAP = asyncActionType('aerosimple/map/CREATE');
const UPDATE_MAP = asyncActionType('aerosimple/map/UPDATE');
const REMOVE_MAP = asyncActionType('aerosimple/map/REMOVE');

const LOAD_TYPE = asyncActionType('aerosimple/surfacetypes/LOAD');
const CREATE_TYPE = asyncActionType('aerosimple/surfacetypes/CREATE');

export {
  // Map
  LOAD_MAP,
  CREATE_MAP,
  UPDATE_MAP,
  REMOVE_MAP,
  // Surface types
  LOAD_TYPE,
  CREATE_TYPE
};
