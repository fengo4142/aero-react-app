import React from "react";
import { Dropdown as LibDropdown } from "semantic-ui-react";

import { DropdownWrapper } from "./Dropdown.styles";
import { DropdownProps as LibDropdownProps } from "semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown";
import { SelectOption } from "../libTypes";

type DropdownProps = {
  options: SelectOption[];
  placeholder: string;
  onChange?: (
    event: React.SyntheticEvent<HTMLElement>,
    data: LibDropdownProps
  ) => void;
  className?: string;
  disabled?: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder,
  onChange,
  disabled
}) => (
  <DropdownWrapper>
    <LibDropdown
      placeholder={placeholder}
      fluid
      search
      selection
      options={options}
      onChange={onChange}
      disabled={disabled}
    />
  </DropdownWrapper>
);

export default Dropdown;
export { Dropdown };
