/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styles from '../steps.module.scss';

const Step4 = ({ icon, title, status }) => {
  const ic = require(`../../../../../icons/inspection-icons/${icon}`);
  return (
    <div className={styles.step0}>
      <img className={styles.icon} src={ic} alt="" />
      <h3 className={styles.headline}>{title}</h3>
      <h3 className={styles.headline}>
        {status === undefined && (
        <FormattedMessage id="inspections.step4.headline"
          defaultMessage="Do you want to save the inspection?"
        />
        )}
        {status === false && (
        <FormattedMessage id="inspections.step4.fail"
          defaultMessage="There was a problem with your submitted."
        />
        )}
        {status && (
        <FormattedMessage id="inspections.step4.success"
          defaultMessage="Great news! Your inspection was saved."
        />
        )}
      </h3>
    </div>
  );
};
Step4.propTypes = {
  icon: PropTypes.string.isRequired,
  status: PropTypes.bool,
  title: PropTypes.string.isRequired
};

Step4.defaultProps = {
  status: undefined
};
export default Step4;
