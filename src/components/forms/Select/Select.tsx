import React from "react";
import { Select as LibSelect } from "../../../libComponents/ui";
import { Field } from "../Field";
import { FieldInputProps, FieldMetaProps, FormikProps } from "formik/dist/types";
import { SelectOption } from "../../../libComponents/ui/libTypes";

type SelectProps = {
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  meta: FieldMetaProps<any>;
  noMargin?: string;
  labelText?: string;
  options: SelectOption[];
}

const Select: React.FC<SelectProps> = props => {
  const {
    options,
    noMargin,
    labelText,
    field,
    form,
    meta,
    ...restProps
  } = props;

  const { name } = field;
  const { values, errors, touched, setFieldValue } = form;
  const isError = Boolean(touched[name] && errors[name]);
  const error = isError ? errors[name] : "";

  return (
    <Field noMargin={noMargin} error={error} labelText={labelText}>
      <LibSelect
        error={isError}
        selectName={name}
        {...field}
        {...restProps}
        value={values[name]}
        onChange={(e, { value }) => setFieldValue(name, value)}
        options={options}
      />
    </Field>
  );
};

export default Select;
export { Select };
