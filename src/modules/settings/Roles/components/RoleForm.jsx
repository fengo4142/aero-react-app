import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Permissions from 'react-redux-permissions';

import Clickable from '../../../../components/clickable/Clickable';
import Checkbox from '../../../../components/checkbox';
import Button from '../../../../components/button';
import Spinner from '../../../../components/spinner';

import styles from '../roles.module.scss';

class RoleForm extends Component {
  state = {
    checkedList: [],
    categoriesList: []
  }

  static getDerivedStateFromProps(props, state) {
    const { privileges, role } = props;
    const { checkedList } = state;
    if (role && checkedList.length === 0) {
      let chlst = {};
      let categories = {};
      Object.keys(privileges).forEach((item, k) => {
        categories[k] = item;
      });
      Object.values(privileges).forEach((p) => {
        p.forEach((pre) => {
          chlst[pre.id] = role.permissions.find(pr => pr.id === pre.id) !== undefined;
        });
      });
      return { ...state, checkedList: chlst, categoriesList: categories };
    }
    return state;
  }

  onCheckboxChange = (e) => {
    const { id, checked } = e.nativeEvent.target;
    const { handleCheckboxChange } = this.props;
    const roleID = id.split('-')[1];

    this.setState(prevState => ({
      checkedList: {
        ...prevState.checkedList,
        [roleID]: checked
      }
    }), () => {
      const { checkedList } = this.state;
      handleCheckboxChange(checkedList);
    });
  };

  render() {
    const { role,
      privileges,
      handleNameChange,
      handleSave,
      handleCancel,
      apiStatus,nameEmpty,spaceError} = this.props;

    const { checkedList, categoriesList } = this.state;
    let actionType = '';
    
    return (
      <div className={styles.newItem}>
        {!role && (
        <div className={styles.header}>
          <Clickable onClick={handleCancel} className={styles.link} type="button">Back</Clickable>
        </div>
        )}
        <div className={`${styles.content} ${role ? styles.full : ''}`}>
          <div className={styles.details}>
            <FormattedMessage id="roles.title.details" defaultMessage="Role Details" />
          </div>
          <label>
          Role Name
            <input type="text" value={this.state.name} onChange={handleNameChange} defaultValue={role ? role.name : ''} disabled={ role && role.system_generated ? role.system_generated : (role.name=='System Admin' ? true : false) } className={role && role.system_generated ? styles.disabled : (role.name=='System Admin' ? styles.disabled : '')}/>
          </label>
          {nameEmpty && <div className={styles.error}> <FormattedMessage tagName="p" id="roles.error.name_empty" defaultMessage="This feild cannot be empty" /> </div>}
          {spaceError && <div className={styles.error}> <FormattedMessage tagName="p" id="roles.error.space_error" defaultMessage="Spaces are not allowed" /> </div>}
          <span className={styles.privileges}>
            <FormattedMessage id="roles.title.privileges" defaultMessage="Role Privileges" />
          </span>
          {Object.values(categoriesList).map((value, key) => (
            <div className={styles.privilegesList} key={key}>
              <FormattedMessage key={value} id={`roles.privileges.${value}`} defaultMessage={value}/>
              <div className={styles.privilegesListItem}>
                {Object.values(privileges).map((p) => (
                  p.map((pre) => {
                    if(pre.category === value){
                      if(pre.codename !== 'can_modify_airport_settings') {
                        if(pre.codename == 'add_inspectionanswer') {
                          actionType = 'actionAddEdit';
                        } else if(pre.codename == 'add_maintenance') {
                          actionType = 'WorkOrderMaintenance';
                        } else if(pre.codename == 'add_operations') {
                          actionType = 'WorkOrderOperations';
                        } else if(pre.codename.includes('add_')){
                          actionType = 'actionAdd';
                        } else if(pre.codename.includes('change_')){
                          actionType = 'actionEdit';
                        } else if(pre.codename.includes('view_')){
                          actionType = 'actionView';
                        } else if(pre.codename.includes('delete_')){
                          actionType = 'actionDelete';
                        } else {
                          actionType = 'default';
                        }
                        return <FormattedMessage key={pre.id} id={`roles.privileges.${actionType}`} defaultMessage={pre.codename}>
                            {txt => (
                              <Checkbox id={`${role && role.id}-${pre.id}`} label={txt}
                                checked={checkedList[pre.id]} onChange={this.onCheckboxChange}
                              />
                            )}
                          </FormattedMessage>
                      }                      
                    }
                  })
                ))}
              </div>
            </div>
          ))}
        </div>
        <Permissions allowed={['change_role']}>
          <div className={`${styles.footer} ${role ? styles.edit : ''}`}>
            {!role && <Button onClick={handleCancel} translationID="cancel" defaultText="Cancel" action="tertiary" />}

            <Button onClick={handleSave} translationID="save" defaultText="Save" action="primary" disabled={role.name=='System Admin'} />
            <Spinner active={apiStatus && apiStatus.loading} />
            {apiStatus && apiStatus.success && (
              <FormattedMessage id="roles.title.saved" defaultMessage="Saved!" />
            )}
            
          </div>
        </Permissions>
      </div>
    );
  }
}

RoleForm.propTypes = {
  role: PropTypes.shape({}).isRequired,
  privileges: PropTypes.shape({}).isRequired,
  handleNameChange: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};
export default RoleForm;
