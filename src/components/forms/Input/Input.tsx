import React from 'react';

import { Input as LibInput } from '../../../libComponents/ui';
import { Field } from '../Field';
import { FieldInputProps, FieldMetaProps, FormikProps } from "formik/dist/types";

type InputProps = {
	field: FieldInputProps<any>;
	form: FormikProps<any>;
	meta: FieldMetaProps<any>;
	labelText?: string;
	placeholder?: string;
	type?: "text" | "password";
	noMargin?: string;
	width?: string;
}

const Input: React.FC<InputProps> = (props) => {
	const {
		noMargin,
		width,
		labelText,
		field,
		form,
		meta,
		type,
		placeholder,
		...restProps
	} = props;

	const { name } = field;
	const { errors, touched } = form;

	const isError = Boolean(touched[name] && errors[name]);
	const error = isError ? errors[name] : '';


	return (
		<Field
			noMargin={noMargin}
			error={error}
			width={width}
			labelText={labelText}
		>
			<LibInput
				error={isError}
				name={name}
				placeholder={placeholder}
				type={type}
				{...field}
				{...restProps}
			/>
		</Field>
	);
};

export default Input;
