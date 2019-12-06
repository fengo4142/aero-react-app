import * as types from './types';
import { actionForState } from '../../../utils/helpers';
import { toast } from "react-toastify";

const INITIAL_STATE = {
  types: [],
  assets: [],
  schemas: {},
  createAction: {
    success: false, loading: false, error: false
  },
  deleteAction: {
    success: false, loading: false, error: false
  },
  updateAction: {
    success: false, loading: false, error: false
  },
  toastId: null
};


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    /* ******************************** */
    /*         LOAD ASSET TYPES         */
    /* ******************************** */
    case types.LOAD_TYPE.pending:
      return {
        ...state,
        actionLoadTypes: actionForState(state.action, 'pending')
      };
    case types.LOAD_TYPE.success:
      return {
        ...state,
        types: action.payload.results,
        actionLoadTypes: actionForState(state.action, 'success')
      };
    case types.LOAD_TYPE.error:
      return {
        ...state,
        actionLoadTypes: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*          CREATE ASSETS           */
    /* ******************************** */
    case types.CREATE_ASSET.pending:
      state.toastId = toast("Asset creation in Progress", { type: toast.TYPE.INFO });
      return {
        ...state,
        createAction: actionForState(state.action, 'pending')
      };
    case types.CREATE_ASSET.success: {
      toast.update(state.toastId, {
        render: "Asset Added successfully.",
        type: toast.TYPE.SUCCESS,
        className: 'rotateY animated'
      });
      state.toastId = null;
      const assets = state.assets.filter(e => e.id !== action.payload.id);
      const aux = action.payload;
      aux.photos = aux.images;
      delete aux.images;
      assets.push(aux);

      return {
        ...state,
        asset: action.payload,
        assets,
        createAction: actionForState(state.action, 'success')
      };
    }
    case types.CREATE_ASSET.error:
      toast.update(state.toastId, {
        render: "Error occured while creating Asset.",
        type: toast.TYPE.ERROR,
        className: 'rotateY animated'
      });
      state.toastId = null;
      return {
        ...state,
        createAction: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*          DELETE ASSETS           */
    /* ******************************** */
    case types.DELETE_ASSET.pending:
      state.toastId = toast("Asset delete in Progress.", { type: toast.TYPE.INFO });
      return {
        ...state,
        deleteAction: actionForState(state.action, 'pending')
      };
    case types.DELETE_ASSET.success:
      toast.update(state.toastId, {
        render: "Asset Deleted.",
        type: toast.TYPE.SUCCESS,
        className: 'rotateY animated'
      });
      state.toastId = null;
      return {
        ...state,
        deleteAction: actionForState(state.action, 'success')
      };
    case types.DELETE_ASSET.error:
      toast.update(state.toastId, {
        render: "Error occured while asset deleting.",
        type: toast.TYPE.ERROR,
        className: 'rotateY animated'
      });
      state.toastId = null;
      return {
        ...state,
        deleteAction: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*          FETCH ASSETS           */
    /* ******************************** */
    case types.FETCH_ASSET.pending:
      return {
        ...state,
        fetchAction: actionForState(state.action, 'pending')
      };
    case types.FETCH_ASSET.success: {
      const res = action.payload.results.map((a) => {
        const aux = a;
        aux.photos = a.images;
        delete aux.images;
        return aux;
      });
      return {
        ...state,
        assets: res,
        fetchAction: actionForState(state.action, 'success')
      };
    }
    case types.FETCH_ASSET.error:
      return {
        ...state,
        fetchAction: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*       FETCH ASSETS  SCHEMA       */
    /* ******************************** */
    case types.FETCH_ASSET_SCHEMA.pending:
      return {
        ...state,
        fetchAction: actionForState(state.action, 'pending')
      };
    case types.FETCH_ASSET_SCHEMA.success:
      return {
        ...state,
        schemas: action.payload,
        fetchAction: actionForState(state.action, 'success')
      };
    case types.FETCH_ASSET_SCHEMA.error:
      return {
        ...state,
        fetchAction: actionForState(state.action, 'error')
      };
    /* ******************************** */
    /*       UPDATE ASSETS SCHEMA       */
    /* ******************************** */
    case types.UPDATE_ASSET_SCHEMA.pending:
      return {
        ...state,
        updateAction: actionForState(state.action, 'pending')
      };
    case types.UPDATE_ASSET_SCHEMA.success:
      return {
        ...state,
        updateAction: actionForState(state.action, 'success')
      };
    case types.UPDATE_ASSET_SCHEMA.error:
      return {
        ...state,
        updateAction: actionForState(state.action, 'error')
      };

    /* ******************************** */
    /*      UPDATE SELF INSPECTION      */
    /* ******************************** */
    case types.UPDATE_SELF_INSPECTION.pending:
      return {
        ...state,
        updateAction: actionForState(state.action, 'pending')
      };
    case types.UPDATE_SELF_INSPECTION.success:
      return {
        ...state,
        updateAction: actionForState(state.action, 'success')
      };
    case types.UPDATE_SELF_INSPECTION.error:
      return {
        ...state,
        updateAction: actionForState(state.action, 'error')
      };

    case types.CLEAR_ASSET_ACTION:
      return {
        ...state,
        createAction: {
          success: false, loading: false, error: false
        },
        deleteAction: {
          success: false, loading: false, error: false
        },
        updateAction: {
          success: false, loading: false, error: false
        }
      };

    default:
      return state;
  }
}
