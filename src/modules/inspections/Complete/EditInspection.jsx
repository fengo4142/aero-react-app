/* global FormData */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment/min/moment-with-locales';

/** ******************************************************************
 *  Redux import
 * ***************** */

import { INSPECTIONS_HOME_ROUTE } from '../../../constants/RouterConstants';
import { fetchInspection, clearInspection, completeInspection, searchUser, createRemark, editRemark, fetchInspectionAnswer, clearInspectionAnswer } from '../redux/actions';

/** ******************************************************************
 *  Components import
 * ************* */

import SectionHeader from '../../../components/sectionHeader';
import Button from '../../../components/button';
import HeaderBack from '../../../components/headerBack';
import InspectionDetails from './components/InspectionDetails';
import InspectionChecklist from './components/InspectionChecklist';
import InspectionSubmitted from './components/InspectionSubmitted';

/** ******************************************************************
 *  Assets import
 * ************* */

import { importAllImages } from '../../../utils/helpers';
import styles from './inspection.module.scss';


class EditInspection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 1,
      apiStatus: undefined,
      showFormErrors: false,
      answers: {
        date: moment()
      },
      remarksIDs: {},
      remarks: [],
      activeInspectionField: 0,
      requiredMap: {},
      fieldErrors: {},
      incompleteChecklist: false,
      inspection: {
        info: {
          name: '',
          icon: ''
        },
        details: {
          fields: [],
          additionalInfo: ''
        },
        checklist: []
      }
    };
    
    this.processInspectionForState = this.processInspectionForState.bind(this);
    this.handleGoToChecklist = this.handleGoToChecklist.bind(this);
    this.handleGoInspections = this.handleGoInspections.bind(this);
    this.handleAnswerChanged = this.handleAnswerChanged.bind(this);
    this.handleFieldErrorChanged = this.handleFieldErrorChanged.bind(this);
    this.handleInspectionItemAnswerChanged = this.handleInspectionItemAnswerChanged.bind(this);
    this.handleInspectionItemRemarkChanged = this.handleInspectionItemRemarkChanged.bind(this);
    this.handleInspectionFieldChanged = this.handleInspectionFieldChanged.bind(this);

    this.isChecklistComplete = this.isChecklistComplete.bind(this);
    this.handleGoBackToDetails = this.handleGoBackToDetails.bind(this);
    this.handleCompleteInspection = this.handleCompleteInspection.bind(this);
    this.handleSearchForUser = this.handleSearchForUser.bind(this);

    this.images = importAllImages(require.context('../../../icons/inspection-icons', false, /\.(png|jpe?g|svg)$/));
  }

  componentDidMount() {
    const { actionFetch, actionFetchAnswer, match: { params: { id, aid } } } = this.props;
    actionFetch(id);
    actionFetchAnswer(aid);
  }

  componentDidUpdate(prevProps) {
    const { inspection } = this.props;
    if (!prevProps.inspection.id && inspection.id) {
      this.processInspectionForState(inspection);
    }
  }

  componentWillUnmount() {
    const { actionClear, actionClearAnswer } = this.props;
    actionClear();
    actionClearAnswer();
  }

  static getDerivedStateFromProps(props, state) {
    // grab user from state
    if (props.answer.inspected_by && !state.answers.inspected_by) {
      let thefieldErrors = {};
      if(props.answer.response){
        Object.entries(props.answer.response).map(([key, value]) => {
          thefieldErrors = {
            ...thefieldErrors,
            [key]: value ? false : true
          };
        });
      }

      return { ...state,
        answers: {
          date: moment(props.answer.inspection_date,'YYYY-MM-DDThh:mm:ssz'),
          inspected_by: props.answer.inspected_by,
          type: props.answer.inspection_type,
          ...props.answer.response
        },
        remarksIDs: props.answer.remarksIDs,
        remarks: props.answer.remarksEdit,
        fieldErrors: {
          date: props.answer.inspection_date ? false : true,
          type: props.answer.inspection_type ? false : true,
          ...thefieldErrors
        }
      };
    }

    // update state when answer is completed.
    if (props.action && props.answerCreated && props.answerCreated.status === 1) {
      return { ...state, apiStatus: props.action.success };
    }

    // update remarks IDs when a new remark is created;
    const r = props.remarkCreated;
    if (r) {
      const thestate = state;
      thestate.remarksIDs[r.field_reference] = {
        ...thestate.remarksIDs[r.field_reference],
        [r.item_reference]: r.id
      };
      return thestate;
    }
    return state;
  }

  processInspectionForState(inspection) {
    if (inspection) {
      const { details } = inspection;
      let requiredMap = {};
      let fieldErrors = {};

      details.fields.forEach((detailField) => {
        requiredMap = {
          ...requiredMap,
          [detailField.id]: detailField.required
        };

        fieldErrors = {
          ...fieldErrors,
          [detailField.id]: detailField.required
        };
      });

      fieldErrors.date = false;
      fieldErrors.type = false;
      fieldErrors.inspected_by = false;
      // fieldErrors.weather = false;
      this.setState({
        inspection,
        requiredMap,
        fieldErrors
      });
    }
  }

  handleGoToChecklist() {
    const { fieldErrors } = this.state;
    const noErrors = Object.keys(fieldErrors)
      .every(k => (fieldErrors[k] === false));

    if (noErrors) {
      this.setState({ stage: 2 });
    } else {
      this.setState({ showFormErrors: true });
    }
  }

  handleGoInspections() {
    const { history, actionClear, actionClearAnswer } = this.props;
    actionClear();
    actionClearAnswer();
    history.push(INSPECTIONS_HOME_ROUTE);
  }

  handleAnswerChanged(answer, fieldId) {
    this.setState(prevState => ({
      answers: {
        ...prevState.answers,
        [fieldId]: answer
      }
    }));
  }

  handleFieldErrorChanged(fieldId, errorValue) {
    // Updates field error map with value passed from field component
    this.setState(prevState => ({
      ...prevState,
      fieldErrors: {
        ...prevState.fieldErrors,
        [fieldId]: errorValue
      }
    }));
  }

  handleInspectionItemAnswerChanged(inspectionFieldId, itemKey, value) {
    this.setState(prevState => ({
      answers: {
        ...prevState.answers,
        [inspectionFieldId]: {
          ...prevState.answers[inspectionFieldId],
          [itemKey]: value
        }
      }
    }));
  }

  handleInspectionItemRemarkChanged(inspectionFieldId, itemKey, value) {
    this.setState(prevState => ({
      remarks: {
        ...prevState.remarks,
        [inspectionFieldId]: {
          ...prevState.remarks[inspectionFieldId],
          [itemKey]: value
        }
      }
    }));

    const { actionCreateRemark, actionEditRemark, actionFetchAnswer, match: { params: { aid } } } = this.props;
    const { remarksIDs } = this.state;

    const formData = new FormData();
    formData.append('answer', aid);
    formData.append('field_reference', inspectionFieldId);
    formData.append('item_reference', itemKey);
    formData.append('text', value.text);
    if (value.photo) formData.append('image', value.photo);
    
    if (remarksIDs[inspectionFieldId] && remarksIDs[inspectionFieldId][itemKey]) {
      actionEditRemark(remarksIDs[inspectionFieldId][itemKey], formData);
    } else {
      actionCreateRemark(formData);
    }
    actionFetchAnswer(aid);
  }

  handleInspectionFieldChanged(idx) {
    this.setState({
      activeInspectionField: idx
    });
  }

  handleGoBackToDetails() {
    this.setState({ stage: 1 });
  }

  isChecklistComplete() {
    const { answers, inspection: { checklist } } = this.state;

    const allAnswered = checklist.reduce((accumulator, currentItem) => {
      const allCurrentItem = answers[currentItem.id] && (
        Object.keys(currentItem.checklist).length === Object.keys(answers[currentItem.id]).length);

      return !!accumulator && !!allCurrentItem;
    }, true);

    return allAnswered;
  }

  handleCompleteInspection() {
    const {
      answers: {
        // eslint-disable-next-line camelcase
        date, type, inspected_by,
        ...rest
      }
    } = this.state;
    this.setState({ incompleteChecklist: false });

    if (this.isChecklistComplete()) {
      const {
        actionSubmit,
        match: { params: { id, aid } },
        location } = this.props;
      actionSubmit(
        id,
        { answer_id: aid,
          response: rest,
          date: new Date(date),
          weather: {  },
          type,
          inspected_by: inspected_by.id,
          created_by: inspected_by.id,
          task_details: {
            ...location.state
          }
        }
      );
    } else {
      this.setState({ incompleteChecklist: true });
    }
  }

  handleSearchForUser(value) {
    const { actionSearchUser } = this.props;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      actionSearchUser(value);
    }, 300);
  }

  render() {
    //  console.log("Inspections in Edit Inspection"+ JSON.stringify(this.props.inspection))
    const {
      stage,
      answers,
      requiredMap,
      showFormErrors,
      apiStatus,
      incompleteChecklist,
      inspection: {
        info,
        details,
        checklist
      },
      activeInspectionField,
      remarks
    } = this.state;

    const { userlist, inspection, user, answer, translations } = this.props;
    const translationMap = (translations && translations[user.language])
      ? translations[user.language] : {};

    return (
      <>
        <SectionHeader
          icon={info.icon.includes(".png") ? this.images[info.icon] : this.images[`${info.icon}.svg`]}
          translationID="inspections.title"
          defaultTitle={translationMap[info.title] || info.title}
        >
          { stage === 2 && !apiStatus && (
            <>
              <div className={styles.completeBtn}>
                <Button action="tertiary" onClick={this.handleGoBackToDetails}
                  translationID="inspections.complete_inspections.back_to_details" defaultText="Go back to Details"
                />
              </div>
              <div className={styles.completeBtn}>
                <Button action="secondary" onClick={this.handleCompleteInspection}
                  translationID="inspections.complete_inspections.Update" defaultText="Update Inspection"
                />
              </div>
            </>
          )}
        </SectionHeader>
        <HeaderBack
          translationID="inspections.start.inspections.back"
          translationDefault="Back to Inspections"
          backRoute={INSPECTIONS_HOME_ROUTE}
        />
        <div className={styles.container}>
          { stage === 1 && !apiStatus && (
            <InspectionDetails
              answers={answers}
              translations={translationMap}
              handleAnswerChanged={this.handleAnswerChanged}
              detailsForm={details}
              handleGoToChecklist={this.handleGoToChecklist}
              requiredMap={requiredMap}
              handleFieldErrorChanged={this.handleFieldErrorChanged}
              showFormErrors={showFormErrors}
              userlist={userlist}
              searchForUser={this.handleSearchForUser}
              answer={answer}
            />
          )}
          { stage === 2 && !apiStatus && (
            <InspectionChecklist
              answers={answers}
              translations={translationMap}
              remarks={remarks}
              workorders={inspection.workorders}
              selfInspection={user.airport.safety_self_inspection === inspection.id}
              handleAnswerChanged={this.handleAnswerChanged}
              checklist={checklist}
              activeIdx={activeInspectionField}
              handleChecklistItemStatusChange={this.handleInspectionItemAnswerChanged}
              handleChecklistItemRemarkChange={this.handleInspectionItemRemarkChanged}
              handleInspectionFieldChanged={this.handleInspectionFieldChanged}
              apiStatus={apiStatus}
              incompleteChecklist={incompleteChecklist}
              answer={answer}
            />
          )}
          { apiStatus && (
            <InspectionSubmitted icon={info.icon} name={info.name}
              handleGoInspections={this.handleGoInspections}
            />
          )}
        </div>
      </>
    );
  }
}

