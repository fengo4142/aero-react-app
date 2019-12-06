/* global localStorage */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from '../../../components/modal'
import { FormattedMessage } from 'react-intl';
import Permissions from 'react-redux-permissions';
import AmazonDateParser from 'amazon-date-parser';
import { getDatesFromRange } from '../../../utils/helpers';

import { fetchInspectionAnswers } from '../redux/actions';
import { fetchsummary } from '../redux/actions';
/** ******************************************************************
 *  Components import
 * ***************** */

import Button from '../../../components/button';
import IconButton from '../../../components/iconButton';
import SectionHeader from '../../../components/sectionHeader';
import Filter from './components/Filter/Filter';
import Table from './components/Table/Table';

/** ******************************************************************
 *  Assets import
 * ************* */

import settings from '../../../icons/settings.svg';
// import search from '../../../icons/search.svg';
import Search from '../../../components/search/Search';
import preset from '../../../icons/Preset.svg';

import styles from '../inspections.module.scss';
import { INSPECTIONS_HOME_ROUTE } from '../../../constants/RouterConstants'

class InspectionList extends Component {
  state = {
    date1: undefined,
    date2: undefined,
    range: undefined,
    filter: undefined,
    showModal: false
  }
  show_weather_modal = () => {
    this.setState({showModal:true})
  };

  closeModal = () => {
    this.setState({showModal: false})
  }

  componentDidMount() {
    const { actionFetchSummary} = this.props;
    actionFetchSummary();
    const {
      actionFetch,
      history: { location: { state } } } = this.props;
    if (state && state.intent === 'ViewInspections') {
      const dates = AmazonDateParser(state.slots.date);
      this.handleDateChange(dates.startDate, dates.endDate);
    } else {
      const range = localStorage.getItem('range');
      let date1 = new Date().toISOString().slice(0, 10);
      let date2 = new Date().toISOString().slice(0, 10);

      if (range) {
        [date1, date2] = getDatesFromRange(range);
      } else {
        date1 = localStorage.getItem('start_date');
        date2 = localStorage.getItem('end_date');
        console.log("Date"+date1);
      }

      const inspectionFilter = localStorage.getItem('inspectionFilter');
      let filter = undefined;
      if(inspectionFilter) {
        filter = { key: 'key0', name: inspectionFilter};
        localStorage.removeItem('inspectionFilter');
      }
      this.setState({ date1, date2, range, filter });
      actionFetch(date1, date2);
    }
  }

  handleDateChange = (s, f, range) => {
    const { actionFetch } = this.props;
    const date1 = s.toISOString().slice(0, 10);
    const date2 = f.toISOString().slice(0, 10);
    localStorage.setItem('start_date', date1);
    localStorage.setItem('end_date', date2);
    if (range) {
      localStorage.setItem('range', range);
    } else {
      localStorage.removeItem('range');
    }
    this.setState({ date1, date2 });
    actionFetch(date1, date2);
  }

  handleFilterChange = (option) => {
    this.setState({ filter: option });
  }

