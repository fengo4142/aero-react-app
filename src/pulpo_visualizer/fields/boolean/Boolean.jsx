import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Boolean extends Component {
  constructor(props) {
    super(props);
    const { isRequired, updateFieldErrors, answer } = this.props;

    if (isRequired && (answer === '' || answer === undefined)) {
      updateFieldErrors(['pulpoforms.errors.not_blank']);
    }
  }

  handleAnswerChanged(value, fieldId) {
    const {
      handleValueChange, handleFieldErrorChanged, isRequired, updateFieldErrors
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
      handleFieldErrorChanged(fieldId, false);
    }
    updateFieldErrors(updatedErrors);
  }

  render() {
    const { widget, fieldId, answer } = this.props;

    let fieldWidget;
    if (widget === 'checkbox') {
      fieldWidget = (
        <input
          type="checkbox"
          name={`boolean-field-${fieldId}`}
          defaultChecked={answer}
          className="pulpo-checkbox"
          onChange={e => this.handleAnswerChanged(e.target.checked, fieldId)}
        />
      );
    } else {
      fieldWidget = (
        <>
          <label htmlFor={`boolean-field-${fieldId}`}>
            <input
              type="radio"
              name={`boolean-field-${fieldId}`}
              defaultChecked={answer === true}
              className="pulpo-radio"
              value
              onChange={e => this.handleAnswerChanged(e.target.value, fieldId)}
            />
            True
          </label>
          <label htmlFor={`boolean-field-${fieldId}`}>
            <input
              type="radio"
              name={`boolean-field-${fieldId}`}
              className="pulpo-radio"
              defaultChecked={answer === false}
              value={false}
              onChange={e => this.handleAnswerChanged(e.target.value, fieldId)}
            />
            False
          </label>
        </>
      );
    }
    return fieldWidget;
  }
}

Boolean.defaultProps = {
  widget: 'checkbox'
};

Boolean.propTypes = {
  widget: PropTypes.oneOf(['radio', 'checkbox']),
  handleValueChange: PropTypes.func.isRequired,
  fieldId: PropTypes.string.isRequired,
  answer: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  updateFieldErrors: PropTypes.func.isRequired
};

export default Boolean;
