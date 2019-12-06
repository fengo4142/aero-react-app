import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../modal';

import styles from './confirm.module.scss';
import Button from '../button';

const Confirm = ({ content, onAccept, onCancel, acceptLabel='todo.newTask.accept', cancelLabel='todo.newTask.cancel'}) => (
  <Modal showIn onClose={onCancel} width="500px" minHeight="30%">
    <div className={styles.confirmTitle}>
      {content.title}
    </div>
    <div className={styles.confirmContent}>
      {content.body}
    </div>

    <div className={styles.confirmFooter}>
      <Button onClick={onCancel} translationID={cancelLabel} defaultText="Cancel" action="tertiary" />
      <Button onClick={onAccept} translationID={acceptLabel} defaultText="Accept" action="secondary" />
    </div>
  </Modal>
);

Confirm.propTypes = {
  content: PropTypes.shape({}).isRequired,
  onAccept: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Confirm;
