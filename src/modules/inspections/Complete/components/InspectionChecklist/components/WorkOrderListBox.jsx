import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import Separator from '../../../../../../components/separator';

import styles from './workOrderListBox.module.scss';


const WorkOrderListBox = ({ workorder }) => {
  const priorities = {
    0: 'workorders.list.table.priorities.low',
    1: 'workorders.list.table.priorities.medium',
    2: 'workorders.list.table.priorities.high'
  };
  const status = {
    0: 'workorders.list.table.status.new',
    1: 'workorders.list.table.status.maintenance',
    2: 'workorders.list.table.status.operations'
  };
  return (
    <div className={styles.workOrderInfoContainer}>
      <div className={styles.workorderId}>
        ID
        <a target="_blank" rel="noopener noreferrer"
          href={`/ops/workorders/${workorder.id}/detail`}
        >
          {workorder.id}
        </a>
      </div>
      <Separator />
      <div className={styles.workorderStatus}> 
        <FormattedMessage id={status[workorder.status == undefined ? 1 : workorder.status]} defaultMessage="Unknown Status" />     
      </div>
      <Separator />
      <div className={styles.workorderDescription}>
        {workorder.problem_description}
      </div>
      <div className={styles.workorderStatus}>
        <FormattedMessage id={priorities[workorder.priority]} defaultMessage="Unknown Priority" />
      </div>
    </div>
  );
};

WorkOrderListBox.propTypes = {
  workorder: PropTypes.shape({}).isRequired
};
export default WorkOrderListBox;
