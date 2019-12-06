import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Number extends Component {
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
    const { fieldId, answer } = this.props;
    return (
      <input
        type="number"
        name={`number-field-${fieldId}`}
        defaultValue={answer}
        className="pulpo-numberfield"
        onChange={e => this.handleAnswerChanged(e.target.value, fieldId)}
      />
    );
  }
}


Number.propTypes = {
  handleValueChange: PropTypes.func.isRequired,
  fieldId: PropTypes.string.isRequired,
  answer: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  updateFieldErrors: PropTypes.func.isRequired
};

Number.defaultProps = {
  answer: ''
};

export default Number;
