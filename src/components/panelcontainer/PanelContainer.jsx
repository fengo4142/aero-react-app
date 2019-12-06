import React from 'react';
import PropTypes from 'prop-types';

import styles from './panelcontainer.module.scss';

const PanelContainer = ({ containerClasses, children, }) => (
  <div className={`${styles.panel} ${containerClasses}`}>

    <div className={styles.content}>
      {children}
    </div>
  </div>
);

PanelContainer.defaultProps = {
  containerClasses: '',
};

PanelContainer.propTypes = {
  containerClasses: PropTypes.string,
};
export default PanelContainer;
