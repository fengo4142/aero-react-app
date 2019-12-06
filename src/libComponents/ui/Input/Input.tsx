import React from "react";
import { Input as LibInput } from "semantic-ui-react";
import { Wrapper } from "./Input.style";
import { InputOnChangeData } from "semantic-ui-react/dist/commonjs/elements/Input/Input";

type InputProps = {
  error?: boolean;
  name: string;
  onBlur?: (e: React.FocusEvent<any>) => void;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  placeholder?: string;
  type?: "text" | "password";
  value?: string;
  size?: "mini" | "small" | "large" | "big" | "huge" | "massive";
  disabled?: boolean;
};

const Input: React.FC<InputProps> = ({
  error,
  name,
  onBlur,
  onChange,
  placeholder,
  value,
  type,
  disabled
}) => {
  return (
    <Wrapper>
      <LibInput
        error={error}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        type={type}
        disabled={disabled}
      />
    </Wrapper>
  );
};

export default Input;
export { Input };
