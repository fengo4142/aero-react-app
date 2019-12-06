/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import Datetime from 'react-datetime';
import moment from 'moment';
import styles from './scheduler.module.scss';
import ColorSelect from '../colorSelect/colorSelect';
import eventIcon from '../../icons/event.svg';
import Day from './Day';
import MonthYearSelector from './MonthYearSelector';
import Collapsible from '../collapsible/Collapsible';
import parseRRule from './utils';


const Scheduler = ({ title, rules, onScheduleChange, selected, intl }) => {
  const frequencyOptions = [
    { key: 'DAILY', name: intl.formatMessage({ id: 'schedule.frequency.day' }) },
    { key: 'WEEKLY', name: intl.formatMessage({ id: 'schedule.frequency.week' }) },
    { key: 'MONTHLY', name: intl.formatMessage({ id: 'schedule.frequency.month' }) },
    { key: 'YEARLY', name: intl.formatMessage({ id: 'schedule.frequency.year' }) }
  ];

  // Hooks
  const [rule, setRule] = useState();
  const [defaultValues, setDefaultValues] = useState();
  const [frequency, setfrequency] = useState(frequencyOptions[1]);
  const [interval, setScheduleInterval] = useState(1);
  const [monthParams, setMonthParams] = useState();
  const [endPeriod, setEndPeriod] = useState();
  const endPeriodCollapse = useRef(null);
  const [daysMap, setDaysMap] = useState(
    { SU: false,
      MO: false,
      TU: false,
      WE: false,
      TH: false,
      FR: false,
      SA: false }
  );

  useEffect(() => {
    if (selected) {
      const defValues = parseRRule(rules, frequencyOptions, selected.rule);
      setDefaultValues(defValues);
      (defValues.rule) && setRule(defValues.rule);
      (defValues.frequency) && setfrequency(defValues.frequency);
      (defValues.interval) &&  setScheduleInterval(defValues.interval);
      (defValues.days) && setDaysMap(defValues.days);
      (selected.end_recurring_period) && setEndPeriod(
        moment.utc(selected.end_recurring_period)
      );
    }
  }, []);

  // Adding custom option to rules
  const therules = [{key: 'None', name: 'None'}, ...rules, { key: 'custom', name: 'Custom' }];


  const daysOptions = [
    { id: 'SU', code: 'schedule.day.sunday.code' },
    { id: 'MO', code: 'schedule.day.monday.code' },
    { id: 'TU', code: 'schedule.day.tuesday.code' },
    { id: 'WE', code: 'schedule.day.wednesday.code' },
    { id: 'TH', code: 'schedule.day.thursday.code' },
    { id: 'FR', code: 'schedule.day.friday.code' },
    { id: 'SA', code: 'schedule.day.saturday.code' }
  ];

  // every time that one of [rule, daysMap, frequency] changes,
  // it calls the funciton.
  useEffect(() => {
    if (rule && rule.key === 'custom') {
      let params;
      if (frequency && frequency.key === 'WEEKLY') {
        const days = Object.keys(daysMap).filter(k => daysMap[k]).join(',');
        params = `BYWEEKDAY:${days};INTERVAL:${interval}`;
      } else {
        params = `${monthParams};INTERVAL:${interval}`;
      }
      onScheduleChange({ undefined, endPeriod, frequency: frequency.key, params });
    } 
    else if (rule && rule.key != 'None') {
      let param;
      if(rule && (rule.name === 'Daily' || rule.name === 'Weekday')) {
        onScheduleChange({ id: rule.key, endPeriod, frequency: undefined, params: undefined });
      } 
      if (rule && rule.name === 'Weekly') {
        const days = Object.keys(daysMap).filter(k => daysMap[k]).join(',');
        setScheduleInterval('1')
        param = `BYWEEKDAY:${days};INTERVAL:${interval}`;
        onScheduleChange({ undefined, endPeriod, frequency:rule.name.toUpperCase(), params:param});
      }
      if (rule && (rule.name === 'Monthly'  || rule.name === 'Yearly')) {
        param = `${monthParams};INTERVAL:${interval}`;
        setScheduleInterval('1')
        onScheduleChange({ undefined, endPeriod, frequency:rule.name.toUpperCase(), params:param});
      }
    } 
    else if (rule && rule.key === 'None') {
      onScheduleChange();
    }

  }, [rule, daysMap, frequency, interval, monthParams, endPeriod]);
  

  return (
    <div className={styles.scheduler}>
      <div className={styles.title}>
        <FormattedMessage id={title} defaultMessage={title} />
      </div>
      <div className={styles.col}>
        <label>
          <FormattedMessage id="schedule.title.time" defaultMessage="time to be repeated" />
          <ColorSelect value={rule ? rule : therules[0]} options={therules} 
            onChange={e => setRule(e)} bordered
          />
        </label>
      </div>
      <div className={`${styles.col} ${styles.infoRepeat}`}>
        {rule ? (
          <>
            {rule && (rule.name === "Daily" || rule.name === "Weekday" ) && 
              <div>
               <img src={eventIcon} alt="event" />
              {`This task will be repeated ${rule.name} ${endPeriod ? 'until ' : ''}`}
              <Collapsible ref={endPeriodCollapse} styleClasses={styles.endPeriod}
                title={(endPeriod && endPeriod.format('MM/DD/YYYY')) || 'forever'}
              >
                <div>
                  <Datetime
                    input={false}
                    defaultValue={endPeriod}
                    open timeFormat={false}
                    closeOnSelect
                    isValidDate={(current) => {
                      const yesterday = Datetime.moment().subtract(1, 'day');
                      return current.isAfter(yesterday);
                    }}
                    onChange={(e) => {
                      setEndPeriod(e);
                      endPeriodCollapse.current.onItemClick();
                    }}
                    id="endPeriod"
                  />
                </div>
              </Collapsible>
              </div> 
            }
          {rule && (rule.name === "Weekly"  || rule.frequency === "WEEKLY") && (
          <label>
            Days
            <div className={styles.days}>
              {daysOptions.map(d => (
                <Day day={d} active={daysMap[d.id]}
                  onClick={id => setDaysMap({ ...daysMap, [id]: !daysMap[id] })}
                />
              ))}
            </div>
          </label>
          )}
          {rule && ( rule.name === "Yearly" || rule.name === "Monthly") && (rule.frequency === 'YEARLY' || rule.frequency === 'MONTHLY') && (
            <MonthYearSelector values={defaultValues}
              type={rule.frequency} onSelect={setMonthParams}
            />
          )}
          </>
        )
          : (
            <FormattedMessage tagName="p"
              id="schedule.repeat.none" defaultMessage="This task will not be repeated"
            />
          )}
      </div>
      {rule && rule.key === 'custom'  && (
      <div className={styles.custom}>
        <div className={styles.col}>
          <label>
            <FormattedMessage id="schedule.repeat.title" defaultMessage="Repeat Every" />
            <div className={styles.inputs}>
              <input type="number" defaultValue={interval}
                onChange={e => setScheduleInterval(e.target.value)}
              />
              <ColorSelect value={frequency} options={frequencyOptions}
                onChange={setfrequency} bordered
              />
            </div>
          </label>
        </div>
        <div className={styles.col}>
          {frequency && frequency.key === 'WEEKLY' && (
          <label>
            Days
            <div className={styles.days}>
              {daysOptions.map(d => (
                <Day day={d} active={daysMap[d.id]}
                  onClick={id => setDaysMap({ ...daysMap, [id]: !daysMap[id] })}
                />
              ))}
            </div>
          </label>
          )}
          {frequency && (
            frequency.key === 'MONTHLY' || frequency.key === 'YEARLY') && (
            <MonthYearSelector values={defaultValues}
              type={frequency.key} onSelect={setMonthParams}
            />
          )}
        </div>
      </div>
      )}
    </div>
  );
};

Scheduler.propTypes = {
  title: PropTypes.string.isRequired
};
export default injectIntl(Scheduler);
