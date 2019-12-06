/* eslint-disable no-restricted-syntax */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import styles from './header.module.scss';

const SectionHeader = ({ icon, translationID, defaultTitle, centered, children }) => {
  const hideBar = (event) => {
    const bar = document.getElementsByClassName('main-header');
    for (const b of bar) {
      b.classList.toggle('collapsed');
    }
    event.target.classList.toggle(styles.collapsed);
  };

  let headerStyles;
  if (centered) {
    headerStyles = `${styles.header} ${styles.center}`;
  } else {
    headerStyles = `${styles.header}`;
  }

  return (
    <div className={headerStyles}>
      <div className={styles.title}>
        <img src={icon} alt="Icon" />
        <h1><FormattedMessage id={translationID} defaultMessage={defaultTitle} /></h1>
      </div>
      {children}
      <button type="button" className={styles.hideArrow} onClick={hideBar}>collapse</button>
    </div>
  );
};

SectionHeader.defaultProps = {
  centered: false,
  children: []
};

SectionHeader.propTypes = {
  icon: PropTypes.string,
  translationID: PropTypes.string.isRequired,
  defaultTitle: PropTypes.string,
  centered: PropTypes.bool,
  children: PropTypes.node
};

export default SectionHeader;
