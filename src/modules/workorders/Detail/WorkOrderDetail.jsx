/* eslint-disable camelcase */
/* global FormData */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';
import Permissions from 'react-redux-permissions';

/** *********************************************************
 *  Redux import
 * ***************** */
import { searchUser } from '../../inspections/redux/actions';

import {
  fetchWorkOrder,
  fetchWorkOrderSchema,
  sendMaintenanceReview,
  sendOperationsReview,
  clearActionResult, 
printPdf } from '../redux/actions';

import {
  WORKORDER_STATUS_MAINTENANCE,
  WORKORDER_STATUS_OPERATION,
  WORKORDER_STATUS_COMPLETED
} from '../../../constants/ModelStatus';

import { WORKORDERS_HOME_ROUTE } from '../../../constants/RouterConstants';

/** *********************************************************
 *  Components import
 * ***************** */

import SectionHeader from '../../../components/sectionHeader';
import IconButton from '../../../components/iconButton';
import Separator from '../../../components/separator';
import HeaderBack from '../../../components/headerBack';
import Panel from '../../../components/panel';
import Spinner from '../../../components/spinner';
import WorkorderInfoBox from './components/WorkorderInfoBox';
import StepForm from './components/StepForm';
import Button from '../../../components/button';
import StepInfoBox from './components/StepInfoBox';

/** *********************************************************
 *  Assets import
 * ***************** */

import styles from './workOrderDetail.module.scss';
import settings from '../../../icons/settings.svg';
import search from '../../../icons/search.svg';
import workOrder from '../../../icons/WorkOrder.svg';


class WorkOrderDetail extends Component {
  state = {
    maintenance: {
      images: [],
      completed_on: moment().format(),
      work_description: '',
      completed_by: {}

    },
    operations: {
      images: [],
      completed_on: moment().format(),
      work_description: '',
      completed_by: {}
    },
    showFormErrors: false,
    requiredMap: {},
    fieldErrors: {
      completed_by: false,
      completed_on: false,
      work_description: true
    }
  }

  firstTime = true;

  componentDidMount() {
    const {
      actionDetail,
      actionGetSchemas,
      schemas,
      match: { params: { id } }
    } = this.props;

    actionDetail(id);
    if (!Object.keys(schemas).length) actionGetSchemas();
  }

  static getDerivedStateFromProps(props, state) {
    // grab user from state
    if (props.user.id && !state.maintenance.completed_by.id) {
      return { ...state,
        maintenance: {
          ...state.maintenance,
          completed_by: {
            id: props.user.id,
            fullname: props.user.fullname
          }
        },
        operations: {
          ...state.operations,
          completed_by: {
            id: props.user.id,
            fullname: props.user.fullname
          }
        }
      };
    }
    return state;
  }

  componentDidUpdate() {
    const { schemas, workorder } = this.props;
    if (!this.firstTime || !Object.keys(workorder).length
      || schemas.workorder === undefined) return;
    const sch = (workorder.status === WORKORDER_STATUS_MAINTENANCE)
      ? schemas.maintenance
      : schemas.operations;

    this.processInspectionForState(sch);
    this.firstTime = false;
  }

  componentWillUnmount() {
    const { clear } = this.props;
    clear();
  }

  processInspectionForState = (sectionschema) => {
    if (sectionschema) {
      const { schema } = sectionschema;
      let { fieldErrors, requiredMap } = this.state;
      schema.fields.forEach((f) => {
        requiredMap = { ...requiredMap, [f.id]: f.required };
        fieldErrors = { ...fieldErrors, [f.id]: f.required };
      });
      this.setState({ requiredMap, fieldErrors });
    }
  }

