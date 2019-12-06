/* eslint-disable no-restricted-syntax */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import styles from './header.module.scss';

const SectionHeaderNoIcon = ({ translationID, defaultTitle, children }) => {

  let  headerStyles = `${styles.header}`;
  return (
    <div className={headerStyles} style={{background:"white", border:"1px solid #e6eaee"}}>
      <div className={styles.title}>
        <h3  style={{marginBottom:"40px"}}><FormattedMessage id={translationID} defaultMessage={defaultTitle} /></h3>
      </div>
      {children}
    </div>
  );
};

SectionHeaderNoIcon.defaultProps = {
  children: []
};

SectionHeaderNoIcon.propTypes = {
  translationID: PropTypes.string.isRequired,
  defaultTitle: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default SectionHeaderNoIcon;
