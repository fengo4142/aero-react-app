import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import Modal from '../../../../../components/modal';
import Button from '../../../../../components/button';
import FieldWidget from '../../components/FieldWidget';


import styles from '../steps.module.scss';

class NewField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {},
      error: ''
    };
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleAddAction = this.handleAddAction.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleDeleteAction = this.handleDeleteAction.bind(this);
  }

  handleFieldChange(v) {
    this.setState({ value: v });
  }

  handleAddAction() {
    const { value } = this.state;
    const { onCreateField } = this.props;
    if (!value.title) {
      this.setState({ error: 'inspections.step2.newField.errortitle' });
      return;
    }
    if (value.values && value.values.length === 0) {
      this.setState({ error: 'inspections.step2.newField.errorOptions' });
      return;
    }
    onCreateField(value);
    this.closeModal();
  }

  handleDeleteAction() {
    const { onCreateField, info } = this.props;
    onCreateField({ ...info, delete: true });
    this.closeModal();
  }

  closeModal() {
    const { onClose } = this.props;
    this.setState({ error: '', value: {} });
    onClose();
  }

  render() {
    const { showIn, info } = this.props;
    const { error } = this.state;
    return (
      <Modal showIn={showIn} onClose={this.closeModal} width="65%">
        <div className={styles.newField}>
          <div className={styles.title}>
            <FormattedMessage tagName="h5" id="inspections.step2.newField.title"
              defaultMessage="New Field"
            />
          </div>
          <FieldWidget onChangeField={this.handleFieldChange} info={info} />
          <div className={styles.footer}>
            <Button action="tertiary" translationID="inspections.new.cancelBtn" defaultText="Cancel"
              onClick={this.closeModal}
            />
            <div className={styles.errors}>
              {error !== '' && <FormattedMessage tagName="p" id={error} defaultMessage="Field has empty values." />}
            </div>
            <div className={styles.modalBtnGroup}>
              {info && (
              <Button action="danger" translationID="inspections.new.delete" defaultText="Delete"
                onClick={this.handleDeleteAction}
              />
              )}
              <Button action="primary" translationID="inspections.new.addBtn" defaultText="Add"
                onClick={this.handleAddAction}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

NewField.propTypes = {
  onCreateField: PropTypes.func.isRequired,
  showIn: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  info: PropTypes.shape({})
};

NewField.defaultProps = {
  showIn: false,
  info: undefined
};

export default NewField;
