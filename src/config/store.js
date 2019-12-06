/* global window */
/* eslint-disable no-underscore-dangle */

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as permissions } from 'react-redux-permissions';

import thunk from 'redux-thunk';
import apiMiddleware from './middleware';
import settings from '../modules/settings/redux';
import map from '../modules/settings/Map/redux';
import auth from '../modules/authentication/redux';
import inspection from '../modules/inspections/redux';
import workorders from '../modules/workorders/redux';
import assets from '../modules/assets-management/redux';
import tasks from '../modules/toDo/redux';
import opslogs from '../modules/operations-logs/redux';
import general from '../general_redux';
import profile from '../components/topbar/profile/redux';
import updateairport from '../components/topbar/airports/redux'


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers({
    general,
    settings,
    map,
    auth,
    inspection,
    workorders,
    permissions,
    assets,
    tasks,
    opslogs,
    profile,
    updateairport
  }),
  composeEnhancers(applyMiddleware(apiMiddleware), applyMiddleware(thunk))
);

export default store;