  render() {
    const { history, answers, actionFetch, summary } = this.props;
    const { date1, date2, range, filter } = this.state;


    // console.log(this.state);
    this.filterOptions = [
      { key: '', name: 'All Inspections' },
       ...Array.from(new Set(answers.map(item => item.inspection))).map(
        (a, i) => ({ key: `k${i}`, name: a })
      )];


    const filteredAnswers = filter && filter.key
      ? answers.filter(e => e.inspection === filter.name)
      : answers;

    let issues = 0;

    filteredAnswers.forEach(answer => {
      issues += answer.issues;
    });
    const next_inspection = summary && summary.task && summary.task != '' ? summary.task : '-'
    const weather = summary && summary.weather && summary.weather.summary ? summary.weather.summary + ', ' + summary.weather.temperature : '-º'
    const weather_information = summary && summary.weather && summary.weather.summary ? summary.weather : '-'
    return (
      <>
        <SectionHeader icon={preset} translationID="inspections.title" defaultTitle="Inspections">
          <div className={styles.detailHeader}>
            <Search onSubmit={query => actionFetch(date1, date2, query)} />
            <Permissions allowed={['add_inspectionparent', 'add_inspection']}>
              <IconButton icon={settings} onClick={() => { history.push(`${INSPECTIONS_HOME_ROUTE}new`); }} />
            </Permissions>
            <Separator />
            <Permissions allowed={['add_inspectionanswer']}>
              <Button translationID="inspections.newInspection" defaultText="New Inspection"
                onClick={() => { history.push(`${INSPECTIONS_HOME_ROUTE}start`); }}
              />
            </Permissions>
            <Separator />
          </div>
        </SectionHeader>
        <Filter
          filterOptions={this.filterOptions}
          onDateChange={this.handleDateChange}
          onFilterChange={this.handleFilterChange}
          dates={[date1, date2]} range={range}
        />
        <div className={styles.container}>
          <div className={styles.datasources}>
            <div className={styles.column}>
              <h5>{next_inspection}</h5>
              <FormattedMessage tagName="p" id="inspections.list.next_inspection" defaultMessage="NEXT INSPECTION" />
              <a href="/todo"><FormattedMessage id="inspections.list.view" defaultMessage="View" /></a>
            </div>
            <div className={styles.column}>
              <h5 dangerouslySetInnerHTML={{__html: weather}} />
              <FormattedMessage tagName="p" id="inspections.list.weather_insformation" defaultMessage="WEATHER INFORMATION" />
              <a href="javascript:" onClick = {()=> summary && summary.weather && summary.weather.summary ? this.show_weather_modal() : ''} ><FormattedMessage id="inspections.list.view" defaultMessage="View" /></a>
            </div>
            <Modal
              onClose={()=>this.closeModal()}
              showIn={this.state.showModal}
              width="50%"
              minHeight="45%">
                <div className={styles.modal}>
                  <table className={styles.table}>
                  <tr><td>SUMMARY</td><td><h5 dangerouslySetInnerHTML={{__html: weather_information.summary}}/></td></tr>
                  <tr><td>TEMPERATURE</td><td><h5 dangerouslySetInnerHTML={{__html: weather_information.temperature}}/></td></tr>
                  <tr><td>HUMIDITY</td><td><h5 dangerouslySetInnerHTML={{__html: weather_information.humidity}}/></td></tr>
                  <tr><td>PRESSURE</td><td><h5 dangerouslySetInnerHTML={{__html: weather_information.pressure}}/></td></tr>
                  <tr><td>VISIBILITY</td><td><h5 dangerouslySetInnerHTML={{__html: weather_information.visibility}}/></td></tr>
                  <tr><td>WIND</td><td><h5 dangerouslySetInnerHTML={{__html: weather_information.wind}}/></td></tr>
                  </table><br/>
                </div>
                <div className={`${styles.btn} ${styles.center}`} >
                  <Button type="secondary" translationID="inspections.list.ok" onClick={()=>this.closeModal()} defaultText="OK"/>
                </div>
            </Modal>
            <div className={styles.column}>
              <h2 className={styles.danger}>{issues}</h2>
              <FormattedMessage tagName="p" id="inspections.list.open_issues" defaultMessage="PENDIENTES" />
              <a href="/#"><FormattedMessage id="inspections.list.view" defaultMessage="View" /></a>
            </div>
          </div>
          <Table data={{ all_day: { label: 'All day', entries: filteredAnswers } }} />
        </div>
      </>
    );
  }
}

InspectionList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  answers: state.inspection.answers,
  action: state.inspection.action,
  summary: state.inspection.summary,
});

const mapDispatchToProps = dispatch => ({
  // Fetch inspection
  actionFetch: (day, day2, query) => {
    dispatch(fetchInspectionAnswers(day, day2, query));
  },
  actionFetchSummary: () => {
    dispatch(fetchsummary());
  },

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionList);

const Separator = () => <div className={styles.separator} />;
