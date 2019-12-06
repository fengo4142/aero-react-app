import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './profile.module.scss';
import UserImg from '../../../icons/default_avatar.jpg'

class Profile extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.state = {
      profileDropdown: false
    };
  }

  handleClick() {
    if (!this.state.profileDropdown) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState(prevState => ({
      profileDropdown: !prevState.profileDropdown,
    }));
  }
  
  handleOutsideClick(e) {
    // ignore clicks on the component itself
    try {
      if (this.node.contains(e.target)) {
        return;
      }
      this.handleClick();
    } catch(ex) {
      // nothing
    }
  }

  render() {
    const { profileDropdown } = this.state;
    const { profile, logout } = this.props;
    return (
      <div className={styles.profile} ref={node => { this.node = node; }}>
        <img src={ profile.image ? profile.image : UserImg } alt={ profile.fullname } />
        <button type="button" onClick={this.handleClick}>
          { profile.fullname }
        </button>
        {this.state.profileDropdown && (
          <ul className={`${styles.dropdown} ${profileDropdown ? styles.open : ''}`}>
            <li className={styles.item}>
              <Link to="/profile"  onClick={() => this.handleClick()}>Profile</Link>
            </li>
            <li className={styles.item}>
              <Link to="/profile/changePassword" onClick={this.handleClick}>Change Password</Link>
            </li>
            <li className={styles.item}>
              <button type="button" onClick={logout} style={{ color: 'black' }}>
                Log Out
              </button>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

Profile.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string
  }).isRequired,
  logout: PropTypes.func.isRequired
};

export default Profile;
