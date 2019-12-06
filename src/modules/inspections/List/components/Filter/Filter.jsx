import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';


import Select from '../../../../../components/select';
import Button from '../../../../../components/button';
import Collapsible from '../../../../../components/collapsible/Collapsible';
import styles from './filter.module.scss';

export const formatDate = date => date.toLocaleDateString(
  'en-US',
  {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
);

class Filter extends Component {
  state = {
    // eslint-disable-next-line react/destructuring-assignment
    selected: this.props.filterOptions[0],
    title: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
    selectionRange: {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    },
    init: false
  };

  child = React.createRef();

  static getDerivedStateFromProps(props, state) {
    const { range, dates } = props;
    if (!state.init) {
      if (range) {
        return { title: range, init: true };
      }
      if (dates[0]) {
        return {
          title: `${formatDate(new Date(`${dates[0]}T00:00`))} -  ${formatDate(new Date(`${dates[1]}T00:00`))}`,
          init: true
        };
      }
    }
    return state;
  }


  handleChange = (e) => {
    const { onFilterChange } = this.props;
    this.setState({ selected: e });
    onFilterChange(e);
  }

  handleDateChange = (ranges) => {
    this.setState({
      selectionRange: {
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate,
        key: 'selection'
      }
    });
  }

  equalDates = (d1, d2) => (
    d1.getFullYear() === d2.getFullYear()
    && d1.getDate() === d2.getDate()
    && d1.getMonth() === d2.getMonth()
  )

  applyFilters = () => {
    const { onDateChange } = this.props;
    const { selectionRange: { startDate, endDate } } = this.state;
    const range = document.getElementsByClassName('rdrStaticRange rdrStaticRangeSelected')[0];
    let rangeName;
    if (range) { 
      rangeName = range.childNodes[0].textContent; 
    } else {
      const sd = formatDate(startDate);
      const ed = formatDate(endDate);
      if (this.equalDates(startDate, endDate)) {
        rangeName = sd;
      } else {
        rangeName = `${sd} -  ${ed}`;
      }
    }

    this.setState({ title: rangeName});

    onDateChange(startDate, endDate, rangeName);
    this.child.current.onItemClick();
  }

  render() {
    const { selected, selectionRange, title } = this.state;
    const { filterOptions } = this.props;
    return (
      <div className={styles.filter}>
        <Select value={selected}
          options={filterOptions} onChange={this.handleChange}
        />
        <div className={styles.right}>
          <Collapsible
            ref={this.child}
            styleClasses={styles.dateHeader}
            title={title}
          >
            <div className={styles.pickerWrapper}>
              <DateRangePicker
                ranges={[selectionRange]}
                onChange={this.handleDateChange}
                rangeColors={['rgba(58, 97, 168, 0.67)']}
                color="rgba(58, 97, 168, 0.67)"
              />
              <Button onClick={this.applyFilters}
                translationID="inspections.filter.apply"
                defaultText="Apply"
                action="secondary"
              />
            </div>

          </Collapsible>
          
          {/* <Separator /> */}
          <div className={styles.viewSelector}>
            {/* <a href="/#" className={styles.active}>List</a> */}
            {/* <a href="/#">Time</a>
            <a href="/#">Board</a> */}
          </div>
          {/* <Separator /> */}
      
          {/* <a className={styles.filters} href="/#">Filters</a> */}
        </div>
      </div>
    );
  }
}

/**
 *  Proptypes and default props
 */
Filter.propTypes = {
  onDateChange: PropTypes.func.isRequired
};

Filter.defaultProps = {

};

export default Filter;

const Separator = () => <div className={styles.separator} />;
