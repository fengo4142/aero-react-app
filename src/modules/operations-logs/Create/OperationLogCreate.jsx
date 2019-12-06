import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment/min/moment-with-locales';

import { fetchLogFormSchema, createLog, fetchLog, updateLog, clear } from '../redux/actions';
/** ******************************************************************
 *  Component import
 * ****************** */
import SectionHeader from '../../../components/sectionHeader';
import HeaderBack from '../../../components/headerBack';
import Spinner from '../../../components/spinner';
import Button from '../../../components/button';
import PulpoField from '../../../pulpo_visualizer/fields';
import DefaultFields from '../List/components/DefaultFields';


/** ******************************************************************
 *  Assets import
 * ************* */

import styles from '../../workorders/Create/workOrderCreate.module.scss';
import Panel from '../../../components/panel';
import { searchUser } from '../../inspections/redux/actions';
import preset from '../../../icons/Preset.svg';
import { LOGS_HOME_ROUTE } from '../../../constants/RouterConstants';

const OperationLogCreate = ({
  actionFetchForm,
  saveAction,
  actionCreateLog,
  actionSearchUser,
  actionClear,
  actionFetchLog,
  actionUpdateLog,
  history,
  match,
  version, userlist,
  types, subTypes,
  log,
  user,
  translations
}) => {
  // State Hooks
  const [requiredMap, setRequiredMap] = useState({});
  const [fieldErrors, setFieldErrors] = useState({
    logged_by: false,
    report_date: false,
    description: !match.params.id,
    type: false,
    subtype: false
  });
  const [answers, setAnswers] = useState({
    report_date: moment().format(),
  });
  const [dynamicAnswers, setDynamicAnswers] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [schema, setSchema] = useState({});

  let timeout;
  // Once Component mounts.
  useEffect(() => {
    actionClear();
    if (match.params.id) actionFetchLog(match.params.id);
    actionFetchForm();
    actionSearchUser(user.fullname);
  }, []);

  useEffect(() => {
    if (schema && schema.fields) {
      let reqMap = {}; let fErrors = { ...fieldErrors };

      schema.fields.forEach((f) => {
        reqMap = { ...reqMap, [f.id]: f.required };
        fErrors = { ...fErrors, [f.id]: (match.params.id ? false : f.required) };
      });
      setRequiredMap(reqMap);
      setFieldErrors(fErrors);
    }
  }, [schema]);

  useEffect(() => {
    if (!match.params.id) setSchema(version.schema);
  }, [version]);

  // fills the form with the log fetched
  useEffect(() => {
    if (match.params.id && log) {
      const fetchedAnswers = {
        logged_by: log.logged_by.id,
        report_date: log.report_date,
        type: log.type,
        subtype: log.subtype,
        description: log.description,
        currentValue: log.logged_by.fullname
      };
      setAnswers(fetchedAnswers);
      setDynamicAnswers(log.response);
      setSchema(log.form.schema);
    }
  }, [log]);

  // Redirects to list when save action finishes.
  useEffect(() => {
    if (saveAction.success) {
      history.push('/ops/logs');
      actionClear();
    }
  }, [saveAction]);


  // Handles the search for user's Autocomplete
  const handleSearchForUser = (value) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      actionSearchUser(value);
    }, 300);
  };

  // Handles the api call for create new Log
  const handleCreate = () => {
    const areErrors = Object.values(fieldErrors).some(a => a);
    if (areErrors) {
      setShowErrors(true);
    } else {
      answers.logged_by = answers.logged_by.id;
      if (match.params.id) {
        actionUpdateLog(match.params.id, { ...answers, response: { ...dynamicAnswers } });
      } else {
        actionCreateLog({ ...answers, response: { ...dynamicAnswers } });
      }
    }
  };


  const errorsChanged = (a, b) => {
    setFieldErrors({ ...fieldErrors, [a]: b });
  };

  const translationsMap = translations ? translations[user.language] : {};
  return (
    <div className={styles.newlog}>
      <SectionHeader icon={preset} translationID="operations.log.title"
        defaultTitle="Operations Log"
      />
      <HeaderBack
        translationID="inspections.new.prev"
        translationDefault="Back to Operations Log"
        backRoute={LOGS_HOME_ROUTE}
      />
      <div className={`container ${styles.form}`}>
        <Panel title="operations.create.formtitle" defaultTitle="Create Log">
          <div className={`${styles.content} ${styles.embedded}`}>
            {(!match.params.id || (match.params.id && Object.keys(answers).length > 0)) && (
            <DefaultFields
              info={answers}
              userlist={userlist}
              searchForUser={handleSearchForUser}
              types={types}
              subtypes={subTypes}
              showFieldErrors={showErrors}
              handleAnswerChanged={(a, b) => setAnswers({ ...answers, [b]: a })}
              handleFieldErrorChanged={errorsChanged}
              user={user}
            />
            )}
            <div className={styles.separator} />
            {Object.keys(requiredMap).length > 0
                && schema.fields.map(field => (
                  <PulpoField key={field.id} {...field} translation={translationsMap && translationsMap[field.title]}
                    handleValueChange={(a, b) => setDynamicAnswers({ ...dynamicAnswers, [b]: a })}
                    isRequired={requiredMap[field.id]} answer={dynamicAnswers[field.id]}
                    showFieldErrors={showErrors}
                    handleFieldErrorChanged={errorsChanged}
                  />
                ))}
          </div>

          <div className={`${styles.footer} ${styles.embedded}`}>
            <Spinner className={styles.spinner} active={saveAction.loading} />
            <div className={styles.errors}>
              {fieldErrors.length > 0 && (
                fieldErrors.map(e => (
                  <>
                    <span>{`${e.id}: `}</span>
                    <FormattedMessage key={e.id} id={e.message}
                      defaultMessage="this field is required"
                    />
                  </>
                ))
              )}
            </div>
            <Button onClick={handleCreate} translationID="inspections.new.create"
              defaultText="Create" action="secondary"
            />
          </div>
        </Panel>
      </div>
    </div>
  );
};

OperationLogCreate.propTypes = {
  actionFetchForm: PropTypes.func.isRequired,
  actionCreateLog: PropTypes.func.isRequired,
  actionSearchUser: PropTypes.func.isRequired,
  saveAction: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  version: PropTypes.shape({}).isRequired,
  types: PropTypes.arrayOf(PropTypes.shape({})),
  subtypes: PropTypes.shape({}),
  userlist: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

const mapStateToProps = state => ({
  version: state.opslogs.schema,
  log: state.opslogs.log,
  types: state.opslogs.types,
  subTypes: state.opslogs.subtypes,
  saveAction: state.opslogs.saveAction,
  userlist: state.inspection.userlist,
  translations: state.auth.translations,
  user: state.auth.profile
});

const mapDispatchToProps = dispatch => ({
  // Fetch form Schema
  actionFetchForm: () => {
    dispatch(fetchLogFormSchema());
  },
  // Fetch form Schema
  actionFetchLog: (id) => {
    dispatch(fetchLog(id));
  },
  // Fetch form Schema
  actionCreateLog: (data) => {
    dispatch(createLog(data));
  },
  // Fetch form Schema
  actionUpdateLog: (id, data) => {
    dispatch(updateLog(id, data));
  },
  // Fetch form Schema
  actionClear: () => {
    dispatch(clear());
  },
  // Fetch form Schema
  actionSearchUser: (data) => {
    dispatch(searchUser(data));
  }
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(OperationLogCreate);
