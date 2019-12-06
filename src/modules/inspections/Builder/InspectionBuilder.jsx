/* eslint-disable camelcase */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { HOC as Permissions } from 'react-redux-permissions';

import { INSPECTIONS_HOME_ROUTE } from '../../../constants/RouterConstants';

import {
  addInspection, fetchInspectionListForEdit,
  clearActionResult, fetchInspectionForEdit,
  editInspection, clearInspection, discardInspectionDraft,
  fetchTemplates, fetchTemplate, updateTemplateVersion,
  updateInspectionVersion, exportInspection
} from '../redux/actions';

import { fetchRules } from '../../toDo/redux/actions';
import { showConfirmModal, hideModal } from '../../../general_redux/actions';
/** ******************************************************************
 *  Components import
 * ***************** */

import Step0 from './steps/Step0/Step0';
import Step1 from './steps/Step1/Step1';
import Step2 from './steps/Step2/Step2';
import Step3 from './steps/Step3/Step3';
import Step4 from './steps/Step4/Step4';

import Button from '../../../components/button';
import Clickable from '../../../components/clickable/Clickable';
import ProgressBar from './components/ProgressBar';
import Forbidden from '../../Forbidden';

/** ******************************************************************
 *  Assets import
 * ************* */
import styles from './create.module.scss';

const initialInspectionData = {
  info: {
    name: '',
    icon: 'icon-2'
  },
  details: {
    fields: [],
    additionalInfo: ''
  },
  inspectionChecklist: []
};

class InspectionBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      lastIdAdded: 0,
      apiStatus: undefined,
      errors: false,
      airport_changes: {},
      assignee: {
        assigned_user: undefined,
        assigned_role: undefined,
        currentUser: '',
        assigneeType: 'user'
      },
      sectionError:false,
      ...initialInspectionData
    };

    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.goToInspectionEdit = this.goToInspectionEdit.bind(this);
    this.handleInfoChange = this.handleInfoChange.bind(this);
    this.handleFieldsChange = this.handleFieldsChange.bind(this);
    this.handleNewItem = this.handleNewItem.bind(this);
    this.handleAddEntry = this.handleAddEntry.bind(this);
    this.handleFieldsOrderChange = this.handleFieldsOrderChange.bind(this);
    this.handleChangeChecklistName = this.handleChangeChecklistName.bind(this);
    this.handleChangeEntry = this.handleChangeEntry.bind(this);
    this.finish = this.finish.bind(this);
    this.handleGoInspections = this.handleGoInspections.bind(this);
    this.discardDraft = this.discardDraft.bind(this);
    this.openConfirmDialog = this.openConfirmDialog.bind(this);
    this.handleAirportChanges = this.handleAirportChanges.bind(this);
    this.handleUpdateVersion = this.handleUpdateVersion.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if ((props.inspection.id && props.inspection.id !== state.id)
        || (props.fetchInspectionAction.success)) {
      props.actionClear();
      const maxChecklistId = props.inspection.checklist.reduce(
        (max, i) => (Number(i.id) > max ? Number(i.id) : max),
        Number(props.inspection.checklist[0].id)
      );
      return {
        ...state,
        id: props.inspection.id,
        info: {
          name: props.inspection.info.title,
          icon: props.inspection.info.icon
        },
        assignee: {
          assigned_user: props.inspection.task.assigned_user
            ? props.inspection.task.assigned_user.id
            : undefined,
          assigned_role: props.inspection.task.assigned_role
            ? props.inspection.task.assigned_role.id
            : undefined,
          currentUser: props.inspection.task.assigned_user
            ? props.inspection.task.assigned_user.fullname
            : undefined,
          assigneeType: props.inspection.task.assigned_user ? 'user' : 'role'
        },
        details: { ...props.inspection.details },
        inspectionChecklist: [...props.inspection.checklist],
        airport_changes: props.inspection.airport_changes,
        currentStep: 1,
        lastIdAdded: maxChecklistId
      };
    }
    if (props.template.id && props.templateAction.success) {
      props.actionClear();
      const maxChecklistId = props.template.checklist.reduce(
        (max, i) => (Number(i.id) > max ? Number(i.id) : max),
        Number(props.template.checklist[0].id)
      );
      return {
        id: props.template.id,
        info: {
          name: props.template.info.title,
          icon: props.template.info.icon
        },
        details: { ...props.template.details },
        inspectionChecklist: [...props.template.checklist],
        currentStep: (props.template.id !== state.id ? 1 : state.currentStep),
        lastIdAdded: maxChecklistId
      };
    }

    if (props.createInspectionAction) {
      return { ...state, apiStatus: props.createInspectionAction.success };
    }
    return state;
  }

  componentDidMount() {
    const {
      actionFetchForEdit,
      actionFetchRules,
      actionFetchTemplates,
      actionFetch,
      history: { location: { state } },
      match: { params: { id } } } = this.props;

    if (id) {
      this.setState({ currentStep: 1 });
      actionFetchForEdit(id);
    } else {
      actionFetch();
      // actionFetchTemplates();
      if (state && state.intent === 'CreateInspectionForm') {
        this.setState({ currentStep: 1 });
      }
    }
    actionFetchRules();
  }

  componentWillUnmount() {
    const { actionClear, inspectionClear } = this.props;
    actionClear();
    inspectionClear();
  }

  next() {
    const { currentStep, info: { name } } = this.state;
    if (currentStep === 1 && name === '') {
      this.setState({ errors: true });
    } else {
      this.setState(prevState => (
        { currentStep: Math.min(4, prevState.currentStep + 1),
          errors: false
        }
      ));
    }
  }

  prev() {
    this.setState((prevState) => {
      let newState = {
        currentStep: Math.max(0, prevState.currentStep - 1)
      };
      if (prevState.currentStep === 1) {
        newState = {
          ...newState,
          ...initialInspectionData
        };
      }
      return newState;
    }, () => {
      const { currentStep } = this.state;
      const { history, inspectionClear } = this.props;

      if (currentStep === 0) {
        inspectionClear();
        history.push('/ops/inspections/new');
        this.setState({ id: undefined });
      }
    });
  }

  goToInspectionEdit(id) {
    const { history, actionFetchForEdit } = this.props;
    actionFetchForEdit(id);
    history.push(`/ops/inspections/${id}/edit`);
  }

  handleAssigneeChanged = (value) => {
    this.setState(prevState => ({
      ...prevState,
      assignee: {
        ...prevState.assignee,
        currentUser: value
      }
    }));
  }

  onAssignTypeChanged = (value) => {
    this.setState(prevState => ({
      ...prevState,
      assignee: {
        ...prevState.assignee,
        assigneeType: value
      }
    }));
  }

  handleAssigneeSelected = (value, userId) => {
    this.setState(prevState => ({
      assignee: {
        ...prevState.assignee,
        assigned_user: userId,
        assigned_role: undefined,
        currentUser: value
      }
    }));
  }

  handleRoleChange = (value) => {
    this.setState(prevState => ({
      assignee: {
        ...prevState.assignee,
        assigned_user: undefined,
        assigned_role: value,
        currentUser: ''
      }
    }));
  }

  handleInfoChange(type, value) {
    this.setState(prevState => ({
      info: {
        ...prevState.info,
        [type]: value
      },
      airport_changes: {
        ...prevState.airport_changes,
        [type]: value
      }
    }));
  }

  handleFieldsChange(type, value) {
    this.setState(prevState => ({
      details: {
        ...prevState.details,
        [type]: value
      }
    }));
  }

  handleAirportChanges(type, value) {
    this.setState(prevState => ({
      airport_changes: {
        ...prevState.airport_changes,
        [type]: value
      }
    }));
  }

  handleFieldsOrderChange(inspectionChecklist) {
    this.setState(prevState => ({
      inspectionChecklist,
      airport_changes: {
        ...prevState.airport_changes,
        inspectionChecklist
      }
    }));
  }

  handleNewItem() {
    const { lastIdAdded } = this.state;
    const newItem = {
      id: `${lastIdAdded + 1}`,
      type: 'inspection',
      title: `Inspection Field ${lastIdAdded + 1}`,
      status_options: {
        pass: 'Satisfactory',
        fail: 'Unsatisfactory'
      },
      checklist: [
        { key: 'CH1', value: 'Checklist 1' },
        { key: 'CH2', value: 'Checklist 2' }
      ],
      required: true,
      order: lastIdAdded
    };

    this.setState(prevState => ({
      inspectionChecklist: [
        ...prevState.inspectionChecklist,
        newItem
      ],
      airport_changes: {
        ...prevState.airport_changes,
        inspectionChecklist: {
          ...prevState.airport_changes.inspectionChecklist,
          newItem
        }
      },
      lastIdAdded: prevState.lastIdAdded + 1
    }));
  }

  handleAddEntry(itemid) {
    const { inspectionChecklist } = this.state;

    const index = inspectionChecklist.map(e => e.id).indexOf(itemid);
    const initialMax = inspectionChecklist[index].checklist[0] ? Number(
      inspectionChecklist[index].checklist[0].key.slice(2)
    ) : 0;
    const maxItemId = inspectionChecklist[index].checklist.reduce(
      (max, i) => (Number(i.key.slice(2)) > max ? Number(i.key.slice(2)) : max),
      initialMax
    );

    inspectionChecklist[index].checklist.push(
      { key: `CH${maxItemId + 1}`, value: 'New checklist item' }
    );

    this.setState(prevState => ({
      inspectionChecklist,
      airport_changes: {
        ...prevState.airport_changes,
        inspectionChecklist
      }
    }));
  }

  handleChangeEntry(fieldId, entryId, value) {
    const { inspectionChecklist, lastIdAdded } = this.state;
    const index = inspectionChecklist.map(e => e.id).indexOf(fieldId);
    let changes = []; let lastID = lastIdAdded;

    if (value === '') {
      inspectionChecklist[index].checklist = inspectionChecklist[index]
        .checklist.filter(e => e.key !== entryId);
      changes = [...inspectionChecklist, { id: fieldId, hidden: true, template: true }];
    } else {
      const index2 = inspectionChecklist[index].checklist.map(e => e.key).indexOf(entryId);
      inspectionChecklist[index].checklist[index2].value = value;
      inspectionChecklist[index].id = `${lastIdAdded + 1}`;
      delete inspectionChecklist[index].template;
      lastID += 1;
      changes = [...inspectionChecklist, { id: fieldId, hidden: true, template: true }];
    }
    this.setState(prevState => ({
      inspectionChecklist,
      lastIdAdded: lastID,
      airport_changes: {
        ...prevState.airport_changes,
        inspectionChecklist: changes
      }
    }));
  }

  handleChangeChecklistName(itemid, value) {
    let { inspectionChecklist } = this.state;
    const { lastIdAdded } = this.state;

    let changes = [];
    let lastID = lastIdAdded;

    if (value === '') {
      inspectionChecklist = inspectionChecklist.filter(e => e.id !== itemid);
      changes = [...inspectionChecklist, { id: itemid, hidden: true, template: true }];
    } else {
      const index = inspectionChecklist.map(e => e.id).indexOf(itemid);
      inspectionChecklist[index].title = value;
      inspectionChecklist[index].id = `${lastIdAdded + 1}`;
      delete inspectionChecklist[index].template;
      lastID += 1;
      changes = [...inspectionChecklist, { id: itemid, hidden: true, template: true }];
    }

    this.setState(prevState => ({
      inspectionChecklist,
      lastIdAdded: lastID,
      airport_changes: {
        ...prevState.airport_changes,
        inspectionChecklist: changes
      }
    }));
  }

  next(id) {
    const { currentStep, info: { name } ,inspectionChecklist,sectionError} = this.state;
    const { actionFetchTemplate } = this.props;
    if (id && (currentStep === 0))
    {
      //actionFetchTemplate(id);
    } 
    if (currentStep === 1 && name === '') {
      this.setState({ errors: true });
    }else if (currentStep === 3 && inspectionChecklist.length === 0) {
      this.setState({sectionError : true});
    } else {
      this.setState(prevState => (
        { currentStep: Math.min(4, prevState.currentStep + 1),
          errors: false, sectionError: false
        }
      ));
    }
  }

  prev() {
    this.setState((prevState) => {
      let newState = {
        currentStep: Math.max(0, prevState.currentStep - 1)
      };
      if (prevState.currentStep === 1) {
        newState = {
          ...newState,
          ...initialInspectionData
        };
      }
      return newState;
    }, () => {
      const { currentStep } = this.state;
      const { history, inspectionClear } = this.props;

      if (currentStep === 0) {
        inspectionClear();
        history.push('/ops/inspections/new');
        this.setState({ id: undefined });
      }
    });
  }

  goToInspectionEdit(id) {
    const { history, actionFetchForEdit } = this.props;
    actionFetchForEdit(id);
    history.push(`/ops/inspections/${id}/edit`);
  }

  finish(isDraft) {
    const {
      info: { name, icon, rule },
      assignee: { assigned_role, assigned_user },
      details: { fields, additionalInfo },
      inspectionChecklist,
      airport_changes
    } = this.state;

    const { actionSave, actionEdit,
      match: { params: { id } } } = this.props;

    const { template, inspection } = this.props;
    const res = {
      id,
      title: name,
      icon,
      additionalInfo,
      task: {
        rule,
        assigned_role,
        assigned_user
      },
      status: (isDraft ? 0 : 1)
    };

    if (template.id || inspection.template) {
      // Removes irrelevant data when a template field change its order
      const field_changes = airport_changes.fields && airport_changes.fields.map((f, i) => {
        if (f.template) return { id: f.id, order: i, ...(f.hidden && { hidden: true }) };
        return { ...f, order: i };
      });

      // Same with checklist
      const checklist_changes = airport_changes.inspectionChecklist && (
        airport_changes.inspectionChecklist.map((f, i) => {
          if (f.template) return { id: f.id, order: i, ...(f.hidden && { hidden: true }) };
          return { ...f, order: i };
        }));

      res.airport_changes = {
        ...airport_changes,
        fields: field_changes || [],
        inspectionChecklist: checklist_changes || []
      };
      res.template = template.selected_version_id;
    } else {
      res.schema = {
        id: name,
        version: 1,
        fields: [
          ...fields.map((f) => { const { order, ...r } = f; return r; }),
          ...inspectionChecklist.map((f) => { const { order, ...r } = f; return r; })
        ],
        sections: [
          {
            id: 'SEC1',
            title: 'Details',
            fields: [...fields.map(e => e.id)]
          },
          {
            id: 'SEC2',
            title: 'Checklist',
            fields: [...inspectionChecklist.map(e => e.id)]
          }
        ],
        pages: [
          {
            id: 'PAGE1',
            title: 'Inspection',
            sections: ['SEC1']
          },
          {
            id: 'PAGE2',
            title: 'Inspection',
            sections: ['SEC2']
          }
        ]
      };
    }

    const {
      match: { params: { id: editId } }
    } = this.props;

    if (editId) {
      actionEdit(res);
    } else {
      actionSave(res);
    }
  }

  handleGoInspections() {
    const { history } = this.props;
    history.push(INSPECTIONS_HOME_ROUTE);
  }

  discardDraft() {
    const { actionDiscard, actionHideModal, history } = this.props;
    const { id } = this.state;
    if (id) {
      actionDiscard(id);
    }
    actionHideModal();
    history.push(INSPECTIONS_HOME_ROUTE);
  }

  openConfirmDialog() {
    const { actionConfirm, actionHideModal } = this.props;
    const content = {
      title: '',
      body: <div className={styles.submissionError}>
        <FormattedMessage
          id="inspections.edit.discard_draft_confirmation_message"
          defaultMessage='Are you sure you want to discard the current draft version?'
        />
      </div>
    };
    actionConfirm(content, this.discardDraft, actionHideModal);
  }


  handleUpdateVersion(updateType) {
    const {
      template,
      actionUpdateTemplate,
      actionUpdateVersion
    } = this.props;

    const { id } = this.state;

    if (updateType === 'template') {
      actionUpdateTemplate(template.id);
    } else {
      actionUpdateVersion(id);
    }
  }

  render() {
    const { id, currentStep, info, details,
      inspectionChecklist, apiStatus, errors, assignee, sectionError} = this.state;

    const {
      inspection,
      permissions,
      rules,
      template,
      inspectionList: { results },
      templateList: { results: templateList }
    } = this.props;

    if (id && !permissions.includes('add_inspection')) {
      return <Forbidden />;
    }
    return (
      <div className={styles.box}>
        <div className={styles.title}>
          {id ? (
            <FormattedMessage id="inspections.edit.title"
              defaultMessage="Edit Inspection"
            />
          ) : (
            <FormattedMessage id="inspections.new.newInspection"
              defaultMessage="New Inspection"
            />
          )}
          {currentStep !== 0 && (
            <Clickable onClick={this.openConfirmDialog} className={styles.discard}>
              <FormattedMessage id="inspections.edit.discard_draft" defaultText="Discard draft" />
            </Clickable>
          )}
        </div>
        <div className={styles.content}>
          {currentStep !== 0 && currentStep !== 4 && <ProgressBar step={currentStep} />}
          {currentStep === 0 && (
            <Step0 goToInspectionEdit={this.goToInspectionEdit}
              goToNext={this.next} list={results} templates={templateList} exportInspection={this.exportInspection}
            />
          )}
          {currentStep === 1 && (
          <Step1
            onInfoChange={this.handleInfoChange}
            info={info} rules={rules} assignee={assignee}
            hasTemplateUpdate={template.new_version_available}
            hasVersionUpdate={inspection.new_version_available}
            onUpdateVersion={this.handleUpdateVersion}
            recurrence={inspection.task}
            handleAssigneeChanged={this.handleAssigneeChanged}
            handleAssigneeSelected={this.handleAssigneeSelected}
            handleRoleChange={this.handleRoleChange}
            onAssignTypeChanged={this.onAssignTypeChanged}
          />
          )}
          {currentStep === 2 && (
          <Step2 details={details}
            onFieldsChange={this.handleFieldsChange}
            onAirportChange={this.handleAirportChanges}
          />
          )}
          {currentStep === 3 && (
          <Step3 checklist={inspectionChecklist}
            addNewItem={this.handleNewItem}
            onFieldsOrderChange={this.handleFieldsOrderChange}
            onChangeChecklistName={this.handleChangeChecklistName}
            onAddEntry={this.handleAddEntry}
            onChangeEntry={this.handleChangeEntry}
          />
          )}

          {currentStep === 4 && <Step4 icon={ info.icon.includes(".png") ? `${info.icon}`: `${info.icon}.svg`} status={apiStatus} title={info.name} />}
        </div>

        {currentStep !== 0 && !apiStatus && (
        <div className={styles.footer}>
          <Button action="secondary" onClick={this.prev}
            translationID="inspections.new.prev" defaultText="Back"
          />
          <div className={styles.errors}>
            {sectionError ? <FormattedMessage tagName="p" id="inspections.new.section_error" defaultMessage="You Have to Add Atleast One Section" />: ''}
            {errors && <FormattedMessage tagName="p" id="inspections.new.error" defaultMessage="Field 'Inspection Name' can't be blank" />}
          </div>
          {currentStep !== 4 && (
          <Button action="secondary" onClick={this.next}
            translationID="inspections.new.next" defaultText="Next"
          />
          )}
          {currentStep === 4 && (
            <div className={styles.saveBtns}>
              <Button action="tertiary" onClick={() => this.finish(true)}
                translationID="inspections.new.finishDraft" defaultText="Save as Draft"
              />
              <Button action="secondary" onClick={() => this.finish(false)}
                translationID="inspections.new.finish" defaultText="Publish"
              />
            </div>
          )}
        </div>
        )}
        {apiStatus && (
          <div className={styles.footer}>
            <div />
            <Button
              action="secondary"
              onClick={this.handleGoInspections}
              translationID="inspections.complete_inspections.go_to_inspections"
              defaultText="Go to Inspections"
            />
            <div />
          </div>
        )}
      </div>
    );
  }
}


