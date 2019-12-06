import { useState } from 'react';

export const useForm = (callback, initialState = {}, initialErrors = {}) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState(initialErrors);

    const onChange = (event) => {
        const { name, value } = event.target;
        validateFields(name, value);
        setValues({...values, [event.target.name] : event.target.value});
    };

    const onDragDocument = (event) => {
        const { name, value } = event.target;
        validateFields(name, value);
        setValues({...values, [event.target.name] : event.target.value});
    };

    const validateFields = (name, value) => {
        switch (name) {
            case 'content': 
                errors.content = 
                value.length < 1
                    ? 'Content Required'
                    : '';
                break;
            case 'document': 
                errors.document = 
                value.length < 1
                    ? 'Content Required'
                    : '';
                break;
            default:
              break;
        };
        setErrors({...errors, [name] : errors[name]});
    };

    const validateForm = () => {
        let valid = true;
        Object.values(values).forEach((val, key) => {
            if(val.length === 0){
                Object.keys(values).forEach((name, k) => {
                    if(key === k){
                        validateFields(name, val);
                    }
                });
                valid = false;
            }
        });
        return valid;
    };

    const onSubmit = (event) => {
        event.preventDefault();
        if(validateForm()){
            callback();
        } else {
            console.log(errors);
        }
    };

    return {
        onSubmit,
        onChange,
        values,
        errors,
        setErrors,
        onDragDocument
    }
}