import React from "react";
import { Select as LibSelect } from "semantic-ui-react";
import { Wrapper } from "./Select.styles";
import { DropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import { SelectOption } from "../libTypes";

type SelectProps = {
  error?: boolean;
  name: string;
  onBlur?: (
    event: React.KeyboardEvent<HTMLElement>,
    data: DropdownProps
  ) => void;
  onChange?: (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) => void;
  onFocus?: (
    event: React.SyntheticEvent<HTMLElement>,
    data: DropdownProps
  ) => void;
  options: SelectOption[];
  placeholder?: string;
  selectName?: string;
  value: string;
  required?: boolean;
  disabled?: boolean;
};

const Select: React.FC<SelectProps> = ({
  error,
  name,
  onBlur,
  onChange,
  placeholder,
  value,
  selectName,
  options,
  required,
  disabled
}) => {
  return (
    <Wrapper>
      <LibSelect
        options={options}
        error={error}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        selectName={selectName}
        required={required}
        disabled={disabled}
      />
    </Wrapper>
  );
};

export default Select;
export { Select };
