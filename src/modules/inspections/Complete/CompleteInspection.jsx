/* global FormData */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment/min/moment-with-locales';
import { FormattedMessage } from 'react-intl';

/** ******************************************************************
 *  Redux import
 * ***************** */

import { INSPECTIONS_HOME_ROUTE } from '../../../constants/RouterConstants';
import {
  fetchInspection, clearInspection, completeInspection, searchUser,
  createRemark, editRemark, draftInspection, fetchDraftInspection
} from '../redux/actions';
import { showConfirmModal, hideModal } from '../../../general_redux/actions';
import { fetchAssets } from '../../assets-management/redux/actions';


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
import Modal from '../../../components/modal'
import Loading from '../../../components/loading/loading';


class CompleteInspection extends Component {
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
      },
      showModal: false,
      showErrorModal: false,
      inspection_type: '',
      loadingStatus: false
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
    this.handleDraftInspection = this.handleDraftInspection.bind(this);
    this.handleSearchForUser = this.handleSearchForUser.bind(this);

    this.images = importAllImages(require.context('../../../icons/inspection-icons', false, /\.(png|jpe?g|svg)$/));
  }

  componentDidMount() {
    const { actionFetch, actionFetchDraft, match: { params: { id } }, assets, actionFetchAssets } = this.props;
    actionFetch(id);
    actionFetchDraft(id);

    //createEmptyInspection(id);
    // get_draft_data(id);
    if (!assets.length) actionFetchAssets();


  }

  componentDidUpdate(prevProps) {
    const { inspection } = this.props;
    if (!prevProps.inspection.id && inspection.id) {
      this.processInspectionForState(inspection);
    }
    if (prevProps.draftAction.success !== this.props.draftAction.success) {
      this.setState({ showModal: true })
    }
  }

  componentWillUnmount() {
    const { actionClear } = this.props;
    actionClear();
  }

  static getDerivedStateFromProps(props, state) {
    // grab user from state
    if (props.user.id && !state.answers.inspected_by) {
      return {
        ...state,
        answers: {
          ...state.answers,
          inspected_by: {
            id: props.user.id,
            fullname: props.user.fullname
          }
        }
      };
    }

    // update state when answer is completed.
    if (props.createAction && props.answerCreated && props.answerCreated.status === 1) {
      return { ...state, apiStatus: props.createAction.success };
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
      fieldErrors.type = true;
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
    const { history } = this.props;
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
      },
      incompleteChecklist: false,
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

    const { actionCreateRemark, actionEditRemark, draft_data } = this.props;
    const { remarksIDs } = this.state;

    const formData = new FormData();
    formData.append('answer', draft_data.id);
    formData.append('field_reference', inspectionFieldId);
    formData.append('item_reference', itemKey);
    formData.append('text', value.text);
    if (value.photo) formData.append('image', value.photo);

    if (remarksIDs[inspectionFieldId]
      && remarksIDs[inspectionFieldId][itemKey]) {
      actionEditRemark(remarksIDs[inspectionFieldId][itemKey], formData);
    } else {
      actionCreateRemark(formData);
    }
  }

  handleInspectionFieldChanged(idx) {
    this.setState({
      activeInspectionField: idx,
      incompleteChecklist: false,
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
    this.setState({ incompleteChecklist: false, loadingStatus: true });

    if (this.isChecklistComplete()) {
      const {
        actionSubmit,
        match: { params: { id } },
        draft_data,
        location } = this.props;
      if (draft_data.type && draft_data.type.length > 0 && type === draft_data.type
        || draft_data.type && draft_data.type.length > 0 && type === undefined) {
        this.state.inspection_type = draft_data.type
      } else {
        //this.setState({inspection_type:type});
        this.state.inspection_type = type;
      }
      actionSubmit(
        id,
        {
          answer_id: draft_data.id,
          response: rest,
          date: new Date(date),
          weather: {},
          type: this.state.inspection_type,
          inspected_by: inspected_by.id,
          created_by: inspected_by.id,
          task_details: {
            ...location.state
          }
        }
      );
    } else {
      //this.setState({ incompleteChecklist: true });
      this.setState({ showErrorModal: true, loadingStatus: false });
    }
  }


  handleDraftInspection() {
    const {
      answers: {
        // eslint-disable-next-line camelcase
        date, type, inspected_by,
        ...rest
      } } = this.state;
    const {
      actiondraft,
      match: { params: { id } },
      draft_answer,
      draft_data,
      location } = this.props;

    if (draft_data.type && draft_data.type.length > 0 && type === draft_data.type
      || draft_data.type && draft_data.type.length > 0 && type === undefined) {
      this.state.inspection_type = draft_data.type
    } else {
      //this.setState({inspection_type:type});
      this.state.inspection_type = type
    }
    actiondraft(
      id,
      {
        answer_id: draft_answer.id,
        response: rest,
        date: new Date(date),
        weather: {},
        type: this.state.inspection_type,
        inspected_by: inspected_by.id,
        created_by: inspected_by.id,
        task_details: {
          ...location.state
        }
      }
    );

  }


  handleSearchForUser(value) {
    const { actionSearchUser } = this.props;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      actionSearchUser(value);
    }, 300);
  }

  showFormErrorsModal = () => {
    const { actionConfirm, actionHideModal } = this.props;
    const content = {
      title: '',
      body: <div className={styles.submissionError}>
        <FormattedMessage
          id="inspections.complete_inspections.incomplete_checklist"
          defaultMessage="There was a problem with your submission. Please make sure you've answered all of the inspection checklists."
        />
      </div>
    };
    actionConfirm(content, () => {
      actionHideModal();
    }, actionHideModal);
  }



  render() {
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

    const { userlist, inspection, user, translations, draft_data } = this.props;
    const translationMap = (translations && translations[user.language])
      ? translations[user.language] : {};
    return (
      <>
        <SectionHeader
          icon={info.icon.includes(".png") ? this.images[info.icon]: this.images[`${info.icon}.svg`] }
          translationID="inspections.title"
          defaultTitle={translationMap[info.title] || info.title}
        >
          {stage === 2 && !apiStatus && (
            <>
              <div className={styles.completeBtn}>
                <Button action="tertiary" onClick={this.handleGoBackToDetails}
                  translationID="inspections.complete_inspections.back_to_details" defaultText="Go back to Details"
                />
              </div>
              <div className={styles.completeBtn}>
                <Button action="tertiary" onClick={this.handleDraftInspection}
                  translationID="inspections.complete_inspections.save_as_draft" defaultText="Save as Draft"
                />
                <Modal
                  onClose={() => this.setState({ showModal: false })}
                  showIn={this.state.showModal}
                  width="35%"
                  minHeight="20%">
                  <div className={styles.confirmContent}>
                    <FormattedMessage id="inspections.draft_inspection.saved" defaultMessage="Successfully Saved" />
                  </div>
                  <div className={styles.btn}>
                    <Button type="secondary" translationID="inspections.list.ok" onClick={() => this.setState({ showModal: false })} defaultText="OK" />
                  </div>
                </Modal>
              </div>
              <div className={styles.completeBtn}>
                <Button action="secondary" onClick={this.handleCompleteInspection}
                  translationID="inspections.complete_inspections.complete" defaultText="Complete Inspection"
                />
              </div>
              {(!this.state.showErrorModal &&
                <Loading loadingStatus={this.state.loadingStatus} />
              )}
              <Modal
                onClose={() => this.setState({ showErrorModal: false })}
                showIn={this.state.showErrorModal}
                width="40%"
                minHeight="30%">
                <div className={styles.confirmContent}>
                  <FormattedMessage id="inspections.complete_inspections.incomplete_checklist"
                    defaultMessage="There was a problem with your submission. Please make sure you've answered all of the inspection checklists."
                  />
                </div>
                <div className={styles.btn}>
                  <Button type="secondary" translationID="inspections.list.ok" onClick={() => this.setState({ showErrorModal: false })} defaultText="OK" />
                </div>
              </Modal>
            </>
          )}
        </SectionHeader>
        <HeaderBack
          translationID="inspections.start.inspections.back"
          translationDefault="Back to Inspections"
          backRoute={INSPECTIONS_HOME_ROUTE}
        />
        <div className={styles.container}>
          {stage === 1 && !apiStatus && (
            <InspectionDetails
              draftdata={draft_data.type}
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
            />
          )}
          {stage === 2 && !apiStatus && (
            <InspectionChecklist
              id={inspection.id}
              answers={answers}
              remarks={remarks}
              draftdata={draft_data}
              translations={translationMap}
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
              showFeedBackModal={this.showFormErrorsModal}
            />
          )}
          {apiStatus && (
            <InspectionSubmitted icon={info.icon} name={info.title}
              handleGoInspections={this.handleGoInspections}
            />
          )}
        </div>
      </>
    );
  }
}

