/* global FormData File */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';

/** ******************************************************************
 *  Redux import
 * ************** */
import { searchUser } from '../../../inspections/redux/actions';
import { fetchRoles } from '../../../settings/redux/actions';
import {
  fetchRules, addTask, updateTask, updateTaskOccurrence
} from '../../redux/actions';

/** ******************************************************************
 *  Components import
 * ***************** */
import Modal from '../../../../components/modal';
import PulpoField from '../../../../pulpo_visualizer/fields/PulpoField';
import Button from '../../../../components/button';
import Scheduler from '../../../../components/scheduler/Scheduler';
import Assignee from '../../../../components/assignee/Assignee';

/** ******************************************************************
 *  Assets import
 * ***************** */
import styles from '../toDoList.module.scss';

class NewTask extends Component {
  state = {
    info: {
      name: '',
      additional_info: ''
    },
    currentUser: '',
    typeSelected: 'user',
    showFieldErrors: false,
    isEditing: false,
    showEditConfirmationModal: false,
    shouldChangeFuture: false
  };

  componentDidMount = () => {
    const { actionGetRoles, actionFetchRules } = this.props;
    actionGetRoles();
    actionFetchRules();
  }

  componentDidUpdate(prevProps) {
    const { taskEdit } = this.props;
    if (taskEdit !== undefined && prevProps.taskEdit === undefined) {
      // If the Detail modal was opened, this modal will receive the task's detail
      // as a prop, which means that if this modal is opened, it will do it in
      // Edit Mode.
      const isUserAssigned = taskEdit.event.assigned_user;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        info: {
          name: taskEdit.title,
          assigned_user: isUserAssigned ? taskEdit.event.assigned_user.id : undefined,
          assigned_role: !isUserAssigned ? taskEdit.event.assigned_role.id : undefined,
          additional_info: taskEdit.event.description,
          end_recurring_period: taskEdit.event.end_recurring_period,
          due_time: taskEdit.event.due_time !== null && moment(
            taskEdit.event.due_time, 'HH:mm'
          ).format(),
          due_date: taskEdit.event.due_date !== null && moment(
            taskEdit.end, 'YYYY-MM-DD'
          ).format(),
          rule: { ...taskEdit.event.rule }
        },
        currentUser: isUserAssigned && taskEdit.event.assigned_user.fullname,
        typeSelected: isUserAssigned ? 'user' : 'role',
        isEditing: true
      });
    } else if (taskEdit === undefined && prevProps.taskEdit !== undefined) {
      // If there was a taskEdit, but it was removed, then this modal will
      // open in Create Mode.
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        info: {
          name: '',
          additional_info: ''
        },
        currentUser: undefined,
        typeSelected: 'user',
        isEditing: false
      });
    }
  }


  handleFieldChange = (value, fieldId) => {
    this.setState(prevState => ({
      info: {
        ...prevState.info,
        [fieldId]: value
      }
    }));
    if (fieldId === 'assigned_role') {
      this.setState(prevState => ({
        info: {
          ...prevState.info,
          assigned_user: undefined
        },
        currentUser: undefined,
        shouldChangeFuture: true
      }));
    }
  }

  getFormData = () => {
    const { info } = this.state;
    info.label = '';
    if (info.due_date) {
      info.due_date = moment(info.due_date).format('YYYY-MM-DDZ');
    }
    if (info.due_time) {
      info.due_time = moment(info.due_time).format('HH:mmZ');
    }
    if (info.end_recurring_period) {
      info.end_recurring_period = moment(info.end_recurring_period).format('YYYY-MM-DD');
    } else {
      delete info.end_recurring_period;
    }
    const formData = new FormData();
    Object.keys(info).forEach((k) => {
      if (info[k] instanceof File) {
        formData.append(k, info[k]);
      } else if (typeof (info[k]) === 'object') {
        formData.append(k, JSON.stringify(info[k]));
      } else if (info[k]) {
        formData.append(k, info[k]);
      }
    });
    return formData;
  }

  handleEditConfirmation = (updateOption) => {
    const { shouldChangeFuture } = this.state;
    const formData = this.getFormData();
    const { actionUpdate, actionUpdateOccurrence, taskEdit } = this.props;

    if (!shouldChangeFuture) {
      formData.delete('rule');
    }
    formData.append('date', taskEdit.original_end);
    if (updateOption === 'all') {
      actionUpdate(taskEdit.event.id, formData);
    } else {
      actionUpdateOccurrence(taskEdit.event.id, formData);
    }
    this.closeModal();
  }

  handleAddAction = () => {
    const { info, isEditing } = this.state;
    const { actionCreate } = this.props;
    if (!info.name || (!info.assigned_role && !info.assigned_user)) {
      this.setState({ showFieldErrors: true });
    } else {
      if (isEditing) {
        this.setState({ showEditConfirmationModal: true });
        return;
      }
      const formData = this.getFormData();
      actionCreate(formData);
      this.closeModal();
    }
  }

  /**
   * Autocomplete Functions
   */
  handleAutocompleteChange = (value) => {
    this.setState({ currentUser: value });
  }

  handleAutocompleteSelect = (value, userId) => {
    this.setState(prevState => ({
      currentUser: value,
      info: {
        ...prevState.info,
        assigned_user: userId,
        assigned_role: undefined
      },
      shouldChangeFuture: true
    }));
  }

  closeModal = () => {
    const { onClose } = this.props;
    this.setState({
      showFieldErrors: false,
      info: {
        name: '',
        additional_info: ''
      },
      currentUser: '',
      typeSelected: 'user',
      isEditing: false,
      showEditConfirmationModal: false
    });
    onClose();
  }

  onAssignTypeChanged = (e) => {
    this.setState({ typeSelected: e.target.value });
  }

  handleScheduleChange = ({ id, endPeriod, frequency, params }) => {
    if (id) {
      this.handleFieldChange({ id }, 'rule');
    } else {
      this.handleFieldChange({ frequency, params }, 'rule');
    }
    if (endPeriod) {
      this.handleFieldChange(endPeriod, 'end_recurring_period');
    }

    const { isEditing } = this.state;
    if (isEditing) {
      const { taskEdit } = this.props;
      this.setState({
        shouldChangeFuture: taskEdit.event.rule.id !== parseInt(id, 10)
      });
    }
  }

  render() {
    const { showIn, rules } = this.props;
    const {
      showFieldErrors, info, currentUser, typeSelected, isEditing,
      showEditConfirmationModal, shouldChangeFuture
    } = this.state;
    return (
      <Modal showIn={showIn} onClose={this.closeModal} width="60%">
        <div className={styles.newTask}>
          <div className={styles.title}>
            {isEditing ? (
              <FormattedMessage tagName="h5" id="todo.editTask.title"
                defaultMessage="Edit Task"
              />
            ) : (
              <FormattedMessage tagName="h5" id="todo.newTask.title"
                defaultMessage="New Task"
              />
            )}
          </div>
          <div className={styles.body}>
            <label className={styles.fullWidth}>
              <div>
                <small style={{ color: 'red' }}> * </small>
                Name
              </div>
              <input
                type="text"
                placeholder="Write a task name"
                value={info.name}
                onChange={e => this.handleFieldChange(e.target.value, 'name')}
              />
              {showFieldErrors && !info.name && (
                <small>
                  <FormattedMessage id="pulpoforms.errors.not_blank"
                    defaultMessage="There is an error in this field"
                  />
                </small>
              )}
            </label>
            <div className={styles.col}>

              <div className={styles.selector}>
                <label>
                  <input type="radio" name="user" value="user"
                    checked={typeSelected === 'user'} onChange={this.onAssignTypeChanged}
                  />
                    User
                </label>
                <label>
                  <input type="radio" name="role" value="role"
                    checked={typeSelected === 'role'} onChange={this.onAssignTypeChanged}
                  />
                    Role
                </label>
              </div>

              <Assignee
                typeSelected={typeSelected}
                updateUserValue={this.handleAutocompleteChange}
                onAssigneeSelected={this.handleAutocompleteSelect}
                onRoleChange={this.handleFieldChange}
                userValue={currentUser}
                showFieldErrors={showFieldErrors}
                assignedRole={info.assigned_role}
                assignedUser={info.assigned_user}
              />

              <PulpoField key="date" id="due_date" type="date" title="Date"
                translationID="todo.newTask.date"
                answer={info.due_date}
                handleValueChange={this.handleFieldChange}
                showFieldErrors={showFieldErrors}
                handleFieldErrorChanged={() => ({})}
              />
            </div>
            <div className={styles.col}>
              <label>
                  Attach a file
                <input type="file" onChange={e => this.handleFieldChange(e.target.files[0], 'attached')} />
              </label>

              <PulpoField key="time" id="due_time" type="datetime" title="Time"
                translationID="todo.newTask.time"
                onlyTime
                answer={info.due_time}
                handleValueChange={this.handleFieldChange}
                showFieldErrors={showFieldErrors}
                handleFieldErrorChanged={() => ({})}
              />
            </div>
            {info.due_date && (
            <Scheduler title="Repeat Task" onScheduleChange={this.handleScheduleChange}
              rules={rules.map(r => ({ key: `${r.id}`, name: r.name, frequency: r.frequency, params: r.params  }))}
              selected={info}
            />
            )}
            <PulpoField key="addInfo" id="additional_info" type="string" title="Additional Information"
              translationID="todo.newTask.info"
              className={styles.fullWidth}
              widget={{ name: 'textfield' }}
              handleValueChange={this.handleFieldChange}
              answer={info.additional_info}
              showFieldErrors={showFieldErrors}
              handleFieldErrorChanged={() => ({})}
            />
          </div>
          <div className={styles.footer}>
            <Button
              onClick={this.closeModal}
              translationID="todo.newTask.cancel"
              defaultText="Cancel" action="secondary"
            />
            <Button
              onClick={this.handleAddAction}
              translationID="todo.newTask.save"
              defaultText="Save" action="secondary"
            />
          </div>
        </div>
        <Modal showIn={showEditConfirmationModal} width="90%" minHeight="200px">
          <div className={styles.newTask}>
            <div className={styles.title}>
              <FormattedMessage tagName="h5" id="todo.newTask.updateModal.title"
                defaultMessage="Select update type"
              />
            </div>
            <div className={styles.body}>
              {!shouldChangeFuture && (
              <FormattedMessage tagName="span" id="todo.newTask.updateModal.description"
                defaultMessage="Do you want to update all occurrences of this task, or only the selected one?"
              />
              )}
              {shouldChangeFuture && (
              <FormattedMessage tagName="span" id="todo.newTask.futureEvents"
                defaultMessage="Your change will apply to all future occurrences of the event. Do you want to continue?"
              />
              )}
            </div>
            <div className={styles.footer} style={{ padding: '0 50px' }}>
              <Button
                onClick={this.closeModal}
                translationID="todo.newTask.cancel"
                defaultText="Cancel" action="tertiary"
              />
              {!shouldChangeFuture && (
              <Button
                onClick={() => this.handleEditConfirmation('selected')}
                translationID="todo.newTask.update.selected_only"
                defaultText="Only selected occurrence" action="secondary"
              />
              )}
              <Button
                onClick={() => this.handleEditConfirmation('all')}
                translationID={shouldChangeFuture ? 'todo.newTask.update.future' : 'todo.newTask.update.update_all'}
                defaultText="Update all" action="secondary"
              />
            </div>
          </div>
        </Modal>
      </Modal>
    );
  }
}

