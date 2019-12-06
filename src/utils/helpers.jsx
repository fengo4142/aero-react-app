import React from 'react';
import moment from 'moment/min/moment-with-locales';

export const importAllImages = (r) => {
  const images = {};
  r.keys().map((item) => {
    images[item.replace('./', '')] = r(item);
    return true;
  });
  return images;
};

let lastId = 0;

export const uniqueID = (prefix = 'id') => {
  lastId += 1;
  return `${prefix}-${lastId}`;
};

export const renderInfoForType = (field, value, info) => {
  switch (field.type) {
    case 'date':
      return moment(value).format('MM/DD/YYYY');
    case 'datetime':
      return moment(value).format('MM/DD/YYYY hh:mm A');
    case 'string':
      return value;
    case 'number':
      return value;
    case 'select': {
      const f = info.answer_schema.fields.find(e => e.id === field.id);
      return f.values.find(e => e.key === value).value;
    }
    case 'multiselect': {
      const f = info.answer_schema.fields.find(e => e.id === field.id);
      return value.map(val => (
        <i key={val}>{f.values.find(e => e.key === val).value}</i>
      ));
    }
    default:
      return null;
  }
};

export const actionForState = (action, state, message) => ({
  ...action,
  success: state === 'success',
  loading: state === 'pending',
  message: message || state
});


export const getDatesFromRange = (range) => {
  let date = moment();
  let date2 = moment();
  switch (range) {
    case 'Today':
      break;
    case 'This Week':
      date = moment().startOf('week');
      date2 = moment().endOf('week');
      break;
    case 'Last Week':
      date = moment().subtract(1, 'weeks').startOf('isoWeek');
      date2 = moment().subtract(1, 'weeks').endOf('isoWeek');
      break;
    case 'This Month':
      date = moment().startOf('month');
      date2 = moment().endOf('month');
      break;
    case 'Last Month':
      date = moment().subtract(1, 'months').startOf('month');
      date2 = moment().subtract(1, 'months').endOf('month');
      break;
    default:
      break;
  }
  return [
    date.format('YYYY-MM-DD'),
    date2.format('YYYY-MM-DD')
  ];
};
