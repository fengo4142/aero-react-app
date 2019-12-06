import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';

/** ******************************************************************
 *  Components import
 * ***************** */
import Modal from '../../../../components/modal';
import Button from '../../../../components/button';
import Clickable from '../../../../components/clickable/Clickable';

/** ******************************************************************
 *  Assets import
 * ***************** */
import styles from '../toDoList.module.scss';
import todoAssignment from '../../../../icons/todo-assignment.svg';
import folder from '../../../../icons/folder.svg';

/** ******************************************************************
 *  Utils import
 * ***************** */
import { INSPECTIONS_HOME_ROUTE } from '../../../../constants/RouterConstants';


class TaskDetail extends Component {
  goToInspection(id) {
    const { history, task } = this.props;
    history.push({
      pathname: `${INSPECTIONS_HOME_ROUTE}${id}/complete`,
      // this info is for indentify the task.
      state: {
        taskid: task.event.id,
        date: task.end
      }
    });
  }


  render() {
    const { showIn, onClose, task, editTask, onComplete } = this.props;
    //console.log(task)
    return (
      <Modal showIn={showIn} onClose={onClose} width="50%">
        {task && (
          <div className={styles.taskDetail}>
            { /* Modal title */ }
            <div className={styles.title}>
              <h5>{task.title}</h5>
              <div className={styles.headerActionContainer}>
                {(!task.task_occurrences || (task.task_occurrences && !task.task_occurrences.completed)) && (
                  <>
                    <button onClick={editTask} type="button" className={styles.editBtn}>
                      Edit
                    </button>
                    <div className={styles.actionsSeparator} />
                  </>
                )}
                <button onClick={onClose} type="button" className={styles.closeBtn}>&times;</button>
              </div>
            </div>

            { /* Modal Body */ }
            <div className={styles.detailBody}>
              <FormattedMessage id="todo.details.title" defaultMessage="Task Details" tagName="h5" />

              { /* Info rows */ }
              <div className={styles.info}>
                <div className={styles.slot}>
                  <FormattedMessage id="todo.details.assigned_to" defaultMessage="Assigned To" />
                  {task.event.assigned_user ? task.event.assigned_user.fullname : task.event.assigned_role.name}
                </div>
                <div className={styles.slot}>
                  <FormattedMessage id="todo.details.due_date" defaultMessage="Due Date" />
                  {task.event.due_date ? moment(task.end).format('YYYY-MM-DD') : '-'}
                </div>
                <div className={styles.slot}>
                  <FormattedMessage id="todo.details.label" defaultMessage="Label" />
                  <div className={`${styles.module} ${styles[(task.event.label || 'none').toLowerCase()]}`}>
                    <FormattedMessage id={`todo.label.${task.event.label || 'none'}`} defaultMessage={task.event.label} />
                  </div>
                </div>
                {/* <div className={styles.slot}>
                  {!(task.task_occurrences && task.task_occurrences.completed) && <Button translationID="todo.details.complete" action="secondary" onClick={onComplete} />}
                </div> */}
              </div>

              { /* full rows info */ }
              <div className={styles.fullSlot}>
                <span>Description</span>
                {task.description}
              </div>
              {task.event.inspection && (
                <div className={styles.fullSlot}>
                  <FormattedMessage id="todo.details.link" defaultMessage="Inspection link" />
                  <Clickable
                    onClick={() => { this.goToInspection(task.event.inspection.id); }}
                    className={styles.inspectionLink}
                  >
                    { task.event.inspection.title }
                  </Clickable>
                </div>
              )}
              {task.event.attached && (
              <div className={styles.fullSlot}>
                <span>File</span>
                <a href={task.event.attached} target="_blank" rel="noopener noreferrer">
                  <img src={folder} alt="" />
                  {task.event.attached.substring(task.event.attached.lastIndexOf('/') + 1)}
                </a>
              </div>
              )}
              <div className={styles.separator} />
              <FormattedMessage id="todo.details.activities" defaultMessage="Activities" tagName="h5" />
              <div className={styles.fullSlot}>
                {task.updated_on && task.task_occurrences.completed && (
                <div className={styles.activity}>
                  <img src={todoAssignment} alt="" />
                  <div className={styles.activityInfo}>
                    <FormattedMessage id="todo.details.activity_completed" defaultMessage="The task was completed" />
                    <span>
                      {moment(task.updated_on).format('MMM Do [at] HH:mm')}
                    </span>
                  </div>
                </div>
                )}
                <div className={styles.activity}>
                  <img src={todoAssignment} alt="" />
                  <div className={styles.activityInfo}>
                    <FormattedMessage id="todo.details.activity_assign" defaultMessage={`Assigned to you by ${task.event.creator}`} values={{
                      person: task.event.requested_by.fullname
                    }}
                    />
                    <span>
                      {moment(task.event.created_on).format('MMM Do [at] HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    );
  }
}

TaskDetail.propTypes = {
  showIn: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  editTask: PropTypes.func.isRequired,
  task: PropTypes.shape({}),
  history: PropTypes.shape({}).isRequired
};

TaskDetail.defaultProps = {
  showIn: false,
  task: undefined
};

export default TaskDetail;
