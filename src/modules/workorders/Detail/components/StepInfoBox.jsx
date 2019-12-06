import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';

import { FormattedMessage } from 'react-intl';
import Collapsible from '../../../../components/collapsible/Collapsible';
import Clickable from '../../../../components/clickable/Clickable';
import PhotoCarousel from '../../../../components/photoCarousel';
import Modal from '../../../../components/modal';
import { renderInfoForType } from '../../../../utils/helpers';

import styles from '../workOrderDetail.module.scss';


class StepInfoBox extends Component {
  state = {
    modal: false
  };

  openPhotoModal = (idx) => {
    this.setState({ modal: true, initialSlide: idx });
  }

  render() {
    const { step, info, translation } = this.props;
    const { modal, initialSlide } = this.state;

    return (
      <Collapsible title={`workorder.detail.${step}_header`}
        styleClasses={styles.collapsibleHeader}
        offset={1}
        openOnMount
      >
        <div className={styles.stepInfo}>
          <div className={styles.infoHalf}>
            <FormattedMessage id="workorder.detail.info.completed_by" defaultMessage="Completed by" />
            <p>{info.completed_by.fullname}</p>
          </div>
          <div className={styles.infoHalf}>
            <FormattedMessage id="workorder.detail.info.completed_on" defaultMessage="Completed on" />
            <p>{moment(info.completed_on).format('MM/DD/YYYY hh:mm A')}</p>
          </div>
          {step === 'maintenance' && (
          <div className={styles.infoFull}>
            <FormattedMessage id="workorder.detail.info.description" defaultMessage="Description of work done" />
            <p>{info.work_description}</p>
          </div>
          )}
          {step === 'operations' && (
          <div className={styles.infoFull}>
            <FormattedMessage id="workorder.detail.info.review_report" defaultMessage="Review Report" />
            <p>{info.review_report}</p>
          </div>
          )}
          {info.answer_schema.fields.map(f => (
            <div key={f.id} className={f.widget && f.widget.type === 'textfield' ? styles.infoFull : styles.infoHalf}>
              <span>{translation && translation[f.title] ?  translation[f.title]: f.title}</span>
              <p>{renderInfoForType(f, info.response[f.id], info)}</p>
            </div>
          ))}
          {info.images.length > 0 && (
          <div className={styles.infoFull}>
            <FormattedMessage id="workorder.detail.info.photos" defaultMessage="Photos" />
            <div className={styles.images}>
              {info.images.map((e, idx) => (
                <Clickable
                  key={e.id}
                  onClick={() => this.openPhotoModal(idx)}
                >
                  <img src={e.image} alt={e.id} />
                </Clickable>
              ))}
            </div>
          </div>
          )}
        </div>
        <Modal
          showIn={modal}
          onClose={() => this.setState({ modal: false })}
          contentStyles={{
            overflow: 'visible',
            background: '#E6EAEE',
            padding: '20px 40px'
          }}
        >
          <PhotoCarousel photos={info.images} initialSlide={initialSlide} />
        </Modal>
      </Collapsible>
    );
  }
}

StepInfoBox.propTypes = {
  info: PropTypes.shape({}).isRequired,
  step: PropTypes.string.isRequired
};
export default StepInfoBox;
