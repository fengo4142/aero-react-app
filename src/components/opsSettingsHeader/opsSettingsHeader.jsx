/* eslint-disable no-restricted-syntax */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './header.module.scss';
import cog from './icons/settings.svg';

const opsSettingsHeader = () => {
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
        <h1><FormattedMessage id="operation.section.title" defaultMessage="Operations Settings" /></h1>
      </div>
      <div className={styles.navigation}>
        <LocalizedLink id="settings.nav.surfaces" defaultMessage="Airfield Surfaces" to="/ops/settings" />
      </div>
      <button type="button" className={styles.hideArrow} onClick={hideBar}>collapse</button>
    </div>
  );
};

export default opsSettingsHeader;

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
