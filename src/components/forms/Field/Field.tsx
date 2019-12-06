import React from "react";
import classnames from "classnames";
import { Wrapper } from "./Field.style";
import { Label } from "semantic-ui-react";
import {FormikErrors} from "formik/dist/types";

type FieldProps = {
  children: JSX.Element[] | JSX.Element;
  noMargin?: string;
  error?:  string | FormikErrors<any> | string[] | FormikErrors<any>[];
  labelText?: string;
  width?: string;
};

const Field: React.FC<FieldProps> = ({
  children,
  noMargin,
  error,
  labelText
}) => {
  const isError = Boolean(error);

  const wrapperClass = classnames("sx-form-field", {
    "no-margin": noMargin,
    error: isError
  });
  const errorClass = classnames("sx-form-error", {
    visible: isError
  });

  return (
    <Wrapper className={wrapperClass}>
      <h3>{labelText}</h3>
      {children}
      <div className={errorClass}>
        {error && (
          <Label basic color="red" pointing>
            {error}
          </Label>
        )}
      </div>
    </Wrapper>
  );
};

export default Field;
export { Field };