EditInspection.propTypes = {
  actionFetch: PropTypes.func.isRequired,
  actionClear: PropTypes.func.isRequired,
  actionCreateRemark: PropTypes.func.isRequired,
  actionEditRemark: PropTypes.func.isRequired,
  actionSubmit: PropTypes.func.isRequired,
  actionSearchUser: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  answerCreated: PropTypes.shape({}),
  inspection: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  userlist: PropTypes.arrayOf(PropTypes.shape({})),
  actionFetchAnswer: PropTypes.func.isRequired,
  actionClearAnswer: PropTypes.func.isRequired,
  answer: PropTypes.shape({}).isRequired,
};

EditInspection.defaultProps = {
  userlist: [],
  answerCreated: {}
};

const mapStateToProps = state => ({
  inspection: state.inspection.inspection,
  action: state.inspection.action,
  answerCreated: state.inspection.answerCreated,
  userlist: state.inspection.userlist,
  user: state.auth.profile,
  remarkCreated: state.inspection.remarkCreated,
  answer: state.inspection.answer,
  translations: state.auth.translations
}); // Please review your data

const mapDispatchToProps = dispatch => ({
  // Fetch inspection
  actionFetch: (id) => {
    dispatch(fetchInspection(id));
  },
  actionSearchUser: (query) => {
    dispatch(searchUser(query));
  },
  actionClear: () => {
    dispatch(clearInspection());
  },
  actionSubmit: (id, data) => {
    dispatch(completeInspection(id, data));
  },
  actionCreateRemark: (data) => {
    dispatch(createRemark(data));
  },
  actionEditRemark: (id, data) => {
    dispatch(editRemark(id, data));
  },
  // Fetch inspection Answer
  actionFetchAnswer: (id) => {
    dispatch(fetchInspectionAnswer(id));
  },
  actionClearAnswer: () => {
    dispatch(clearInspectionAnswer());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditInspection);
