import React from 'react';
import { FormattedMessage } from 'react-intl';


const FormattedMessageWithClass = ({ tagName, ...props }) => {
  const Tag = tagName || 'span';
  return (
    <FormattedMessage {...props}>
      {txt => (
        <Tag className={props.className}>
          {txt}
        </Tag>
      )}
    </FormattedMessage>
  );
};


export default FormattedMessageWithClass;