NewTask.propTypes = {
  showIn: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  info: PropTypes.shape({}),
  taskEdit: PropTypes.shape({}),
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  roles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rules: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  actionGetRoles: PropTypes.func.isRequired,
  actionFetchRules: PropTypes.func.isRequired,
  actionSearchUser: PropTypes.func.isRequired,
  actionCreate: PropTypes.func.isRequired,
  actionUpdate: PropTypes.func.isRequired,
  actionUpdateOccurrence: PropTypes.func.isRequired
};

NewTask.defaultProps = {
  showIn: false,
  info: undefined,
  taskEdit: undefined
};


const mapStateToProps = state => ({
  users: state.inspection.userlist,
  roles: state.settings.roles,
  assignmentAction: state.workorders.assignmentAction,
  rules: state.tasks.rules
});

const mapDispatchToProps = dispatch => ({
  actionSearchUser: (query, type) => {
    dispatch(searchUser(query, type));
  },
  actionGetRoles: () => {
    dispatch(fetchRoles());
  },
  actionFetchRules: () => {
    dispatch(fetchRules());
  },
  actionCreate: (data) => {
    dispatch(addTask(data));
  },
  actionUpdate: (id, data) => {
    dispatch(updateTask(id, data));
  },
  actionUpdateOccurrence: (id, data) => {
    dispatch(updateTaskOccurrence(id, data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTask);
