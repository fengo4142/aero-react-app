import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from 'react-autocomplete';
import { FormattedMessage } from 'react-intl';

import Button from '../../../../../components/button';
import FormattedMessageWithClassName from '../../../../../components/formattedMessageWithClass';
import PulpoField from '../../../../../pulpo_visualizer/fields';

import styles from './details.module.scss';
import fieldstyles from '../../../../../pulpo_visualizer/fields/fields.module.scss';
import { INSPECTIONS_HOME_ROUTE } from '../../../../../constants/RouterConstants';
import { withRouter } from 'react-router-dom';

class InspectionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: undefined,
      inspectionType: ''
    };
    this.handleAutocompleteChange = this.handleAutocompleteChange.bind(this);
    this.handleAutocompleteSelect = this.handleAutocompleteSelect.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.currentValue === undefined && props.answers.inspected_by) {
      return { ...state, currentValue: props.answers.inspected_by.fullname };
    }
    return state;
  }
  componentDidUpdate(prevProps){
    if(prevProps.draftdata && prevProps.draftdata !== this.props.draftdata){
      this.setState({inspectionType: this.props.draftdata });
    }
  }
  handleAutocompleteChange(e) {
    const { searchForUser } = this.props;
    this.setState({ currentValue: e.target.value });
    searchForUser(e.target.value);
  }

  handleAutocompleteSelect(val, item) {
    const { handleAnswerChanged, handleFieldErrorChanged } = this.props;

    this.setState({ currentValue: val });
    handleAnswerChanged(item, 'inspected_by');
    handleFieldErrorChanged('inspected_by', false);
  }

  goBackToInspections = () => {
    const { history } = this.props;
    history.push(INSPECTIONS_HOME_ROUTE);
  }


  render() {
    const { currentValue } = this.state;
    const {
      detailsForm,
      userlist,
      translations,
      handleAnswerChanged,
      answers,
      showFormErrors,
      handleFieldErrorChanged,
      handleGoToChecklist,
      requiredMap,
      inspectionID,
      draftdata,
      answer } = this.props;
    
    const startInspectionTitle =  answer ? 'inspections.edit_inspection.title' : 'inspections.start_inspection.title' ;
    const startInspectionDefault =  answer ? 'Edit Inspection' : 'Start Inspection' ;
    //console.log(draftdata)
    return (
  
      <div className={styles.details}>
        <div>
          <div className={styles.header}>
            <FormattedMessage id="inspections.complete_inspection.details" defaultMessage="Inspection Details" />
          </div>
          <p className={styles.details_header}>
            <FormattedMessage id="inspections.complete_inspection.review_data" defaultMessage="Please review your data" />
          </p>
          <p className={styles.instructions}>{detailsForm.additionalInfo}</p>
          <div className={styles.details_form}>
            <PulpoField key="date" id="date" type="datetime" title="Date of Inspection" isRequired
              translationID="inspections.complete_inspections.date"
              handleValueChange={handleAnswerChanged}
              answer={answer?answer.inspection_date:answers.date}
              showFieldErrors={showFormErrors}
              handleFieldErrorChanged={handleFieldErrorChanged}
            />

            <div className={fieldstyles.field}>
              <FormattedMessageWithClassName id="inspections.complete_inspections.by"
                defaultMessage="Inspected By" className={fieldstyles.title}
              />
              <Autocomplete
                getItemValue={item => item.fullname}
                items={userlist}
                wrapperStyle={{ position: 'relative' }}
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
                value={currentValue}
                onChange={this.handleAutocompleteChange}
                onSelect={this.handleAutocompleteSelect}
              />
              {!currentValue && showFormErrors && (
                <small>
                  <FormattedMessage
                    id="pulpoforms.errors.not_blank"
                    defaultMessage="There is an error in this field"
                  />
                </small>
              )}
            </div>
            {/* <PulpoField key="weather" id="weather" type="string" title="Weather conditions" isRequired
              translationID="inspections.complete_inspections.weather"
              handleValueChange={handleAnswerChanged} answer={answers.weather}
              showFieldErrors={showFormErrors} handleFieldErrorChanged={handleFieldErrorChanged}
              /> */} 
            <PulpoField key="type" id="type" type="string" title="Type of Inspection" isRequired
              translationID="inspections.complete_inspections.type"
              handleValueChange={handleAnswerChanged} 
              answer={answer ? answer.inspection_type : this.state.inspectionType}
              showFieldErrors={showFormErrors} handleFieldErrorChanged={handleFieldErrorChanged}
            />
          </div>
          <div className={styles.details_form}>
            {detailsForm.fields.map(field => (
              <PulpoField key={field.id} {...field}
                translation={translations && translations[field.title]} handleValueChange={handleAnswerChanged}
                isRequired={requiredMap[field.id]} answer={answers[field.id]}
                showFieldErrors={showFormErrors} handleFieldErrorChanged={handleFieldErrorChanged}
              />
            ))}
          </div>
        </div>
        <div className={styles.footer}>
          <Button action="tertiary" onClick={this.goBackToInspections} translationID="inspections.new.prev" defaultText="Back" />
          <Button action="secondary" onClick={handleGoToChecklist}
            translationID={startInspectionTitle} defaultText={startInspectionDefault}
          />
        </div>
      </div>
    );
  }
}
InspectionDetails.propTypes = {
  handleAnswerChanged: PropTypes.func.isRequired,
  detailsForm: PropTypes.shape({
    fields: PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired,
  answers: PropTypes.shape({}).isRequired,
  requiredMap: PropTypes.shape({}).isRequired,
  handleFieldErrorChanged: PropTypes.func.isRequired,
  handleGoToChecklist: PropTypes.func.isRequired,
  showFormErrors: PropTypes.bool.isRequired,
  answer: PropTypes.shape({}),
  draftdata: PropTypes.string
};

export default withRouter(InspectionDetails)
