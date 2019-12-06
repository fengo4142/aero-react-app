import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './workOrderSettings.module.scss';
import { fetchInspectionList, clearInspection } from '../inspections/redux/actions';
import { editAirport, clearAirportAction } from '../settings/redux/actions';

import { importAllImages } from '../../utils/helpers';
import FormattedMessageWithClass from '../../components/formattedMessageWithClass';
import Clickable from '../../components/clickable/Clickable';
import Spinner from '../../components/spinner';

class WorkOrderSettings extends Component {
  state = {
    selectedInspection: undefined
  };

  images = importAllImages(
    require.context('../../icons/inspection-icons', false, /\.(png|jpe?g|svg)$/)
  );

  componentDidMount() {
    const { actionFetch, inspectionList } = this.props;
    if (!inspectionList.length) actionFetch();
  }

  componentDidUpdate(prevProps) {
    const { editStatus, actionClear } = this.props;
    if (prevProps.editStatus.loading && editStatus.success) {
      setTimeout(() => actionClear(), 1000);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (state.selectedInspection === undefined && props.airport) {
      return { ...state, selectedInspection: props.airport.safety_self_inspection };
    }
    return state;
  }

  handleClick = (id) => {
    const { airport, actionEdit } = this.props;
    actionEdit(airport.id, { safety_self_inspection: id });
    this.setState({ selectedInspection: id });
  }

  render() {
    const { inspectionList, editStatus } = this.props;
    const { selectedInspection } = this.state;

    return (
      <div className={styles.workOrderSettings}>
        <FormattedMessageWithClass className={styles.title}
          id="settings.workorders.title" defaultText="Select which inspection form is the base for all work orders."
        />
        <div className={styles.content}>
          {inspectionList.map((e) => {
            const classes = [
              styles.inspection,
              e.id === selectedInspection && styles.active
            ].filter(el => el);

            return (
              <Clickable key={e.id} className={classes.join(' ')}
                onClick={() => this.handleClick(e.id)}
              >
                <img src={this.images[`${e.icon}.svg`]} alt={e.title} />
                {e.title}
                {selectedInspection === e.id
                  && <Spinner className={styles.spinner} active={editStatus.loading} />}
                {selectedInspection === e.id
                  && editStatus.success && <div className={styles.success}>Saved </div>}
              </Clickable>
            );
          })}
        </div>
      </div>
    );
  }
}

WorkOrderSettings.propTypes = {
  inspectionList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  airport: PropTypes.shape({}),
  actionFetch: PropTypes.func.isRequired,
  actionClear: PropTypes.func.isRequired,
  actionEdit: PropTypes.func.isRequired,
  editStatus: PropTypes.shape({})
};

WorkOrderSettings.defaultProps = {
  airport: {},
  editStatus: {}
};

const mapStateToProps = state => ({
  inspectionList: state.inspection.inspectionList.results,
  fetchStatus: state.inspection.action,
  editStatus: state.settings.action,
  airport: state.auth.profile.airport
});

const mapDispatchToProps = dispatch => ({
  actionFetch: () => {
    dispatch(fetchInspectionList());
  },
  actionEdit: (id, data) => {
    dispatch(editAirport(id, data));
  },
  actionClear: () => {
    dispatch(clearInspection());
    dispatch(clearAirportAction());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkOrderSettings);
