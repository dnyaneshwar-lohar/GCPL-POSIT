import Spinner from "../../shared/Spinner";
import { Formik, Field, ErrorMessage } from "formik";
import "./SponsorForm.css";
import { CloseOutlined, UndoOutlined } from "@ant-design/icons";
import React, { Component } from "react";
import FormWrapper, {
  tailFormItemLayout,
  formItemLayout,
} from "../../shared/styles/FormWrapper";
import moment from "moment";
import Message from "../../shared/message";
import axios from "axios";
import { Button, Form, Input, Radio } from "antd";
import * as Yup from "yup";
import ViewFormItem from "../../shared/form/items/ViewFormItem";
import InputFormItem from "../../shared/form/items/InputFormItem";
import RadioFormItem from "../../shared/form/items/RadioFormItem";
import TextAreaFormItem from "../../shared/form/items/TextAreaFormItem";
import DatePickerFormItem from "../../shared/form/items/DatePickerFormItem";
import SponsorService from "../../modules/sponsor/SponsorServices";

class SponsorForm extends Component {
  handleSubmit = async (values) => {
    const { isEditing } = this.props;
    const {
      sponsor_name,
      sponsor_short_name,
      contact_no,
      email_id,
      website,
      owner,
      is_active,
      sponsorship_amount,
    } = values;
    const sponsor_description =
      values.sponsor_description != null ? values.sponsor_description : "";
    const gcpl_accociation_from = moment(values.gcpl_accociation_from).format(
      "YYYY"
    );
    const agc_residence_year_from = moment(
      values.agc_residence_year_from
    ).format("YYYY");
    const data = {
      sponsor_name,
      sponsor_short_name,
      sponsor_description,
      contact_no,
      email_id,
      website,
      owner,
      gcpl_accociation_from,
      agc_residence_year_from,
      is_active,
      sponsorship_amount,
      gcpl_accociation_from,
      agc_residence_year_from,
    };
    if (isEditing) {
      await SponsorService.update(data);

      Message.success("Sponsor Updated Successfully");
      this.props.onCancel();
    } else {
      await SponsorService.create(data);

      Message.success("Sponsor Added Successfully");
      this.props.onCancel();
    }
  };

  initialValues = () => {
    const { isEditing, record } = this.props;
    if (isEditing) {
      const {
        sponsor_name,
        sponsor_short_name,
        sponsor_description,
        contact_no,
        email_id,
        website,
        owner,
        is_active,
        sponsorship_amount,
      } = record;
      const gcpl_accociation_from = moment(
        record.gcpl_accociation_from,
        "YYYY"
      );
      const agc_residence_year_from = moment(
        record.agc_residence_year_from,
        "YYYY"
      );
      const data = {
        sponsor_name,
        sponsor_short_name,
        sponsor_description,
        contact_no,
        email_id,
        website,
        owner,
        is_active,
        sponsorship_amount,
        gcpl_accociation_from,
        agc_residence_year_from,
      };
      return data;
    }
    return {};
  };

  onChange = (e) => {
    console.log("radio checked", e.target.value);
  };

  render() {
    const { ID, isEditing } = this.props;
    const owner = [
      { id: "Yes", label: "Yes" },
      { id: "No", label: "No" },
    ];
    const phoneRegExp = /^[2-9]\d{9}$/;
    const EmailID = isEditing ? [] : ID.map((item) => item.email_id);

    return (
      <React.Fragment>
        <FormWrapper>
          <Formik
            enableReinitialize
            initialValues={this.initialValues()}
            onSubmit={this.handleSubmit}
            validationSchema={Yup.object().shape({
              sponsor_name: Yup.string()
                .matches(/^[a-zA-Z]+[a-zA-Z ]*$/, "Alphabets only")
                .required("Sponsor Name is Required"),
              sponsor_short_name: Yup.string()
                .matches(/^[A-Z]+$/, "Uppercase Alphabets only")
                .required("Sponsor Short Name is Required"),
              contact_no: Yup.string()
                .matches(phoneRegExp, "Phone number is not valid")
                .required("Required"),
              email_id: Yup.string()
                .email("Invalid Email")
                .notOneOf(EmailID, "Email ID is already taken")
                .required("Required"),
              website: Yup.string()
                .matches(
                  /^((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                  "Enter correct Website name!"
                )
                .required("Please enter website"),
              sponsorship_amount: Yup.number()
                .typeError("Sponsorship must be a number")
                .required("Sponsorship Amount is Required")
                .positive("Value Must be Positive"),
              is_active: Yup.number().required("Select Active Status"),
              owner: Yup.string().required("Select Active Status"),
              gcpl_accociation_from: Yup.string()
                .required("Required")
                .nullable(),
              agc_residence_year_from: Yup.string()
                .required("Required")
                .nullable(),
            })}
          >
            {(form) => {
              return (
                <Form onSubmit={form.handleSubmit}>
                  <InputFormItem name={"sponsor_name"} label={"Name"} />
                  <InputFormItem
                    name={"sponsor_short_name"}
                    label={"Short Name"}
                  />
                  <TextAreaFormItem
                    name={"sponsor_description"}
                    label={"Description"}
                  />
                  <InputFormItem name={"contact_no"} label={"Contact No"} />
                  {this.props.isEditing !== true ? (
                    <InputFormItem name={"email_id"} label={"E-mail ID"} />
                  ) : (
                    <ViewFormItem name={"email_id"} label={"E-mail ID"} />
                  )}
                  <InputFormItem name={"website"} label={"Website"} />
                  <DatePickerFormItem
                    name={"gcpl_accociation_from"}
                    label={"GCPL Association from"}
                    picker="year"
                    layout={formItemLayout}
                    disabledDate={(d) =>
                      !d ||
                      d.isAfter(moment(), "year") ||
                      d.isSameOrBefore("1950-12-31", "year")
                    }
                  />
                  <RadioFormItem
                    name={"owner"}
                    label={"Owner"}
                    options={owner.map((item) => ({
                      value: item.id,
                      label: item.label,
                    }))}
                  />
                  <DatePickerFormItem
                    name={"agc_residence_year_from"}
                    label={"AGC Residence Since"}
                    picker="year"
                    layout={formItemLayout}
                    disabledDate={(d) =>
                      !d ||
                      d.isAfter(moment(), "year") ||
                      d.isSameOrBefore("1950-12-31", "year")
                    }
                  />
                  <Form.Item label="Active Status" {...formItemLayout}>
                    <Radio.Group
                      name="is_active"
                      checked={form.values.is_active}
                      defaultValue={form.values.is_active}
                    >
                      <Radio
                        onChange={() => form.setFieldValue("is_active", 1)}
                        value={1}
                      >
                        Yes
                      </Radio>
                      <Radio
                        onChange={() => form.setFieldValue("is_active", 0)}
                        value={0}
                      >
                        No
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <InputFormItem
                    name={"sponsorship_amount"}
                    label={"Sponsorship Amount"}
                  />
                  <Form.Item className="form-buttons" {...tailFormItemLayout}>
                    <Button type="primary" onClick={form.handleSubmit}>
                      {"Save"}
                    </Button>

                    <Button onClick={form.handleReset}>{"Reset"}</Button>

                    <Button onClick={() => this.props.onCancel()}>
                      {"Close"}
                    </Button>
                  </Form.Item>
                </Form>
              );
            }}
          </Formik>
        </FormWrapper>
      </React.Fragment>
    );
  }
}

export default SponsorForm;
