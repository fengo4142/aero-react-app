import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

/** ******************************************************************
 *  Redux import
 * ************* */
import {
  fetchUsers,
  fetchRoles,
  editUser,
  createUser,
  clear } from '../redux/actions';

/** ******************************************************************
 *  Components import
 * ***************** */
import Panel from '../../../components/panel';
import Button from '../../../components/button';
import Clickable from '../../../components/clickable/Clickable';
import Checkbox from '../../../components/checkbox';
import Spinner from '../../../components/spinner';

/** ******************************************************************
 *  Assets import
 * ************** */
import styles from '../Roles/roles.module.scss';


class Users extends Component {
  state = {
    view: 'list',
    selectedUser: {
      first_name:'',
      last_name:'',
      fullname: '',
      email: '',
      roles: []
    }
  };
  inputStyles={
   marginRight:'10px',
  };
  componentDidMount() {
    const {
      users,
      actionFetch,
      location,
      roles,
      actionFetchRoles
    } = this.props;

    if (!users.length) actionFetch();
    if (location.state && location.state.slots) {
      if (!roles.length) actionFetchRoles();
      this.setState({ view: 'new' });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.apiStatusUser.success) {
      props.actionClear();
      props.actionFetch();
      return {
        ...state,
        view: 'list',
        selectedUser: { fullname: '', first_name:'',last_name:'', email: '', roles: [] }
      };
    }
    return state;
  }

  handleClick = (id) => {
    const { users, roles, permissions, actionFetchRoles } = this.props;
    if (permissions.includes('change_aerosimpleuser')) {
      const selected = users.find(e => e.id === id);
      if (!roles.length) actionFetchRoles();
      this.setState({ selectedUser: selected, view: 'change' });
    }
  }

  handleNew = (view) => {
    const { roles, actionFetchRoles } = this.props;
    if (!roles.length) actionFetchRoles();
    this.setState({ view,
      selectedUser: {
        fullname: '',
        first_name:'',
        last_name:'',
        email: '',
        roles: []
      }
    });
  }

  handleFieldChange = (e) => {
    const { id, value } = e.nativeEvent.target;
    this.setState(prevState => ({
      selectedUser: {
        ...prevState.selectedUser,
        [id]: value
      }
    }));
  }

  handleCheckboxChange = (e) => {
    const { roles: allRoles } = this.props;
    const { id, checked } = e.nativeEvent.target;
    const { selectedUser: { roles } } = this.state;
    if (checked) {
      const role = allRoles.find(r => r.id === parseInt(id, 10));
      roles.push(role);
    } else {
      roles.splice(roles.findIndex(i => i.id === parseInt(id, 10)), 1);
    }
    this.setState(prevState => ({
      selectedUser: {
        ...prevState.selectedUser,
        roles
      }
    }));
  }

  handleCreate = () => {
    const { selectedUser: { id, ...data } } = this.state;
    const { actionEdit, actionCreate } = this.props;

    data.roles = data.roles.map(r => r.id);
    if (data.email && data.first_name) {
      if (id) {
        actionEdit(id, data);
      } else {
        actionCreate(data);
      }
    } else {
      this.setState({ shouldShowErrors: true });
    }
  }

