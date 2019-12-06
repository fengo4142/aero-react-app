import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import styles from './fields.module.scss';


class PulpoField extends Component {
  constructor(props) {
    super(props);

    const { type: fieldType } = props;

    /* eslint-disable-next-line */
    let component = require(`./${fieldType}`);
    if (component.default) {
      component = component.default;
    }
    this.component = component;
    this.state = { errors: [] };

    this.updateFieldErrors = this.updateFieldErrors.bind(this);
  }

  updateFieldErrors(errors) {
    this.setState({ errors });
  }

  render() {
    const {
      id: fieldId,
      type: fieldType,
      title,
      isRequired,
      showFieldErrors,
      className,
      translationID,
      translation,
      ...fieldProps
    } = this.props;
    const { errors } = this.state;
    return (
      <div className={`${styles.field} ${className}`}>
        <span className={styles.title}>
          { isRequired && <small style={{ color: 'red' }}> * </small> }
          {translation || <FormattedMessage id={translationID} defaultMessage={title} />}
        </span>
        { React.createElement(
          this.component,
          {
            ...fieldProps,
            fieldId,
            fieldType,
            isRequired,
            updateFieldErrors: this.updateFieldErrors
          }, null
        )}
        {showFieldErrors && errors.map(e => (
          <small key={e}>
            <FormattedMessage id={e} defaultMessage="There is an error in this field" />
          </small>
        ))}
      </div>
    );
  }
}


PulpoField.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  handleValueChange: PropTypes.func.isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  showFieldErrors: PropTypes.bool.isRequired,
  className: PropTypes.string,
  translationID: PropTypes.string
};

PulpoField.defaultProps = {
  className: '',
  translationID: 'invalid',
  isRequired: false
};

export default PulpoField;
