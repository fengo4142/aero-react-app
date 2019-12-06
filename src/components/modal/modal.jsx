import React from 'react';
import Transition from 'react-transition-group/Transition';
import PropTypes from 'prop-types';

import styles from './modal.module.scss';

const Modal = ({ onClose, children, showIn, width, minHeight, contentStyles }) => {
  const onOverlayClick = () => {
    onClose();
  };

  const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 }
  };

  return (
    <Transition in={showIn} timeout={0} unmountOnExit>
      {state => (
        <div className={styles.modal} style={transitionStyles[state]}>
          <div className={styles.overlay} tabIndex="0"
            onClick={onOverlayClick} onKeyPress={onOverlayClick} role="button"
          />
          <div
            className={styles.content}
            style={{ width: `${width}`, minHeight: `${minHeight}`, ...contentStyles}}
          >
            {children}
          </div>
        </div>
      )}
    </Transition>
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  showIn: PropTypes.bool,
  width: PropTypes.string,
  minHeight: PropTypes.string,
  contentStyles: PropTypes.shape({})
};


Modal.defaultProps = {
  showIn: false,
  width: '50%',
  minHeight: '60%',
  contentStyles: {}
};

export default Modal;