InspectionBuilder.propTypes = {
  actionSave: PropTypes.func.isRequired,
  actionEdit: PropTypes.func.isRequired,
  actionFetch: PropTypes.func.isRequired,
  actionClear: PropTypes.func.isRequired,
  inspectionClear: PropTypes.func.isRequired,
  actionDiscard: PropTypes.func.isRequired,
  actionFetchForEdit: PropTypes.func.isRequired,
  actionConfirm: PropTypes.func.isRequired,
  actionHideModal: PropTypes.func.isRequired,
  inspectionList: PropTypes.shape({}),
  templateList: PropTypes.arrayOf(PropTypes.shape({})),
  template: PropTypes.shape({}),
  inspection: PropTypes.shape({}),
  match: PropTypes.shape({}),
  history: PropTypes.shape({}).isRequired,
  permissions: PropTypes.arrayOf(PropTypes.string)
};

InspectionBuilder.defaultProps = {
  inspectionList: [],
  templateList: [],
  inspection: {},
  template: {},
  match: {},
  permissions: []
};

const mapStateToProps = state => ({
  createInspectionAction: state.inspection.createInspectionAction,
  inspectionList: state.inspection.inspectionList,
  templateList: state.inspection.templateList,
  template: state.inspection.template,
  inspection: state.inspection.inspection,
  permissions: state.permissions,
  rules: state.tasks.rules,
  templateAction: state.inspection.templateAction,
  fetchInspectionAction: state.inspection.fetchInspectionAction
});

