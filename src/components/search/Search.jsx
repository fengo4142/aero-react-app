/* global FormData */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './search.module.scss';
import search from '../../icons/search.svg';
import IconButton from '../iconButton';

const Search = ({ onSubmit }) => {
  const [active, setActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target).get('query');
    onSubmit(data);
  };

  return (
    <div className={styles.search}>
      <form onSubmit={handleSubmit} className={`${styles.form} ${active ? styles.active : ''}`}>
        <input type="text" placeholder="Search" name="query" autoComplete="off" />
      </form>
      <IconButton icon={search} onClick={() => setActive(true)} />
    </div>
  );
};

Search.propTypes = {
  onSubmit: PropTypes.func.isRequired
};
export default Search;
