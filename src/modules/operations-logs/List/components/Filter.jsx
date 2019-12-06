/* global localStorage */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-date-range';
import moment from 'moment';
import Collapsible from '../../../../components/collapsible/Collapsible';
import Button from '../../../../components/button';
import Separator from '../../../../components/separator';
import styles from '../../../inspections/List/components/Filter/filter.module.scss';
import { formatDate } from '../../../inspections/List/components/Filter/Filter';

const Filter = ({ dates, onDateChange }) => {
  // Hooks
  const [selectionRange, setSelectionRange] = useState({
    startDate: dates[0],
    endDate: dates[1],
    key: 'selection'
  });

  const [title, setTitle] = useState('Today');
  const child = useRef(null);

  useEffect(() => {
    let theTitle = localStorage.getItem('log_range');
    if (!theTitle) {
      theTitle = `${dates[0].format('MMM DD, YYYY')} -  ${dates[1].format('MMM DD, YYYY')}`;
    }
    setTitle(theTitle);
  }, []);

  const equalDates = (d1, d2) => (
    d1.getFullYear() === d2.getFullYear()
    && d1.getDate() === d2.getDate()
    && d1.getMonth() === d2.getMonth()
  );

  const applyFilters = () => {
    const therange = document.getElementsByClassName('rdrStaticRange rdrStaticRangeSelected')[0];
    let rangeName;

    if (therange) {
      rangeName = therange.childNodes[0].textContent;
    } else {
      const sd = formatDate(selectionRange.startDate);
      const ed = formatDate(selectionRange.endDate);
      if (equalDates(selectionRange.startDate, selectionRange.endDate)) {
        rangeName = sd;
      } else {
        rangeName = `${sd} -  ${ed}`;
      }
    }

    setTitle(rangeName);

    onDateChange(
      moment(selectionRange.startDate).format('YYYY-MM-DD'),
      moment(selectionRange.endDate).format('YYYY-MM-DD'),
      therange ? therange.childNodes[0].textContent : undefined
    );
    child.current.onItemClick();
  };

  const handleDateChange = (ranges) => {
    setSelectionRange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
      key: 'selection'
    });
  };
  return (
    <div className={`${styles.filter} ${styles.onlyRight}`}>
      <div className={styles.right}>
        <Collapsible ref={child} styleClasses={styles.dateHeader} title={title}>
          <div className={styles.pickerWrapper}>
            <DateRangePicker
              ranges={[selectionRange]}
              onChange={handleDateChange}
              rangeColors={['rgba(58, 97, 168, 0.67)']}
              color="rgba(58, 97, 168, 0.67)"
            />
            <Button onClick={applyFilters}
              translationID="inspections.filter.apply"
              defaultText="Apply"
              action="secondary"
            />
          </div>
        </Collapsible>
        <Separator />
      </div>
    </div>
  );
};

Filter.propTypes = {
  onDateChange: PropTypes.func.isRequired,
  dates: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};
export default Filter;
