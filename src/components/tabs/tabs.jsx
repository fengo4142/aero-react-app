/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Clickable from '../clickable/Clickable';

import styles from './tabs.module.scss';

class Tabs extends Component {
  state = {
    tabSelected: 0
  }

  goTo = (id) => {
    this.setState({ tabSelected: id });
  }

  render() {
    const { children } = this.props;
    const { tabSelected } = this.state;

    return (
      <div className={styles.tabs}>
        <div className={styles.head}>
          {children.map((ch, idx) => (
            <Clickable key={idx} className={idx === tabSelected ? styles.active : ''}
              onClick={() => this.goTo(idx)}
            >
              {ch.props.label}
            </Clickable>
          ))}
        </div>
        <div className={styles.body}>
          {children[tabSelected]}
        </div>
      </div>
    );
  }
}
export default Tabs;
