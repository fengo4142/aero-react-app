import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import styles from '../toDoList.module.scss';

import ControlledCheckbox from '../../../../components/checkbox/controlledCheckbox';
import Clickable from '../../../../components/clickable/Clickable';


const ToDoTable = ({ taskGroup, section, handleCompleted, goToDetail }) => (
  <table>
    <thead>
      <tr>
        { section === 'my_tasks' && (
        <th><FormattedMessage id="todo.table.completed" defaultMessage="Completed" /></th>
        )}
        <th width="250"><FormattedMessage id="todo.table.title" defaultMessage="Task Title" /></th>
        <th>
          {section !== 'delegated_tasks'
            ? <FormattedMessage id="todo.table.assigned_by" defaultMessage="Assigned To" />
            : <FormattedMessage id="todo.table.assigned_to" defaultMessage="Assigned By" /> }

        </th>
        <th><FormattedMessage id="todo.table.labels" defaultMessage="Labels" /></th>
        <th><FormattedMessage id="todo.table.due_date" defaultMessage="Due Date" /></th>
        <th><FormattedMessage id="todo.table.due_time" defaultMessage="Due Time" /></th>
        <th />
      </tr>
    </thead>
    <tbody>
      {taskGroup.map((t, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <tr key={`${t.event.id}-${t.end}-${idx}`}>
           {section === 'my_tasks'  && (
          <td>
            <ControlledCheckbox id={t.id || t.end} label="" checked={t.task_occurrences && t.task_occurrences.completed}
              onChange={() => handleCompleted(t)}
            />
          </td>
            )}
          <td className={t.task_occurrences && t.task_occurrences.completed ? styles.completed : ''}>
            {t.title}
          </td>
          <td>
            {section === 'delegated_tasks'
              ? ((t.event.assigned_user && t.event.assigned_user.fullname)
                 || (t.event.assigned_role && t.event.assigned_role.name))
              : t.event.requested_by.fullname}
          </td>
          <td>
            <div className={`${styles.module} ${styles[(t.event.label || 'none').toLowerCase()]}`}>
              <FormattedMessage id={`todo.label.${t.event.label || 'none'}`} defaultMessage={t.event.label} />
            </div>
          </td>
          <td>{(t.event.due_date && moment(t.end).format('YYYY-MM-DD')) || ' - '}</td>
          <td>{t.event.due_time ? moment(t.event.due_time, ['HH:mm']).format('HH:mm') : '--:--'}</td>
          <td>
            <Clickable onClick={() => goToDetail(t)}>Details</Clickable>
          </td>
        </tr>
      ))}

    </tbody>
  </table>

);

ToDoTable.propTypes = {
  task: PropTypes.shape({}).isRequired
};
export default ToDoTable;
