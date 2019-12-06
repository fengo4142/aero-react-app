import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';

import moment from 'moment/min/moment-with-locales';

import 'react-datetime/css/react-datetime.css';


class Date extends Component {
  constructor(props) {
    super(props);
    const { isRequired, updateFieldErrors, answer } = this.props;
    this.focused = false;
    if (isRequired && (answer === '' || answer === undefined)) {
      updateFieldErrors(['pulpoforms.errors.not_blank']);
    }
  }

  handleAnswerChanged(value, fieldId) {
    const {
      handleValueChange, handleFieldErrorChanged, isRequired, updateFieldErrors
    } = this.props;
    handleValueChange(value.format(), fieldId);
    let updatedErrors = [];

    if (!value) {
      handleFieldErrorChanged(fieldId, isRequired);
      updatedErrors = [...updatedErrors, 'pulpoforms.errors.not_blank'];
    } else {
      handleFieldErrorChanged(fieldId, false);
    }
    updateFieldErrors(updatedErrors);
  }

  render() {
    const { fieldId, answer } = this.props;

    return (
      <Datetime
        timeFormat={false}
        defaultValue={answer && moment(answer)}
        inputProps={{ readOnly: true }}
        closeOnSelect
        onChange={e => this.handleAnswerChanged(e, fieldId)}
        id={`date-field-${fieldId}`}
      />
    );
  }
}

Date.defaultProps = {
  answer: undefined
};

Date.propTypes = {
  handleValueChange: PropTypes.func.isRequired,
  fieldId: PropTypes.string.isRequired,
  answer: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  updateFieldErrors: PropTypes.func.isRequired
};

export default Date;
