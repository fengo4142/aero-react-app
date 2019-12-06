/* eslint-disable no-restricted-syntax */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Permissions from 'react-redux-permissions';
import styles from './header.module.scss';
import cog from './icons/settings.svg';

const SettingsHeader = () => {
  const hideBar = (event) => {
    const bar = document.getElementsByClassName('main-header');
    for (const b of bar) {
      b.classList.toggle('collapsed');
    }
    event.target.classList.toggle(styles.collapsed);
  };

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <img src={cog} alt="settings Icon" />
        <h1><FormattedMessage id="section.title" defaultMessage="Organization Settings" /></h1>
      </div>
      <div className={styles.navigation}>
        <LocalizedLink id="settings.nav.details" defaultMessage="Airport Details" to="/settings/organization" />
        {/* <LocalizedLink id="settings.nav.feeds" defaultMessage="Data Feeds" to="/settings/datafeeds" /> */}
        {/* <LocalizedLink id="settings.nav.surfaces" defaultMessage="Airfield Surfaces" to="/settings/surfaces" /> */}
        {/* <LocalizedLink id="settings.nav.shift" defaultMessage="Shift" to="/settings/shift" /> */}
        <Permissions allowed={['add_aerosimpleuser', 'change_aerosimpleuser']}>
          <LocalizedLink id="settings.nav.users" defaultMessage="Users" to="/settings/users" />
        </Permissions>
        <Permissions allowed={['view_role']}>
          <LocalizedLink id="settings.nav.roles" defaultMessage="Roles" to="/settings/roles" />
        </Permissions>
        <LocalizedLink id="settings.nav.timezone" defaultMessage="Timezone" to="/settings/timezone" />
        <LocalizedLink id="settings.nav.language" defaultMessage="Language" to="/settings/language" />
      </div>
      <button type="button" className={styles.hideArrow} onClick={hideBar}>collapse</button>
    </div>
  );
};

export default SettingsHeader;

const LocalizedLink = ({ to, id, defaultMessage }) => (
  <NavLink activeClassName={styles.active} to={to}>
    <FormattedMessage id={id} defaultMessage={defaultMessage} />
  </NavLink>
);

LocalizedLink.propTypes = {
  to: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string.isRequired
};
