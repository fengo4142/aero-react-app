import React, { Component } from 'react'
import PropTypes from 'prop-types';

import share from '../../../../../icons/share.svg';
import { FormattedMessage } from 'react-intl';
import Clickable from '../../../../../components/clickable/Clickable';
import styles from './shareOptions.module.scss';

class ShareOptions extends Component {
    constructor() {
      super();
      this.handleClick = this.handleClick.bind(this);
      this.handleOutsideClick = this.handleOutsideClick.bind(this);
      this.state = {
        shareOptionsDropdown: false
      };
    }
  
    handleClick() {
      if (!this.state.shareOptionsDropdown) {
        // attach/remove event handler
        document.addEventListener('click', this.handleOutsideClick, false);
      } else {
        document.removeEventListener('click', this.handleOutsideClick, false);
      }
      this.setState(prevState => ({
        shareOptionsDropdown: !prevState.shareOptionsDropdown,
      }));
    }
    
    handleOutsideClick(e) {
      // ignore clicks on the component itself
      if (this.node.contains(e.target)) {
        return;
      }
      this.handleClick();
    }
  
    render() {
      const { exportInspection, inspectionid, exportInspectionData, answer } = this.props;
      return (
        <div className={styles.shareOptionsContainer} ref={node => { this.node = node; }}>
          <button onClick={this.handleClick} ><img src={share} alt="share button" /></button>
          {this.state.shareOptionsDropdown && (
              <div className={styles.shareOptionsDropdown}>
                  <Clickable className={styles.shareOptions} onClick={() => { exportInspection(inspectionid.id); }}>
                      <FormattedMessage id="inspections.answer_details.shareOption.emptyTemplate" defaultMessage="Inspection template" />
                  </Clickable>
                  <Clickable className={styles.shareOptions} onClick={() => { exportInspectionData(answer); }}>
                      <FormattedMessage id="inspections.answer_details.shareOption.dataTemplate" defaultMessage="Template with data" />
                  </Clickable>
              </div>
           )}
        </div>
      );
    }
  }

  ShareOptions.propTypes = {
    exportInspection: PropTypes.func.isRequired,
    inspectionid: PropTypes.shape({}).isRequired,
    exportInspectionData: PropTypes.func.isRequired,
    answer: PropTypes.string.isRequired
  };

  export default ShareOptions