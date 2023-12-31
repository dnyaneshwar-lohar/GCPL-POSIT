import React, { Component } from "react";
import { Form, DatePicker } from "antd";
import { formItemLayout } from "../../../shared/styles/FormWrapper";
import PropTypes from "prop-types";
import FormErrors from "../../../shared/form/formErrors";
import { FastField } from "formik";

class DatePickerFormItemNotFast extends Component {
  render() {
    const {
      label,
      name,
      form,
      hint,
      layout,
      autoFocus,
      showTime,
      formItemProps,
      inputProps,
      required
    } = this.props;

    return (
      <Form.Item
        {...layout}
        label={label}
        required={required}
        validateStatus={FormErrors.validateStatus(form, name)}
        help={FormErrors.displayableError(form, name) || hint}
        {...formItemProps}
      >
        <DatePicker
          id={name}
          onChange={value => form.setFieldValue(name, value)}
          value={form.values[name]}
          autoFocus={autoFocus || false}
          style={{ width: "100%" }}
          showTime={showTime ? { format: "HH:mm" } : undefined}
          format={this.props.format}
          picker={this.props.picker}
          disabledDate={this.props.disabledDate}
          {...inputProps}
        />
      </Form.Item>
    );
  }
}

DatePickerFormItemNotFast.defaultProps = {
  layout: formItemLayout,
  showTime: false,
  required: false
};

DatePickerFormItemNotFast.propTypes = {
  showTime: PropTypes.bool,
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  hint: PropTypes.string,
  label: PropTypes.string,
  autoFocus: PropTypes.bool,
  layout: PropTypes.object,
  formItemProps: PropTypes.object,
  inputProps: PropTypes.object,
  required: PropTypes.bool
};

class DatePickerFormItem extends Component {
  render() {
    return (
      <FastField name={this.props.name}>
        {({ form }) => (
          <DatePickerFormItemNotFast {...this.props} form={form} />
        )}
      </FastField>
    );
  }
}

export default DatePickerFormItem;
