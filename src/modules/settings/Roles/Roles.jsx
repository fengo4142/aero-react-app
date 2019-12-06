import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import Permissions from 'react-redux-permissions';
import {
  fetchPrivileges,
  fetchRoles,
  createRole,
  editRole,
  clear } from '../redux/actions';

import Panel from '../../../components/panel';
import Button from '../../../components/button';
import Collapsible from '../../../components/collapsible/Collapsible';
import RoleForm from './components/RoleForm';

import styles from './roles.module.scss';


class Roles extends Component {
  state = {
    view: 'list',
    permissions: [],
    nameEmpty:false,
    spaceError:false
  }

  componentDidMount() {
    const {
      history,
      privileges,
      roles,
      actionFetch,
      actionFetchPrivileges } = this.props;

    if (!privileges.length) actionFetchPrivileges();
    if (!roles.length) actionFetch();

    if (history.location.state
      && history.location.state.intent === 'AddRole') {
      this.setState({ view: 'new', name: history.location.state.slots.role });
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.permissions && props.actionPrivileges.success) {
      return { ...state,
        permissions:
        props.privileges.reduce((obj, item) => {
          const o = obj;
          o[item.id] = undefined;
          return o;
        }, {})
      };
    }
    if (props.actionCreateRole.success) {
      props.actionClear();
      props.actionFetch();
      return { ...state, view: 'list' };
    }
    return state;
  }

  handleNew = () => {
    this.setState({ view: 'new' });
  }

  handleNameChange = (e) => {
    const { value } = e.nativeEvent.target;
      this.setState({ name: value });
      this.setState({nameEmpty:false});
      this.setState({spaceError:false})
  }

  handleCheckboxChange = (value) => {
    this.setState({ permissions: value });
  }

  handleCreate = (id) => {
    const { name, permissions, nameEmpty} = this.state;
    const { actionCreate, actionEdit, actionClear } = this.props;
    const filtered = Object.keys(permissions).filter(
      key => permissions[key]
    );
    if(!name) {
      this.setState({nameEmpty:true});
      return;
    }

    if(!name.trim()) {
      this.setState({spaceError:true});
      return;
    }
    if (id) {
      actionEdit(id, { name, permissions: filtered });
    } else {
      actionCreate({ name, permissions: filtered });
    }
    setTimeout(() => { actionClear(); }, 2000);
  }

  handleCancel = () => {
    this.setState({ view: 'list' });
  }

  render() {
    const { view, name, nameEmpty, spaceError} = this.state;
    const { privileges, roles, actionEditRole } = this.props;

    return (
      <>
        <div className={styles.list}>
          { view === 'list' && (
          <Panel title="settings.roles.title" defaultTitle="Roles">
            <Permissions allowed={['add_role']}>
              <div className={styles.newButton}>
                <Button onClick={this.handleNew} translationID="settings.roles.add"
                  defaultText="New Role" action="primary"
                />
              </div>
            </Permissions>
            {roles.map(e => (
              <div key={e.id}>
                <Collapsible title={e.name} styleClasses={styles.rol}>
                  <RoleForm
                    role={e}
                    privileges={privileges}
                    handleNameChange={this.handleNameChange}
                    handleCheckboxChange={this.handleCheckboxChange}
                    handleSave={() => this.handleCreate(e.id)}
                    handleCancel={this.handleCancel}
                    apiStatus={actionEditRole}
                  />
                  {/* {console.log(privileges)} */}
                </Collapsible>
              </div>
            ))}
          </Panel>
          )}
          { view === 'new' && (
          <RoleForm
            role={{ name, permissions: [] }}
            privileges={privileges}
            handleNameChange={this.handleNameChange}
            handleCheckboxChange={this.handleCheckboxChange}
            handleSave={() => this.handleCreate()}
            handleCancel={this.handleCancel}
            nameEmpty={nameEmpty}
            spaceError={spaceError}
          />
          )}
        </div>
      </>
    );
  }
}

Roles.propTypes = {
  privileges: PropTypes.shape({}).isRequired,
  actionFetchPrivileges: PropTypes.func.isRequired,
  actionCreate: PropTypes.func.isRequired,
  actionEditRole: PropTypes.shape({})
};


const mapStateToProps = state => ({
  roles: state.settings.roles,
  privileges: state.settings.privileges,
  actionPrivileges: state.settings.actionPrivileges,
  actionCreateRole: state.settings.actionCreateRole,
  actionEditRole: state.settings.actionEditRole,
  rolesAction: state.settings.rolesAaction
});

const mapDispatchToProps = dispatch => ({
  // Fetch Roles
  actionFetch: () => {
    dispatch(fetchRoles());
  },
  // Fetch Privileges
  actionFetchPrivileges: () => {
    dispatch(fetchPrivileges());
  },
  actionCreate: (data) => {
    dispatch(createRole(data));
  },
  actionEdit: (id, data) => {
    dispatch(editRole(id, data));
  },
  actionClear: () => {
    dispatch(clear());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Roles);
