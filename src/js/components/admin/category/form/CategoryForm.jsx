import Spinner from "../../../shared/Spinner";
import { Formik, Field, ErrorMessage } from "formik";
import { CloseOutlined, UndoOutlined } from "@ant-design/icons";
import React, { Component } from "react";
import FormWrapper, {
  tailFormItemLayout,
  formItemLayout,
} from "../../../shared/styles/FormWrapper";
import  "../category.css";
import { Button, Form, Input, Radio } from "antd";
import * as Yup from "yup";
import ViewFormItem from "../../../shared/form/items/ViewFormItem";
import InputFormItem from "../../../shared/form/items/InputFormItem";
import RadioFormItem from "../../../shared/form/items/RadioFormItem";

class CategoryForm extends Component {
  handleSubmit = (values) => {
    this.props.onSubmit(values);
  };

  initialValues = () => {
    const { isEditing, record } = this.props;
    if (isEditing) return record;
    return {};
  };
  onChange = (e) => {
    console.log("radio checked", e.target.value);
  };

  renderForm() {
    const { saveLoading, isEditing, categoryName, record } = this.props;
    const uniqueCategoryName =
      isEditing != true
        ? categoryName.map((item) => item.category_name.toLowerCase())
        : categoryName
            .filter(
              (item) =>
                item.category_name.toLowerCase() !==
                record.category_name.toLowerCase()
            )
            .map((item) => item.category_name.toLowerCase());
    const gender = [
      { id: "Male", label: "Male" },
      { id: "Female", label: "Female" },
    ];
    return (
      <FormWrapper>
        <Formik
          initialValues={this.initialValues()}
          onSubmit={this.handleSubmit}
          validationSchema={Yup.object().shape({
            category_name: Yup.string()
              .matches(
                /^[a-zA-Z0-9]+[a-zA-Z0-9 ]$/,
                "Alphabets and Number only"
              )
              .test("CheckUniqueness", "Category Name is not Unique", (value) =>
                value !== undefined
                  ? !uniqueCategoryName.includes(value.toLowerCase())
                  : value
              )
              .required("Category Name is Required"),
            category_gender: Yup.string().required("Select Gender"),
            min_age: Yup.number()
              .typeError("Age must be a number")
              .min(5, "Min value 5.")
              .max(60, "Max value 60.")
              .integer("Require Integer value")
              .required("Minimum Age is Required")
              .positive("Value Must be Positive"),
            max_age: Yup.number()
              .typeError("Age must be a number")
              .required("Maximum Age is Required")
              .positive("Value Must be Positive")
              .integer("Require Integer value"),
            participation_fees: Yup.number()
              .typeError("Sponsorship must be a number")
              .integer("Must be Integer")
              .moreThan(-1, "Can't be negative")
              .required("Participation Fee is Required"),
            sponsorship_amount: Yup.number()
              .typeError("Sponsorship must be a number")
              .required("Sponsorship Amount is Required")
              .positive("Value Must be Positive"),
            is_active: Yup.number().required("Select Active Status"),
          })}
        >
          {(form) => {
            return (
              <Form onSubmit={form.handleSubmit}>
                <InputFormItem name={"category_name"} label={"Name"} />
                <RadioFormItem
                  name={"category_gender"}
                  label={"Gender"}
                  options={gender.map((item) => ({
                    value: item.id,
                    label: item.label,
                  }))}
                />
                <InputFormItem name={"min_age"} label={"Min Age"} />
                <InputFormItem name={"max_age"} label={"Max Age"} />
                <InputFormItem
                  name={"participation_fees"}
                  label={"Participation Fee"}
                />
                <InputFormItem
                  name={"sponsorship_amount"}
                  label={"Sponsorship Amount"}
                />
                <Form.Item label="Active Status" {...formItemLayout}>
                  <Radio.Group
                    name="is_active"
                    checked={form.values.is_active}
                    defaultValue={form.values.is_active}
                  >
                    <Radio
                      onChange={() => form.setFieldValue("is_active", 0)}
                      value={0}
                    >
                      No
                    </Radio>
                    <Radio
                      onChange={() => form.setFieldValue("is_active", 1)}
                      value={1}
                    >
                      Yes
                    </Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item className="form-buttons" {...tailFormItemLayout}>
                  <Button
                    loading={saveLoading}
                    type="primary"
                    onClick={form.handleSubmit}
                  >
                    {"Save"}
                  </Button>

                  <Button disabled={saveLoading} onClick={form.handleReset}>
                    {"Reset"}
                  </Button>

                  {this.props.onCancel ? (
                    <Button
                      disabled={saveLoading}
                      onClick={() => this.props.onCancel()}
                    >
                      {"Close"}
                    </Button>
                  ) : null}
                </Form.Item>
              </Form>
            );
          }}
        </Formik>
      </FormWrapper>
    );
  }

  render() {
    const { isEditing, findLoading, record } = this.props;
    if (findLoading) {
      return <Spinner />;
    }

    if (isEditing && !record) {
      return <Spinner />;
    }

    return this.renderForm();
  }
}

export default CategoryForm;
