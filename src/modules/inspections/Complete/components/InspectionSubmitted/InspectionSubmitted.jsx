import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../../../../../components/button';

import { importAllImages } from '../../../../../utils/helpers';

import styles from './inspectionSubmitted.module.scss';

class InspectionSubmitted extends Component {
  constructor(props) {
    super(props);
    this.images = importAllImages(require.context('../../../../../icons/inspection-icons', false, /\.(png|jpe?g|svg)$/));
  }

  render() {
    const { icon, name, handleGoInspections } = this.props;
    return (
      <div className={styles.submittedContainer}>
        {icon.includes(".png") ?
                  <img src={this.images[icon]} alt="insptection_icon" /> :
                  <img src={this.images[`${icon}.svg`]} alt="insptection_icon" />}
        <span className={styles.inspectionName}>{ name }</span>
        <span className={styles.submitted_msg}>
          Your inspection was successfully submitted
        </span>
        <Button
          action="secondary"
          onClick={handleGoInspections}
          translationID="inspections.complete_inspections.go_to_inspections"
          defaultText="Go to Inspections"
        />
      </div>
    );
  }
}

InspectionSubmitted.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleGoInspections: PropTypes.func.isRequired
};

export default InspectionSubmitted;
