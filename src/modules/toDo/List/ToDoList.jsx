import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import styles from './toDoList.module.scss';

import {
  fetchTasks,
  completeTask,
  fetchDelegatedTasks,
  fetchCompletedTasks,
  clear } from '../redux/actions';

import { showConfirmModal, hideModal } from '../../../general_redux/actions';
/** ******************************************************************
 *  Components import
 * ***************** */

import Button from '../../../components/button';
import IconButton from '../../../components/iconButton';
import SectionHeader from '../../../components/sectionHeader';
import Separator from '../../../components/separator';
import NewTask from './components/NewTask';
import TaskDetail from './components/TaskDetail';
import ToDoTable from './components/toDoTable';
import Shortcuts from '../../../components/topbar/shortcuts/shortcuts';
/** ******************************************************************
 *  Assets import
 * ************* */

import settings from '../../../icons/settings.svg';
import todo from '../../../icons/todo.svg';
import Collapsible from '../../../components/collapsible/Collapsible';
import Clickable from '../../../components/clickable/Clickable';


import { INSPECTIONS_HOME_ROUTE } from '../../../constants/RouterConstants';

class ToDoList extends Component {
  state = {
    modal: false,
    tasks: {},
    section: 'my_tasks'
  }

  links = [
    { url: '/', name: 'Aerobot' },
    { url: '/todo', name: 'To Do' },
    { url: '/messenger', name: 'Messenger' },
    { url: '/settings/organization', name: 'Settings', permissions: ['can_modify_airport_settings'] }
  ]

  componentDidMount = () => {
    const { actionFetch } = this.props;
    actionFetch();
  }
  

  static getDerivedStateFromProps = (props, state) => {
    if (props.action.success) {
      const result = {
        today: [],
        overdue: [],
        tomorrow: [],
        thisWeek: [],
        nextWeek: [],
        noDueDate: []
      };

      // Formatting response grouping by date.
      const today = moment();
      const tomorrow = today.clone().add(1, 'day');
      props.tasks.forEach((t) => {
        // without due date
        if (!t.event.due_date) {
          result.noDueDate.push(t);
          return;
        }

        // overdue tasks
        const due = moment(t.end);
        if (due.isBefore(today,'day')) {
          result.overdue.push(t);
          return;
        }

        // today tasks
        if (due.isSame(today,'day')) {
          result.today.push(t);
          return;
        }

        // tomorrow tasks
        if (due.isSame(tomorrow, 'day')) {
          result.tomorrow.push(t);
          return;
        }

        // this week tasks
        if (due.isSame(today, 'week') && due.isAfter(today)) {
          result.thisWeek.push(t);
          return;
        }

        result.nextWeek.push(t);
      });

      const selected = props.updated_task;
      props.clearActions();
      // update the selected task when it is updated
      if (selected) {
        return { ...state, tasks: result, selected };
      }
      return { ...state, tasks: result };
    }
    return state;
  }

  /**
   * Function that handles the tabs state and
   * make the call for the corresponding tasks
   * */
  handleTabClick = (value) => {
    const {
      actionFetch,
      actionFetchDelegated,
      actionFetchCompleted } = this.props;

    this.setState({ section: value });

    switch (value) {
      case 'my_tasks':
        actionFetch(); break;
      case 'delegated_tasks':
        actionFetchDelegated(); break;
      case 'completed_tasks':
        actionFetchCompleted(); break;
      default:
        break;
    }
  }

  toggleModal = (modal, value) => {
    const { section } = this.state;
    this.setState({ [modal]: value });
    if (!value) {
      setTimeout(() => {
        this.handleTabClick(section);
      }, 500);
    }
  }

  goToInspection = (occurrence) => {
    const { history } = this.props;
    history.push({
      pathname: `${INSPECTIONS_HOME_ROUTE}${occurrence.event.inspection.id}/complete`,
      // this info is for indentify the task.
      state: {
        taskid: occurrence.event.id,
        date: occurrence.end
      }
    });
  }

  handleCompleted = (occurrence) => {
    const {
      actionComplete,
      actionConfirm,
      actionHideModal } = this.props;

    var content = ''

    occurrence.event.inspection === null ?
     content = {
      title: 'Complete Task',
      body: 'Are you sure you want to mark this task as completed?.'
    }
    :
     content = {
      title: 'Complete Task',
      body: 'There is an inspection form associated to this task. To close this task, you need to complete the inspection.'
    }
    actionConfirm(content, () => {
      occurrence.event.inspection === null ? actionComplete(occurrence) : this.goToInspection(occurrence)
      actionHideModal();
    }, actionHideModal);
  }

