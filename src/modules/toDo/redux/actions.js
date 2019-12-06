import {
  FETCH_TASKS,
  COMPLETE_TASK,
  ADD_TASK,
  UPDATE_TASK,
  UPDATE_TASK_OCCURRENCE,
  FETCH_RULES,
  CLEAR_TODOS_ACTION } from './types';

const BACKEND_API = 'BACKEND_API';


export const fetchTasks = () => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: '/tasks/occurrences/'
    },
    FETCH_TASKS
  )
});

export const fetchDelegatedTasks = () => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: '/tasks/delegated/'
    },
    FETCH_TASKS
  )
});

export const fetchRules = () => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: '/rules/'
    },
    FETCH_RULES
  )
});

export const fetchCompletedTasks = () => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'get',
      url: '/tasks/completed/'
    },
    FETCH_TASKS
  )
});

export const completeTask = oc => ({
  type: BACKEND_API,
  payload: Object.assign(
    {
      method: 'post',
      url: `/tasks/${oc.event.id}/toggle_complete_task/`,
      data: {
        date: oc.original_end
      }
    },
    COMPLETE_TASK
  )
});

export const addTask = data => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: '/tasks/',
    data,
    ...ADD_TASK
  }
});

export const updateTask = (id, data) => ({
  type: BACKEND_API,
  payload: {
    method: 'patch',
    url: `/tasks/${id}/`,
    data,
    ...UPDATE_TASK
  }
});

export const updateTaskOccurrence = (id, data) => ({
  type: BACKEND_API,
  payload: {
    method: 'post',
    url: `/tasks/${id}/update_occurrence/`,
    data,
    ...UPDATE_TASK_OCCURRENCE
  }
});


export const clear = () => ({
  type: CLEAR_TODOS_ACTION
});
