import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { HOC as Permissions } from 'react-redux-permissions';
import { FormattedMessage } from 'react-intl';
import Transition from 'react-transition-group/Transition';

import {
  fetchWorkOrderSchema,
  updateWorkOrderSchemas,
  clearActionResult
} from '../redux/actions';

import { WORKORDERS_HOME_ROUTE } from '../../../constants/RouterConstants';

import Spinner from '../../../components/spinner';
import SectionHeader from '../../../components/sectionHeader';
import HeaderBack from '../../../components/headerBack';
import Button from '../../../components/button';
import IconButton from '../../../components/iconButton';
import NewField from '../../inspections/Builder/steps/Step2/NewField';
import Forbidden from '../../Forbidden';
import OrderableList from './components/OrderableList/OrderableList';
import FormattedMessageWithClass from '../../../components/formattedMessageWithClass';

import workOrder from '../../../icons/WorkOrder.svg';
import addIcon from '../../../icons/add.svg';
import assignment from '../../../icons/assignment.svg';
import styles from './workOrderBuilder.module.scss';
import Assignment from './components/Assignment';


class WorkOrderBuilder extends Component {
  state = {
    modal: false,
    loadedFields: false,
    maintenanceView: 'fields',
    operationsView: 'fields',
    workorder: [],
    maintenance: [],
    operations: [],
    selectedUsers: [],
    maxIdWorkOrders: 1,
    maxIdMaintenance: 1,
    maxIdOperations: 1
  }

  slide = {
    entering: {
      transform: 'translate(-100%)'
    },
    entered: {
      transform: 'translate(0%)',
      transition: 'transform 300ms ease-in-out'
    },
    exiting: {
      transform: 'translate(0%)'
    },
    exited: {
      transform: 'translate(-100%)',
      transition: 'transform 300ms ease-in-out'
    }
  };

  componentDidMount() {
    const {
      actionGetSchemas,
      schemas } = this.props;

    if (!schemas.length) actionGetSchemas();
  }

  componentWillUnmount() {
    const { clear, actionGetSchemas } = this.props;
    actionGetSchemas();
    clear();
  }

  static getDerivedStateFromProps(props, state) {
    const { updateSchemaAction, clear } = props;
    if (updateSchemaAction.success) {
      setTimeout(() => {
        clear();
      }, 5000);
    }
    if (!props.schemas.workorder || state.loadedFields) return state;
    const {
      schemas: {
        workorder,
        maintenance,
        operations
      }
    } = props;
    const workorderMaxId = workorder.schema.fields.reduce(
      (max, i) => (Number(i.id.slice(1)) > max ? Number(i.id.slice(1)) : max),
      1
    );
    const maintenanceMaxId = maintenance.schema.fields.reduce(
      (max, i) => (Number(i.id.slice(1)) > max ? Number(i.id.slice(1)) : max),
      1
    );
    const operationsMaxId = operations.schema.fields.reduce(
      (max, i) => (Number(i.id.slice(1)) > max ? Number(i.id.slice(1)) : max),
      1
    );
    const workorderFields = workorder.schema.sections.length ? (
      workorder.schema.sections[0].fields) : [];
    const maintenanceFields = maintenance.schema.sections.length ? (
      maintenance.schema.sections[0].fields) : [];
    const operationsFields = operations.schema.sections.length ? (
      operations.schema.sections[0].fields) : [];
    return {
      workorder: workorderFields.map(
        f => workorder.schema.fields.find(fi => fi.id === f)
      ),
      maintenance: maintenanceFields.map(
        f => maintenance.schema.fields.find(fi => fi.id === f)
      ),
      operations: operationsFields.map(
        f => operations.schema.fields.find(fi => fi.id === f)
      ),
      workorderMaxId,
      maintenanceMaxId,
      operationsMaxId,
      loadedFields: true
    };
  }

  toggleModal = (value) => {
    this.setState({ modal: value });
  }

  openNewFieldModal = (form) => {
    this.setState({ clickedField: undefined, fieldForm: form });
    this.toggleModal(true);
  }

  handleFieldClick = (id, form) => {
    const { [form]: fields } = this.state;
    const clicked = fields.find(e => e.id === id);
    this.setState({ clickedField: clicked, fieldForm: form, modal: true });
  }

  handleFieldOrderChanged = (fields, form) => {
    this.setState({
      [`${form}`]: fields
    });
  }

  handleCreateField = (field) => {
    const { fieldForm: form } = this.state;
    const {
      [`${form}`]: fields,
      [`${form}MaxId`]: maxId
    } = this.state;

    if (field.delete) {
      const newitems = fields.filter(e => e.id !== field.id);
      this.setState({ [`${form}`]: newitems });
      return;
    }

    if (field.id) {
      const i = fields.findIndex(e => e.id === field.id);
      fields[i] = field;
      this.setState({
        [`${form}`]: fields
      });
    } else {
      const newField = { ...field, id: `d${maxId + 1}` };
      this.setState(prevState => ({
        [`${form}`]: [...fields, newField],
        [`${form}MaxId`]: prevState[`${form}MaxId`] + 1
      }));
    }
  }

