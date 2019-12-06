import React from "react";
import { TextArea as LibTextArea } from "semantic-ui-react";

import { Wrapper } from "./TextArea.styles";
import { TextAreaProps as LibTextAreaProps } from "semantic-ui-react/dist/commonjs/addons/TextArea/TextArea";

type TextAreaProps = {
  error?: boolean;
  name?: string;
  onBlur?: (e: React.FocusEvent<any>) => void;
  onChange?: (
    event: React.FormEvent<HTMLTextAreaElement>,
    data: LibTextAreaProps
  ) => void;
  placeholder?: string;
  selectName?: string;
  type?: string;
  value?: string;
  size?: "mini" | "small" | "large" | "big" | "huge" | "massive";
  required?: boolean;
  disabled?: boolean;
};

const TextArea: React.FC<TextAreaProps> = ({
  error,
  name,
  onBlur,
  onChange,
  placeholder,
  value,
  type,
  selectName,
  required,
  disabled
}) => {
  return (
    <Wrapper>
      <LibTextArea
        error={error}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        type={type}
        selectName={selectName}
        required={required}
        disabled={disabled}
      />
    </Wrapper>
  );
};

export default TextArea;
export { TextArea };