  /* ********************************************* */
  /* ***** MAINTENANCE & OPERATIONS METHODS ****** */
  /* ********************************************* */
  handleSearchForUser = (value) => {
    const { actionSearchUser } = this.props;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      actionSearchUser(value);
    }, 300);
  }

  handleAnswerChanged = (type, answer, fieldId) => {
    this.setState(prevState => ({
      [type]: {
        ...prevState[type],
        [fieldId]: answer
      }
    }));
  }

  handleFieldErrorChanged = (id, value) => {
    this.setState(prevState => ({
      fieldErrors: {
        ...prevState.fieldErrors,
        [id]: value
      }
    }));
  }

  printPdf(id){
    this.props.actionPrintPdf(id);
  }

  sendResponse = (status) => {
    const {
      actionSendMaintenance,
      actionSendOperations,
      match: { params: { id } } } = this.props;
    const { maintenance, operations, fieldErrors } = this.state;

    const data = (status === WORKORDER_STATUS_MAINTENANCE)
      ? maintenance
      : operations;

    const noErrors = Object.keys(fieldErrors)
      .every(k => (fieldErrors[k] === false));

    if (noErrors) {
      const aux = { ...data };
      const { completed_by, images, completed_on, work_description, ...response } = aux;
      const toSend = {};
      toSend.completed_by = completed_by.id;
      toSend.completed_on = completed_on;
      toSend.images = images;

      if (status === WORKORDER_STATUS_OPERATION) {
        toSend.review_report = work_description;
      } else {
        toSend.work_description = work_description;
      }
      toSend.response = JSON.stringify(response);

      // transform data into formData
      const formData = new FormData();
      Object.keys(toSend).forEach((k) => {
        if (k === 'images') {
          data.images.forEach(e => formData.append(k, e));
        } else {
          formData.append(k, toSend[k]);
        }
      });
      if (status === WORKORDER_STATUS_MAINTENANCE) {
        actionSendMaintenance(id, formData);
      } else {
        actionSendOperations(id, formData);
      }
    } else {
      this.setState({ showFormErrors: true });
    }
  }

  /* ********************************************* */
  /* ****************** RENDER ******************* */
  /* ********************************************* */
  render() {
    const {
      workorder,
      userlist,
      maintenanceAction,
      operationsAction,
      schemas,
      permissions,
      user,
      translations,
      notams
    } = this.props;


    const {
      maintenance,
      showFormErrors,
      operations,
      requiredMap } = this.state;

    const status = {
      1: 'workorders.detail.workCompletedBtn',
      2: 'workorders.detail.inspectionCompletedBtn'
    };

    if (!workorder.id) return <Spinner active />;
    // check if user is assigned to maintenance
    const canViewMaintenance = schemas.maintenance != undefined && (user.roles.map(e => e.id).includes(
      schemas.maintenance.assignment.role
    ) || schemas.maintenance.assignment.users.map(e => e.id).includes(user.id));

    // check if user is assigned to operations
    const canViewOperations = schemas.operations != undefined && (user.roles.map(e => e.id).includes(
      schemas.operations.assignment.role
    ) || schemas.operations.assignment.users.map(e => e.id).includes(user.id));

    const shouldShowFooter = (canViewMaintenance || canViewOperations)
        && ((workorder.status === WORKORDER_STATUS_MAINTENANCE && permissions.includes('add_maintenance'))
        || (workorder.status === WORKORDER_STATUS_OPERATION && permissions.includes('add_operations')));


    const translationMap = translations ? translations[user.language] : {};

    return (
      <div>
        {(maintenanceAction.success || operationsAction.success) && (
          <Redirect push to={WORKORDERS_HOME_ROUTE} />
        )}
        <SectionHeader icon={workOrder} translationID="workorders.title" defaultTitle="Work Orders">
          <div className={styles.detailHeader}>
            <IconButton icon={search} />
            <IconButton icon={settings} />
            <Separator />
          </div>
        </SectionHeader>
        <HeaderBack
          translationID="workorders.start.back"
          translationDefault="Back to Work Orders"
          backRoute={WORKORDERS_HOME_ROUTE}
        />
        <Panel
          containerClasses={styles.mainPanel}
          title="workorders.detail.header"
          defaultTitle={'Work Order {id}'}
          translationValues={{ id: workorder.id }}
        >
          <div className={styles.print_pdf_btn}>
          <Button onClick={() => this.printPdf(workorder.id)} translationID="workorders.detail.pdfBtn"
            defaultText="Print Pdf" action="secondary"
          />
          </div>
          <div className={styles.panelContent}>
            <WorkorderInfoBox workorder={workorder} translation={translationMap} />
            {workorder.status === WORKORDER_STATUS_MAINTENANCE
              && (
              <Permissions allowed={['add_maintenance']}>
                {canViewMaintenance && (
                <StepForm info={maintenance}
                  schema={schemas.maintenance}
                  step="maintenance"
                  translation={translationMap}
                  userlist={userlist}
                  searchForUser={this.handleSearchForUser}
                  handleAnswerChanged={this.handleAnswerChanged}
                  handleFieldErrorChanged={this.handleFieldErrorChanged}
                  showFormErrors={showFormErrors}
                  requiredMap={requiredMap}
                  notams={notams}
                />
                )}
              </Permissions>
              )
            }
            {workorder.status === WORKORDER_STATUS_OPERATION && (
              <>
                <StepInfoBox step="maintenance" info={workorder.maintenance_answer}
                  schema={schemas.maintenance} translation={translationMap}
                />
                <Permissions allowed={['add_operations']}>
                  {canViewOperations && (
                  <StepForm info={operations}
                    schema={schemas.operations}
                    step="operations"
                    translation={translationMap}
                    userlist={userlist}
                    searchForUser={this.handleSearchForUser}
                    handleAnswerChanged={this.handleAnswerChanged}
                    handleFieldErrorChanged={this.handleFieldErrorChanged}
                    showFormErrors={showFormErrors}
                    requiredMap={requiredMap}
                  />
                  )}
                </Permissions>
              </>
            )}
            {workorder.status === WORKORDER_STATUS_COMPLETED && (
              <>
                <StepInfoBox step="maintenance" info={workorder.maintenance_answer} />
                <StepInfoBox step="operations" info={workorder.operations_answer} />
              </>
            )}
          </div>
          {shouldShowFooter && (
            <div className={`${styles.footer} ${styles.embedded}`}>
              <Spinner className={styles.spinner}
          active={maintenanceAction.loading || operationsAction.loading}
              />
            <Button onClick={() => this.sendResponse(workorder.status)} translationID={status[workorder.status]}
                defaultText="Send" action="secondary"
              /> 
            </div>
          )}
        </Panel>
      </div>
    );
  }
}