  handleSaveSchemas = () => {
    const { actionSave, updateSchemaAction } = this.props;
    if (updateSchemaAction.loading) return;
    const {
      workorder,
      maintenance,
      operations
    } = this.state;

    const workorderSchema = workorder.length ? ({
      id: '',
      version: 1,
      fields: [...workorder],
      sections: [{
        id: 'SEC1',
        fields: workorder.map(field => field.id),
        title: 'Work order'
      }],
      pages: [{
        id: 'PAGE1',
        sections: ['SEC1'],
        title: 'Work order'
      }]
    }) : { id: '', version: 1, fields: [], sections: [], pages: [] };

    const maintenanceSchema = maintenance.length ? ({
      id: '',
      version: 1,
      fields: [...maintenance],
      sections: [{
        id: 'SEC1',
        fields: maintenance.map(field => field.id),
        title: 'Maintenance'
      }],
      pages: [{
        id: 'PAGE1',
        sections: ['SEC1'],
        title: 'Maintenance'
      }]
    }) : { id: '', version: 1, fields: [], sections: [], pages: [] };

    const operationsSchema = operations.length ? ({
      id: '',
      version: 1,
      fields: [...operations],
      sections: [{
        id: 'SEC1',
        fields: operations.map(field => field.id),
        title: 'Work order'
      }],
      pages: [{
        id: 'PAGE1',
        sections: ['SEC1'],
        title: 'Work order'
      }]
    }) : { id: '', version: 1, fields: [], sections: [], pages: [] };

    actionSave({
      workorder: workorderSchema,
      maintenance: maintenanceSchema,
      operations: operationsSchema
    });
  }

  toggleView = (form, value) => {
    this.setState({
      [`${form}View`]: value
    });
  }

