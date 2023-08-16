import React, { Component } from 'react';
import { Form } from 'antd';
import { formItemLayout } from '../../../shared/styles/FormWrapper';
import PropTypes from 'prop-types';
import FormErrors from '../../../shared/form/formErrors';
import { FastField } from 'formik';
import Select from 'react-select';

class SelectFormItemNotFast extends Component {
  render() {
    const {
      label,
      name,
      form,
      hint,
      layout,
      size,
      placeholder,
      options,
      mode,
      autoFocus,
      autoComplete,
      prefix,
      formItemProps,
      inputProps,
      errorMessage,
      required,
    } = this.props;

    return (
      <Form.Item
        {...layout}
        label={label}
        validateStatus={FormErrors.validateStatus(form, name, errorMessage)}
        required={required}
        help={FormErrors.displayableError(form, name, errorMessage) || hint}
        {...formItemProps}>
        <Select
          id={name}
          name={name}
          onChange={(selectedOption) => {
            form.setFieldValue(name, selectedOption.value);
          }}
          onBlur={() => form.setFieldTouched(name)}
          value={options ? options.find((option) => option.value === form.values[name]) : form.values[name]}
          size={size || undefined}
          placeholder={placeholder || undefined}
          autoFocus={autoFocus || false}
          autoComplete={autoComplete || undefined}
          prefix={prefix || undefined}
          mode={mode || undefined}
          isSearchable={true}
          options={options || null}
          {...inputProps}
        />
      </Form.Item>
    );
  }
}

SelectFormItemNotFast.defaultProps = {
  layout: formItemLayout,
  required: false,
};

SelectFormItemNotFast.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array,
  type: PropTypes.string,
  label: PropTypes.string,
  hint: PropTypes.string,
  autoFocus: PropTypes.bool,
  required: PropTypes.bool,
  size: PropTypes.string,
  prefix: PropTypes.string,
  placeholder: PropTypes.string,
  layout: PropTypes.object,
  errorMessage: PropTypes.string,
  formItemProps: PropTypes.object,
  inputProps: PropTypes.object,
  mode: PropTypes.string,
};

class ReactSelectFormItem extends Component {
  render() {
    return (
      <FastField name={this.props.name}>
        {({ form }) => <SelectFormItemNotFast {...this.props} form={form} />}
      </FastField>
    );
  }
}

export default ReactSelectFormItem;