CompleteInspection.propTypes = {
  actionFetch: PropTypes.func.isRequired,
  actionClear: PropTypes.func.isRequired,
  actionFetchDraft: PropTypes.func.isRequired,
  actionCreateRemark: PropTypes.func.isRequired,
  actionEditRemark: PropTypes.func.isRequired,
  actionSubmit: PropTypes.func.isRequired,
  actiondraft: PropTypes.func.isRequired,
  actionSearchUser: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  answerCreated: PropTypes.shape({}),
  draft_answer: PropTypes.shape({}),
  inspection: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  userlist: PropTypes.arrayOf(PropTypes.shape({}))
};

CompleteInspection.defaultProps = {
  userlist: [],
  answerCreated: {},
  draft_answer: {},
  draft_data: {}
};

const mapStateToProps = state => ({
  // createAction: state.workorders.createAction,
  inspection: state.inspection.inspection,
  createAction: state.inspection.createAction,
  answerCreated: state.inspection.answerCreated,
  userlist: state.inspection.userlist,
  user: state.auth.profile,
  remarkCreated: state.inspection.remarkCreated,
  translations: state.auth.translations,
  draft_answer: state.inspection.draft_answer,
  draft_data: state.inspection.draft_data,
  draftAction: state.inspection.draftAction,
  assets: state.assets.assets,
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
  actionFetchDraft: (id) => {
    dispatch(fetchDraftInspection(id));
  },
  actionSubmit: (id, data) => {
    dispatch(completeInspection(id, data));
  },
  actiondraft: (id, data) => {
    dispatch(draftInspection(id, data));
  },
  actionCreateRemark: (data) => {
    dispatch(createRemark(data));
  },
  actionEditRemark: (id, data) => {
    dispatch(editRemark(id, data));
  },
  actionConfirm: (body, accept, cancel) => {
    dispatch(showConfirmModal(body, accept, cancel));
  },
  actionHideModal: (insp) => {
    dispatch(hideModal(insp));
  },
  actionFetchAssets: () => {
    dispatch(fetchAssets());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompleteInspection);
