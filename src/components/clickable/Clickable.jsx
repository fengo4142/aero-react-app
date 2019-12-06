import React from 'react';
import PropTypes from 'prop-types';

const Clickable = ({ onClick, children, ...rest }) => (
  <div onClick={onClick} onKeyPress={onClick} tabIndex="0" role="button" {...rest}>
    {children}
  </div>
);

Clickable.propTypes = {
  onClick: PropTypes.func.isRequired
};
export default Clickable;
