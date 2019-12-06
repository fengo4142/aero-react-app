import React from 'react';
import { TextArea as LibTextArea } from '../../../libComponents/ui';
import { Field } from '../Field';
import {FieldInputProps, FieldMetaProps, FormikProps} from "formik/dist/types";
import {SelectOption} from "../../../libComponents/ui/libTypes";

type TextAreaProps = {
	field: FieldInputProps<any>;
	form: FormikProps<any>;
	meta: FieldMetaProps<any>;
	labelText?: string;
	placeholder?: string;
	noMargin?: string;
	options: SelectOption[];
}

const TextArea: React.FC<TextAreaProps> = props => {
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
	const { errors, touched } = form;

	const isError = Boolean(touched[name] && errors[name]);
	const error = isError ? errors[name] : '';

	return (
		<Field
			noMargin={noMargin}
			error={error}
      labelText={labelText}
		>
			<LibTextArea
				error={isError}
				selectName={name}
				{...field}
				{...restProps}
			/>
		</Field>
	);
};

export default TextArea;
export { TextArea };
