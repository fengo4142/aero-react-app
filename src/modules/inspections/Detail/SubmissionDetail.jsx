import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

/** ******************************************************************
 *  Redux import
 * ***************** */
import { INSPECTIONS_HOME_ROUTE,LOGS_HOME_ROUTE } from '../../../constants/RouterConstants';
import { fetchInspectionAnswer, clearInspectionAnswer, exportInspection, exportInspectionData } from '../redux/actions';

/** ******************************************************************
 *  Components import
 * ***************** */
import HeaderBack from '../../../components/headerBack';
import SectionHeader from '../../../components/sectionHeader';
import IconButton from '../../../components/iconButton';
import DataSummary from './components/DataSummary/DataSummary';
import AdditionalInformation from './components/AdditionalInformation/AdditionalInformation';
import Selector from './components/Selector/Selector';
import FieldDetail from './components/FieldDetail/FieldDetail';

/** ******************************************************************
 *  Assets import
 * ************* */

import styles from '../inspections.module.scss';
// import icon from '../../../icons/icon.svg';
// import search from '../../../icons/search.svg';
// import settings from '../../../icons/settings.svg';
import listview from '../../../icons/listview.svg';
import allview from '../../../icons/allview.svg';
import editIcon from '../../../icons/inspection-icons/edit.svg';

class SubmissionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeInspectionField: undefined,
      view: 'list'
    };
    
    this.changeSelectedField = this.changeSelectedField.bind(this);
    this.exportInspection = this.exportInspection.bind(this);
    this.exportInspectionData = this.exportInspectionData.bind(this);
  }

  componentDidMount() {
    const { actionFetch, match: { params: { id } } } = this.props;
    actionFetch(id);
  }

  componentWillReceiveProps(nextProps) {
    const { answer: { id: answerId } } = this.props;
    const { answer: { id: nextAnswerId, version } } = nextProps;
    if (!answerId && nextAnswerId) {
      this.setState({
        activeInspectionField: version.schema.sections[1].fields[0]
      });
    }
  }

  componentWillUnmount() {
    const { actionClear } = this.props;
    actionClear();
  }

  changeSelectedField(fieldId) {
    this.setState({
      activeInspectionField: fieldId
    });
  }

  exportInspection(id) {
    const { actionexportInspection } = this.props;
    actionexportInspection(id);
  }

  exportInspectionData(id) {
    const { actionexportInspectionData } = this.props;
    actionexportInspectionData(id);
  }

  toggle(view) {
    this.setState({ view });
  }

  goToInspection(id, answerId) {
    const { history } = this.props;
    history.push(`${INSPECTIONS_HOME_ROUTE}${id}/${answerId}/edit-inspection`);
  }

  render() {
    const { answer, match: { params: { id } } } = this.props;
    const {
      answer: {
        open_workorders,
        version,
        response,
        remarks,
        ...inspection
      }
    } = this.props;
    if(inspection.icon) {
      var icon = inspection.icon.includes(".png") ? require(`../../../icons/inspection-icons/${inspection.icon}`)
               : require(`../../../icons/inspection-icons/${inspection.icon}.svg`);
    } 
    
    const { activeInspectionField, view } = this.state;
    if (!version.form_id) return null;
    const inspFields = version.schema.fields.filter(f => f.type === 'inspection')
      // transform field list to object.
      .reduce((all, field) => ({ ...all, [field.id]: field }), {});

    const additionalFields = version.schema.fields.filter(f => f.type !== 'inspection')
      // transform field list to object.
      .reduce((all, field) => ({ ...all, [field.id]: field }), {});
    return (
      <>
        <SectionHeader icon={icon} translationID="invalid" defaultTitle={answer.inspection}>
          {/* <div className={styles.detailHeader}>
            <IconButton icon={search} />
            <IconButton icon={settings} />
            <Separator />
          </div> */}
        </SectionHeader>

        <HeaderBack
          translationID="inspections.new.prev"
          translationDefault="Back"
          backRoute={INSPECTIONS_HOME_ROUTE}
        />
        <div className={styles.container}>
          <DataSummary answer={answer} inspection={inspection} />
          <div className={styles.additional}>
            <AdditionalInformation answer={answer} fields={additionalFields} />
          </div>
          <div className={styles.viewSelector}>
            <FormattedMessage tagName="h4"
              id="inspections.details.title"
              defaultMessage="Inspections Details"
            />
            <div className={styles.buttons}>
              <IconButton icon={editIcon} onClick={() => { this.goToInspection(version.form_id, id); }} />
              <IconButton icon={listview} onClick={() => this.toggle('all')} />
              <IconButton icon={allview} onClick={() => this.toggle('list')} />
            </div>
          </div>

          <div className={styles.view}>
            {view === 'list' && (
            <Selector form={version.schema} answers={response}
              activeInspectionField={activeInspectionField}
              changeSelectedField={this.changeSelectedField}
            />
            )}
            <FieldDetail
              full={view === 'all'} fields={inspFields} remarks={remarks}
              selected={activeInspectionField} answers={response}
              workorders={open_workorders} exportInspection={this.exportInspection}
              exportInspectionData={this.exportInspectionData} answerId={id}
              inspectionid={version}
            />
          </div>
        </div>

      </>
    );
  }
}


SubmissionDetail.propTypes = {
  actionFetch: PropTypes.func.isRequired,
  actionClear: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  answer: PropTypes.shape({}).isRequired,
  actionexportInspection: PropTypes.func.isRequired,
  actionexportInspectionData: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
  answer: state.inspection.answer
});

const mapDispatchToProps = dispatch => ({
  // Fetch inspection
  actionFetch: (id) => {
    dispatch(fetchInspectionAnswer(id));
  },
  actionClear: () => {
    dispatch(clearInspectionAnswer());
  },
  actionexportInspection: (id) => {
    dispatch(exportInspection(id));
  },
  actionexportInspectionData: (id) => {
    dispatch(exportInspectionData(id));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmissionDetail);

const Separator = () => <div className={styles.separator} />;
