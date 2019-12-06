import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { fetchLog } from '../redux/actions';
import styles from './operationLogDetails.module.scss';
import toDoStyles from '../../../src/modules/toDo/List/toDoList.module.scss';
import { LOGS_HOME_ROUTE } from '../../../constants/RouterConstants';
import FormattedMessageWithClass from '../../../components/formattedMessageWithClass';

const OperationLogDetails = ({ logID, onClose, history, ...redux }) => {
  // Fetch log on first mount
  useEffect(() => {
    redux.actionFetch(logID);
  }, []);

  const goToEdit = () => history.push(`${LOGS_HOME_ROUTE}${logID}`);

  const { log } = redux;

  return log ? (
    <div className={toDoStyles.taskDetail}>
      <div className={toDoStyles.title}>
        <h5>Log Details</h5>
        <div className={toDoStyles.headerActionContainer}>
          <button type="button" className={toDoStyles.editBtn} onClick={goToEdit}> Edit </button>
          <div className={toDoStyles.actionsSeparator} />
          <button type="button" className={toDoStyles.closeBtn} onClick={onClose}> &times; </button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.item}>
          <FormattedMessageWithClass className={styles.label}
            id="operations.builder.logged_by" defaultMessage="Logged By"
          />
          {log.logged_by.fullname}
        </div>
        <div className={styles.item}>
          <FormattedMessageWithClass className={styles.label}
            id="operations.builder.date" defaultMessage="Report Date"
          />
          <span>{moment(log.report_date).format('YYYY-MM-DD')}</span>
        </div>
        <div className={styles.item}>
          <FormattedMessageWithClass className={styles.label}
            id="operations.builder.category" defaultMessage="Type"
          />
          <span>{log.type}</span>
        </div>

        <div className={styles.item}>
          <FormattedMessageWithClass className={styles.label}
            id="operations.builder.subcategory" defaultMessage="Sub Category"
          />
          <span>{log.subtype}</span>
        </div>
        <div className={styles.fullItem}>
          <span className={styles.label}>description:</span>
          <span>{log.description}</span>
        </div>
      </div>
      <h5 className={styles.subtitle}>Other fields</h5>
      <div className={styles.content}>
        {log.form.schema.fields.map(field => (
          <div className={styles.item}>
            <span className={styles.label}>{field.title}</span>
            <span>{log.response[field.id]}</span>
          </div>
        ))}
      </div>
    </div>
  )
    : null;
};

OperationLogDetails.propTypes = {
  log: PropTypes.shape({})
};

const mapStateToProps = state => ({
  log: state.opslogs.log
});

const mapDispatchToProps = dispatch => ({
  // Fetch Log list
  actionFetch: (id) => {
    dispatch(fetchLog(id));
  }
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(withRouter(OperationLogDetails));
