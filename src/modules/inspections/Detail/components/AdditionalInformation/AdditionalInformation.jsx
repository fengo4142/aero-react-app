import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import { FormattedDate, FormattedTime } from 'react-intl';
import styles from './additionalInfo.module.scss';

import Collapsible from '../../../../../components/collapsible/Collapsible';

const AdditionalInformation = ({ answer, fields }) => {
  const renderWeatherObs = (obs) => {
    return obs !== undefined ? obs.metar.summary + ' - ' + obs.metar.temperature + (obs.metar.wind !== undefined ? ', ' + obs.metar.wind : '') + (obs.metar.humidity !== undefined ? ', Humidity - ' + obs.metar.humidity : '') : '';
  };
  const renderInfoForType = (field, value) => {
    switch (field.type) {
      case 'date':
        return <FormattedDate value={moment(value)} />;
      case 'datetime':
        return (
          <>
            <FormattedDate value={moment(value)} />
            {' @ '}
            <FormattedTime value={moment(value)} />
          </>
        );
      case 'string':
        return <div>{value}</div>;
      case 'select': {
        const f = answer.version.schema.fields.find(e => e.id === field.id);
        return (
          <div>{f.values.find(e => e.key === value).value}</div>
        );
      }
      case 'multiselect': {
        const f = answer.version.schema.fields.find(e => e.id === field.id);
        return value.map(val => (
          <div key={val}>{f.values.find(e => e.key === val).value}</div>
        ));
      }
      default:
        return null;
    }
  };

  return (
    <Collapsible title="inspections.answer_details.additionalInfo">
      <div className={styles.additionalInfo}>
        {Object.keys(fields).map(k => (
          <div key={fields[k].id} className={styles.field}>
            <span className={styles.title}>{fields[k].title}</span>
            <div className={styles.info}>
              {renderInfoForType(fields[k], answer.response[k])}
            </div>
          </div>
        ))}
        <div key="weather_obs" className={styles.field}>
          <span className={styles.title}>Weather Observations</span>
          <div dangerouslySetInnerHTML={{ __html: renderWeatherObs(answer.weather_conditions.current_obs) }} className={styles.info} />
        </div>
      </div>
    </Collapsible>
  );
};

AdditionalInformation.propTypes = {
  answer: PropTypes.shape({}).isRequired,
  fields: PropTypes.shape({}).isRequired
};
export default AdditionalInformation;
