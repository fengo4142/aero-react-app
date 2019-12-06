import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import Autocomplete from 'react-autocomplete';
import PulpoField from '../../../../pulpo_visualizer/fields';
import styles from '../../../workorders/Create/components/fixedFields.module.scss';
import fieldstyles from '../../../../pulpo_visualizer/fields/fields.module.scss';
import FormattedMessageWithClass from '../../../../components/formattedMessageWithClass';

const DefaultFields = ({
  info,
  types,
  subtypes,
  userlist,
  searchForUser,
  handleAnswerChanged,
  showFieldErrors,
  handleFieldErrorChanged,
  intl,
  user
}) => {
  // State Hooks
  const [currentValue, setCurrentValue] = useState('');
  // handles type of autocomplete
  const handleAutocompleteChange = (e) => {
    setCurrentValue(e.target.value);
    searchForUser(e.target.value);
  };
  useEffect(() => {
    setCurrentValue(info.currentValue);
  }, []);
  
  const handleAutocompleteSelect = (val, item) => {
    setCurrentValue(val);
    handleAnswerChanged(item, 'logged_by');
    handleFieldErrorChanged('logged_by', false);
  };

  if (user && user.id && !currentValue) {
    handleAnswerChanged(user, 'logged_by');
    setCurrentValue(user.fullname);
  }

  return (
    <>
      <div className={fieldstyles.field}>
        <FormattedMessageWithClass
          className={fieldstyles.title} id="operations.create.by"
          defaultMessage="Logged by"
        />
        <Autocomplete getItemValue={item => item.fullname} items={userlist}
          wrapperStyle={{ position: 'relative' }}
          value={currentValue}
          onChange={handleAutocompleteChange}
          onSelect={handleAutocompleteSelect}
          renderMenu={children => (
            <div className={styles.autocompleteMenu}>
              {children}
            </div>
          )}
          renderItem={(item, isHighlighted) => (
            <div key={item.id} className={`${styles.menuItem} ${isHighlighted && styles.highlighted}`}>
              {item.fullname}
            </div>
          )}
        />
        {!currentValue && showFieldErrors && (
          <small>
            <FormattedMessage id="pulpoforms.errors.not_blank" defaultMessage="There is an error in this field" />
          </small>
        )}
      </div>
      <PulpoField key="report_date" id="report_date" type="datetime"
        translationID="workorder.create.date" title="Report date"
        isRequired handleValueChange={a => handleAnswerChanged(a, 'report_date')}
        answer={info.report_date}
        showFieldErrors={showFieldErrors}
        handleFieldErrorChanged={handleFieldErrorChanged}
      />

      <PulpoField key="type" id="type" type="select" title="Type" isRequired
        translationID="operations.create.type" className={styles.fullInput}
        handleValueChange={a => handleAnswerChanged(a, 'type')}
        answer={info.type}
        showFieldErrors={showFieldErrors}
        handleFieldErrorChanged={handleFieldErrorChanged}
        values={types.map(e => ({ key: `${e.name}`, value: (e.i18n_id ? intl.formatMessage({ id: `operations.log.${e.i18n_id}` }) : e.name) }))}
      />

      {info.type && (
        <PulpoField key="subtype" id="subtype" type="select" title="SubType" isRequired
          translationID="operations.create.subtype" className={styles.fullInput}
          handleValueChange={a => handleAnswerChanged(a, 'subtype')}
          answer={info.subtype}
          showFieldErrors={showFieldErrors}
          handleFieldErrorChanged={handleFieldErrorChanged}
          values={subtypes.filter(
            s => s.activity_type.name === info.type
          ).map(e => ({ key: `${e.name}`, value: (e.i18n_id ? intl.formatMessage({ id: `operations.log.${e.i18n_id}` }) : e.name) }))}
        />
      )}

      <PulpoField key="desc" id="description" type="string"
        translationID="workorder.create.description" className={styles.fullInput}
        widget={{ type: 'textarea' }} title="Description" isRequired
        handleValueChange={a => handleAnswerChanged(a, 'description')}
        answer={info.description}
        showFieldErrors={showFieldErrors} handleFieldErrorChanged={handleFieldErrorChanged}
      />
    </>
  );
};

DefaultFields.propTypes = {
  info: PropTypes.shape({}).isRequired,
  userlist: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  searchForUser: PropTypes.func.isRequired,
  showFieldErrors: PropTypes.bool.isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  handleAnswerChanged: PropTypes.func.isRequired,
  types: PropTypes.arrayOf(PropTypes.shape({})),
  subtypes: PropTypes.arrayOf(PropTypes.shape({})),
  user: PropTypes.shape({})
};

DefaultFields.defaultProps = {
  types: [],
  subtypes: []
};
export default injectIntl(DefaultFields);
