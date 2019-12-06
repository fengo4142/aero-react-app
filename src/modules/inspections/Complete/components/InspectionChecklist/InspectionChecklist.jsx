import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import InspectionChecklistItem from './components/InspectionChecklistItem';
import InspectionFieldsContainer from './components/InspectionFieldsContainer';

import styles from './checklist.module.scss';

class InspectionChecklist extends Component {
  constructor(props) {
    super(props);

    this.handleChecklistItemStatusChange = this.handleChecklistItemStatusChange.bind(this);
    this.handleChecklistItemRemarkChange = this.handleChecklistItemRemarkChange.bind(this);
  }

  handleChecklistItemStatusChange(itemKey, pass) {
    const { handleChecklistItemStatusChange, checklist, activeIdx } = this.props;
    handleChecklistItemStatusChange(checklist[activeIdx].id, itemKey, pass);
  }

  handleChecklistItemRemarkChange(itemKey, value) {
    const { handleChecklistItemRemarkChange, checklist, activeIdx } = this.props;
    handleChecklistItemRemarkChange(checklist[activeIdx].id, itemKey, value);
  }
 


  render() {
    const {
      remarks,
      checklist,
      activeIdx,
      answers,
      handleInspectionFieldChanged,
      apiStatus,
      incompleteChecklist,
      workorders,
      selfInspection,
      translations,
      answer,
      draftdata
    } = this.props;
    
    return (
      <div className={styles.inspectionChecklistContainer}>
        {apiStatus === false && (
          <div className={styles.submissionError}>
            <FormattedMessage
              id="inspections.complete_inspections.server_error_msg"
              defaultMessage="There was a problem with your submission. Please try again or contact support."
            />
          </div>
        )}
        {incompleteChecklist && (
          this.props.showFeedBackModal()
          // <div className={styles.submissionError}>
          //   <FormattedMessage
          //     id="inspections.complete_inspections.incomplete_checklist"
          //     defaultMessage="There was a problem with your submission. Please make sure you've answered all of the inspection checklists."
          //   />
          // </div>
        )}
        <div className={styles.inspectionChecklist}>
          <InspectionFieldsContainer
            checklist={checklist}
            translations={translations}
            activeIdx={activeIdx}
            handleInspectionFieldChanged={handleInspectionFieldChanged}
            answers={answers}
            answer={answer}
          />
          <div className={styles.checklist}>
            <span className={styles.title}>
              {(translations && translations[checklist[activeIdx].title])
               || checklist[activeIdx].title}
            </span>
            <div>
              {checklist[activeIdx].checklist.map(item => (
                <InspectionChecklistItem
                  id={this.props.id}
                  draftdata={draftdata && Object.keys(draftdata.response).length > 0 && draftdata.response[Object.keys(draftdata.response)[activeIdx]]
                    ? draftdata.response[Object.keys(draftdata.response)[activeIdx]] : {}}
                  title={(translations && translations[item.value]) || item.value}
                  key={`${activeIdx}-${item.key}`}
                  category={checklist[activeIdx].id}
                  itemKey={item.key}
                  selfInspection={selfInspection}
                  remark={remarks[checklist[activeIdx].id] ? remarks[
                    checklist[activeIdx].id][item.key] : ''}
                  handleItemStatusChange={this.handleChecklistItemStatusChange}
                  handleItemRemarkChange={this.handleChecklistItemRemarkChange}
                  workorders={workorders.filter(e => (
                    checklist[activeIdx].id === e.category_id
                    && item.key === e.subcategory_id
                  ))}
                  pass={ answers[checklist[activeIdx].id] ? answers[checklist[activeIdx].id][item.key] : undefined }
                  answerText={ answer ? (answer.remarks[checklist[activeIdx].id] && answer.remarks[checklist[activeIdx].id][item.key] ? answer.remarks[ checklist[activeIdx].id][item.key].text : '') : ''}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

InspectionChecklist.defaultProps = {
  apiStatus: undefined,
  selfInspection: false,
  workorders: []
};

InspectionChecklist.propTypes = {
  checklist: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  activeIdx: PropTypes.number.isRequired,
  handleChecklistItemStatusChange: PropTypes.func.isRequired,
  handleChecklistItemRemarkChange: PropTypes.func.isRequired,
  handleInspectionFieldChanged: PropTypes.func.isRequired,
  answers: PropTypes.shape({}).isRequired,
  remarks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  incompleteChecklist: PropTypes.bool.isRequired,
  apiStatus: PropTypes.bool,
  workorders: PropTypes.arrayOf(PropTypes.shape({})),
  selfInspection: PropTypes.bool,
  answer: PropTypes.shape({})
};

export default InspectionChecklist;