  goToDetail = (task) => {
    this.toggleModal('detailModal', true);
    this.setState({ selected: task });
  }

  handleEditModalClose = () => {
    this.toggleModal('detailModal', false);
    this.setState({ selected: undefined });
  }

  handleNewTaskModalClose = () => {
    this.toggleModal('modal', false);
    this.setState({ selected: undefined });
  }

  handleGoToEdit = () => {
    this.toggleModal('modal', true);
    this.toggleModal('detailModal', false);
  }



  render() {
    const { actionComplete, tasks: rawTasks, history } = this.props;
    const { modal, detailModal, tasks, section, selected } = this.state;
    return (
      <>
      <Shortcuts links={this.links} />
      <div className={styles.toDoList}>
        <SectionHeader icon={todo} translationID="todo.title" defaultTitle="To Do">
          <div className={styles.navigation}>
            <Clickable className={section === 'my_tasks' ? styles.active : ''}
              onClick={() => this.handleTabClick('my_tasks')}
            >
              <FormattedMessage id="todo.my_tasks" defaultMessage="My Tasks" />
            </Clickable>
            <Clickable className={section === 'delegated_tasks' ? styles.active : ''}
              onClick={() => this.handleTabClick('delegated_tasks')}
            >
              <FormattedMessage id="todo.my_delegated_tasks" defaultMessage="My delegated tasks" />
            </Clickable>
            <Clickable className={section === 'completed_tasks' ? styles.active : ''}
              onClick={() => this.handleTabClick('completed_tasks')}
            >
              <FormattedMessage id="todo.my_completed_tasks" defaultMessage="My completed tasks" />
            </Clickable>
          </div>
          <div className={styles.detailHeader}>
            {/* <IconButton icon={settings} onClick={() => {}} />
            <Separator /> */}
            <Button translationID="todo.add" defaultText="Add New Task"
              onClick={() => this.toggleModal('modal', true)}
            />
            <Separator />
          </div>
        </SectionHeader>
        <div className={styles.list}>
          {/* if section are my tasks ot my delegated tasks, the table is
              divided by collapsible panels  */}
          {section !== 'completed_tasks' && Object.keys(tasks).map(k => (
            tasks[k].length > 0 && (
            <Collapsible key={k} title={`todo.${k}`} 
              styleClasses={`${styles.header} ${k === 'overdue' ? styles.overdue : ''}`}
              openOnMount={k==='overdue' || k==='today' ? true: false} autoheight={false} 
            >
              <ToDoTable taskGroup={tasks[k]} section={section}
                handleCompleted={this.handleCompleted}
                goToDetail={this.goToDetail}
              />
            </Collapsible>
            )
          ))}
          {/* if section are my tasks or my delegated tasks, the table is
              presented all toghether */}
          {section === 'completed_tasks' && (
            <ToDoTable taskGroup={rawTasks} section={section}
              handleCompleted={this.handleCompleted}
              goToDetail={this.goToDetail}
            />
          )}
          {rawTasks.length === 0 && <span className={styles.noResults}>There are no tasks with the selected criteria.</span>}
        </div>
        <NewTask showIn={modal} onClose={this.handleNewTaskModalClose} taskEdit={selected} />
        <TaskDetail showIn={detailModal} task={selected}
          editTask={this.handleGoToEdit}
          onComplete={() => { actionComplete(selected); }}
          onClose={this.handleEditModalClose}
          history={history}
        />
      </div>
      </>
    );
  }
}

ToDoList.propTypes = {
  actionFetch: PropTypes.func.isRequired,
  actionFetchDelegated: PropTypes.func.isRequired,
  actionFetchCompleted: PropTypes.func.isRequired,
  actionComplete: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
  tasks: state.tasks.tasks,
  updated_task: state.tasks.updated_task,
  rules: state.tasks.rules,
  action: state.tasks.action
});

const mapDispatchToProps = dispatch => ({
  actionFetch: () => {
    dispatch(fetchTasks());
  },
  actionFetchDelegated: () => {
    dispatch(fetchDelegatedTasks());
  },
  actionFetchCompleted: () => {
    dispatch(fetchCompletedTasks());
  },
  actionComplete: (id) => {
    dispatch(completeTask(id));
  },
  clearActions: () => {
    dispatch(clear());
  },
  // Confirmation dialog actions
  actionConfirm: (body, accept, cancel) => {
    dispatch(showConfirmModal(body, accept, cancel, 'todo.newTask.complete_task'));
  },
  actionHideModal: (insp) => {
    dispatch(hideModal(insp));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToDoList);
