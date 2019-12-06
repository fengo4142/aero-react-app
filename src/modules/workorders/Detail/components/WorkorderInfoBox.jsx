import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment/min/moment-with-locales';
import { FormattedMessage } from 'react-intl';

import Collapsible from '../../../../components/collapsible/Collapsible';
import Map from '../../List/components/Map';
import Clickable from '../../../../components/clickable/Clickable';
import PhotoCarousel from '../../../../components/photoCarousel';
import Modal from '../../../../components/modal';
import { renderInfoForType } from '../../../../utils/helpers';
import Notams from './Notams';
import {
  WORKORDER_STATUS_MAINTENANCE,
  WORKORDER_STATUS_COMPLETED
} from '../../../../constants/ModelStatus';

import styles from '../workOrderDetail.module.scss';

class WorkorderInfoBox extends Component {
  state = {
    modal: false
  };

  openPhotoModal = (idx) => {
    this.setState({ modal: true, initialSlide: idx });
  }

  render() {
    const { workorder, translation } = this.props;
    const { modal, initialSlide } = this.state;
    return (
      <Collapsible
        title="workorder.detail.request_header"
        styleClasses={styles.collapsibleHeader}
        offset={200}
        openOnMount={
          workorder.status === WORKORDER_STATUS_MAINTENANCE || (
            workorder.status === WORKORDER_STATUS_COMPLETED)}
      >
        <div className={styles.sectionHeader}>
          <FormattedMessage id="workorder.detail.request.request_title" defaultMessage="Work details" />
        </div>
        <div className={styles.requestInfo}>
          <div className={styles.infoTable}>
            <div className={styles.infoRow}>
              <span className={styles.title}>
                <FormattedMessage id="workorder.detail.request.logged_by" defaultMessage="Logged by" />
              </span>
              <span className={styles.rowContent}>
                {workorder.logged_by.fullname}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.title}>
                <FormattedMessage id="workorder.detail.request.report_date" defaultMessage="Report date" />
              </span>
              <span className={styles.rowContent}>
                {moment(workorder.report_date).format('MM/DD/YYYY hh:mm A')}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.title}>
                <FormattedMessage id="workorder.detail.request.assigned_to" defaultMessage="Assigned to" />
              </span>
              <span className={styles.rowContent}>
                -
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.title}>
                <FormattedMessage id="workorder.detail.request.priority" defaultMessage="Priority" />
              </span>
              <span className={styles.rowContent}>
                {workorder.priority}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.title}>
                <FormattedMessage id="workorder.detail.request.category" defaultMessage="Category" />
              </span>
              <span className={styles.rowContent}>
                {workorder.category}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.title}>
                <FormattedMessage id="workorder.detail.request.subcategory" defaultMessage="Subcategory" />
              </span>
              <span className={styles.rowContent}>
                {workorder.subcategory}
              </span>
            </div>
          </div>
          <div className={styles.infoMap}>
            <Map workorders={[workorder]} workorderDetail />
          </div>

        </div>



        <div className={styles.requestInfoField}>
          <span className={styles.title}>
            <FormattedMessage id="workorder.detail.request.problem_description" defaultMessage="Problem description" />
          </span>
          <div className={styles.content}>
            {workorder.problem_description}
          </div>
        </div>
        {Object.keys(workorder.images).length > 0 && (
          <div className={styles.requestInfoField}>
            <span className={styles.title}>
              <FormattedMessage id="workorder.detail.request.photos" defaultMessage="Photos" />
            </span>
            { Object.keys(workorder.images).length > 1 ? (
            <div className={styles.photos}>
              {workorder.images.map((e, idx) => (
                <Clickable
                  key={e.id}
                  onClick={() => this.openPhotoModal(idx)}
                >
                  <img src={e.image} alt={e.id} />
                </Clickable>
              ))}
            </div>
            )
          :(   <div className={styles.photo}>
            {workorder.images.map((e, idx) => (
              <Clickable
                key={e.id}
                onClick={() => this.openPhotoModal(idx)}
              >
                <img src={e.image} alt={e.id} />
              </Clickable>
            ))}
          </div>)}
          </div>
        )}
        {console.log(Object.keys(workorder.images).length)}
        <div className={styles.requestInfoField}>
          <span className={styles.title}>
            <FormattedMessage id="workorder" defaultMessage="Notams" />
          </span>
          <div className={styles.content}>
            <Notams notams={workorder.notams} />
          </div>
        </div>

        {workorder.assets.length > 0 && (
          < div className={styles.requestInfoField}>
            <span className={styles.title}>
              <FormattedMessage id="workorder.detail.request.assets" defaultMessage="Assets " />
            </span>
            <div className={styles.content}>
              {workorder.assets[0].name}
            </div>
          </div>
        )}


        <div className={`${styles.stepInfo} ${styles.noMarginTop}`}>
          {workorder.answer_schema.fields.map(f => (
            <div key={f.id} className={f.widget && f.widget.type === 'textfield' ? styles.infoFull : styles.infoHalf}>
              <span>{translation && translation[f.title] ? translation[f.title] : f.title}</span>
              <p>{renderInfoForType(f, workorder.response[f.id], workorder)}</p>
            </div>
          ))}
        </div>

        {/* {workorder.images.length &&
        <Modal
          showIn={modal}
          onClose={() => this.setState({ modal: false })} 
          contentStyles={{
            overflow: 'visible',
            background: '#E6EAEE',
            padding: '20px 40px'         
          }}
          >
            <div>{workorder.images.length >1 ?  < PhotoCarousel  photos={workorder.images} initialSlide={initialSlide} />
 
      :<div ><img src={workorder.images[0].image} className={styles.workimg}></img></div> 
      }
        </div>
          
        </Modal>} */}
      </Collapsible >
    );
  }
}

WorkorderInfoBox.propTypes = {
  workorder: PropTypes.shape({}).isRequired
};

export default WorkorderInfoBox;
