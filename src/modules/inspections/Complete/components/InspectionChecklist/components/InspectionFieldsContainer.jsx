import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import styles from './InspectionFieldsContainer.module.scss';
import inspectionStyles from '../checklist.module.scss';

const InspectionFieldsContainer = ({
  checklist,
  activeIdx,
  handleInspectionFieldChanged,
  answers,
  translations,
  answer
}) => (
  <div className={styles.inspectionFields}>
    <span className={styles.title}>
      <FormattedMessage id="inspections.complete_inspections.summary" defaultMessage="" />
    </span>
    <table>
      <thead>
        <tr className={styles.tableHead}>
          <th>
            <FormattedMessage id="inspections.complete_inspections.status" defaultMessage="Status" />
          </th>
          <th>
            <FormattedMessage id="inspections.complete_inspections.facilities" defaultMessage="Facilities" />
          </th>
        </tr>
      </thead>
      <tbody>
        {checklist.map((inspectionField, idx) => {
          let inspectionFieldStyle = inspectionStyles.untouched;
          const allAnswers = answers[inspectionField.id] && (
            Object.keys(inspectionField.checklist).length === Object.keys(
              answers[inspectionField.id]
            ).length);
          if (allAnswers) {
            const allTrue = Object.values(answers[inspectionField.id]).reduce((a, b) => a && b);
            inspectionFieldStyle = allTrue ? inspectionStyles.success : inspectionStyles.failure;
          }
          return (
            <tr
              role="button"
              tabIndex="0"
              key={inspectionField.id}
              onClick={() => { handleInspectionFieldChanged(idx); }}
              onKeyPress={() => { handleInspectionFieldChanged(idx); }}
            >
              <td className={styles.status}>
                <span className={`${inspectionStyles.statusDot} ${inspectionFieldStyle}`} />
              </td>
              <td className={`${styles.tableData} ${idx === activeIdx ? styles.active : ''}`}>
                {(translations && translations[inspectionField.title]) || inspectionField.title}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

InspectionFieldsContainer.propTypes = {
  checklist: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  activeIdx: PropTypes.number.isRequired,
  answers: PropTypes.shape({}).isRequired,
  handleInspectionFieldChanged: PropTypes.func.isRequired,
  answer: PropTypes.shape({})
};
export default InspectionFieldsContainer;
