import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import styles from './paginator.module.scss';

// Custom hook
const useCounter = ({ defaultValue, max }) => {
  const [counter, setCounter] = useState(defaultValue);

  const handleChangeCounter = (value) => {
    const val = Math.min(Math.max(1, value), max);
    setCounter(val);
  };

  return [counter, handleChangeCounter];
};

const Paginator = ({ max, onChange }) => {
  const [active, setActive] = useCounter({ defaultValue: 1, max });
  const range = [active - 1, active, active + 1].filter(e => e > 0 && e <= max);

  useEffect(() => { onChange(active); }, [active]);

  return (
    <div className={styles.paginator}>
      {range.map(n => (
        <>
          <button className={n === active ? styles.active : ''}
            onClick={() => setActive(n)} type="button"
          >
            {n}
          </button>
        </>
      ))}
      {active < max - 2 && ('...')}
      {active < max - 1 && (
      <button onClick={() => setActive(max)} type="button">
        {max}
      </button>
      )}
    </div>
  );
};

Paginator.propTypes = {
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};
export default Paginator;
