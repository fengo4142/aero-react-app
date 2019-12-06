import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Permissions from 'react-redux-permissions';

import styles from './shortcuts.module.scss';

const Shortcuts = ({ links }) => (
  <div className={`${styles.shortcuts} main-header`}>
    {links
      && links.map(l => l.permissions ? (
          <Permissions key={l.name} allowed={[...l.permissions]}>
            <Link key={l.name} to={l.url}>
              {l.name}
            </Link>
          </Permissions>
        ) : (
          <Link key={l.name} to={l.url}>
            {l.name}
          </Link>
        ))}
  </div>
);

Shortcuts.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Shortcuts;
