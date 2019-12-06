import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import styles from './panel.module.scss';


const Panel = ({ containerClasses, title, defaultTitle, children, translationValues, display }) => (
  <div className={`${styles.panel} ${containerClasses}`}>
    <div className={styles.title}>
      <FormattedMessage
        id={title}
        defaultMessage={defaultTitle}
        values={translationValues}
      /> <span> {display} </span>
    </div>
    <div className={styles.content}>
      {children}
    </div>
  </div>
);

Panel.defaultProps = {
  containerClasses: '',
  translationValues: {}
};

Panel.propTypes = {
  containerClasses: PropTypes.string,
  title: PropTypes.string.isRequired,
  defaultTitle: PropTypes.string.isRequired,
  translationValues: PropTypes.shape({}),
  children: PropTypes.node.isRequired
};
export default Panel;
