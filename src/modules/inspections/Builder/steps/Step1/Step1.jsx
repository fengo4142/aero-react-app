import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import 'react-datetime/css/react-datetime.css';

import Modal from '../../../../../components/modal';

import { importAllImages } from '../../../../../utils/helpers';

import styles from '../steps.module.scss';
import Scheduler from '../../../../../components/scheduler/Scheduler';
import Assignee from '../../../../../components/assignee/Assignee';
import Button from '../../../../../components/button';


const Step1 = ({
  recurrence,
  info,
  hasTemplateUpdate,
  hasVersionUpdate,
  onInfoChange,
  onUpdateVersion,
  rules,
  assignee,
  handleAssigneeChanged,
  handleAssigneeSelected,
  handleRoleChange,
  onAssignTypeChanged
}) => {
  const [modal, setModal] = useState(false);
  const images = importAllImages(require.context('../../../../../icons/inspection-icons', false, /\.(png|jpe?g|svg)$/));

  const selectIcon = (icon) => {
    setModal(false);
    onInfoChange('icon', icon);
  };
  
  return (
    <div className={styles.step1}>
      {hasTemplateUpdate && (
      <div className={styles.newVersion}>
        There is a new version of this template, do you want to update it?
        <Button onClick={() => onUpdateVersion('template')}
          translationID="inspections.step1.update" defaultText="update" action="primary"
        />
      </div>
      )}
      {hasVersionUpdate && (
        <div className={styles.newVersion}>
          There is a new version of the base template of this form, do you want to update it?
          <Button onClick={() => onUpdateVersion('version')}
            translationID="inspections.step1.update" defaultText="update" action="primary"
          />
        </div>
      )}
      <div className={styles.title}>
        <FormattedMessage tagName="h5" id="inspections.step1.title"
          defaultMessage="Inspection Overview"
        />
      </div>
      {/* <FormattedMessage tagName="p" id="inspections.step1.subsection"
        defaultMessage="Inspection Overview"
      /> */}
      <div className={styles.info}>
        <label htmlFor="inspName">
          <FormattedMessage id="inspections.step1.labelName"
            defaultMessage="Inspection Name"
          />
          <input id="inspName" type="text" onChange={e => onInfoChange('name', e.nativeEvent.target.value)} defaultValue={info.name} />
        </label>
        {images[`${info.icon}.svg`] ?
         <div className={styles.iconSelector}>
          <FormattedMessage tagName="p" id="inspections.step1.labelIcon"
            defaultMessage="Inspection Icon"
          />
          <button onClick={() => setModal(true)} onKeyPress={() => setModal(true)} type="button">
            <img src={images[`${info.icon}.svg`]} alt="" />
          </button>
        </div> :
        <div className={styles.iconDisplay}>
        <FormattedMessage tagName="p" id="inspections.step1.labelIcon"
          defaultMessage="Inspection Icon"
        />
        <button onClick={() => setModal(true)} onKeyPress={() => setModal(true)} type="button">
          <img src={images[info.icon]} alt="" width="75px" height="75px"/>
        </button>
        </div> }
      </div>
      <Scheduler title="schedule.repeat.maintitle"
        selected={recurrence}
        onScheduleChange={e => onInfoChange('rule', e)}
        rules={rules.map(r => ({ key: `${r.id}`, name: r.name, frequency: r.frequency, params: r.params }))}
      />

      <div className={styles.selector}>
        <label>
          <input type="radio" name="user" value="user"
            checked={assignee.assigneeType === 'user'} onChange={e => onAssignTypeChanged(e.target.value)}
          />
            User
        </label>
        <label>
          <input type="radio" name="role" value="role"
            checked={assignee.assigneeType === 'role'} onChange={e => onAssignTypeChanged(e.target.value)}
          />
            Role
        </label>
      </div>
      <div className={styles.assigneeSelector}>
        <Assignee
          typeSelected={assignee.assigneeType}
          updateUserValue={handleAssigneeChanged}
          onAssigneeSelected={handleAssigneeSelected}
          onRoleChange={handleRoleChange}
          userValue={assignee.currentUser}
          showFieldErrors={false}
          assignedRole={assignee.assigned_role}
          assignedUser={assignee.assigned_user}
          roleClassName={styles.roleLabel}
        />
      </div>

      <Modal showIn={modal} onClose={() => setModal(false)}>
        <div className={styles.modalTitle}>
          <FormattedMessage tagName="h5" id="inspections.step1.modalTitle"
            defaultMessage="New Icon"
          />
        </div>
        <h2 className={styles.selectTitle}>
          <FormattedMessage id="inspections.step1.modalHeadline"
            defaultMessage="Select an icon for your Inspection"
          />
        </h2>
        <div className={styles.icons}>
          {Object.keys(images).map(i => ( 
            i.includes(".png") && <button key={i} type="button" onClick={() => selectIcon(i)}>
              <img src={images[i]} alt="" width='70px' height = '70px'/> 
            </button> 
          ))
          }
        </div>
      </Modal>
    </div>
  );
};

Step1.propTypes = {
  onInfoChange: PropTypes.func.isRequired,
  info: PropTypes.shape({}).isRequired
};

export default Step1;