WorkOrderDetail.propTypes = {
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  workorder: PropTypes.shape({}).isRequired,
  action: PropTypes.shape({}).isRequired,
  actionDetail: PropTypes.func.isRequired,
  // maintenance & operations methods
  maintenanceAction: PropTypes.shape({}).isRequired,
  operationsAction: PropTypes.shape({}).isRequired,
  actionGetSchemas: PropTypes.func.isRequired,
  actionSearchUser: PropTypes.func.isRequired,
  actionSendOperations: PropTypes.func.isRequired,
  actionSendMaintenance: PropTypes.func.isRequired,
  userlist: PropTypes.arrayOf(PropTypes.shape({})),
  schemas: PropTypes.shape({}).isRequired,
  clear: PropTypes.func.isRequired,
  permissions: PropTypes.arrayOf(PropTypes.string)

};

WorkOrderDetail.defaultProps = {
  userlist: [],
  permissions: []
};

const mapStateToProps = state => ({
  workorder: state.workorders.detail,
  action: state.workorders.action,
  maintenanceAction: state.workorders.maintenanceAction,
  operationsAction: state.workorders.operationsAction,
  userlist: state.inspection.userlist,
  user: state.auth.profile,
  schemas: state.workorders.schemas,
  permissions: state.permissions,
  translations: state.auth.translations
});

const mapDispatchToProps = dispatch => ({
  // Fetch work order detail
  actionDetail: (id) => {
    dispatch(fetchWorkOrder(id));
  },
  // maintenance
  actionGetSchemas: () => {
    dispatch(fetchWorkOrderSchema());
  },
  actionSearchUser: (query) => {
    dispatch(searchUser(query));
  },
  actionSendMaintenance: (id, data) => {
    dispatch(sendMaintenanceReview(id, data));
  },
  actionSendOperations: (id, data) => {
    dispatch(sendOperationsReview(id, data));
  },
  clear: () => {
    dispatch(clearActionResult());
  },
  actionPrintPdf: (id) => {
    dispatch(printPdf(id))
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkOrderDetail);
