/* eslint-disable jsx-a11y/no-onchange */
/* global isNaN */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './select.module.scss';


class Select extends Component {
  constructor(props) {
    super(props);
    const { isRequired, updateFieldErrors, answer } = this.props;

    if (isRequired && (answer === '' || answer === undefined)) {
      updateFieldErrors(['pulpoforms.errors.not_blank']);
    }
  }

  handleAnswerChanged(value, fieldId) {
    const {
      handleValueChange, handleFieldErrorChanged, isRequired, values, updateFieldErrors
    } = this.props;
    handleValueChange(value, fieldId);
    let updatedErrors = [];
    if (value === '' || value === undefined) {
      handleFieldErrorChanged(fieldId, isRequired);
      updatedErrors = [
        ...updatedErrors,
        'pulpoforms.errors.not_blank'
      ];
    } else {
      const validOption = Object.keys(values).some(
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
    const { widget: { type: widget }, fieldId, answer, values, defaultOption } = this.props;
    // debugger;
    let fieldWidget;
    if (widget === 'dropdown') {
      fieldWidget = (
        <select
          value={answer}
          onChange={e => this.handleAnswerChanged(e.target.value, fieldId)}
          name={`select-field-${fieldId}`}
          className="pulpo-dropdown"
        >
          <option key="default" value="">{defaultOption}</option>
          {values.map(option => (
            <option key={option.key} value={option.key}>{option.value}</option>
          ))}
        </select>
      );
    } else {
      fieldWidget = (
        <div className={styles.pulpoRadio}>
          {values.map(option => (
            <label key={option.key}>
              <input
                type="radio"
                className="pulpo-radio"
                value={option.key}
                onChange={e => this.handleAnswerChanged(e.target.value, fieldId)}
                checked={answer === option.key}
              />
              {option.value}
            </label>
          ))}
        </div>
      );
    }
    return fieldWidget;
  }
}

Select.defaultProps = {
  widget: { type: 'dropdown' },
  answer: '',
  defaultOption: ''
};

Select.propTypes = {
  widget: PropTypes.shape({ type: PropTypes.string }),
  handleValueChange: PropTypes.func.isRequired,
  fieldId: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string
  })).isRequired,
  answer: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  updateFieldErrors: PropTypes.func.isRequired,
  defaultOption: PropTypes.string
};

export default Select;
