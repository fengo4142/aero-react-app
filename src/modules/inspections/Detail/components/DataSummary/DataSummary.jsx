import React from 'react';
import PropTypes from 'prop-types';

import { FormattedDate } from 'react-intl';

import styles from '../../../inspections.module.scss';
import defaultAvatar from '../../../../../icons/default_avatar.jpg';

const DataSummary = ({ inspection, answer, fields  }) => {
  const renderWeatherObs = (obs) => {
    // {console.log(obs !== undefined ? obs.metar.temperature : 'No data')}
    return obs !== undefined ?  obs.metar.temperature : '';
  }
  return(
  <div className={styles.datasources}>
    <div className={styles.userInfo}>
      {/* <img src={inspection.inspected_by.picture} alt="" /> */}
      <img src={inspection.inspected_by.image?inspection.inspected_by.image:defaultAvatar} alt="" />
      <div>
        <h2>{inspection.inspected_by.fullname}</h2>
        <p>{inspection.inspected_by.email}</p>
        {/* <a href="/#">View Route</a>
        <a href="/#">More Detail</a> */}
      </div>
    </div>
    <div className={styles.column}>
      <h2>
        <FormattedDate
          value={inspection.inspection_date}
          month="short"
          day="numeric"
        />
      </h2>
      {/* <p>start 03:00 AM</p>
      <p>end 05:00 AM</p> */}
    </div>
    <div className={styles.column}>
      <h2>-</h2>
      <p>SHIFT</p>
    </div>
    <div className={styles.column} >
      <div dangerouslySetInnerHTML={{ __html: renderWeatherObs(answer.weather_conditions.current_obs) }}/>
      <p>--</p>
    </div>
    <div className={styles.column}>
      <h2 className={styles.danger}>
        {inspection.issues}
      </h2>
      <p>OPEN ISSUES</p>
    </div>
  </div>
  )};

DataSummary.propTypes = {
  inspection: PropTypes.shape({}).isRequired,
  answer: PropTypes.shape({}).isRequired,
  fields: PropTypes.shape({}).isRequired
};
export default DataSummary;
