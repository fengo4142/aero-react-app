import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './multiselect.module.scss';

class Multiselect extends Component {
  constructor(props) {
    super(props);
    const { isRequired, updateFieldErrors, answer } = this.props;

    if (isRequired && ((Array.isArray(answer) && answer.length === 0) || answer === undefined)) {
      updateFieldErrors(['pulpoforms.errors.not_blank']);
    }
  }

  handleAnswerChanged(value, fieldId) {
    const {
      handleValueChange, handleFieldErrorChanged, isRequired, values, updateFieldErrors, answer
    } = this.props;
    let newAnswer;
    if (answer.includes(value)) {
      newAnswer = answer.filter(e => e !== value);
    } else {
      newAnswer = [...answer, value];
    }
    handleValueChange(newAnswer, fieldId);
    let updatedErrors = [];

    if ((Array.isArray(newAnswer) && newAnswer.length === 0) || value === undefined) {
      handleFieldErrorChanged(fieldId, isRequired);
      updatedErrors = [
        ...updatedErrors,
        'pulpoforms.errors.not_blank'
      ];
    } else {
      const validOption = Object.keys(
        values
      ).some(
        k => (values[k].key === value)
      );

      handleFieldErrorChanged(fieldId, !validOption);
      if (!validOption) {
        updatedErrors = [
          ...updatedErrors,
          'pulpoforms.errors.select.invalid_option'
        ];
      }
    }
    updateFieldErrors(updatedErrors);
  }

  render() {
    const { fieldId, answer, values } = this.props;
    return (
      <>
        {values.map(option => (
          <label className={styles.checkbox} key={option.key}>
            <input
              type="checkbox"
              value={option.key}
              checked={answer && answer.indexOf(option.key) >= 0}
              onChange={e => this.handleAnswerChanged(e.target.value, fieldId)}
            />
            {option.value}
          </label>
        ))}
      </>
    );
  }
}

Multiselect.defaultProps = {
  answer: []
};

Multiselect.propTypes = {
  handleValueChange: PropTypes.func.isRequired,
  fieldId: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string
  })).isRequired,
  answer: PropTypes.arrayOf(PropTypes.string),
  isRequired: PropTypes.bool.isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  updateFieldErrors: PropTypes.func.isRequired
};

export default Multiselect;
