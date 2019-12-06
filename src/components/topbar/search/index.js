import React, { Component } from 'react';
import {injectIntl} from 'react-intl';

import styles from './search.module.scss';
import btn from '../icons/search.svg';



class Search extends Component {
  render() {
  const {formatMessage} = this.props.intl;
  return (
    <form action="POST" className={styles.search}>
        <input type="text" placeholder={formatMessage({id: 'topbar.search'})} />
        <button type="submit">
        <img src={btn} alt="search"/>
        </button>
      </form>
    );
  }
}

export default injectIntl(Search);
