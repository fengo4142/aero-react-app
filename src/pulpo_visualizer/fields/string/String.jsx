import React, { Component } from 'react';
import PropTypes from 'prop-types';


class String extends Component {
  constructor(props) {
    super(props);
    const { isRequired, answer, updateFieldErrors } = this.props;

    if (isRequired && !answer) {
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
    const { widget: { type: widget }, fieldId, answer, rows } = this.props;
    let fieldWidget;
    if (widget === 'charfield') {
      fieldWidget = (
        <input
          type="text"
          name={`string-field-${fieldId}`}
          defaultValue={answer}
          onChange={e => this.handleAnswerChanged(e.target.value, fieldId)}
          className="pulpo-charfield"
        />
      );
    } else {
      fieldWidget = (
        <textarea
          className="pulpo-textarea"
          name={`string-field-${fieldId}`}
          style={{ height: 'initial' }}
          defaultValue={answer}
          onChange={e => this.handleAnswerChanged(e.target.value, fieldId)}
          rows={rows}
        />
      );
    }
    return fieldWidget;
  }
}


String.defaultProps = {
  widget: { type: 'charfield' },
  answer: '',
  rows: 5
};

String.propTypes = {
  widget: PropTypes.shape({ type: PropTypes.string }),
  handleValueChange: PropTypes.func.isRequired,
  fieldId: PropTypes.string.isRequired,
  answer: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  updateFieldErrors: PropTypes.func.isRequired,
  rows: PropTypes.number
};

export default String;
