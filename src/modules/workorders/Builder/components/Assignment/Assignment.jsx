/* eslint-disable jsx-a11y/no-onchange */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autocomplete from 'react-autocomplete';
import { connect } from 'react-redux';

import { searchUser } from '../../../../inspections/redux/actions';
import { fetchRoles } from '../../../../settings/redux/actions';
import { saveAssignment, clearActionResult } from '../../../redux/actions';
import Clickable from '../../../../../components/clickable/Clickable';
import Button from '../../../../../components/button';

import styles from '../../workOrderBuilder.module.scss';
import fieldStyle from '../../../../../pulpo_visualizer/fields/fields.module.scss';

class Assignment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentValue: undefined,
      userList: []
    };
  }

  componentDidMount() {
    const { actionGetRoles, roles } = this.props;
    if (!roles.length) actionGetRoles();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.assignmentAction.success) {
      setTimeout(() => { props.clear(); }, 2000);
    }

    if (state.currentRole === undefined && props.defaultRole) {
      const newState = { ...state, currentRole: props.defaultRole };
      return newState;
    }

    if (state.currentRole === undefined
        && !state.userList.length && props.defaultUsers) {
      const newState = { ...state, userList: props.defaultUsers };
      return newState;
    }

    return state;
  }

  handleAutocompleteChange = (e) => {
    const { actionSearchUser, section } = this.props;
    this.setState({ currentValue: e.target.value, open: true });
    actionSearchUser(e.target.value, section);
  }

  handleAutocompleteSelect = (val, item) => {
    let { userList } = this.state;
    const exists = userList.find(e => e.id === item.id) !== undefined;
    if (!exists) {
      userList = [...userList, item];
      this.setState({
        currentValue: '',
        currentRole: '',
        open: false,
        userList
      });
    }
  }

  handleRoleSelect = (event) => {
    const { value } = event.nativeEvent.target;
    this.setState({ currentRole: value, userList: [] });
  }

  removeItem = (value) => {
    let { userList } = this.state;
    userList = userList.filter(e => e.id !== value);
    this.setState({ userList });
  }

  handleSearchForUser = (value) => {
    const { actionSearchUser } = this.props;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      actionSearchUser(value);
    }, 300);
  }

  handleSave = () => {
    const { userList, currentRole } = this.state;
    const { actionSave, section } = this.props;

    if (userList.length) {
      const IDs = userList.map(e => e.id);
      actionSave(section, { users: IDs });
    } else {
      actionSave(section, { role: parseInt(currentRole, 10) });
    }
  }

  render() {
    const {
      roles,
      users,
      onGoBack,
      transition,
      assignmentAction
    } = this.props;

    const {
      userList,
      currentValue,
      currentRole,
      open } = this.state;
    return (
      <div style={transition}>
        <div className={styles.header}>
          <Clickable className={styles.backBtn} onClick={onGoBack}>
            fields
          </Clickable>
          <div className={styles.save}>
            {assignmentAction.success && <div className={styles.success}>Saved!</div> }
            <Button action="secondary" translationID="work_order" defaultText="Save"
              onClick={this.handleSave}
            />
          </div>
        </div>
        <div className={styles.content}>
          <span className={styles.subtitle}>Assign a Role to maintenance work orders.</span>
          <label htmlFor="roles">
              Roles
            <select className={styles.roleSelect} id="roles"
              onChange={this.handleRoleSelect} value={currentRole}
            >
              <option value="">-----</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </label>
          <span className={styles.subtitle}> Or select which users can fill maintenance forms</span>
          <label className={fieldStyle.field}>
            Users
            <Autocomplete
              getItemValue={item => item.fullname}
              items={users}
              open={open}
              wrapperStyle={{ position: 'relative' }}
              value={currentValue}
              onChange={this.handleAutocompleteChange}
              onSelect={this.handleAutocompleteSelect}
              renderMenu={children => (
                <div className={styles.autocompleteMenu}>
                  {children}
                </div>
              )}
              renderItem={(item, isHighlighted) => (
                <div key={item.id} className={`${styles.menuItem} ${isHighlighted && styles.highlighted}`}>
                  {item.fullname}
                </div>
              )}
            />
          </label>
          <div className={styles.sectionTitle}>
            Selected Users
          </div>
          <div className={styles.userList}>
            {userList.map(u => (
              <span className={styles.user} key={u.id}>
                {u.fullname}
                <span onKeyPress={() => this.removeItem(u.id)} tabIndex={0} role="button"
                  onClick={() => this.removeItem(u.id)} className={styles.btnRemove}
                />
              </span>))}
          </div>
        </div>
      </div>
    );
  }
}

Assignment.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onGoBack: PropTypes.func.isRequired,
  transition: PropTypes.shape({}).isRequired
};


const mapStateToProps = state => ({
  users: state.inspection.userlist,
  roles: state.settings.roles,
  assignmentAction: state.workorders.assignmentAction
});

const mapDispatchToProps = dispatch => ({
  actionSearchUser: (query, type) => {
    dispatch(searchUser(query, type));
  },
  actionGetRoles: () => {
    dispatch(fetchRoles());
  },
  actionSave: (type, data) => {
    dispatch(saveAssignment(type, data));
  },
  clear: () => {
    dispatch(clearActionResult());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Assignment);
