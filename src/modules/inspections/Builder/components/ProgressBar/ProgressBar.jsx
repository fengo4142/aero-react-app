import React from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './progressBar.module.scss';

const ProgressBar = ({ step }) => {
  const steps = [];
  [1, 2, 3, 4].forEach((i) => {
    if (i < step) {
      steps.push(<div key={`k${i}`} className={`${styles.step} ${styles.done}`} />);
    } else if (i === step) {
      steps.push(<div key={`k${i}`} className={`${styles.step} ${styles.active}`} />);
    } else {
      steps.push(<div key={`k${i}`} className={styles.step} />);
    }
  });
  return (
    <>
      <p className={styles.progressStage}>
        <FormattedMessage
          id="inspections.new.stage"
          defaultMessage={'Stage {step} of 4'}
          values={{ step }}
        />
      </p>
      <div className={styles.progress}>
        {steps}
        <div className={styles.bar} style={{ width: `calc(${step - 1}*100%/3)` }} />
      </div>
    </>
  );
};

export default ProgressBar;