  render() {
    const {
      workorder,
      maintenance,
      operations,
      modal,
      clickedField,
      maintenanceView,
      operationsView,
      selectedUsers
    } = this.state;

    const { updateSchemaAction, schemas } = this.props;
    return (
      <div className={styles.builder}>
        <SectionHeader icon={workOrder} translationID="workorders.settings.title" defaultTitle="Work Order Settings">
          <div className={styles.saveFormsBtn}>
            {updateSchemaAction.success && <FormattedMessage tagName="h4" id="workorder.settings.saved" defaultMessage="Saved" />}
            <Spinner active={updateSchemaAction.loading} />
            <Button action="secondary" onClick={this.handleSaveSchemas}
              translationID="workorder.settings.saveBtn" defaultText="Complete Inspection"
            />
          </div>
        </SectionHeader>
        <HeaderBack
          translationID="workorder.settings.back"
          translationDefault="Back"
          backRoute={WORKORDERS_HOME_ROUTE}
        />
        <div>
          <div className={styles.fieldBoxContainer}>
            <div className={styles.formFieldBox}>
              <div className={`${styles.boxHeader} ${styles.newWorkOrder}`}>
                <FormattedMessage tagName="h3"
                  id="workorder.settings.work_order_box"
                  defaultMessage="New Work Order"
                />
                <IconButton icon={addIcon}
                  onClick={() => this.openNewFieldModal('workorder')}
                />
              </div>
              <div>
                <h4 className={styles.sectionTitle}>
                  <FormattedMessage
                    id="workorder.settings.work_order_details"
                    defaultMessage="Work Order Details"
                  />
                </h4>
                <span className={styles.fixedfieldBox}>Logged by</span>
                <span className={styles.fixedfieldBox}>Report date</span>
                <span className={styles.fixedfieldBox}>Priority</span>
                <span className={styles.fixedfieldBox}>Category</span>
                <span className={styles.fixedfieldBox}>Subcategory</span>
                <span className={styles.fixedfieldBox}>Location</span>
                <span className={styles.fixedfieldBox}>Problem description</span>

              </div>
              {workorder.length > 0 && (
                <div>
                  <h4 className={styles.sectionTitle}>
                    <FormattedMessage
                      id="workorder.settings.work_order_extra"
                      defaultMessage="Additional Fields"
                    />
                  </h4>
                  <OrderableList
                    fields={workorder}
                    form="workorder"
                    handleFieldClick={this.handleFieldClick}
                    handleFieldOrderChanged={this.handleFieldOrderChanged}
                  />
                </div>
              )}
            </div>
            <div className={styles.formFieldBox}>
              <div className={`${styles.boxHeader} ${styles.maintenanceReview}`}>
                <FormattedMessage tagName="h3"
                  id="workorder.settings.maintenance_box"
                  defaultMessage="Maintenance Review"
                />
                <div>
                  <div className={styles.assignment}>
                    <IconButton icon={assignment}
                      onClick={() => this.toggleView('maintenance', 'assignment')}
                    />
                  </div>
                  <IconButton
                    icon={addIcon}
                    onClick={() => this.openNewFieldModal('maintenance')}
                  />
                </div>
              </div>
              <Transition in={maintenanceView === 'fields'} timeout={0}>
                {state => (
                  <div className={styles.transitionContainer}>
                    <div style={this.slide[state]}>
                      <div>
                        <h4 className={styles.sectionTitle}>
                          <FormattedMessage
                            id="workorder.settings.review_details"
                            defaultMessage="Review Details"
                          />
                        </h4>

                        <span className={styles.fixedfieldBox}>Work Completed By</span>
                        <span className={styles.fixedfieldBox}>Date and time work completed</span>
                        <span className={styles.fixedfieldBox}>Description of work done</span>
                        <span className={styles.fixedfieldBox}>Photos</span>
                      </div>
                      {maintenance.length > 0 && (
                        <div>
                          <h4 className={styles.sectionTitle}>
                            <FormattedMessage
                              id="workorder.settings.work_order_extra"
                              defaultMessage="Additional Fields"
                            />
                          </h4>
                          <OrderableList
                            fields={maintenance}
                            form="maintenance"
                            handleFieldClick={this.handleFieldClick}
                            handleFieldOrderChanged={this.handleFieldOrderChanged}
                          />
                        </div>
                      )}
                    </div>
                    <Assignment transition={this.slide[state]}
                      section="maintenance"
                      defaultRole={schemas.maintenance
                        ? schemas.maintenance.assignment.role : undefined}
                      defaultUsers={schemas.maintenance
                        ? schemas.maintenance.assignment.users : undefined}
                      onGoBack={() => this.toggleView('maintenance', 'fields')}
                    />
                  </div>
                )}
              </Transition>
            </div>
            <div className={styles.formFieldBox}>
              <div className={`${styles.boxHeader} ${styles.operationsReview}`}>
                <FormattedMessage tagName="h3"
                  id="workorder.settings.operations_box"
                  defaultMessage="Operations Review"
                />
                <div>
                  <div className={styles.assignment}>
                    <IconButton icon={assignment}
                      onClick={() => this.toggleView('operations', 'assignment')}
                    />
                  </div>
                  <IconButton
                    icon={addIcon}
                    onClick={() => this.openNewFieldModal('operations')}
                  />
                </div>
              </div>
              <Transition in={operationsView === 'fields'} timeout={0}>
                {state => (
                  <div className={styles.transitionContainer}>
                    <div style={this.slide[state]}>
                      <h4 className={styles.sectionTitle}>
                        <FormattedMessage
                          id="workorder.settings.review_details"
                          defaultMessage="Review Details"
                        />
                      </h4>

                      <span className={styles.fixedfieldBox}>Work Completed By</span>
                      <span className={styles.fixedfieldBox}>Date and time work completed</span>
                      <span className={styles.fixedfieldBox}>Review Report</span>
                      <span className={styles.fixedfieldBox}>Photos</span>

                      {operations.length > 0 && (
                      <>
                        <h4 className={styles.sectionTitle}>
                          <FormattedMessage
                            id="workorder.settings.work_order_extra"
                            defaultMessage="Additional Fields"
                          />
                        </h4>
                        <OrderableList
                          fields={operations}
                          form="operations"
                          handleFieldClick={this.handleFieldClick}
                          handleFieldOrderChanged={this.handleFieldOrderChanged}
                        />
                      </>
                      )}
                    </div>
                    <Assignment transition={this.slide[state]}
                      section="operations"
                      defaultRole={schemas.operations
                        ? schemas.operations.assignment.role : undefined}
                      defaultUsers={schemas.operations
                        ? schemas.operations.assignment.users : undefined}
                      onGoBack={() => this.toggleView('operations', 'fields')}
                    />
                  </div>
                )}
              </Transition>
            </div>
          </div>
        </div>
        <NewField onCreateField={this.handleCreateField} showIn={modal}
          onClose={() => this.toggleModal(false)} info={clickedField}
        />
      </div>
    );
  }
}

WorkOrderBuilder.defaultProps = {
  schemas: {},
  updateSchemaAction: {}
};

WorkOrderBuilder.propTypes = {
  actionGetSchemas: PropTypes.func.isRequired,
  actionSave: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  schemas: PropTypes.shape({}),
  updateSchemaAction: PropTypes.shape({})
};


const mapStateToProps = state => ({
  schemas: state.workorders.schemas,
  updateSchemaAction: state.workorders.updateSchemaAction
});

const mapDispatchToProps = dispatch => ({
  actionGetSchemas: () => {
    dispatch(fetchWorkOrderSchema());
  },
  actionSave: (data) => {
    dispatch(updateWorkOrderSchemas(data));
  },
  clear: () => {
    dispatch(clearActionResult());
  }
});

export default Permissions(['add_workorderschema'])(
  connect(mapStateToProps, mapDispatchToProps)(WorkOrderBuilder),
  <Forbidden />
);
