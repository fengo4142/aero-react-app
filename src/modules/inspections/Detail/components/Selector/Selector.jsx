import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import Clickable from '../../../../../components/clickable/Clickable';

import styles from './selector.module.scss';
import checklistStyles from '../../../Complete/components/InspectionChecklist/checklist.module.scss';

const Selector = ({ form, activeInspectionField, answers, changeSelectedField }) => (
  <div className={styles.selector}>
    <div className={`${styles.item} ${styles.title}`}>
      <FormattedMessage
        id="inspections.answer_details.inspection_checklist"
        defaultMessage="Inspection Checklist"
      />
    </div>
    {form.sections[1].fields.map((fieldId) => {
      const checklistField = form.fields.find(field => (
        field.id === fieldId
      ));
      const allTrue = Object.values(answers[checklistField.id]).reduce((a, b) => a && b);
      const status = allTrue ? checklistStyles.success : checklistStyles.failure;

      return (
        <Clickable className={`${styles.item} ${checklistStyles.inspectionChecklist} 
          ${fieldId === activeInspectionField ? styles.active : ''}`}
          onClick={() => changeSelectedField(fieldId)} key={fieldId}
        >
          <span className={`${checklistStyles.statusDot} ${status}`} />
          <div className={styles.titleContainer}>
            {checklistField.title}
          </div>
        </Clickable>
      );
    })}
  </div>
);

Selector.propTypes = {
  form: PropTypes.shape().isRequired,
  activeInspectionField: PropTypes.string.isRequired,
  answers: PropTypes.shape({}).isRequired,
  changeSelectedField: PropTypes.func.isRequired
};

export default Selector;
