import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchInspectionList } from '../redux/actions';
import SectionHeader from '../../../components/sectionHeader';
import cog from '../../../components/settingsHeader/icons/settings.svg';

import HeaderBack from '../../../components/headerBack';
import { INSPECTIONS_HOME_ROUTE } from '../../../constants/RouterConstants';
import { importAllImages } from '../../../utils/helpers';

import headerStyles from '../../../components/sectionHeader/header.module.scss';
import styles from './inspection.module.scss';


class InspectionStart extends Component {
  constructor(props) {
    super(props);
    this.images = importAllImages(require.context('../../../icons/inspection-icons', false, /\.(png|jpe?g|svg)$/));
    this.state = {section: ''};
  }

  componentWillMount() {
    const { actionFetch } = this.props;
    actionFetch();
  }

  goToInspection(id) {
    const { history } = this.props;
    history.push(`${INSPECTIONS_HOME_ROUTE}${id}/complete`);
  }

  filterInspectionList = (filter) => {
    const { actionFetch } = this.props;
    this.setState({section: filter})
    actionFetch(filter);
  }

  render() {
    const { inspections, translations, user } = this.props;
    const translationMap = (translations && translations[user.language])
      ? translations[user.language] : {};
    const { section}= this.state

    return (
      <>
        <SectionHeader
          icon={cog}
          translationID="inspections.start_inspection.title"
          defaultTitle="Start Inspection"
          centered
        >
          <div className={headerStyles.navigation}>
            <NavLink activeClassName={section === '' ? headerStyles.active : '' } to="/ops/inspections/start" onClick={()=>{this.filterInspectionList('')}}>
              <FormattedMessage id="inspections.start_inspection.all" defaultMessage="All" />
            </NavLink>
            <NavLink activeClassName={section === 'daily' ? headerStyles.active : ''} to="/ops/inspections/start"  onClick={()=>{this.filterInspectionList('daily')}}>
              <FormattedMessage id="inspections.start_inspection.daily" defaultMessage="Daily" />
            </NavLink>
            <NavLink activeClassName={section === 'weekdays' ? headerStyles.active : '' } to="/ops/inspections/start" onClick={()=> {this.filterInspectionList('weekdays')}} >
              <FormattedMessage id="inspections.start_inspection.weekdays" defaultMessage="Weekdays" />
            </NavLink>
            <NavLink activeClassName={section === 'weekly' ? headerStyles.active : '' } to="/ops/inspections/start" onClick={()=> {this.filterInspectionList('weekly')}} >
              <FormattedMessage id="inspections.start_inspection.weekly" defaultMessage="Weekly" />
            </NavLink>
            <NavLink activeClassName={section === 'monthly' ? headerStyles.active : '' } to="/ops/inspections/start" onClick={()=>{this.filterInspectionList('monthly')}}>
              <FormattedMessage id="inspections.start_inspection.monthly" defaultMessage="Monthly" />
            </NavLink>
            <NavLink activeClassName={section === 'yearly' ? headerStyles.active : '' } to="/ops/inspections/start" onClick={()=> {this.filterInspectionList('yearly')}} >
              <FormattedMessage id="inspections.start_inspection.yearly" defaultMessage="Yearly" />
            </NavLink>
          </div>
        </SectionHeader>
        <HeaderBack
          translationID="inspections.start.inspections.back"
          translationDefault="Back to Inspections"
          backRoute={INSPECTIONS_HOME_ROUTE}
        />
        <div className={styles.inspection_list}>
          <img className={styles.title_img} src={cog} alt="inspection_list_icon" />
          <h3 className={styles.title}>
            <FormattedMessage id="inspections.start_inspection.list_title" defaultMessage="What type of inspection would you like to do?" />
          </h3>
          <div className={styles.inspection_list__item_container}>
            {inspections.map(inspection => (
              <div
                tabIndex="0"
                key={inspection.id}
                role="button"
                onKeyPress={() => { this.goToInspection(inspection.id); }}
                onClick={() => { this.goToInspection(inspection.id); }}
                className={styles.inspection_list__item}
              >
              {inspection.icon.includes(".png") ?
                  <img src={this.images[inspection.icon]} alt="insptection_icon" /> :
                  <img src={this.images[`${inspection.icon}.svg`]} alt="insptection_icon" />}
                <span>{ translationMap[inspection.title] || inspection.title }</span>
                <div className={styles.tags}>
                          <div  className={` ${styles.statusContainer} ${inspection.answer_status === 0 ? styles.draft : ''}`}>
                            {inspection.answer_status === 0 ? (
                              <FormattedMessage id="inspections.step0.draft" defaultMessage="Draft" />
                            ) : ''}
                          </div>
                </div>
            </div>
            ))}
        </div>
        </div> 
      </>
    )
  }
}

InspectionStart.propTypes = {
  actionFetch: PropTypes.func.isRequired,
  inspections: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  history: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
  inspections: state.inspection.inspectionList.results,
  translations: state.auth.translations,
  user: state.auth.profile
});

const mapDispatchToProps = dispatch => ({
  // Fetch inspection list
  actionFetch: (id) => {
    dispatch(fetchInspectionList(id ? id : ''));
  }
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionStart));