  render() {
    const { users, roles, apiStatusUser, error } = this.props;
    const { view, selectedUser, shouldShowErrors } = this.state;

    return (
      <>
        {/* ************************************************ */}
        {/* **************** listing users ***************** */}
        {/* ************************************************ */}
        <div className={styles.list}>
          {view === 'list' && (
            <Panel title="settings.users.title" defaultTitle="Users">
              <div className={styles.newButton}>
                <Button translationID="settings.users.add"
                  onClick={() => this.handleNew('new')}
                  defaultText="New User" action="primary"
                />
              </div>
              <table>
                <thead>
                  <tr>
                    <th width="250">Contact Name</th>
                    <th> Roles </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(e => (
                    <tr key={e.id} className={styles.user}
                      onClick={() => this.handleClick(e.id)} onKeyPress={this.handleClick}
                    >
                      <td>{e.fullname}</td>
                      <td>
                        {e.roles.length > 0 && e.roles.slice(0, 3).map(el => el.name).join(', ')}
                        {e.roles.length > 3 && ` + ${e.roles.length - 2} more`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          )}
          {/* ************************************************ */}
          {/* *********** for edit and crete users *********** */}
          {/* ************************************************ */}
          {(view === 'change' || view === 'new') && (
            <div className={styles.newItem}>
              <div className={styles.content}>
                <div className={styles.details}>User Details</div>
                <div className={styles[`inputs_${view}`]}>
                  {/* <label className={styles.input}>
                    Full Name
                    <input type="text" id="fullname" readOnly={view === 'change'} defaultValue={selectedUser.fullname}
                      onChange={this.handleFieldChange}
                    />
                    <div className={styles.error}>
                      {shouldShowErrors
                        && selectedUser.fullname === '' && <span>Name cannot be empty</span>}
                    </div>
                  </label> */}
                  <label className={styles.input}>
                    First Name
                    <input type="text" id="first_name" readOnly={view === 'change'} defaultValue={selectedUser.first_name}
                      onChange={this.handleFieldChange}
                    />
                    <div className={styles.error}>
                      {shouldShowErrors
                        && selectedUser.first_name === '' && <span>Name cannot be empty</span>}
                    </div>
                  </label>
                  <label className={styles.input}>
                    Last Name
                    <input type="text" id="last_name" readOnly={view === 'change'} defaultValue={selectedUser.last_name}
                      onChange={this.handleFieldChange}
                    />
                    <div className={styles.error}>
                      {shouldShowErrors
                        && selectedUser.last_name === '' && <span>Name cannot be empty</span>}
                    </div>
                  </label>
                  <label className={styles.input}>
                    Email             
                    <input type="email" id="email" readOnly={view === 'change'} defaultValue={selectedUser.email}
                      onChange={this.handleFieldChange} style={this.inputStyles}
                    />
                    <div className={styles.error}>
                      {error.email && <span>{error.email[0]}</span>}
                      {shouldShowErrors
                        && selectedUser.email === '' && <span>Email cannot be empty</span>}
                    </div>
                  </label>
                </div>
                <span className={styles.privileges} style={{ margin: 0 }}> Roles </span>
                <div className={styles.privilegesList}>
                  {roles.map(r => (
                    <Checkbox id={r.id} key={r.id} label={r.name}
                      checked={selectedUser.roles.find(ro => ro.id === r.id) !== undefined}
                      onChange={this.handleCheckboxChange}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.footer}>
                <Button onClick={() => this.setState({ view: 'list' })}
                  translationID="cancel" defaultText="Cancel" action="tertiary"
                />
                <div className={styles.save}>
                  <Spinner active={apiStatusUser.loading} />
                  <Button onClick={this.handleCreate}
                    translationID="save" defaultText="Save" action="primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

Users.propTypes = {
  actionFetch: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape()),
  roles: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  permissions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  actionFetchRoles: PropTypes.func.isRequired,
  actionEdit: PropTypes.func.isRequired,
  actionCreate: PropTypes.func.isRequired,
  apiStatusUser: PropTypes.shape().isRequired
};

Users.defaultProps = {
  users: []
};

const mapStateToProps = state => ({
  users: state.settings.users,
  roles: state.settings.roles,
  apiStatusUser: state.settings.apiStatusUser,
  error: state.settings.error,
  permissions: state.permissions
});

const mapDispatchToProps = dispatch => ({
  // Fetch Users
  actionFetch: () => {
    dispatch(fetchUsers());
  },
  actionEdit: (id, data) => {
    dispatch(editUser(id, data));
  },
  actionCreate: (data) => {
    dispatch(createUser(data));
  },
  actionClear: () => {
    dispatch(clear());
  },
  // Fetch Roles
  actionFetchRoles: () => {
    dispatch(fetchRoles());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
