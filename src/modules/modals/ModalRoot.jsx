import React from 'react';
import { connect } from 'react-redux';

// These are regular React components we will write soon
import Confirm from '../../components/confirm';

const MODAL_COMPONENTS = {
  SHOW_CONFIRM_MODAL: Confirm
};

const ModalRoot = ({ modalType, modalProps }) => {
  if (!modalType) return null;
  const SpecificModal = MODAL_COMPONENTS[modalType];
  return <SpecificModal {...modalProps} />;
};

const mapStateToProps = state => ({
  modalType: state.general.modalType,
  modalProps: state.general.modalProps
});

export default connect(
  mapStateToProps
)(ModalRoot);