const mapDispatchToProps = dispatch => ({
  // Save inspection
  actionSave: (insp) => {
    dispatch(addInspection(insp));
  },
  actionEdit: (insp) => {
    dispatch(editInspection(insp));
  },
  actionFetch: () => {
    dispatch(fetchInspectionListForEdit());
  },
  actionFetchRules: () => {
    dispatch(fetchRules());
  },
  actionFetchTemplates: () => {
    dispatch(fetchTemplates());
  },
  actionFetchTemplate: (id) => {
    dispatch(fetchTemplate(id));
  },
  actionUpdateTemplate: (id) => {
    dispatch(updateTemplateVersion(id));
  },
  actionUpdateVersion: (id) => {
    dispatch(updateInspectionVersion(id));
  },
  actionFetchForEdit: (id) => {
    dispatch(fetchInspectionForEdit(id));
  },
  actionClear: () => {
    dispatch(clearActionResult());
  },
  inspectionClear: () => {
    dispatch(clearInspection());
  },
  actionDiscard: (insp) => {
    dispatch(discardInspectionDraft(insp));
  },
  actionHideModal: (insp) => {
    dispatch(hideModal(insp));
  },
  // modals
  actionConfirm: (body, accept, cancel) => {
    dispatch(showConfirmModal(body, accept, cancel));
  }
});

export default Permissions(['add_inspectionparent', 'add_inspection'])(
  connect(mapStateToProps, mapDispatchToProps)(InspectionBuilder),
  <Forbidden />
);
