import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Dropzone from 'react-dropzone';
import Autocomplete from 'react-autocomplete';
import PulpoField from '../../../../pulpo_visualizer/fields';
import Clickable from '../../../../components/clickable/Clickable';
import Collapsible from '../../../../components/collapsible/Collapsible';

import styles from '../../Create/components/fixedFields.module.scss';
import wostyles from '../workOrderDetail.module.scss';
import fieldstyles from '../../../../pulpo_visualizer/fields/fields.module.scss';


class StepForm extends Component {
  state = { currentValue: undefined }

  static getDerivedStateFromProps(props, state) {
    if (props.info.completed_by.id && state.currentValue === undefined) {
      return { ...state, currentValue: props.info.completed_by.fullname };
    }
    return state;
  }

  handleAutocompleteChange = (e) => {
    const { searchForUser } = this.props;
    this.setState({ currentValue: e.target.value });
    searchForUser(e.target.value);
  }

  handleAutocompleteSelect = (val, item) => {
    const { handleAnswerChanged, handleFieldErrorChanged, step } = this.props;

    this.setState({ currentValue: val });
    handleAnswerChanged(step, item, 'completed_by');
    handleFieldErrorChanged('completed_by', false);
  }

  handleDrop = (dropped) => {
    const { handleAnswerChanged, info, step } = this.props;
    handleAnswerChanged(step, [...info.images, ...dropped], 'images');
  }

  handleRemoveImage = (r) => {
    const { handleAnswerChanged, info, step } = this.props;
    const res = info.images.filter(e => e !== r);
    handleAnswerChanged(step, res, 'images');
  }

  render() {
    const { currentValue } = this.state;
    const {
      handleAnswerChanged,
      showFormErrors,
      handleFieldErrorChanged,
      userlist,
      info,
      step,
      schema,
      requiredMap,
      translation
    } = this.props;
    return (
      <Collapsible
        title={`workorder.detail.${step}_header`}
        styleClasses={wostyles.collapsibleHeader}
        offset={200}
        openOnMount
      >
        <div className={wostyles.stepForm}>
          <div className={fieldstyles.field}>
            <FormattedMessage id="workorders.maintenance.by"
              defaultMessage="Work Completed by"
            >
              {txt => (
                <span className={fieldstyles.title}>
                  <small style={{ color: 'red', display: 'inline' }}> * </small>
                  {txt}
                </span>
              )}
            </FormattedMessage>
            <Autocomplete getItemValue={item => item.fullname} items={userlist}
              wrapperStyle={{ position: 'relative' }}
              value={currentValue}
              onChange={this.handleAutocompleteChange}
              onSelect={this.handleAutocompleteSelect}
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
            {!currentValue && showFormErrors && (
            <small>
              <FormattedMessage id="pulpoforms.errors.not_blank" defaultMessage="There is an error in this field" />
            </small>
            )}
          </div>

          <PulpoField key="date" id="completed_on" type="datetime"
            translationID={`workorder.detail.${step}.date`} title="Date and Time work completed"
            isRequired handleValueChange={(a, b) => handleAnswerChanged(step, a, b)}
            answer={info.completed_on}
            showFieldErrors={showFormErrors}
            handleFieldErrorChanged={handleFieldErrorChanged}
          />

          <PulpoField key="desc" id="work_description" type="string"
            className={styles.fullInput} widget={{ type: 'textarea' }}
            translationID={`workorder.detail.${step}.description`} title="Description of Work done"
            isRequired handleValueChange={(a, b) => handleAnswerChanged(step, a, b)}
            answer={info.work_description}
            showFieldErrors={showFormErrors} handleFieldErrorChanged={handleFieldErrorChanged}
          />
          <div className={styles.fullInput}>
            <span className={styles.label}>Photos</span>
            <Dropzone onDrop={this.handleDrop} disableClick
              className={styles.dropzone} accept="image/*"
            >
              {({ open }) => (
                <>
                  <p className={styles.browsetext}>
                    <FormattedMessage id="airport.logo.text1" defaultMessage="Drag an image here or" />
                    <button type="button" onClick={() => open()}>
                      <FormattedMessage id="airport.logo.button" defaultMessage="browse" />
                    </button>
                    <FormattedMessage id="airport.logo.text2" defaultMessage="for an image to upload." />
                  </p>
                </>
              )}
            </Dropzone>
            {info.images.length > 0 && (
            <div className={styles.photos}>
              {info.images.map(e => (
                <div key={e.name} className={styles.wrapper}>
                  <Clickable onClick={() => this.handleRemoveImage(e)}>&times;</Clickable>
                  <img src={e.preview} alt={e.name} />
                </div>
              ))}
            </div>
            )}
          </div>
          <div className={wostyles.separator} />
          {schema && schema.schema.fields.map(field => (
            <PulpoField key={field.id} {...field} translation={translation && translation[field.title]}
              handleValueChange={(a, b) => handleAnswerChanged(step, a, b)}
              isRequired={requiredMap[field.id]} answer={info[field.id]}
              showFieldErrors={showFormErrors}
              handleFieldErrorChanged={handleFieldErrorChanged}
            />
          ))}
        </div>
      </Collapsible>
    );
  }
}

StepForm.propTypes = {
  info: PropTypes.shape({}).isRequired,
  handleAnswerChanged: PropTypes.func.isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  showFormErrors: PropTypes.bool,
  userlist: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  searchForUser: PropTypes.func.isRequired,
  step: PropTypes.string.isRequired
};

StepForm.defaultProps = {
  showFormErrors: false
};

export default StepForm;
