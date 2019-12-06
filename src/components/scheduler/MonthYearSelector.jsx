import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './scheduler.module.scss';
import ColorSelect from '../colorSelect';

const MonthYearSelector = ({ values, type, onSelect }) => {
  const setposOptions = [
    { key: 1, name: 'First' },
    { key: 2, name: 'Second' },
    { key: 3, name: 'Third' },
    { key: 4, name: 'Fourth' },
    { key: -1, name: 'Last' }
  ];

  const bydayOptions = [
    { key: 'SU', name: 'Sunday' },
    { key: 'MO', name: 'Monday' },
    { key: 'TU', name: 'Tuesday' },
    { key: 'WE', name: 'Wednesday' },
    { key: 'TH', name: 'Thursday' },
    { key: 'FR', name: 'Friday' },
    { key: 'SA', name: 'Saturday' },
    { key: 'SU,MO,TU,WE,TH,FR,SA', name: 'Day' },
    { key: 'MO,TU,WE,TH,FR', name: 'Weekday' },
    { key: 'SU,SA', name: 'Weekend day' }
  ];

  const bymonthOptions = [
    { key: 1, name: 'Jan' }, { key: 2, name: 'Feb' }, { key: 3, name: 'Mar' },
    { key: 4, name: 'Apr' }, { key: 5, name: 'May' }, { key: 6, name: 'Jun' },
    { key: 7, name: 'Jul' }, { key: 8, name: 'Aug' }, { key: 9, name: 'Sep' },
    { key: 10, name: 'Oct' }, { key: 11, name: 'Nov' }, { key: 12, name: 'Dec' }
  ];

  // hooks
  const [option, setOption] = useState('day');
  const [setpos, updateSetpos] = useState(setposOptions[0]);
  const [byMonthDay, setByMonthDay] = useState(1);
  const [byday, setByday] = useState(bydayOptions[0]);
  const [bymonth, setBymonth] = useState(bymonthOptions[0]);

  useEffect(() => {
    if (values) {
      if (values.monthDay) {
        setOption('day'); setByMonthDay(values.monthDay);
      } else {
        setOption('on_the');
      }
      if (values.days) {
        const selectedDay = Object.keys(values.days).find(d => values.days[d] === true);
        setByday(bydayOptions.find(op => op.key === selectedDay));
      }
      if (values.setpos) {
        updateSetpos(setposOptions.find(op => op.key === parseInt(values.setpos, 10)));
      }
      if (values.month) {
        setBymonth(bymonthOptions.find(op => op.key === parseInt(values.month, 10)));
      }
    }
  }, []);

  useEffect(() => {
    let result = '';
    if (option === 'day') {
      if (byMonthDay) result += `BYMONTHDAY:${byMonthDay};`;
    } else {
      if (setpos) result += `BYSETPOS:${setpos.key};`;
      if (byday) result += `BYWEEKDAY:${byday.key};`;
    }
    if (type === 'YEARLY' && bymonth) result += `BYMONTH:${bymonth.key};`;
    onSelect(result);
  });

  return (
    <div className={styles.month}>
      <div className={styles.selector}>
        <label>
          <input type="radio" name="day" value="day"
            checked={option === 'day'} onChange={e => setOption(e.target.value)}
          />
          On day
        </label>
        <label>
          <input type="radio" name="on_the" value="on_the"
            checked={option === 'on_the'} onChange={e => setOption(e.target.value)}
          />
          On the
        </label>
      </div>
      {option === 'day' && (
        <label className={styles.daysCombos}>
          <input type="number" min="1" max="31" value={byMonthDay}
            onChange={e => setByMonthDay(e.target.value)}
          />
          {type === 'YEARLY' && (
          <ColorSelect value={bymonth} options={bymonthOptions}
            onChange={setBymonth} bordered
          />
          )}
        </label>
      )}
      {option === 'on_the' && (
        <div className={styles.daysCombos}>
          <ColorSelect value={setpos} options={setposOptions}
            onChange={updateSetpos} bordered
          />
          <ColorSelect value={byday} options={bydayOptions}
            onChange={setByday} bordered
          />
          {type === 'YEARLY' && (
          <ColorSelect value={bymonth} options={bymonthOptions}
            onChange={setBymonth} bordered
          />
          )}
        </div>
      )}
    </div>
  );
};

MonthYearSelector.propTypes = {
  onSelect: PropTypes.func.isRequired
};
export default MonthYearSelector;
