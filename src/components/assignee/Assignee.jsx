import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { connect } from 'react-redux';
import Autocomplete from 'react-autocomplete';

import PulpoField from '../../pulpo_visualizer/fields/PulpoField';

import { searchUser } from '../../modules/inspections/redux/actions';
import { fetchRoles } from '../../modules/settings/redux/actions';

import styles from './assignee.module.scss';


class Assignee extends Component {
  state = {
    open: false
  }

  componentDidMount = () => {
    const { actionGetRoles } = this.props;
    actionGetRoles();
  }

  handleAutocompleteChange = (e) => {
    const { actionSearchUser, updateUserValue } = this.props;
    this.setState({ open: true });
    actionSearchUser(e.target.value);
    updateUserValue(e.target.value);
  }

  handleAutocompleteSelect = (val, item) => {
    const { onAssigneeSelected } = this.props;
    onAssigneeSelected(val, item.id);
    this.setState({ open: false });
  }

  render() {
    const {
      users,
      roles,
      typeSelected,
      userValue,
      onRoleChange,
      showFieldErrors,
      assignedRole,
      assignedUser,
      roleClassName
    } = this.props;
    const { open } = this.state;
    return (
      <>
        {typeSelected === 'user' && (
        <label className={styles.assign}>
          <div>
            <small style={{ color: 'red' }}> * </small>
            Assign to
          </div>
          <Autocomplete
            getItemValue={item => item.fullname}
            items={users}
            open={open}
            wrapperStyle={{ position: 'relative' }}
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
            value={userValue}
            onChange={this.handleAutocompleteChange}
            onSelect={this.handleAutocompleteSelect}
          />
          {showFieldErrors && !assignedUser && (
            <small>
              <FormattedMessage id="pulpoforms.errors.not_blank"
                defaultMessage="There is an error in this field"
              />
            </small>
          )}
        </label>
        )}
        {typeSelected === 'role' && (
        <PulpoField key="role" id="assigned_role" type="select"
          title="Assigned role" isRequired
          translationID="todo.newTask.role"
          handleValueChange={onRoleChange}
          answer={assignedRole}
          values={roles.map(r => ({ key: `${r.id}`, value: r.name }))}
          showFieldErrors={showFieldErrors}
          handleFieldErrorChanged={() => ({})}
          className={roleClassName}
        />
        )}
      </>
    );
  }
}

Assignee.propTypes = {
  // Actions
  actionSearchUser: PropTypes.func.isRequired,
  actionGetRoles: PropTypes.func.isRequired,
  // Store data
  users: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  roles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  // Component props
  updateUserValue: PropTypes.func.isRequired,
  onAssigneeSelected: PropTypes.func.isRequired,
  typeSelected: PropTypes.oneOf(['user', 'role']).isRequired,
  userValue: PropTypes.string,
  onRoleChange: PropTypes.func.isRequired,
  showFieldErrors: PropTypes.bool.isRequired,
  assignedRole: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  assignedUser: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

Assignee.defaultProps = {
  userValue: undefined,
  assignedRole: undefined,
  assignedUser: undefined
};

const mapStateToProps = state => ({
  users: state.inspection.userlist,
  roles: state.settings.roles
});

const mapDispatchToProps = dispatch => ({
  actionSearchUser: (query, type) => {
    dispatch(searchUser(query, type));
  },
  actionGetRoles: () => {
    dispatch(fetchRoles());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Assignee);
