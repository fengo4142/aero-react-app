import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import IconButton from '../../../../../components/iconButton';
import ShareOptions from './ShareOptions'


/** *********************************************************
 *  Assets import
 * ************* */
import share from '../../../../../icons/share.svg';
import print from '../../../../../icons/print.svg';

import styles from './fieldDetail.module.scss';
import ChecklistRow from './ChecklistRow';

const FieldDetail = ({ full, fields, selected, answers, remarks, workorders, exportInspection, inspectionid, exportInspectionData, answerId }) => (
  <table className={styles.detail}>
    <thead className={styles.header}>
      <tr className={styles.row}>
        {full
        && <FormattedMessage tagName="th" id="inspections.answer_details.inspection_checklist" defaultMessage="Inspection Checklist" />
        }
        <FormattedMessage tagName="th" id="inspections.answer_details.conditions" defaultMessage="Conditions" />
        <FormattedMessage tagName="th" id="inspections.answer_details.status" defaultMessage="Status" />
        <FormattedMessage tagName="th" id="inspections.answer_details.work_orders" defaultMessage="Work Orders" />
        <FormattedMessage tagName="th" id="inspections.answer_details.notams" defaultMessage="Notams" />
        <th>
          <div className={styles.parent}>
            <div className={styles.child}>
              <ShareOptions  exportInspection={exportInspection} 
                exportInspectionData={exportInspectionData}
                inspectionid={inspectionid} answer={answerId} />
            </div>
            <div className={styles.child}>
              <IconButton icon={print} 
                onClick={() => { exportInspectionData(answerId); }}/>
            </div>
          </div>
        </th>
      </tr>
    </thead>
    <tbody className={styles.body}>
      {Object.keys(fields).map((f) => {
        if (f === selected || full) {
          return fields[f].checklist.map((item, i) => (
            <ChecklistRow key={item.key}
              field={fields[f]} item={item}
              answer={answers[fields[f].id]}
              remark={remarks[fields[f].id]}
              workorders={workorders}
              rowSpan={full && i === 0 ? fields[f].checklist.length : undefined}
            />
          ));
        }
        return null;
      })}
    </tbody>
  </table>
);
FieldDetail.propTypes = {
  fields: PropTypes.shape({}).isRequired,
  selected: PropTypes.string.isRequired,
  full: PropTypes.bool,
  answers: PropTypes.shape({}).isRequired,
  remarks: PropTypes.shape({}).isRequired,
  exportInspection: PropTypes.func.isRequired,
  inspectionid: PropTypes.shape({}).isRequired,
  exportInspectionData: PropTypes.func.isRequired,
  answerId: PropTypes.string.isRequired,
};

FieldDetail.defaultProps = {
  full: false
};

export default FieldDetail;
